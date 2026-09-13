import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Payment from '../models/Payment.js';
import Contract from '../models/Contract.js';
import Proposal from '../models/Proposal.js';

async function testFreelancerDashboardQuery() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';
  await mongoose.connect(mongoUri);

  const aarav = await User.findOne({ email: 'aarav.desai@email.com' });
  const userId = aarav._id;

  const totalEarnings = aarav.earnings || 0;
  const activeContracts = await Contract.countDocuments({ freelancer: userId, status: 'active' });
  const proposalsSent = await Proposal.countDocuments({ freelancer: userId });
  const acceptedProposals = await Proposal.countDocuments({ freelancer: userId, status: 'accepted' });
  const successRate = proposalsSent > 0 ? Number(((acceptedProposals / proposalsSent) * 100).toFixed(1)) : 0;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const monthlyEarnings = await Payment.aggregate([
    {
      $match: {
        recipient: new mongoose.Types.ObjectId(userId),
        type: 'escrow_release',
        status: 'succeeded',
        createdAt: { $gte: oneYearAgo }
      }
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        earnings: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const proposalStatusBreakdown = await Proposal.aggregate([
    { $match: { freelancer: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const contractsWithUpcomingDeadlines = await Contract.find({
    freelancer: userId,
    'milestones.status': { $in: ['funded', 'in_progress'] }
  }).populate('job', 'title').select('title job milestones').lean();

  let upcomingDeadlines = [];
  contractsWithUpcomingDeadlines.forEach(contract => {
    const projTitle = contract.title || contract.job?.title || 'Active Project';
    contract.milestones.forEach(milestone => {
      if (['funded', 'in_progress'].includes(milestone.status) && milestone.dueDate) {
        upcomingDeadlines.push({
          contractId: contract._id,
          contractTitle: projTitle,
          milestoneId: milestone._id,
          milestoneTitle: milestone.title,
          dueDate: milestone.dueDate,
          date: new Date(milestone.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          project: projTitle,
          title: milestone.title,
          amount: milestone.amount,
          status: milestone.status
        });
      }
    });
  });
  upcomingDeadlines.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  console.log('=== FREELANCER DASHBOARD DATA TEST ===');
  console.log('Total Earnings:', totalEarnings);
  console.log('Active Contracts:', activeContracts);
  console.log('Proposals Sent:', proposalsSent);
  console.log('Accepted Proposals:', acceptedProposals);
  console.log('Success Rate:', successRate + '%');
  console.log('Monthly Earnings Breakdown:', monthlyEarnings);
  console.log('Proposal Funnel Breakdown:', proposalStatusBreakdown);
  console.log('Upcoming Deadlines Count:', upcomingDeadlines.length);
  upcomingDeadlines.forEach(d => console.log(' •', d.title, '|', d.project, '| Due:', d.date, '| Amount: ₹' + d.amount));

  process.exit(0);
}

testFreelancerDashboardQuery();
