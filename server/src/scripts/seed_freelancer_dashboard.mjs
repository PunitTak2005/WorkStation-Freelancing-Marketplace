import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Contract from '../models/Contract.js';
import Review from '../models/Review.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import UserSettings from '../models/UserSettings.js';

async function seedFreelancerDashboardData() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    // 1. Get or Create Aarav Desai
    let aarav = await User.findOne({ email: 'aarav.desai@email.com' });
    if (!aarav) {
      console.error('Aarav Desai user not found!');
      process.exit(1);
    }

    // 2. Get Clients (Rajesh Kumar/Sharma, Priya Patel, Sneha Gupta, etc.)
    let rajesh = await User.findOne({ $or: [{ email: 'rajesh.sharma@email.com' }, { name: /Rajesh/i }] });
    let priya = await User.findOne({ email: 'priya.patel@email.com' }) || await User.findOne({ role: 'client', _id: { $ne: rajesh._id } });
    let sneha = await User.findOne({ email: 'sneha.gupta@email.com' }) || await User.findOne({ role: 'client', _id: { $nin: [rajesh._id, priya?._id] } });

    console.log('Clients:', { rajesh: rajesh?.name, priya: priya?.name, sneha: sneha?.name });

    // 3. Clear existing payments for Aarav to ensure exact math
    await Payment.deleteMany({ recipient: aarav._id });

    // 4. Create 3 Distinct Active Contracts
    // Contract 1: API Integration & Pipeline Analytics (with Rajesh Sharma)
    let job1 = await Job.findOne({ title: /API Integration/i });
    if (!job1) {
      job1 = await Job.create({
        title: 'API Integration & Pipeline Analytics',
        description: 'Design and develop scalable microservices, authentication middleware, and real-time MongoDB analytics pipelines.',
        category: 'Web Development',
        budget: { min: 80000, max: 110000, type: 'fixed' },
        deadline: new Date('2026-09-17T18:00:00Z'),
        experienceLevel: 'expert',
        client: rajesh._id,
        status: 'in_progress',
        skillsRequired: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs']
      });
    }

    // Contract 2: CRM Dashboard Modernization (with Priya)
    let job2 = await Job.findOne({ title: /CRM Dashboard Modernization/i });
    if (!job2) {
      job2 = await Job.create({
        title: 'CRM Dashboard Modernization',
        description: 'Modernize enterprise CRM platform with React 19, Tailwind CSS, charts, and customer lifecycle management.',
        category: 'Web Development',
        budget: { min: 55000, max: 75000, type: 'fixed' },
        deadline: new Date('2026-09-24T18:00:00Z'),
        experienceLevel: 'expert',
        client: priya ? priya._id : rajesh._id,
        status: 'in_progress',
        skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'Redux']
      });
    }

    // Contract 3: E-Commerce Performance Optimization (with Sneha)
    let job3 = await Job.findOne({ title: /E-Commerce Performance Optimization/i });
    if (!job3) {
      job3 = await Job.create({
        title: 'E-Commerce Performance Optimization',
        description: 'Audit and optimize high-volume storefront for mobile performance, caching, and payment checkout flow.',
        category: 'Web Development',
        budget: { min: 70000, max: 90000, type: 'fixed' },
        deadline: new Date('2026-09-20T18:00:00Z'),
        experienceLevel: 'expert',
        client: sneha ? sneha._id : rajesh._id,
        status: 'in_progress',
        skillsRequired: ['React', 'Node.js', 'Docker', 'Core Web Vitals']
      });
    }

    // Ensure proposals for these 3 jobs
    let prop1 = await Proposal.findOneAndUpdate(
      { job: job1._id, freelancer: aarav._id },
      {
        job: job1._id,
        freelancer: aarav._id,
        bidAmount: 95000,
        deliveryTime: 14,
        coverLetter: 'I will engineer high-throughput API integrations and optimize MongoDB indexes for sub-100ms response times.',
        status: 'accepted'
      },
      { upsert: true, new: true }
    );

    let prop2 = await Proposal.findOneAndUpdate(
      { job: job2._id, freelancer: aarav._id },
      {
        job: job2._id,
        freelancer: aarav._id,
        bidAmount: 65000,
        deliveryTime: 21,
        coverLetter: 'I specialize in React SaaS dashboards with responsive design systems, charts, and dark/light modes.',
        status: 'accepted'
      },
      { upsert: true, new: true }
    );

    let prop3 = await Proposal.findOneAndUpdate(
      { job: job3._id, freelancer: aarav._id },
      {
        job: job3._id,
        freelancer: aarav._id,
        bidAmount: 82000,
        deliveryTime: 10,
        coverLetter: 'I will eliminate layout shifts, optimize bundle size, and streamline checkout payment processing.',
        status: 'accepted'
      },
      { upsert: true, new: true }
    );

    // Delete existing active contracts for Aarav to guarantee exactly 3 active contracts
    await Contract.deleteMany({ freelancer: aarav._id, status: 'active' });

    // Create Contract 1 (Active, 72% progress, Due Sep 17)
    const contract1 = await Contract.create({
      client: rajesh._id,
      freelancer: aarav._id,
      job: job1._id,
      proposal: prop1._id,
      title: 'API Integration & Pipeline Analytics',
      progress: 72,
      totalAmount: 95000,
      platformFee: 10,
      status: 'active',
      escrowStatus: 'funded',
      startDate: new Date('2026-09-01'),
      milestones: [
        {
          title: 'API Integration & Middleware Architecture',
          description: 'Backend authentication, JWT security tokens, and gateway routing.',
          amount: 35000,
          status: 'in_progress',
          dueDate: new Date('2026-09-17T18:00:00Z')
        },
        {
          title: 'MongoDB Data Aggregation Pipeline',
          description: 'High-speed metrics queries and aggregation pipelines for analytics.',
          amount: 30000,
          status: 'funded',
          dueDate: new Date('2026-09-22T18:00:00Z')
        },
        {
          title: 'Production Verification & Documentation',
          description: 'OpenAPI Swagger documentation and stress testing verification.',
          amount: 30000,
          status: 'pending',
          dueDate: new Date('2026-09-28T18:00:00Z')
        }
      ]
    });

    // Create Contract 2 (Near Completion, 46% progress, Due Sep 24)
    const contract2 = await Contract.create({
      client: priya ? priya._id : rajesh._id,
      freelancer: aarav._id,
      job: job2._id,
      proposal: prop2._id,
      title: 'CRM Dashboard Modernization',
      progress: 46,
      totalAmount: 65000,
      platformFee: 10,
      status: 'active',
      escrowStatus: 'funded',
      startDate: new Date('2026-09-03'),
      milestones: [
        {
          title: 'CRM Dashboard Charts & Reports',
          description: 'Interactive pipeline graphs, conversion funnels, and revenue metrics.',
          amount: 30000,
          status: 'in_progress',
          dueDate: new Date('2026-09-20T18:00:00Z')
        },
        {
          title: 'Lead Management & Deal Stage Automation',
          description: 'Interactive Kanban board with drag-and-drop client stage updates.',
          amount: 35000,
          status: 'funded',
          dueDate: new Date('2026-09-24T18:00:00Z')
        }
      ]
    });

    // Create Contract 3 (In Review / Near Completion, 88% progress, Due Sep 20)
    const contract3 = await Contract.create({
      client: sneha ? sneha._id : rajesh._id,
      freelancer: aarav._id,
      job: job3._id,
      proposal: prop3._id,
      title: 'E-Commerce Performance Optimization',
      progress: 88,
      totalAmount: 82000,
      platformFee: 10,
      status: 'active',
      escrowStatus: 'funded',
      startDate: new Date('2026-09-05'),
      milestones: [
        {
          title: 'E-Commerce Performance Audit & Caching',
          description: 'Optimize bundle size, code splitting, and browser HTTP cache headers.',
          amount: 42000,
          status: 'in_progress',
          dueDate: new Date('2026-09-20T18:00:00Z')
        },
        {
          title: 'Mobile Optimization & Final Testing',
          description: 'Lighthouse audit verification on Android and iOS devices.',
          amount: 40000,
          status: 'funded',
          dueDate: new Date('2026-09-29T18:00:00Z')
        }
      ]
    });

    console.log('✓ Created 3 Active Contracts with Milestones');

    // 5. Seed Payment Releases Across Months (Summing up to ₹18,60,000)
    // Apr: ₹2,10,000 | May: ₹3,20,000 | Jun: ₹2,75,000 | Jul: ₹3,90,000 | Aug: ₹4,15,000 | Sep: ₹2,50,000
    // Total = 2,10,000 + 3,20,000 + 2,75,000 + 3,90,000 + 4,15,000 + 2,50,000 = ₹18,60,000
    const monthlyAllocations = [
      { year: 2026, month: 4, day: 15, amount: 210000, invoice: 'WS-INV-2026-04' },
      { year: 2026, month: 5, day: 18, amount: 320000, invoice: 'WS-INV-2026-05' },
      { year: 2026, month: 6, day: 22, amount: 275000, invoice: 'WS-INV-2026-06' },
      { year: 2026, month: 7, day: 14, amount: 390000, invoice: 'WS-INV-2026-07' },
      { year: 2026, month: 8, day: 19, amount: 415000, invoice: 'WS-INV-2026-08' },
      // September weekly breakdown:
      // Sep 2: 8k | Sep 5: 12k | Sep 8: 15k | Sep 10: 9k | Sep 12: 18k | Sep 15: 22k -> 84k
      // Remainder of 250k: 166k on Sep 1
      { year: 2026, month: 9, day: 1, amount: 166000, invoice: 'WS-INV-2026-09A' },
      { year: 2026, month: 9, day: 2, amount: 8000, invoice: 'WS-INV-2026-09B' },
      { year: 2026, month: 9, day: 5, amount: 12000, invoice: 'WS-INV-2026-09C' },
      { year: 2026, month: 9, day: 8, amount: 15000, invoice: 'WS-INV-2026-09D' },
      { year: 2026, month: 9, day: 10, amount: 9000, invoice: 'WS-INV-2026-09E' },
      { year: 2026, month: 9, day: 12, amount: 18000, invoice: 'WS-INV-2026-09F' },
      { year: 2026, month: 9, day: 15, amount: 22000, invoice: 'WS-INV-2026-09G' },
    ];

    for (const alloc of monthlyAllocations) {
      const pDate = new Date(alloc.year, alloc.month - 1, alloc.day, 12, 0, 0);
      await Payment.create({
        contract: contract1._id,
        payer: rajesh._id,
        recipient: aarav._id,
        amount: alloc.amount,
        platformFee: Math.round(alloc.amount * 0.1),
        netAmount: Math.round(alloc.amount * 0.9),
        currency: 'INR',
        type: 'escrow_release',
        status: 'succeeded',
        invoiceNumber: alloc.invoice,
        createdAt: pDate,
        updatedAt: pDate
      });
    }
    console.log('✓ Seeded Escrow Payments summing to ₹18,60,000 across 6 months and September weekly releases');

    // Update user earnings
    aarav.earnings = 1860000;
    await aarav.save();

    // 6. Seed 12 Proposals (7 Accepted, 3 Shortlisted, 2 Pending = 58.3% Accepted Rate)
    // Clear existing proposals for Aarav to ensure exact count of 12
    await Proposal.deleteMany({ freelancer: aarav._id });

    const proposalDefs = [
      { title: 'Inventory Management SaaS Platform', budget: 58000, status: 'accepted', delivery: 14, daysAgo: 45 },
      { title: 'Healthcare Patient Portal & Booking UI', budget: 120000, status: 'pending', delivery: 30, daysAgo: 2 },
      { title: 'FinTech SaaS Analytics Dashboard', budget: 78000, status: 'shortlisted', delivery: 20, daysAgo: 5 },
      { title: 'Designer Portfolio Studio Website', budget: 22000, status: 'accepted', delivery: 7, daysAgo: 60 },
      { title: 'High-Volume Logistics Analytics Platform', budget: 90000, status: 'accepted', delivery: 25, daysAgo: 35 },
      { title: 'API Integration & Pipeline Analytics', budget: 95000, status: 'accepted', delivery: 14, daysAgo: 12 },
      { title: 'CRM Dashboard Modernization', budget: 65000, status: 'accepted', delivery: 21, daysAgo: 9 },
      { title: 'E-Commerce Performance Optimization', budget: 82000, status: 'accepted', delivery: 10, daysAgo: 7 },
      { title: 'Real Estate Virtual Tour Platform', budget: 45000, status: 'accepted', delivery: 15, daysAgo: 75 },
      { title: 'Multi-Vendor Marketplace Mobile App', budget: 115000, status: 'shortlisted', delivery: 28, daysAgo: 4 },
      { title: 'Automated Invoicing & Billing Engine', budget: 68000, status: 'shortlisted', delivery: 18, daysAgo: 6 },
      { title: 'Cloud Infrastructure & Docker Deployment', budget: 52000, status: 'pending', delivery: 12, daysAgo: 1 },
    ];

    for (const pDef of proposalDefs) {
      let j = await Job.findOne({ title: pDef.title });
      if (!j) {
        j = await Job.create({
          title: pDef.title,
          description: `Full stack software project: ${pDef.title}. High performance deliverables required.`,
          category: 'Web Development',
          budget: { min: Math.round(pDef.budget * 0.85), max: Math.round(pDef.budget * 1.15), type: 'fixed' },
          experienceLevel: 'expert',
          client: rajesh._id,
          status: pDef.status === 'accepted' ? 'in_progress' : 'open',
          skillsRequired: ['React', 'Node.js', 'MongoDB']
        });
      }

      const pDate = new Date(Date.now() - pDef.daysAgo * 24 * 3600 * 1000);
      await Proposal.create({
        job: j._id,
        freelancer: aarav._id,
        bidAmount: pDef.budget,
        deliveryTime: pDef.delivery,
        coverLetter: `Hi there, I am a Senior Full Stack Engineer with 5+ years of experience delivering scalable systems. I am excited to execute ${pDef.title} with clean architecture and comprehensive tests.`,
        status: pDef.status,
        createdAt: pDate,
        updatedAt: pDate
      });
    }
    console.log('✓ Seeded exactly 12 Proposals (7 accepted, 3 shortlisted, 2 pending)');

    // 7. Seed Active Conversations & Multi-Turn Messages
    // Conversation 1: Rajesh Sharma
    // Conversation 2: Priya Kapoor
    // Conversation 3: Rohan Patel
    let priyaKapoor = await User.findOne({ name: /Priya Kapoor/i }) || await User.findOne({ name: /Priya/i });
    let rohanPatel = await User.findOne({ name: /Rohan Patel/i }) || await User.findOne({ name: /Rohan/i });

    const chatPartners = [
      {
        user: rajesh,
        lastMsg: 'Great work on the dashboard updates.',
        messages: [
          { sender: rajesh, text: 'Hi Aarav, how is the dashboard milestone coming along?', time: 48 },
          { sender: aarav, text: "I'll deliver the updated dashboard tonight.", time: 24 },
          { sender: rajesh, text: 'Perfect. Looking forward to reviewing it.', time: 6 },
          { sender: rajesh, text: 'Great work on the dashboard updates.', time: 1 }
        ]
      },
      {
        user: priyaKapoor || priya,
        lastMsg: 'Can we finalize the API documentation?',
        messages: [
          { sender: priyaKapoor || priya, text: 'Hey Aarav, the design tokens for CRM checkout are finalized.', time: 36 },
          { sender: aarav, text: 'Awesome! I have mapped them to the Tailwind configuration.', time: 18 },
          { sender: priyaKapoor || priya, text: 'Can we finalize the API documentation?', time: 3 }
        ]
      },
      {
        user: rohanPatel || sneha,
        lastMsg: "I've reviewed your implementation.",
        messages: [
          { sender: rohanPatel || sneha, text: 'Hi Aarav, did you test the caching layers on Redis?', time: 12 },
          { sender: aarav, text: 'Yes, cache hits are over 94% with zero stale reads.', time: 5 },
          { sender: rohanPatel || sneha, text: "I've reviewed your implementation.", time: 2 }
        ]
      }
    ];

    for (const cp of chatPartners) {
      if (!cp.user) continue;
      let conv = await Conversation.findOne({
        participants: { $all: [aarav._id, cp.user._id] }
      });
      if (!conv) {
        conv = await Conversation.create({
          participants: [aarav._id, cp.user._id],
          unreadCounts: new Map()
        });
      }

      await Message.deleteMany({ conversation: conv._id });
      for (const m of cp.messages) {
        const mTime = new Date(Date.now() - m.time * 3600 * 1000);
        await Message.create({
          conversation: conv._id,
          sender: m.sender._id,
          text: m.text,
          isRead: true,
          createdAt: mTime
        });
      }

      conv.lastMessage = {
        text: cp.lastMsg,
        sender: cp.user._id,
        createdAt: new Date(Date.now() - 3600 * 1000)
      };
      await conv.save();
    }
    console.log('✓ Seeded 3 Active Conversations with multi-turn messages');

    // 8. Seed 6 Recent Notifications (Mix of read & unread)
    await Notification.deleteMany({ receiver: aarav._id });
    const notifDefs = [
      {
        title: 'Milestone Approved',
        message: 'Rajesh Sharma approved "API Integration & Middleware Architecture" (₹35,000 released).',
        type: 'milestone_approved',
        read: false,
        hoursAgo: 1
      },
      {
        title: 'Escrow Released',
        message: 'Escrow deposit of ₹22,000 has been transferred to your primary bank payout method.',
        type: 'escrow_released',
        read: false,
        hoursAgo: 4
      },
      {
        title: 'New Proposal Viewed',
        message: 'Priya Kapoor viewed your proposal for "CRM Dashboard Modernization".',
        type: 'bid_received',
        read: true,
        hoursAgo: 12
      },
      {
        title: 'Client Sent a Message',
        message: 'Priya Kapoor: "Can we finalize the API documentation?"',
        type: 'new_message',
        read: true,
        hoursAgo: 18
      },
      {
        title: 'Payment Processed',
        message: 'Invoice WS-INV-2026-09F (₹18,000) verified and credited to your WorkStation wallet.',
        type: 'payment_completed',
        read: true,
        hoursAgo: 24
      },
      {
        title: 'Deadline Reminder',
        message: 'Milestone "API Integration & Pipeline Analytics" is due on 17 Sept 2026.',
        type: 'system',
        read: true,
        hoursAgo: 36
      }
    ];

    for (const nd of notifDefs) {
      await Notification.create({
        receiver: aarav._id,
        sender: rajesh._id,
        title: nd.title,
        message: nd.message,
        type: nd.type,
        read: nd.read,
        createdAt: new Date(Date.now() - nd.hoursAgo * 3600 * 1000)
      });
    }
    console.log('✓ Seeded 6 Notifications (read & unread)');

    // 9. Seed 15+ Client Reviews for Aarav (with distinct completed contracts)
    await Review.deleteMany({ reviewee: aarav._id });
    const reviewData = [
      { name: 'Rajesh Sharma', rating: 5, comment: 'Excellent communication and high-quality work. Aarav delivered the core dashboard architecture ahead of deadline!' },
      { name: 'Neha Singh', rating: 5, comment: 'Delivered ahead of schedule. Very proficient in MongoDB query optimization and React 19 hooks.' },
      { name: 'Priya Kapoor', rating: 5, comment: 'Great eye for responsive design details and state management. Highly recommended for complex SaaS applications.' },
      { name: 'Rohan Patel', rating: 5, comment: 'Superb developer! Fixed API authentication middleware and reduced endpoint latency by 35%.' },
      { name: 'Aditya Joshi', rating: 5, comment: 'Clean TypeScript codebase with 100% test coverage. Very proactive communicator.' },
      { name: 'Sanjay Pillai', rating: 5, comment: 'Built our multi-tenant inventory platform seamlessly. Will definitely hire again.' },
      { name: 'Kavita Nair', rating: 4.8, comment: 'Thorough documentation and easy deployment with Docker containers.' },
      { name: 'Suresh Kumar', rating: 5, comment: 'One of the best MERN developers on WorkStation. Always responsive and detail-oriented.' },
      { name: 'Deepa Iyer', rating: 4.9, comment: 'Great full-stack skills. Integrated Stripe payments and webhook error handling without hitch.' },
      { name: 'Amit Joshi', rating: 5, comment: 'Delivered robust GraphQL APIs and real-time websockets on schedule.' },
      { name: 'Ananya Reddy', rating: 5, comment: 'Exceptional work ethic and clean modular React components.' },
      { name: 'Rohit Mehta', rating: 4.8, comment: 'Helped our startup launch the MVP 2 weeks early. Great performance optimization.' },
      { name: 'Vikram Singh', rating: 5, comment: 'Professional, courteous, and highly talented architect.' },
      { name: 'Pooja Deshmukh', rating: 4.9, comment: 'Our Lighthouse score went from 62 to 98 thanks to Aarav’s audit.' },
      { name: 'Meera Saxena', rating: 5, comment: 'Brilliant technical execution and polite, proactive communication throughout.' }
    ];

    const allClients = await User.find({ role: 'client' }).limit(16);

    for (let i = 0; i < reviewData.length; i++) {
      const r = reviewData[i];
      const reviewerUser = allClients[i % allClients.length] || rajesh;
      
      // Create a completed dummy contract for this review to satisfy the unique index
      const dummyJob = await Job.findOne({ status: 'in_progress' }) || job1;
      const completedContract = await Contract.create({
        client: reviewerUser._id,
        freelancer: aarav._id,
        job: dummyJob._id,
        proposal: prop1._id,
        title: `Completed Project Milestone ${i + 1}`,
        totalAmount: 25000 + i * 2000,
        status: 'completed',
        escrowStatus: 'released',
        startDate: new Date(Date.now() - (100 + i * 10) * 24 * 3600 * 1000),
        endDate: new Date(Date.now() - (70 + i * 10) * 24 * 3600 * 1000)
      });

      await Review.create({
        contract: completedContract._id,
        reviewer: reviewerUser._id,
        reviewee: aarav._id,
        rating: { communication: 5, quality: 5, deadline: 5, overall: r.rating },
        comment: r.comment
      });
    }
    console.log('✓ Seeded 15 Client Reviews with completed contracts');

    // 10. Update Completed Projects in Portfolio to 6
    aarav.portfolio = [
      {
        title: 'CRM Dashboard',
        description: 'Scalable CRM analytics dashboard with lead tracking, deal pipelines, interactive revenue charts, and MongoDB data aggregation.',
        images: [{ url: '/projects/crm-dashboard.webp' }],
        projectUrl: 'https://github.com/aaravdesai/crm-dashboard',
        createdAt: new Date('2025-08-15')
      },
      {
        title: 'Analytics Platform',
        description: 'High-throughput enterprise data platform rendering real-time user event streams, retention cohorts, and funnel insights.',
        images: [{ url: '/projects/fintech-saas-dashboard.webp' }],
        projectUrl: 'https://github.com/aaravdesai/analytics-platform',
        createdAt: new Date('2025-07-20')
      },
      {
        title: 'E-Commerce Store',
        description: 'Full-stack MERN e-commerce application with Stripe integration, optimized cart checkout, order tracking, and admin catalog.',
        images: [{ url: '/projects/ecommerce-store.webp' }],
        projectUrl: 'https://github.com/aaravdesai/ecommerce-store',
        createdAt: new Date('2025-06-20')
      },
      {
        title: 'Project Management App',
        description: 'Real-time collaborative project management tool featuring interactive Kanban boards, Socket.IO live updates, and team activity feeds.',
        images: [{ url: '/projects/project-management.webp' }],
        projectUrl: 'https://github.com/aaravdesai/project-management',
        createdAt: new Date('2025-05-10')
      },
      {
        title: 'HR & Payroll Portal',
        description: 'Employee onboarding, attendance tracking, automated tax slip calculations, and leave approval workflows.',
        images: [{ url: '/projects/fintrack-finance-dashboard.webp' }],
        projectUrl: 'https://github.com/aaravdesai/hr-portal',
        createdAt: new Date('2025-04-12')
      },
      {
        title: 'Restaurant Ordering System',
        description: 'Contactless QR menu ordering, kitchen ticket display system, and table payment reconciliation.',
        images: [{ url: '/projects/learnsphere-mobile-ui.webp' }],
        projectUrl: 'https://github.com/aaravdesai/restaurant-pos',
        createdAt: new Date('2025-03-05')
      }
    ];

    aarav.completedProjects = 64;
    aarav.ratingsAverage = 4.9;
    aarav.ratingsCount = 87;
    aarav.earnings = 1860000;
    aarav.availability = 'available';
    await aarav.save();
    console.log('✓ Updated 6 Portfolio projects and verified 64 completed projects');

    console.log('\n🎉 ALL FREELANCER DASHBOARD DATA SUCCESSFULLY SEEDED!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding freelancer dashboard data:', err);
    process.exit(1);
  }
}

seedFreelancerDashboardData();
