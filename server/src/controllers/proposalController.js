import Proposal from '../models/Proposal.js';
import Job from '../models/Job.js';
import Contract from '../models/Contract.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const submitProposal = async (req, res, next) => {
  try {
    const jobId = req.params.jobId || req.body.job || req.body.jobId;
    if (!jobId) return next(new ApiError('Job ID is required', 400));

    const job = await Job.findById(jobId);
    if (!job) return next(new ApiError('Job not found', 404));
    
    if (job.status !== 'open') {
      return next(new ApiError('Job is not open for proposals', 400));
    }

    const existingProposal = await Proposal.findOne({ 
      freelancer: req.user._id, 
      job: jobId 
    });
    
    if (existingProposal) {
      return next(new ApiError('You have already submitted a proposal for this job', 400));
    }

    const { coverLetter, bidAmount, deliveryTime, deliveryDays, milestones } = req.body;
    const resolvedDeliveryTime = deliveryTime || deliveryDays || 7;

    const proposal = await Proposal.create({
      coverLetter,
      bidAmount,
      deliveryTime: resolvedDeliveryTime,
      milestones,
      freelancer: req.user._id,
      job: jobId
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { proposalCount: 1 } });

    const io = req.app.get('io');
    if (io) {
      io.to(job.client.toString()).emit('notification', {
        type: 'bid_received',
        message: `New proposal received for your job: ${job.title}`,
        jobId: job._id
      });
    }

    res.status(201).json(new ApiResponse('Proposal submitted successfully', { proposal }));
  } catch (error) {
    next(error);
  }
};

export const getJobProposals = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return next(new ApiError('Job not found', 404));
    
    if (job.client.toString() !== req.user._id.toString()) {
      return next(new ApiError('Not authorized to view these proposals', 403));
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'name avatar skills hourlyRate ratingsAverage completedProjects location')
      .sort('-createdAt');

    res.status(200).json(new ApiResponse('Proposals retrieved successfully', { proposals }));
  } catch (error) {
    next(error);
  }
};

export const getMyProposals = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { freelancer: req.user._id };
    
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [proposals, totalResults, statusAgg] = await Promise.all([
      Proposal.find(query)
        .populate('job', 'title budget status client deadline category')
        .populate({
          path: 'job',
          populate: { path: 'client', select: 'name avatar profileImage company' }
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Proposal.countDocuments(query),
      Proposal.aggregate([
        { $match: { freelancer: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusCounts = {
      all: 0,
      accepted: 0,
      shortlisted: 0,
      pending: 0,
      rejected: 0,
      withdrawn: 0
    };

    statusAgg.forEach(item => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
      statusCounts.all += item.count;
    });

    const totalPages = Math.ceil(totalResults / Number(limit));

    res.status(200).json(new ApiResponse('My proposals retrieved successfully', {
      proposals,
      statusCounts,
      pagination: { currentPage: Number(page), totalPages, totalResults }
    }));
  } catch (error) {
    next(error);
  }
};

export const getProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('freelancer', 'name avatar bio skills hourlyRate')
      .populate('job');
      
    if (!proposal) return next(new ApiError('Proposal not found', 404));

    const isFreelancer = proposal.freelancer._id.toString() === req.user._id.toString();
    const isClient = proposal.job.client.toString() === req.user._id.toString();

    if (!isFreelancer && !isClient) {
      return next(new ApiError('Not authorized to view this proposal', 403));
    }

    res.status(200).json(new ApiResponse('Proposal retrieved successfully', { proposal }));
  } catch (error) {
    next(error);
  }
};

export const withdrawProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return next(new ApiError('Proposal not found', 404));

    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return next(new ApiError('Not authorized to withdraw this proposal', 403));
    }

    if (['accepted', 'withdrawn'].includes(proposal.status)) {
      return next(new ApiError(`Cannot withdraw an already ${proposal.status} proposal`, 400));
    }

    proposal.status = 'withdrawn';
    await proposal.save();

    await Job.findByIdAndUpdate(proposal.job, { $inc: { proposalCount: -1 } });

    res.status(200).json(new ApiResponse('Proposal withdrawn successfully', { proposal }));
  } catch (error) {
    next(error);
  }
};

export const updateProposalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const proposal = await Proposal.findById(req.params.id).populate('job');
    
    if (!proposal) return next(new ApiError('Proposal not found', 404));
    
    const job = proposal.job;
    const isClient = job && job.client && job.client.toString() === req.user._id.toString();
    const isFreelancer = proposal.freelancer && proposal.freelancer.toString() === req.user._id.toString();

    // Allow freelancer to withdraw their pending/shortlisted proposal
    if (status === 'withdrawn' && isFreelancer) {
      if (['accepted', 'withdrawn'].includes(proposal.status)) {
        return next(new ApiError(`Cannot withdraw an already ${proposal.status} proposal`, 400));
      }
      proposal.status = 'withdrawn';
      await proposal.save();
      await Job.findByIdAndUpdate(proposal.job._id || proposal.job, { $inc: { proposalCount: -1 } });
      return res.status(200).json(new ApiResponse('Proposal withdrawn successfully', { proposal }));
    }

    if (!isClient) {
      return next(new ApiError('Not authorized to update this proposal', 403));
    }

    const currentStatus = proposal.status;
    const validTransitions = {
      'pending': ['viewed', 'shortlisted', 'accepted', 'rejected'],
      'viewed': ['shortlisted', 'accepted', 'rejected'],
      'shortlisted': ['accepted', 'rejected']
    };

    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
      return next(new ApiError(`Invalid status transition from ${currentStatus} to ${status}`, 400));
    }

    proposal.status = status;
    await proposal.save();

    const io = req.app.get('io');

    if (status === 'accepted') {
      // Reject others
      await Proposal.updateMany(
        { job: job._id, _id: { $ne: proposal._id }, status: { $in: ['pending', 'shortlisted'] } },
        { status: 'rejected' }
      );

      // Create contract
      let milestones = [];
      if (proposal.milestones && proposal.milestones.length > 0) {
        milestones = proposal.milestones.map(m => ({
          title: m.title, amount: m.amount, dueDate: m.deadline, status: 'pending'
        }));
      } else {
        milestones = [{ title: 'Full Project', amount: proposal.bidAmount, status: 'pending' }];
      }

      await Contract.create({
        client: job.client,
        freelancer: proposal.freelancer,
        job: job._id,
        proposal: proposal._id,
        totalAmount: proposal.bidAmount,
        milestones
      });

      job.status = 'in_progress';
      await job.save();

      if (io) {
        io.to(proposal.freelancer.toString()).emit('notification', {
          type: 'proposal_accepted',
          message: `Your proposal for ${job.title} was accepted!`,
          jobId: job._id
        });
      }
    } else if (status === 'rejected') {
      if (io) {
        io.to(proposal.freelancer.toString()).emit('notification', {
          type: 'proposal_rejected',
          message: `Your proposal for ${job.title} was declined.`,
          jobId: job._id
        });
      }
    }

    res.status(200).json(new ApiResponse('Proposal status updated successfully', { proposal }));
  } catch (error) {
    next(error);
  }
};
