import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Contract from '../models/Contract.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import UserSettings from '../models/UserSettings.js';

async function verify() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';
  await mongoose.connect(mongoUri);

  const aarav = await User.findOne({ email: 'aarav.desai@email.com' });
  console.log('--- AARAV DESAI PROFILE ---');
  console.log('ID:', aarav._id);
  console.log('Name:', aarav.name);
  console.log('Title:', aarav.title);
  console.log('Role:', aarav.role);
  console.log('Location:', aarav.location);
  console.log('Hourly Rate:', aarav.hourlyRate);
  console.log('Earnings:', aarav.earnings);
  console.log('Rating:', aarav.ratingsAverage, '(' + aarav.ratingsCount + ' reviews)');
  console.log('Completed Projects:', aarav.completedProjects);
  console.log('Avatar:', aarav.avatar.url);
  console.log('Skills Count:', aarav.skills.length, 'Skills:', aarav.skills);
  console.log('Portfolio Items:', aarav.portfolio.length);
  console.log('Experiences:', aarav.experiences.length);
  console.log('Certifications:', aarav.certifications.length);

  const settings = await UserSettings.findOne({ user: aarav._id });
  console.log('\n--- USER SETTINGS ---');
  console.log('Username:', settings?.general?.username);
  console.log('Timezone:', settings?.general?.timeZone);

  const proposals = await Proposal.find({ freelancer: aarav._id }).populate('job', 'title budget');
  console.log('\n--- PROPOSALS ---');
  console.log('Count:', proposals.length);
  proposals.forEach(p => console.log('•', p.job?.title, '| Bid:', p.bidAmount, '| Status:', p.status));

  const contracts = await Contract.find({ freelancer: aarav._id }).populate('client', 'name');
  console.log('\n--- CONTRACTS ---');
  console.log('Count:', contracts.length);
  contracts.forEach(c => console.log('• Client:', c.client?.name, '| Total:', c.totalAmount, '| Status:', c.status, '| Milestones:', c.milestones.length));

  const convs = await Conversation.find({ participants: aarav._id });
  console.log('\n--- CONVERSATIONS ---');
  console.log('Count:', convs.length);

  const msgs = await Message.find({ conversation: { $in: convs.map(c => c._id) } });
  console.log('\n--- MESSAGES ---');
  console.log('Count:', msgs.length);
  msgs.forEach(m => console.log('• [' + (m.sender.equals(aarav._id) ? 'Aarav' : 'Rajesh') + ']:', m.text));

  const notifs = await Notification.find({ receiver: aarav._id });
  console.log('\n--- NOTIFICATIONS ---');
  console.log('Count:', notifs.length);
  notifs.forEach(n => console.log('• [' + n.type + ']:', n.title, '-', n.message));

  const payments = await Payment.find({ recipient: aarav._id });
  console.log('\n--- PAYMENTS ---');
  console.log('Count:', payments.length);
  payments.forEach(p => console.log('• Amount:', p.amount, '| Status:', p.status, '| Type:', p.type));

  process.exit(0);
}

verify();
