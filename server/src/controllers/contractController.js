import Contract from '../models/Contract.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Payment from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createOrder, verifyPaymentSignature } from '../services/paymentService.js';
import { createNotification } from '../services/notificationService.js';
import { generateInvoice } from '../utils/generateInvoice.js';

export const getContracts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userFilter = {
      $or: [{ client: req.user._id }, { freelancer: req.user._id }],
    };
    
    const query = { ...userFilter };
    
    if (status && status !== 'all') {
      if (status === 'disputed') {
        query.$and = [
          userFilter,
          {
            $or: [
              { status: 'disputed' },
              { 'dispute.status': 'disputed' },
              { 'dispute.status': 'under_review' }
            ]
          }
        ];
        delete query.$or;
      } else if (status === 'under_review') {
        query.$and = [
          userFilter,
          {
            $or: [
              { status: 'under_review' },
              { 'dispute.status': 'under_review' }
            ]
          }
        ];
        delete query.$or;
      } else {
        query.status = status;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contracts = await Contract.find(query)
      .populate('client', 'name avatar email company profileImage')
      .populate('freelancer', 'name avatar email profileImage')
      .populate('job', 'title category budget')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contract.countDocuments(query);

    // Compute live dispute stats from database
    const allUserContracts = await Contract.find(userFilter).lean();
    const activeDisputes = allUserContracts.filter(c => c.status === 'disputed' || c.status === 'under_review' || c.dispute?.status === 'disputed' || c.dispute?.status === 'under_review').length;
    const underReview = allUserContracts.filter(c => c.status === 'under_review' || c.dispute?.status === 'under_review').length;
    const resolved = allUserContracts.filter(c => c.dispute?.status === 'resolved').length;
    const escrowHeld = allUserContracts.reduce((sum, c) => {
      if (c.status === 'disputed' || c.status === 'under_review' || c.dispute?.status === 'disputed' || c.dispute?.status === 'under_review') {
        return sum + (c.dispute?.escrowHeld || (c.escrowStatus === 'held' ? c.totalAmount : 0));
      }
      return sum;
    }, 0);

    const statusCounts = {
      all: allUserContracts.length,
      active: allUserContracts.filter(c => c.status === 'active').length,
      completed: allUserContracts.filter(c => c.status === 'completed').length,
      pending: allUserContracts.filter(c => c.status === 'pending').length,
      disputed: activeDisputes,
      under_review: underReview
    };

    res.status(200).json(new ApiResponse(200, {
      contracts,
      disputeStats: {
        activeDisputes,
        underReview,
        resolved,
        escrowHeld
      },
      statusCounts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      }
    }, 'Contracts fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name avatar')
      .populate('freelancer', 'name avatar')
      .populate('job', 'title');

    if (!contract) {
      throw new ApiError(404, 'Contract not found');
    }

    if (contract.client._id.toString() !== req.user._id.toString() &&
        contract.freelancer._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to view this contract');
    }

    res.status(200).json(new ApiResponse(200, contract, 'Contract fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const fundMilestone = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;
    
    const contract = await Contract.findById(id);
    if (!contract) throw new ApiError(404, 'Contract not found');
    
    if (contract.client.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Only client can fund milestone');
    }

    const index = parseInt(milestoneIndex);
    const milestone = contract.milestones[index];
    if (!milestone) throw new ApiError(404, 'Milestone not found');
    
    if (milestone.status !== 'pending') {
      throw new ApiError(400, 'Milestone cannot be funded (status: ' + milestone.status + ')');
    }

    const order = await createOrder(milestone.amount, contract._id, index);

    const payment = await Payment.create({
      payer: req.user._id,
      recipient: contract.freelancer,
      contract: contract._id,
      amount: milestone.amount,
      currency: 'INR',
      type: 'escrow_deposit',
      status: 'pending',
      razorpayOrderId: order.id
    });

    res.status(200).json(new ApiResponse(200, { order, paymentId: payment._id }, 'Milestone funding initiated'));
  } catch (error) {
    next(error);
  }
};

export const verifyMilestonePayment = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const contract = await Contract.findById(id);
    if (!contract) throw new ApiError(404, 'Contract not found');

    const isValid = verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    if (!isValid) throw new ApiError(400, 'Invalid payment signature');

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) throw new ApiError(404, 'Payment record not found');

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'succeeded';
    payment.invoiceNumber = generateInvoice();
    await payment.save();

    const index = parseInt(milestoneIndex);
    contract.milestones[index].status = 'funded';
    contract.milestones[index].fundedAt = Date.now();
    
    const allFunded = contract.milestones.every(m => m.status === 'funded' || m.status === 'approved' || m.status === 'submitted');
    contract.escrowStatus = allFunded ? 'fully_funded' : 'partially_funded';
    
    await contract.save();

    await createNotification({
      receiver: contract.freelancer,
      sender: contract.client,
      type: 'system', // or milestone_funded
      title: 'Milestone Funded',
      message: `Client has funded milestone: ${contract.milestones[index].title}`,
      linkUrl: `/contracts/${contract._id}`,
      io: req.app.get('io')
    });

    res.status(200).json(new ApiResponse(200, { payment }, 'Payment verified and milestone funded'));
  } catch (error) {
    next(error);
  }
};

export const submitWork = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { description } = req.body;

    const contract = await Contract.findById(id);
    if (!contract) throw new ApiError(404, 'Contract not found');

    if (contract.freelancer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Only freelancer can submit work');
    }

    const index = parseInt(milestoneIndex);
    const milestone = contract.milestones[index];
    if (!milestone) throw new ApiError(404, 'Milestone not found');

    if (!['funded', 'revision_requested'].includes(milestone.status)) {
      throw new ApiError(400, 'Cannot submit work for this milestone status');
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(f => ({
        url: f.path,
        filename: f.filename || f.originalname
      }));
    }

    contract.milestones[index].submission = {
      description,
      attachments,
      submittedAt: Date.now()
    };
    contract.milestones[index].status = 'submitted';
    await contract.save();

    await createNotification({
      receiver: contract.client,
      sender: contract.freelancer,
      type: 'system',
      title: 'Work Submitted',
      message: `Freelancer has submitted work for milestone: ${milestone.title}`,
      linkUrl: `/contracts/${contract._id}`,
      io: req.app.get('io')
    });

    res.status(200).json(new ApiResponse(200, contract, 'Work submitted successfully'));
  } catch (error) {
    next(error);
  }
};

export const approveMilestone = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;

    const contract = await Contract.findById(id);
    if (!contract) throw new ApiError(404, 'Contract not found');

    if (contract.client.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Only client can approve milestone');
    }

    const index = parseInt(milestoneIndex);
    const milestone = contract.milestones[index];
    if (!milestone) throw new ApiError(404, 'Milestone not found');

    if (milestone.status !== 'submitted') {
      throw new ApiError(400, 'Milestone not in submitted state');
    }

    contract.milestones[index].status = 'approved';
    contract.milestones[index].approvedAt = Date.now();

    const netAmount = milestone.amount - (milestone.amount * contract.platformFee / 100);

    const payment = await Payment.create({
      payer: contract.client,
      recipient: contract.freelancer,
      contract: contract._id,
      amount: milestone.amount,
      netAmount,
      platformFee: contract.platformFee,
      currency: 'INR',
      type: 'escrow_release',
      status: 'succeeded',
      invoiceNumber: generateInvoice()
    });

    const allApproved = contract.milestones.every(m => m.status === 'approved');
    if (allApproved) {
      contract.status = 'completed';
      contract.escrowStatus = 'released';
      await Job.findByIdAndUpdate(contract.job, { status: 'completed' });
    }

    await contract.save();

    await User.findByIdAndUpdate(contract.freelancer, {
      $inc: { 
        earnings: netAmount, 
        completedProjects: allApproved ? 1 : 0 
      }
    });

    await User.findByIdAndUpdate(contract.client, {
      $inc: { totalSpent: milestone.amount }
    });

    await createNotification({
      receiver: contract.freelancer,
      sender: contract.client,
      type: 'escrow_released',
      title: 'Escrow Released',
      message: `Client approved your work and released ${milestone.amount} INR`,
      linkUrl: `/contracts/${contract._id}`,
      io: req.app.get('io')
    });

    res.status(200).json(new ApiResponse(200, contract, 'Milestone approved and funds released'));
  } catch (error) {
    next(error);
  }
};

export const requestRevision = async (req, res, next) => {
  try {
    const { id, milestoneIndex } = req.params;

    const contract = await Contract.findById(id);
    if (!contract) throw new ApiError(404, 'Contract not found');

    if (contract.client.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Only client can request revision');
    }

    const index = parseInt(milestoneIndex);
    const milestone = contract.milestones[index];
    
    if (milestone.status !== 'submitted') {
      throw new ApiError(400, 'Milestone not in submitted state');
    }

    contract.milestones[index].status = 'revision_requested';
    // Optionally clearing submission or just leaving it for history
    contract.milestones[index].submission = undefined;
    
    await contract.save();

    await createNotification({
      receiver: contract.freelancer,
      sender: contract.client,
      type: 'system',
      title: 'Revision Requested',
      message: `Client requested a revision for milestone: ${milestone.title}`,
      linkUrl: `/contracts/${contract._id}`,
      io: req.app.get('io')
    });

    res.status(200).json(new ApiResponse(200, contract, 'Revision requested'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/contracts/:id/accept
 * Freelancer accepts a pending contract → moves to active.
 */
export const acceptContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name avatar email')
      .populate('freelancer', 'name avatar email')
      .populate('job', 'title');

    if (!contract) throw new ApiError(404, 'Contract not found');

    if (contract.freelancer._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Only the assigned freelancer can accept this contract');
    }

    if (contract.status !== 'pending') {
      throw new ApiError(400, `Contract cannot be accepted (current status: ${contract.status})`);
    }

    contract.status = 'active';
    contract.startDate = new Date();
    // Keep 'held' if deposit was reserved, otherwise mark as funded
    contract.escrowStatus = contract.escrowStatus === 'held' ? 'held' : 'funded';
    await contract.save();

    // Update the linked job to in_progress
    if (contract.job?._id) {
      await Job.findByIdAndUpdate(contract.job._id, { status: 'in_progress' });
    }

    // Notify the client
    await createNotification({
      receiver: contract.client._id,
      sender: contract.freelancer._id,
      type: 'contract_created',
      title: 'Contract Accepted',
      message: `${contract.freelancer.name} has accepted the contract for "${contract.job?.title || contract.title}". Work begins now!`,
      linkUrl: `/dashboard/contracts/${contract._id}`,
      io: req.app.get('io')
    });

    res.status(200).json(new ApiResponse(200, contract, 'Contract accepted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/contracts/:id/decline
 * Freelancer declines a pending contract → moves to cancelled.
 */
export const declineContract = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name avatar email')
      .populate('freelancer', 'name avatar email')
      .populate('job', 'title');

    if (!contract) throw new ApiError(404, 'Contract not found');

    if (contract.freelancer._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Only the assigned freelancer can decline this contract');
    }

    if (contract.status !== 'pending') {
      throw new ApiError(400, `Contract cannot be declined (current status: ${contract.status})`);
    }

    contract.status = 'cancelled';
    contract.escrowStatus = 'refunded';
    if (reason) {
      contract.dispute = { ...contract.dispute, reason };
    }
    await contract.save();

    // Notify the client
    await createNotification({
      receiver: contract.client._id,
      sender: contract.freelancer._id,
      type: 'system',
      title: 'Contract Declined',
      message: `${contract.freelancer.name} has declined the contract for "${contract.job?.title || contract.title}". Escrow will be refunded.`,
      linkUrl: `/dashboard/contracts/${contract._id}`,
      io: req.app.get('io')
    });

    res.status(200).json(new ApiResponse(200, contract, 'Contract declined'));
  } catch (error) {
    next(error);
  }
};
