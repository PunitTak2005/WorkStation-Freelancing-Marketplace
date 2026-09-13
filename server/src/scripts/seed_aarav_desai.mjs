import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import UserSettings from '../models/UserSettings.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Contract from '../models/Contract.js';
import Review from '../models/Review.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';

async function seedAaravDesai() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB at', mongoUri);

    // 1. Find or create Client Rajesh Kumar (or Rajesh Sharma)
    let clientUser = await User.findOne({ 
      $or: [{ email: 'rajesh.sharma@email.com' }, { name: /Rajesh/i }] 
    });
    if (!clientUser) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      clientUser = await User.create({
        name: 'Rajesh Kumar',
        email: 'rajesh.sharma@email.com',
        password: hashedPassword,
        role: 'client',
        verified: true,
        location: 'Udaipur, Rajasthan, India',
        phone: '+91 63670 88841',
        bio: 'Founder & Technical Director hiring experienced full stack developers.'
      });
      console.log('Created Client Rajesh:', clientUser._id);
    } else {
      console.log('Found Client Rajesh:', clientUser._id, clientUser.name);
    }

    // 2. Find or create Aarav Desai
    let aarav = await User.findOne({ email: 'aarav.desai@email.com' });
    const passwordHash = await bcrypt.hash('password123', 12);

    const aaravData = {
      name: 'Aarav Desai',
      email: 'aarav.desai@email.com',
      role: 'freelancer',
      title: 'Full Stack Developer',
      status: 'active',
      verified: true,
      location: 'Ahmedabad, Gujarat, India',
      phone: '+91 98765 43210',
      hourlyRate: 1800,
      availability: 'available',
      experience: 'expert',
      expertiseLevel: 'Expert',
      earnings: 1860000, // ₹18.6L+
      completedProjects: 64,
      ratingsAverage: 4.9,
      ratingsCount: 87,
      bio: 'Full Stack Developer with 5+ years of experience building scalable React, Node.js, Express, and MongoDB applications. Specialized in SaaS platforms, dashboards, REST APIs, and responsive UI development with a strong focus on performance and user experience.',
      skills: [
        'React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript',
        'Redux', 'Tailwind CSS', 'Docker', 'Git', 'REST APIs', 'JWT', 'Socket.IO', 'PostgreSQL'
      ],
      avatar: {
        url: '/freelancers/aarav-desai.webp'
      },
      coverBanner: {
        url: '/banners/workstation-hero.webp'
      },
      socialLinks: {
        github: 'https://github.com/aaravdesai',
        linkedin: 'https://linkedin.com/in/aaravdesai',
        website: 'https://aaravdesai.dev'
      },
      education: [
        {
          degree: 'B.Tech Computer Engineering',
          institution: 'Nirma University, Ahmedabad',
          year: 2021
        }
      ],
      certifications: [
        'AWS Cloud Practitioner',
        'MongoDB Associate',
        'React Advanced Certification',
        'Docker Foundations'
      ],
      certificationsList: [
        {
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          date: 'Issued Dec 2024',
          credentialId: 'AWS-CCP-98421',
          url: 'https://aws.amazon.com/verification'
        },
        {
          title: 'MongoDB Certified Associate Developer',
          issuer: 'MongoDB University',
          date: 'Issued Aug 2024',
          credentialId: 'MDB-DEV-77124',
          url: 'https://university.mongodb.com/'
        },
        {
          title: 'React Advanced Architecture Specialist',
          issuer: 'Meta / Coursera',
          date: 'Issued Mar 2024',
          credentialId: 'META-REACT-55910',
          url: 'https://coursera.org/verify'
        },
        {
          title: 'Docker Foundations Professional',
          issuer: 'Docker Inc.',
          date: 'Issued Jan 2024',
          credentialId: 'DCK-FD-31049',
          url: 'https://docker.com'
        }
      ],
      experiences: [
        {
          role: 'Senior Full Stack Developer',
          company: 'TechNova Solutions',
          duration: 'Jan 2024 – Present',
          description: 'Built SaaS dashboards, improved API performance by 35%, and led frontend architecture across React and Node microservices.'
        },
        {
          role: 'MERN Developer',
          company: 'PixelCraft Studio',
          duration: 'Jul 2022 – Dec 2023',
          description: 'Developed client portals, implemented secure JWT authentication, and built high-performance reusable UI components.'
        },
        {
          role: 'Frontend Developer',
          company: 'WebNest Technologies',
          duration: 'Jun 2021 – Jun 2022',
          description: 'Created responsive landing pages and optimized Core Web Vitals to achieve 98+ Lighthouse scores.'
        }
      ],
      portfolio: [
        {
          title: 'CRM Dashboard',
          description: 'Scalable CRM analytics dashboard with lead tracking, deal pipelines, interactive revenue charts, and MongoDB data aggregation.',
          images: [{ url: '/projects/crm-dashboard.webp' }],
          projectUrl: 'https://github.com/aaravdesai/crm-dashboard',
          createdAt: new Date('2025-08-15')
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
          createdAt: new Date('2025-03-10')
        }
      ],
      twoFactorEnabled: true,
      createdAt: new Date('2025-02-10')
    };

    if (aarav) {
      Object.assign(aarav, aaravData);
      await aarav.save();
      console.log('✓ Updated Aarav Desai user record:', aarav._id);
    } else {
      aaravData.password = passwordHash;
      aarav = await User.create(aaravData);
      console.log('✓ Created Aarav Desai user record:', aarav._id);
    }

    // 3. Populate UserSettings for Aarav
    await UserSettings.findOneAndUpdate(
      { user: aarav._id },
      {
        user: aarav._id,
        general: {
          username: 'aaravdesai',
          displayName: 'Aarav Desai',
          language: 'English (US)',
          timeZone: 'UTC+05:30 (India Standard Time - IST)',
          dateFormat: 'DD/MM/YYYY'
        },
        account: {
          company: '',
          jobTitle: 'Senior Full Stack Developer'
        },
        appearance: {
          theme: 'light',
          accentColor: '#0A84FF',
          density: 'comfortable',
          fontSize: 'medium'
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
          showLastSeen: true,
          allowDirectMessages: true,
          searchEngineIndexing: true,
          freelancerRecommendations: true
        },
        connectedAccounts: {
          google: { connected: true, email: 'aarav.desai@gmail.com' },
          github: { connected: true, username: 'aaravdesai' },
          linkedin: { connected: true, username: 'in/aaravdesai' },
          microsoft: { connected: false, email: '' }
        }
      },
      { upsert: true, new: true }
    );
    console.log('✓ UserSettings updated for Aarav Desai');

    // 4. Find or create CRM Dashboard Job posted by client Rajesh
    let crmJob = await Job.findOne({ title: /CRM Dashboard/i });
    if (!crmJob) {
      crmJob = await Job.create({
        title: 'CRM Dashboard Architecture & Full-Stack Development',
        description: 'We need an experienced Senior Full-Stack developer to build a modern, high-performance SaaS CRM Dashboard with lead tracking, deals pipeline, and analytics.',
        category: 'Web Development',
        budget: {
          min: 50000,
          max: 75000,
          type: 'fixed'
        },
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        experienceLevel: 'expert',
        client: clientUser._id,
        status: 'in_progress',
        skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
        skillsRequired: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Tailwind CSS']
      });
      console.log('✓ Created CRM Dashboard Job:', crmJob._id);
    } else {
      console.log('Found existing CRM Dashboard Job:', crmJob._id);
    }

    // 5. Proposal for CRM Dashboard
    let proposal = await Proposal.findOne({ job: crmJob._id, freelancer: aarav._id });
    if (!proposal) {
      proposal = await Proposal.create({
        job: crmJob._id,
        freelancer: aarav._id,
        bidAmount: 62000,
        deliveryTime: 21,
        coverLetter: 'Hi Rajesh, I have 5+ years of full stack MERN experience and recently built analytics dashboards with high concurrency. I can deliver your CRM Dashboard with complete test coverage, reusable UI components, and optimal database indexes.',
        status: 'pending',
        milestones: [
          { title: 'System Architecture & Database Schema', amount: 18000 },
          { title: 'Frontend Dashboard & Pipeline Views', amount: 24000 },
          { title: 'Final Integration, Analytics & Deployment', amount: 20000 }
        ]
      });
      console.log('✓ Created CRM Dashboard Proposal:', proposal._id);
    } else {
      proposal.bidAmount = 62000;
      proposal.status = 'pending';
      await proposal.save();
      console.log('✓ Updated CRM Dashboard Proposal:', proposal._id);
    }

    // 6. Active Contract & Milestones for Aarav (with Rajesh)
    let contract = await Contract.findOne({ freelancer: aarav._id, client: clientUser._id });
    if (!contract) {
      contract = await Contract.create({
        client: clientUser._id,
        freelancer: aarav._id,
        job: crmJob._id,
        proposal: proposal._id,
        totalAmount: 62000,
        platformFee: 10,
        status: 'active',
        escrowStatus: 'funded',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        milestones: [
          {
            title: 'Core UI Framework & Kanban Dashboard',
            description: 'Implement responsive dashboard view with React and Tailwind CSS.',
            amount: 22000,
            status: 'approved',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            title: 'API Integration & Pipeline Analytics',
            description: 'Node.js/Express backend endpoints with MongoDB aggregation pipeline.',
            amount: 20000,
            status: 'in_progress',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            title: 'Production Testing & Final Delivery',
            description: 'Deployment to cloud instance, SSL certificate, and final signoff.',
            amount: 20000,
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        ]
      });
      console.log('✓ Created Active Contract for Aarav:', contract._id);
    } else {
      console.log('Found existing Contract for Aarav:', contract._id);
    }

    // 7. Seed Reviews for Aarav to guarantee 4.9 average rating
    const existingReview = await Review.findOne({ contract: contract._id, reviewer: clientUser._id });
    if (!existingReview) {
      await Review.create({
        contract: contract._id,
        reviewer: clientUser._id,
        reviewee: aarav._id,
        rating: { communication: 5, quality: 5, deadline: 5, overall: 5 },
        comment: 'Aarav is an exceptional full-stack developer. Delivered the CRM prototype days ahead of schedule with immaculate code quality and detailed documentation!'
      });
      console.log('✓ Created Review for Aarav Desai');
    }

    // 8. Conversation & Messages with Rajesh Sharma / Kumar
    let conv = await Conversation.findOne({
      participants: { $all: [aarav._id, clientUser._id] }
    });

    if (!conv) {
      conv = await Conversation.create({
        participants: [aarav._id, clientUser._id],
        job: crmJob._id,
        unreadCounts: new Map()
      });
      console.log('✓ Created Conversation between Aarav and Rajesh:', conv._id);
    }

    // Check messages
    const messageCount = await Message.countDocuments({ conversation: conv._id });
    if (messageCount === 0) {
      const msg1 = await Message.create({
        conversation: conv._id,
        sender: clientUser._id,
        text: 'Hi Aarav, how is the dashboard milestone coming along?',
        isRead: true,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000)
      });

      const msg2 = await Message.create({
        conversation: conv._id,
        sender: aarav._id,
        text: "I'll deliver the updated dashboard tonight.",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000)
      });

      const msg3 = await Message.create({
        conversation: conv._id,
        sender: clientUser._id,
        text: 'Perfect. Looking forward to reviewing it.',
        isRead: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      });

      conv.lastMessage = {
        text: msg3.text,
        sender: clientUser._id,
        createdAt: msg3.createdAt
      };
      await conv.save();
      console.log('✓ Created Conversation Messages between Aarav and Rajesh');
    }

    // 9. Realistic Notifications for Aarav
    await Notification.deleteMany({ receiver: aarav._id });
    await Notification.create([
      {
        receiver: aarav._id,
        sender: clientUser._id,
        title: 'Milestone Approved',
        message: 'Rajesh approved your milestone "Core UI Framework & Kanban Dashboard" (₹22,000 released to escrow).',
        type: 'milestone_approved',
        read: false,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000)
      },
      {
        receiver: aarav._id,
        sender: clientUser._id,
        title: 'Proposal Viewed',
        message: 'Rajesh Sharma viewed your proposal for "CRM Dashboard Architecture".',
        type: 'bid_received',
        read: true,
        createdAt: new Date(Date.now() - 8 * 3600 * 1000)
      },
      {
        receiver: aarav._id,
        sender: clientUser._id,
        title: 'New Message',
        message: 'Rajesh Sharma: "Perfect. Looking forward to reviewing it."',
        type: 'new_message',
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]);
    console.log('✓ Seeded Notifications for Aarav');

    // 10. Escrow Release Payment for Freelancer Dashboard Analytics
    const existingPayment = await Payment.findOne({ recipient: aarav._id, status: 'succeeded' });
    if (!existingPayment) {
      await Payment.create({
        contract: contract._id,
        payer: clientUser._id,
        recipient: aarav._id,
        amount: 22000,
        platformFee: 2200,
        netAmount: 19800,
        currency: 'INR',
        type: 'escrow_release',
        status: 'succeeded',
        invoiceNumber: 'WS-INV-AARAV-01',
        createdAt: new Date()
      });
      console.log('✓ Created escrow release Payment for Aarav');
    }

    console.log('🎉 Aarav Desai successfully seeded across all collections!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Aarav Desai:', err);
    process.exit(1);
  }
}

seedAaravDesai();
