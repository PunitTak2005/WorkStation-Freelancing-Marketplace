import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

// Import all models
import User from '../models/User.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Contract from '../models/Contract.js';
import Payment from '../models/Payment.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

// Import seed data
import { adminUser, clientUsers, freelancerUsers } from './data/users.js';
import { generateJobs } from './data/jobs.js';
import { generateProposals } from './data/proposals.js';
import { generateReviews } from './data/reviews.js';
import { generateNotifications } from './data/notifications.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Proposal.deleteMany({}),
      Contract.deleteMany({}),
      Payment.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Seed users (passwords will be hashed by pre-save hook)
    console.log('👤 Seeding users...');
    const admin = await User.create(adminUser);
    const clients = await User.create(clientUsers);
    const freelancers = await User.create(freelancerUsers);
    console.log(`   ✓ Created 1 admin, ${clients.length} clients, ${freelancers.length} freelancers`);

    // Seed jobs
    console.log('💼 Seeding jobs...');
    const clientIds = clients.map(c => c._id);
    const jobData = generateJobs(clientIds);
    const jobs = await Job.insertMany(jobData);
    console.log(`   ✓ Created ${jobs.length} jobs`);

    // Seed proposals (use .create() one by one to trigger pre-save hooks)
    console.log('📝 Seeding proposals...');
    const freelancerIds = freelancers.map(f => f._id);
    const openJobIds = jobs.filter(j => j.status === 'open').map(j => j._id);
    const proposalData = generateProposals(openJobIds, freelancerIds);
    const proposals = await Proposal.insertMany(proposalData);
    console.log(`   ✓ Created ${proposals.length} proposals`);

    // Create some contracts from accepted proposals
    console.log('📝 Seeding contracts...');
    const acceptedProposals = proposals.filter(p => p.status === 'accepted');
    const contracts = [];
    for (const proposal of acceptedProposals) {
      const job = jobs.find(j => j._id.toString() === proposal.job.toString());
      if (job) {
        const contract = await Contract.create({
          client: job.client,
          freelancer: proposal.freelancer,
          job: job._id,
          proposal: proposal._id,
          totalAmount: proposal.bidAmount,
          status: Math.random() > 0.5 ? 'active' : 'completed',
          milestones: [{
            title: 'Full Project Delivery',
            amount: proposal.bidAmount,
            status: 'pending',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }],
        });
        contracts.push(contract);
      }
    }
    console.log(`   ✓ Created ${contracts.length} contracts`);

    // Seed reviews for completed contracts
    console.log('⭐ Seeding reviews...');
    const completedContracts = contracts.filter(c => c.status === 'completed');
    const reviewData = generateReviews(completedContracts);
    const reviews = await Review.insertMany(reviewData);
    console.log(`   ✓ Created ${reviews.length} reviews`);

    // Seed notifications
    console.log('🔔 Seeding notifications...');
    const allUserIds = [admin._id, ...clientIds, ...freelancerIds];
    const notificationData = generateNotifications(allUserIds);
    await Notification.insertMany(notificationData);
    console.log(`   ✓ Created ${notificationData.length} notifications`);

    // Create some sample conversations and messages
    console.log('💬 Seeding conversations...');
    const conversations = [];
    for (let i = 0; i < Math.min(10, contracts.length); i++) {
      const contract = contracts[i];
      const conv = await Conversation.create({
        participants: [contract.client, contract.freelancer],
        job: contract.job,
        lastMessage: { text: 'Looking forward to working together!', sender: contract.freelancer, createdAt: new Date() },
      });
      
      // Create a few messages per conversation
      const messages = [
        { conversation: conv._id, sender: contract.client, text: `Hi! I've reviewed your proposal and I'm excited to start.`, messageType: 'chat' },
        { conversation: conv._id, sender: contract.freelancer, text: `Thank you for accepting! I'll start working on it right away.`, messageType: 'chat' },
        { conversation: conv._id, sender: contract.client, text: `Great! Please share progress updates weekly.`, messageType: 'chat' },
        { conversation: conv._id, sender: contract.freelancer, text: `Looking forward to working together!`, messageType: 'chat' },
      ];
      await Message.insertMany(messages);
      conversations.push(conv);
    }
    console.log(`   ✓ Created ${conversations.length} conversations with messages`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin:      punittak2005@gmail.com / admin123');
    console.log('   Client:     rajesh.sharma@email.com / password123');
    console.log('   Freelancer: aarav.desai@email.com / password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

const destroyDatabase = async () => {
  try {
    await connectDB();
    console.log('🗑️  Destroying all data...');
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Proposal.deleteMany({}),
      Contract.deleteMany({}),
      Payment.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('✅ All data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Destroy failed:', error);
    process.exit(1);
  }
};

if (process.argv.includes('--destroy')) {
  destroyDatabase();
} else {
  seedDatabase();
}
