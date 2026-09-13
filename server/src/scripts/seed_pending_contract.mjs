/**
 * seed_pending_contract.mjs
 *
 * Seeds a realistic Pending Contract for Aarav Desai (freelancer)
 * with Deepa Iyer (client) into the WorkStation database.
 *
 * Idempotent: Running multiple times does NOT create duplicate records.
 * Run: node src/scripts/seed_pending_contract.mjs
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Contract from '../models/Contract.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';

// ── Timestamps ───────────────────────────────────────────────────────────────
const NOW         = new Date('2026-09-12T10:00:00.000Z'); // contract creation
const DEADLINE    = new Date('2026-09-15T23:59:59.000Z'); // acceptance deadline
const DUE_DATE    = new Date('2026-10-18T18:00:00.000Z'); // project due date
const MSG_T1      = new Date('2026-09-12T10:05:00.000Z'); // Deepa's message
const MSG_T2      = new Date('2026-09-12T10:12:00.000Z'); // Aarav's reply
const NOTIF_T1    = new Date('2026-09-12T10:01:00.000Z');
const NOTIF_T2    = new Date('2026-09-12T10:02:00.000Z');
const NOTIF_T3    = new Date('2026-09-12T10:03:00.000Z');

// ── Contract Details ──────────────────────────────────────────────────────────
const PROJECT_TITLE   = 'AI Analytics Dashboard';
const CONTRACT_TITLE  = 'AI Analytics Dashboard - Full Stack Development';
const BUDGET          = 115000;
const ESCROW_DEPOSIT  = 34500; // 30% initial deposit

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  // ── 1. Resolve Users ────────────────────────────────────────────────────────
  const aarav = await User.findOne({ email: 'aarav.desai@email.com' });
  if (!aarav) {
    console.error('Aarav Desai not found. Run seed_aarav_desai.mjs first.');
    process.exit(1);
  }

  // Deepa Iyer — find by any of her possible email patterns
  let deepa = await User.findOne({
    $or: [
      { email: 'deepa.iyer@email.com' },
      { email: 'deepa.client@finedge.tech' },
      { email: 'deepa.client@finedge.io' },
      { name: /^Deepa Iyer$/i, role: 'client' }
    ]
  });

  if (!deepa) {
    const hash = await bcrypt.hash('password123', 12);
    deepa = await User.create({
      name: 'Deepa Iyer',
      email: 'deepa.iyer@email.com',
      password: hash,
      role: 'client',
      verified: true,
      location: 'Bangalore, Karnataka, India',
      phone: '+91 99876 54321',
      title: 'Chief Data Officer',
      bio: 'CDO at FinEdge Analytics. Building data-driven products powered by AI and real-time analytics.',
      avatar: { url: '/clients/deepa-iyer.webp' },
      profileImage: '/clients/deepa-iyer.webp',
      company: 'FinEdge Analytics',
      industry: 'FinTech',
      totalSpent: 385000
    });
    console.log('Created Deepa Iyer:', deepa._id);
  } else {
    await User.findByIdAndUpdate(deepa._id, {
      $set: {
        'avatar.url': '/clients/deepa-iyer.webp',
        profileImage: '/clients/deepa-iyer.webp',
        company: deepa.company || 'FinEdge Analytics',
        industry: deepa.industry || 'FinTech'
      }
    });
    console.log('Found Deepa Iyer:', deepa._id, deepa.name);
  }

  // ── 2. Idempotency Check ────────────────────────────────────────────────────
  const existingContract = await Contract.findOne({
    freelancer: aarav._id,
    client: deepa._id,
    status: 'pending',
    title: CONTRACT_TITLE
  });

  if (existingContract) {
    console.log('Pending contract already exists:', existingContract._id);
    console.log('Seeder is idempotent - no duplicate created.');
    await mongoose.disconnect();
    return;
  }

  // ── 3. Upsert the Job ───────────────────────────────────────────────────────
  let job = await Job.findOne({ title: PROJECT_TITLE, client: deepa._id });
  if (!job) {
    job = await Job.create({
      title: PROJECT_TITLE,
      description:
        'Build a modern AI-powered analytics dashboard with real-time charts, REST API integration, ' +
        'role-based authentication, and responsive UI using React, Node.js, Express, and MongoDB. ' +
        'The dashboard must support multi-tenant data streams, WebSocket-powered live metrics, ' +
        'customizable widget layouts, and export functionality.',
      category: 'Data Science & Analytics',
      budget: { min: 100000, max: 130000, type: 'fixed' },
      deadline: DUE_DATE,
      experienceLevel: 'expert',
      client: deepa._id,
      status: 'in_progress',
      image: '/projects/ai-analytics-dashboard.webp',
      skillsRequired: [
        'React', 'Node.js', 'Express.js', 'MongoDB',
        'Python', 'Chart.js', 'WebSockets', 'REST APIs',
        'Machine Learning APIs', 'TailwindCSS'
      ],
      locationType: 'remote'
    });
    console.log('Created Job:', job._id);
  } else {
    console.log('Found existing Job:', job._id);
  }

  // ── 4. Upsert the Proposal ─────────────────────────────────────────────────
  const proposal = await Proposal.findOneAndUpdate(
    { job: job._id, freelancer: aarav._id },
    {
      job: job._id,
      freelancer: aarav._id,
      bidAmount: BUDGET,
      deliveryTime: 35,
      coverLetter:
        'I specialize in building AI-powered dashboards with real-time data streams and predictive analytics APIs. ' +
        'My MERN stack expertise and experience with Chart.js makes me an ideal fit for this project. ' +
        'I will deliver a fully responsive, role-based analytics platform with live WebSocket feeds and exportable reports.',
      status: 'accepted',
      decidedAt: NOW,
      milestones: [
        { title: 'Project Setup & Authentication', amount: 20000, deadline: new Date('2026-09-22') },
        { title: 'Dashboard Layout & Charts', amount: 35000, deadline: new Date('2026-09-30') },
        { title: 'AI/ML API Integration', amount: 35000, deadline: new Date('2026-10-10') },
        { title: 'Testing, Optimization & Deployment', amount: 25000, deadline: DUE_DATE }
      ]
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('Upserted Proposal:', proposal._id);

  // ── 5. Create the Pending Contract ─────────────────────────────────────────
  const contract = await Contract.create({
    client: deepa._id,
    freelancer: aarav._id,
    job: job._id,
    proposal: proposal._id,
    title: CONTRACT_TITLE,
    progress: 0,
    totalAmount: BUDGET,
    platformFee: 10,
    priority: 'medium',
    status: 'pending',
    escrowStatus: 'held',           // 30% deposit reserved (held in escrow)
    startDate: null,
    endDate: DUE_DATE,
    dispute: {
      status: 'none',
      escrowHeld: ESCROW_DEPOSIT
    },
    milestones: [
      {
        title: 'Project Setup & Authentication',
        description: 'Initialize project repository, configure CI/CD, set up JWT-based role authentication.',
        amount: 20000,
        status: 'pending',
        dueDate: new Date('2026-09-22')
      },
      {
        title: 'Dashboard Layout & Realtime Charts',
        description: 'Build responsive layout, integrate Chart.js/Recharts, connect live WebSocket data feeds.',
        amount: 35000,
        status: 'pending',
        dueDate: new Date('2026-09-30')
      },
      {
        title: 'AI/ML API Integration',
        description: 'Integrate prediction APIs, build model accuracy visualizations, data export features.',
        amount: 35000,
        status: 'pending',
        dueDate: new Date('2026-10-10')
      },
      {
        title: 'Testing, Optimization & Deployment',
        description: 'End-to-end testing, performance optimization, Docker deployment, documentation.',
        amount: 25000,
        status: 'pending',
        dueDate: DUE_DATE
      }
    ],
    createdAt: NOW,
    updatedAt: NOW
  });
  console.log('Created Pending Contract:', contract._id);

  // ── 6. Create / Update Conversation ────────────────────────────────────────
  let conversation = await Conversation.findOne({
    participants: { $all: [aarav._id, deepa._id] },
    job: job._id
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [deepa._id, aarav._id],
      job: job._id,
      lastMessage: {
        text: "Thanks! I'll review the scope and confirm shortly.",
        sender: aarav._id,
        createdAt: MSG_T2
      },
      unreadCounts: new Map([[aarav._id.toString(), 1]])
    });
    console.log('Created Conversation:', conversation._id);
  } else {
    await Conversation.findByIdAndUpdate(conversation._id, {
      $set: {
        lastMessage: {
          text: "Thanks! I'll review the scope and confirm shortly.",
          sender: aarav._id,
          createdAt: MSG_T2
        },
        [`unreadCounts.${aarav._id.toString()}`]: 1
      }
    });
    console.log('Found existing Conversation:', conversation._id);
  }

  // ── 7. Create Messages ──────────────────────────────────────────────────────
  const existingMessages = await Message.countDocuments({ conversation: conversation._id });
  if (existingMessages === 0) {
    await Message.create([
      {
        conversation: conversation._id,
        sender: deepa._id,
        text: "I've finalized the contract for the AI Analytics Dashboard project. Please review the terms, milestone breakdown, and the initial escrow deposit. Accept when you're ready to begin!",
        messageType: 'chat',
        isRead: true,
        createdAt: MSG_T1
      },
      {
        conversation: conversation._id,
        sender: aarav._id,
        text: "Thanks Deepa! I'll review the complete scope, milestone amounts, and the acceptance deadline. Will confirm shortly. Looking forward to building this with you!",
        messageType: 'chat',
        isRead: false,
        createdAt: MSG_T2
      }
    ]);
    console.log('Created 2 Messages');
  } else {
    console.log('Messages already exist for this conversation, skipping.');
  }

  // ── 8. Create Notifications ─────────────────────────────────────────────────
  const existingNotifs = await Notification.countDocuments({
    receiver: aarav._id,
    linkUrl: `/dashboard/contracts/${contract._id}`
  });

  if (existingNotifs === 0) {
    await Notification.create([
      {
        receiver: aarav._id,
        sender: deepa._id,
        type: 'contract_created',
        title: 'New Contract Invitation',
        message: `Deepa Iyer has sent you a contract invitation for "${PROJECT_TITLE}". Review and accept to begin.`,
        linkUrl: `/dashboard/contracts/${contract._id}`,
        read: false,
        createdAt: NOTIF_T1
      },
      {
        receiver: aarav._id,
        sender: deepa._id,
        type: 'escrow_held',
        title: 'Escrow Reserved',
        message: `34,500 has been reserved in escrow for "${PROJECT_TITLE}". Funds will be released upon milestone approval.`,
        linkUrl: `/dashboard/contracts/${contract._id}`,
        read: false,
        createdAt: NOTIF_T2
      },
      {
        receiver: aarav._id,
        sender: null,
        type: 'system',
        title: 'Acceptance Deadline: 15 Sept 2026',
        message: `Contract acceptance deadline for "${PROJECT_TITLE}" is Sep 15, 2026. Accept or decline before the deadline expires.`,
        linkUrl: `/dashboard/contracts/${contract._id}`,
        read: false,
        createdAt: NOTIF_T3
      }
    ]);
    console.log('Created 3 Notifications for Aarav');

    await Notification.create({
      receiver: deepa._id,
      sender: aarav._id,
      type: 'system',
      title: 'Contract Sent Successfully',
      message: `Your contract for "${PROJECT_TITLE}" has been sent to Aarav Desai and is awaiting acceptance.`,
      linkUrl: `/dashboard/contracts/${contract._id}`,
      read: false,
      createdAt: NOTIF_T1
    });
    console.log('Created 1 Notification for Deepa');
  } else {
    console.log('Notifications already exist, skipping.');
  }

  // ── 9. Summary ──────────────────────────────────────────────────────────────
  console.log('\n========================================');
  console.log('  SEED COMPLETE - Pending Contract');
  console.log('========================================');
  console.log('  Contract ID :', contract._id);
  console.log('  Project     :', PROJECT_TITLE);
  console.log('  Freelancer  : Aarav Desai');
  console.log('  Client      : Deepa Iyer');
  console.log('  Status      : pending');
  console.log('  Budget      : INR 1,15,000');
  console.log('  Escrow      : INR 34,500 reserved');
  console.log('  Milestones  : 4 (all pending)');
  console.log('  Messages    : 2');
  console.log('  Notifs      : 4');
  console.log('========================================');
  console.log('\n  Visit: http://localhost:3256/dashboard/contracts?status=pending\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch(err => {
  console.error('Seeder error:', err);
  process.exit(1);
});
