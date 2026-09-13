import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

async function seedFreelancerDashboard() {
  console.log('🌱 Starting Aarav Desai Freelancer Dashboard Seeding...');
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  const usersCol = mongoose.connection.collection('users');
  const jobsCol = mongoose.connection.collection('jobs');
  const proposalsCol = mongoose.connection.collection('proposals');
  const contractsCol = mongoose.connection.collection('contracts');
  const paymentsCol = mongoose.connection.collection('payments');
  const reviewsCol = mongoose.connection.collection('reviews');
  const notificationsCol = mongoose.connection.collection('notifications');
  const conversationsCol = mongoose.connection.collection('conversations');
  const messagesCol = mongoose.connection.collection('messages');
  const timeLogsCol = mongoose.connection.collection('timelogs');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Ensure Clients exist for realistic relationships
  const clientsData = [
    {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@email.com',
      phone: '+91 6367088841',
      role: 'client',
      location: 'Udaipur, Rajasthan, India',
      company: 'Sharma Enterprises',
      avatar: { url: '/freelancers/rajesh-kumar.webp' },
      fullAvatarUrl: '/freelancers/rajesh-kumar.webp',
      profileImage: '/freelancers/rajesh-kumar.webp',
      verified: true,
      status: 'active',
      isOnline: true
    },
    {
      name: 'Priya Kapoor',
      email: 'priya.client@kapoordigital.com',
      phone: '+91 9811223344',
      role: 'client',
      location: 'Mumbai, Maharashtra, India',
      company: 'Kapoor Digital Labs',
      avatar: { url: '/freelancers/priya-kapoor.webp' },
      fullAvatarUrl: '/freelancers/priya-kapoor.webp',
      profileImage: '/freelancers/priya-kapoor.webp',
      verified: true,
      status: 'active',
      isOnline: true
    },
    {
      name: 'Rohan Patel',
      email: 'rohan.client@pateltechnologies.com',
      phone: '+91 9922334455',
      role: 'client',
      location: 'Ahmedabad, Gujarat, India',
      company: 'Patel Technologies',
      avatar: { url: '/freelancers/rohan-patel.webp' },
      fullAvatarUrl: '/freelancers/rohan-patel.webp',
      profileImage: '/freelancers/rohan-patel.webp',
      verified: true,
      status: 'active',
      isOnline: false
    },
    {
      name: 'Neha Singh',
      email: 'neha.client@singhai.com',
      phone: '+91 9844556677',
      role: 'client',
      location: 'Bengaluru, Karnataka, India',
      company: 'Singh AI Innovations',
      avatar: { url: '/freelancers/neha-singh.webp' },
      fullAvatarUrl: '/freelancers/neha-singh.webp',
      profileImage: '/freelancers/neha-singh.webp',
      verified: true,
      status: 'active',
      isOnline: true
    },
    {
      name: 'Deepa Iyer',
      email: 'deepa.client@finedge.io',
      phone: '+91 9833445566',
      role: 'client',
      location: 'Hyderabad, Telangana, India',
      company: 'FinEdge Technologies',
      avatar: { url: '/freelancers/neha-singh.webp' },
      fullAvatarUrl: '/freelancers/neha-singh.webp',
      profileImage: '/freelancers/neha-singh.webp',
      verified: true,
      status: 'active',
      isOnline: true
    },
    {
      name: 'Priya Sharma',
      email: 'priya.client@learnsphere.io',
      phone: '+91 9877112233',
      role: 'client',
      location: 'Pune, Maharashtra, India',
      company: 'LearnSphere Academy',
      avatar: { url: '/freelancers/priya-kapoor.webp' },
      fullAvatarUrl: '/freelancers/priya-kapoor.webp',
      profileImage: '/freelancers/priya-kapoor.webp',
      verified: true,
      status: 'active',
      isOnline: true
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul.client@travelsphere.io',
      phone: '+91 9911882233',
      role: 'client',
      location: 'Delhi NCR, India',
      company: 'TravelSphere India',
      avatar: { url: '/freelancers/rohan-patel.webp' },
      fullAvatarUrl: '/freelancers/rohan-patel.webp',
      profileImage: '/freelancers/rohan-patel.webp',
      verified: true,
      status: 'active',
      isOnline: true
    },
    {
      name: 'Kavita Nair',
      email: 'kavita.client@hrpulse.io',
      phone: '+91 9822334411',
      role: 'client',
      location: 'Bengaluru, Karnataka, India',
      company: 'HRPulse Solutions',
      avatar: { url: '/freelancers/neha-singh.webp' },
      fullAvatarUrl: '/freelancers/neha-singh.webp',
      profileImage: '/freelancers/neha-singh.webp',
      verified: true,
      status: 'active',
      isOnline: true
    }
  ];

  const clientMap = {};
  for (const c of clientsData) {
    let existing = await usersCol.findOne({ email: c.email });
    if (!existing) {
      const doc = {
        ...c,
        password: hashedPassword,
        createdAt: new Date('2026-01-15T00:00:00.000Z'),
        updatedAt: new Date()
      };
      const res = await usersCol.insertOne(doc);
      clientMap[c.name] = res.insertedId;
      console.log(`✓ Created client ${c.name}`);
    } else {
      await usersCol.updateOne(
        { _id: existing._id },
        {
          $set: {
            avatar: c.avatar,
            profileImage: c.profileImage,
            fullAvatarUrl: c.fullAvatarUrl,
            company: c.company,
            verified: true,
            status: 'active'
          }
        }
      );
      clientMap[c.name] = existing._id;
      console.log(`✓ Found client ${c.name}`);
    }
  }

  // 2. Freelancer: Aarav Desai
  let aarav = await usersCol.findOne({ email: 'aarav.desai@email.com' });
  const aaravId = aarav ? aarav._id : new mongoose.Types.ObjectId();

  const portfolioItems = [
    {
      title: 'CRM Dashboard Modernization',
      description: 'High performance enterprise CRM with live charts, sales pipeline analytics, and multi-tenant access control.',
      images: [{ url: '/freelancers/aarav-desai.webp' }],
      projectUrl: 'https://crm.workstation.io',
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      completionDate: 'Aug 2026',
      createdAt: new Date('2026-08-15T00:00:00.000Z')
    },
    {
      title: 'Analytics Platform & Data Stream',
      description: 'Real-time financial streaming analytics and transactional fraud detection platform handling 50k+ events/sec.',
      images: [{ url: '/freelancers/aarav-desai.webp' }],
      projectUrl: 'https://analytics.workstation.io',
      techStack: ['Node.js', 'Kafka', 'Redis', 'React', 'Docker'],
      completionDate: 'Jul 2026',
      createdAt: new Date('2026-07-20T00:00:00.000Z')
    },
    {
      title: 'E-Commerce Store & Escrow Marketplace',
      description: 'Multi-vendor marketplace featuring headless checkout, automated escrow settlements, and inventory sync.',
      images: [{ url: '/freelancers/aarav-desai.webp' }],
      projectUrl: 'https://store.workstation.io',
      techStack: ['Next.js', 'Express', 'MongoDB', 'Razorpay', 'Stripe'],
      completionDate: 'Jun 2026',
      createdAt: new Date('2026-06-18T00:00:00.000Z')
    },
    {
      title: 'Project Management App (WorkStation)',
      description: 'Collaborative agile task workspace with WebSocket push updates, sprint timelines, and time logging.',
      images: [{ url: '/freelancers/aarav-desai.webp' }],
      projectUrl: 'https://projects.workstation.io',
      techStack: ['React', 'Redux Toolkit', 'Socket.io', 'Node.js'],
      completionDate: 'May 2026',
      createdAt: new Date('2026-05-22T00:00:00.000Z')
    },
    {
      title: 'HR Portal & Automated Payroll',
      description: 'Full lifecycle employee management, attendance biometric sync, tax compliance, and automated payroll disbursements.',
      images: [{ url: '/freelancers/aarav-desai.webp' }],
      projectUrl: 'https://hr.workstation.io',
      techStack: ['React', 'Node.js', 'MongoDB', 'AWS S3', 'Tailwind'],
      completionDate: 'Apr 2026',
      createdAt: new Date('2026-04-10T00:00:00.000Z')
    },
    {
      title: 'Restaurant Ordering & POS Cloud System',
      description: 'Real-time kitchen order display, table QR ordering, digital menu management, and automated inventory deduction.',
      images: [{ url: '/freelancers/aarav-desai.webp' }],
      projectUrl: 'https://pos.workstation.io',
      techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      completionDate: 'Mar 2026',
      createdAt: new Date('2026-03-28T00:00:00.000Z')
    }
  ];

  const aaravData = {
    name: 'Aarav Desai',
    email: 'aarav.desai@email.com',
    password: hashedPassword,
    role: 'freelancer',
    phone: '+91 98201 44589',
    title: 'Lead Full Stack Engineer & Cloud Architect',
    bio: 'Elite full stack engineer with 8+ years experience architecting cloud-native web applications, distributed APIs, and real-time dashboard systems using React, Node.js, and TypeScript. Passionate about high-throughput systems and UX excellence.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'Next.js', 'AWS', 'Express', 'Tailwind CSS', 'Redis', 'GraphQL'],
    hourlyRate: 2200,
    experience: 'expert',
    expertiseLevel: 'Expert',
    location: 'Bengaluru, Karnataka, India',
    availability: 'available',
    verified: true,
    status: 'active',
    isOnline: true,
    online: true,
    earnings: 1860000, // ₹18,60,000
    totalSpent: 0,
    completedProjects: 24,
    ratingsAverage: 4.9,
    ratingsCount: 18,
    avatar: {
      url: '/freelancers/aarav-desai.webp',
      publicId: 'aarav-desai'
    },
    fullAvatarUrl: '/freelancers/aarav-desai.webp',
    profileImage: '/freelancers/aarav-desai.webp',
    portfolio: portfolioItems,
    socialLinks: {
      github: 'https://github.com/aaravdesai-dev',
      linkedin: 'https://linkedin.com/in/aarav-desai-fullstack',
      website: 'https://aaravdesai.dev'
    },
    updatedAt: new Date()
  };

  if (aarav) {
    await usersCol.updateOne({ _id: aaravId }, { $set: aaravData });
    console.log('✓ Updated freelancer Aarav Desai:', aaravId.toString());
  } else {
    aaravData._id = aaravId;
    aaravData.createdAt = new Date('2026-01-01T00:00:00.000Z');
    await usersCol.insertOne(aaravData);
    console.log('✓ Inserted freelancer Aarav Desai:', aaravId.toString());
  }

  // Also ensure admin user has access
  const adminUser = await usersCol.findOne({ email: 'punittak2005@gmail.com' });
  if (adminUser) {
    console.log('✓ Admin user verified:', adminUser.email);
  }

  // 3. Clear existing Aarav-linked data for clean idempotent re-run
  console.log('🧹 Cleaning old data linked to Aarav Desai for idempotency...');
  await Promise.all([
    paymentsCol.deleteMany({ recipient: aaravId }),
    proposalsCol.deleteMany({ freelancer: aaravId }),
    contractsCol.deleteMany({ freelancer: aaravId }),
    reviewsCol.deleteMany({ reviewee: aaravId }),
    notificationsCol.deleteMany({ receiver: aaravId }),
    timeLogsCol.deleteMany({ freelancer: aaravId }),
    conversationsCol.deleteMany({ participants: aaravId }),
    messagesCol.deleteMany({ sender: aaravId })
  ]);
  console.log('✓ Old records cleared');

  // 4. Create Projects / Jobs
  console.log('📦 Seeding connected Projects & Jobs...');
  const rajeshId = clientMap['Rajesh Sharma'];
  const priyaId = clientMap['Priya Kapoor'];
  const rohanId = clientMap['Rohan Patel'];
  const nehaId = clientMap['Neha Singh'];
  const deepaId = clientMap['Deepa Iyer'];
  const priyaSharmaId = clientMap['Priya Sharma'];
  const rahulId = clientMap['Rahul Sharma'];
  const kavitaId = clientMap['Kavita Nair'];

  const jobsData = [
    // 3 Jobs for Active Contracts
    {
      title: 'API Integration & Pipeline Analytics',
      description: 'Build robust RESTful APIs and real-time streaming data pipeline for telemetry and user event logs. Integrate with existing microservices and configure automated alerts.',
      category: 'Web Development',
      budget: { min: 85000, max: 110000, type: 'fixed' },
      deadline: new Date('2026-09-17T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['Node.js', 'React', 'MongoDB', 'Docker'],
      client: rajeshId,
      status: 'in_progress',
      proposalCount: 4,
      createdAt: new Date('2026-08-25T10:00:00.000Z')
    },
    {
      title: 'CRM Dashboard Modernization',
      description: 'Redesign and modernize legacy CRM frontend into a fast, responsive React dashboard. Provide data visualization charts, lead scoring, and automated PDF export.',
      category: 'Web Development',
      budget: { min: 60000, max: 75000, type: 'fixed' },
      deadline: new Date('2026-09-24T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React', 'TypeScript', 'Tailwind CSS'],
      client: priyaId,
      status: 'in_progress',
      proposalCount: 3,
      createdAt: new Date('2026-08-28T14:00:00.000Z')
    },
    {
      title: 'E-Commerce Performance Optimization',
      description: 'Audit and optimize Core Web Vitals, server response times, and checkout latency. Implement edge caching, image compression, and Redis caching for product catalog.',
      category: 'Web Development',
      budget: { min: 75000, max: 95000, type: 'fixed' },
      deadline: new Date('2026-09-20T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['Next.js', 'React', 'Node.js', 'Redis'],
      client: rohanId,
      status: 'in_progress',
      proposalCount: 5,
      createdAt: new Date('2026-08-20T11:00:00.000Z')
    },
    // 3 Jobs for Disputed / Resolved Contracts
    {
      title: 'Mobile Banking UI Revamp',
      description: 'End-to-end revamp of mobile banking customer touchpoints, fund transfers, and biometric authentication flows.',
      category: 'Mobile Development',
      budget: { min: 35000, max: 45000, type: 'fixed' },
      deadline: new Date('2026-09-25T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React Native', 'Figma', 'TypeScript'],
      client: deepaId,
      status: 'in_progress',
      proposalCount: 3,
      createdAt: new Date('2026-09-01T09:00:00.000Z')
    },
    {
      title: 'Inventory Management System',
      description: 'Real-time inventory synchronization engine and warehousing stock alert management across multiple branches.',
      category: 'Web Development',
      budget: { min: 20000, max: 30000, type: 'fixed' },
      deadline: new Date('2026-09-28T18:30:00.000Z'),
      experienceLevel: 'intermediate',
      skillsRequired: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
      client: rahulId,
      status: 'in_progress',
      proposalCount: 4,
      createdAt: new Date('2026-08-26T11:00:00.000Z')
    },
    {
      title: 'HR Management Portal',
      description: 'Internal employee HR portal with automated payroll computation, attendance tracking, and tax deductions.',
      category: 'Full Stack Development',
      budget: { min: 40000, max: 55000, type: 'fixed' },
      deadline: new Date('2026-08-22T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React', 'Node.js', 'MongoDB'],
      client: kavitaId,
      status: 'completed',
      proposalCount: 5,
      createdAt: new Date('2026-07-28T10:00:00.000Z')
    },
    // Other Jobs for Proposals
    {
      title: 'Inventory Management SaaS Platform',
      description: 'Full stack inventory management solution with barcode tracking, automated purchase orders, and warehouse multi-location sync.',
      category: 'Web Development',
      budget: { min: 50000, max: 65000, type: 'fixed' },
      deadline: new Date('2026-10-15T18:30:00.000Z'),
      experienceLevel: 'intermediate',
      skillsRequired: ['React', 'Node.js', 'MongoDB'],
      client: rajeshId,
      status: 'in_progress',
      proposalCount: 6,
      createdAt: new Date('2026-08-15T09:00:00.000Z')
    },
    {
      title: 'Healthcare Patient Portal & Booking UI',
      description: 'Secure HIPAA-compliant tele-consultation and appointment booking portal with calendar sync and doctor prescription download.',
      category: 'Web Development',
      budget: { min: 110000, max: 140000, type: 'fixed' },
      deadline: new Date('2026-10-25T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React', 'Node.js', 'TypeScript', 'Docker'],
      client: nehaId,
      status: 'open',
      proposalCount: 8,
      createdAt: new Date('2026-09-06T12:00:00.000Z')
    },
    {
      title: 'FinTech SaaS Analytics Dashboard',
      description: 'Interactive analytics dashboard displaying real-time financial transaction trends, revenue forecasting, and churn risk scoring.',
      category: 'Web Development',
      budget: { min: 70000, max: 85000, type: 'fixed' },
      deadline: new Date('2026-10-10T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React', 'TypeScript', 'Node.js'],
      client: rajeshId,
      status: 'open',
      proposalCount: 5,
      createdAt: new Date('2026-09-02T15:00:00.000Z')
    },
    {
      title: 'Designer Portfolio Studio Website',
      description: 'Award-winning creative portfolio website with smooth GSAP animations, WebGL transitions, and headless CMS integration.',
      category: 'UI/UX Design',
      budget: { min: 20000, max: 25000, type: 'fixed' },
      deadline: new Date('2026-09-30T18:30:00.000Z'),
      experienceLevel: 'intermediate',
      skillsRequired: ['React', 'Tailwind CSS'],
      client: priyaId,
      status: 'in_progress',
      proposalCount: 4,
      createdAt: new Date('2026-08-22T16:00:00.000Z')
    },
    {
      title: 'High-Volume Logistics Analytics Platform',
      description: 'Fleet tracking and delivery route optimization platform with real-time GPS coordinates and driver status dashboard.',
      category: 'Web Development',
      budget: { min: 80000, max: 100000, type: 'fixed' },
      deadline: new Date('2026-10-18T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['Node.js', 'React', 'MongoDB', 'Docker'],
      client: rohanId,
      status: 'in_progress',
      proposalCount: 5,
      createdAt: new Date('2026-08-10T10:00:00.000Z')
    },
    {
      title: 'Restaurant Cloud Ordering & POS System',
      description: 'Online table booking, touch POS integration, kitchen display system, and delivery rider assignment.',
      category: 'Web Development',
      budget: { min: 40000, max: 50000, type: 'fixed' },
      deadline: new Date('2026-09-28T18:30:00.000Z'),
      experienceLevel: 'intermediate',
      skillsRequired: ['React', 'Node.js', 'MongoDB'],
      client: rajeshId,
      status: 'completed',
      proposalCount: 3,
      createdAt: new Date('2026-08-01T11:00:00.000Z')
    },
    {
      title: 'Real Estate Virtual Tour Platform',
      description: '360-degree panorama viewer, floor plan interactive map, and video call walkthrough for luxury properties.',
      category: 'Web Development',
      budget: { min: 75000, max: 90000, type: 'fixed' },
      deadline: new Date('2026-10-05T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React', 'Three.js', 'Node.js'],
      client: nehaId,
      status: 'open',
      proposalCount: 7,
      createdAt: new Date('2026-08-30T13:00:00.000Z')
    },
    {
      title: 'AI Resume Screener & Parser',
      description: 'Automated candidate screening tool using NLP to parse PDF resumes, extract skills, and rank suitability against job descriptions.',
      category: 'Web Development',
      budget: { min: 55000, max: 70000, type: 'fixed' },
      deadline: new Date('2026-10-12T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['Python', 'Node.js', 'React'],
      client: rajeshId,
      status: 'open',
      proposalCount: 6,
      createdAt: new Date('2026-09-01T09:30:00.000Z')
    },
    {
      title: 'Automated Invoicing & Billing Engine',
      description: 'Scheduled recurring subscription invoices, automated tax calculation, GST compliance, and PDF receipt dispatch.',
      category: 'Web Development',
      budget: { min: 45000, max: 55000, type: 'fixed' },
      deadline: new Date('2026-10-20T18:30:00.000Z'),
      experienceLevel: 'intermediate',
      skillsRequired: ['Node.js', 'MongoDB', 'Docker'],
      client: rohanId,
      status: 'open',
      proposalCount: 4,
      createdAt: new Date('2026-09-05T14:30:00.000Z')
    },
    // 3 Jobs for Rejected Proposals
    {
      title: 'FinEdge Finance Dashboard',
      description: 'Institutional-grade finance dashboard with real-time trading metrics, portfolio analytics, and automated compliance reports.',
      category: 'Web Development',
      budget: { min: 70000, max: 85000, type: 'fixed' },
      deadline: new Date('2026-09-25T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['React', 'TypeScript', 'Node.js', 'FinTech'],
      client: deepaId,
      status: 'completed',
      proposalCount: 6,
      createdAt: new Date('2026-09-04T09:00:00.000Z')
    },
    {
      title: 'LearnSphere LMS Portal',
      description: 'Comprehensive learning management portal with video course player, live quizzes, certificate generator, and mentor bookings.',
      category: 'Full Stack Development',
      budget: { min: 110000, max: 130000, type: 'fixed' },
      deadline: new Date('2026-10-01T18:30:00.000Z'),
      experienceLevel: 'expert',
      skillsRequired: ['Next.js', 'Node.js', 'MongoDB', 'Video Streaming'],
      client: priyaSharmaId,
      status: 'completed',
      proposalCount: 8,
      createdAt: new Date('2026-08-30T10:30:00.000Z')
    },
    {
      title: 'Travel Booking Platform UI',
      description: 'Next-generation flight and hotel booking web app with interactive seat map, itinerary builder, and instant payment gateway.',
      category: 'React Development',
      budget: { min: 50000, max: 60000, type: 'fixed' },
      deadline: new Date('2026-09-15T18:30:00.000Z'),
      experienceLevel: 'intermediate',
      skillsRequired: ['React', 'Tailwind CSS', 'API Integration'],
      client: rahulId,
      status: 'completed',
      proposalCount: 5,
      createdAt: new Date('2026-08-26T11:00:00.000Z')
    }
  ];

  const jobMap = {};
  for (const j of jobsData) {
    let existingJob = await jobsCol.findOne({ title: j.title });
    if (!existingJob) {
      const res = await jobsCol.insertOne({
        ...j,
        updatedAt: new Date()
      });
      jobMap[j.title] = { _id: res.insertedId, ...j };
    } else {
      await jobsCol.updateOne({ _id: existingJob._id }, { $set: j });
      jobMap[j.title] = { _id: existingJob._id, ...j };
    }
  }
  console.log(`✓ Inserted/Updated ${Object.keys(jobMap).length} jobs`);

  // 5. Seed Proposals (Exactly 12 proposals: 5 Accepted, 2 Shortlisted, 2 Pending, 3 Rejected -> 41.7% success rate)
  console.log('📝 Seeding 12 Proposals (5 Accepted, 2 Shortlisted, 2 Pending, 3 Rejected)...');
  const proposalsData = [
    // Accepted 1: API Integration & Pipeline Analytics
    {
      jobTitle: 'API Integration & Pipeline Analytics',
      bidAmount: 95000,
      deliveryTime: 21,
      status: 'accepted',
      coverLetter: 'Dear Rajesh, I have extensive experience building scalable REST and WebSocket data pipelines. I will implement secure JWT authentication, rate limiting, and automated pipeline telemetry with 99.9% uptime reliability.',
      submissionDate: new Date('2026-08-26T14:00:00.000Z'),
      decidedAt: new Date('2026-08-27T00:00:00.000Z'),
      expectedTimeline: '3 weeks'
    },
    // Accepted 2: CRM Dashboard Modernization
    {
      jobTitle: 'CRM Dashboard Modernization',
      bidAmount: 65000,
      deliveryTime: 18,
      status: 'accepted',
      coverLetter: 'Hi Priya, I reviewed your CRM specs and wireframes. I specialize in building crisp, modular React dashboards with high-performance Recharts components and snappy state management.',
      submissionDate: new Date('2026-08-29T11:30:00.000Z'),
      decidedAt: new Date('2026-08-30T00:00:00.000Z'),
      expectedTimeline: '2.5 weeks'
    },
    // Accepted 3: E-Commerce Performance Optimization
    {
      jobTitle: 'E-Commerce Performance Optimization',
      bidAmount: 82000,
      deliveryTime: 14,
      status: 'accepted',
      coverLetter: 'Hello Rohan, I have audited multiple high-traffic eCommerce storefronts. I will optimize your Next.js SSR bundle, integrate Redis query caching, and bring your mobile Lighthouse score above 95.',
      submissionDate: new Date('2026-08-21T16:45:00.000Z'),
      decidedAt: new Date('2026-08-22T00:00:00.000Z'),
      expectedTimeline: '2 weeks'
    },
    // Accepted 4: Inventory Management SaaS Platform
    {
      jobTitle: 'Inventory Management SaaS Platform',
      bidAmount: 58000,
      deliveryTime: 25,
      status: 'accepted',
      coverLetter: 'Dear Rajesh, I have architected similar warehouse inventory platforms. I propose a robust schema with MongoDB change streams for instant stock updates across all retail stores.',
      submissionDate: new Date('2026-08-16T10:15:00.000Z'),
      decidedAt: new Date('2026-08-18T00:00:00.000Z'),
      expectedTimeline: '3.5 weeks'
    },
    // Accepted 5: Designer Portfolio Studio Website
    {
      jobTitle: 'Designer Portfolio Studio Website',
      bidAmount: 22000,
      deliveryTime: 10,
      status: 'accepted',
      coverLetter: 'Hi Priya, Your design vision looks incredible! I will translate your Figma screens into pixel-perfect Tailwind and Framer Motion code with 60fps animations on all mobile devices.',
      submissionDate: new Date('2026-08-23T15:20:00.000Z'),
      decidedAt: new Date('2026-08-25T00:00:00.000Z'),
      expectedTimeline: '10 days'
    },
    // Shortlisted 1: Real Estate Virtual Tour Platform
    {
      jobTitle: 'Real Estate Virtual Tour Platform',
      bidAmount: 85000,
      deliveryTime: 24,
      status: 'shortlisted',
      coverLetter: 'Hi Neha, I have integrated WebGL and 360-degree panorama viewers in React. I can ensure fast initial load times and smooth gyroscopic device orientation support.',
      submissionDate: new Date('2026-08-31T17:10:00.000Z'),
      expectedTimeline: '3.5 weeks'
    },
    // Shortlisted 2: AI Resume Screener & Parser
    {
      jobTitle: 'AI Resume Screener & Parser',
      bidAmount: 60000,
      deliveryTime: 16,
      status: 'shortlisted',
      coverLetter: 'Hello Rajesh, I can implement a reliable Python FastAPI microservice paired with your Node.js backend to extract structured skills and compute candidate match scores.',
      submissionDate: new Date('2026-09-02T11:20:00.000Z'),
      expectedTimeline: '2.5 weeks'
    },
    // Pending 1: Healthcare Patient Portal & Booking UI
    {
      jobTitle: 'Healthcare Patient Portal & Booking UI',
      bidAmount: 120000,
      deliveryTime: 30,
      status: 'pending',
      coverLetter: 'Dear Neha, Healthcare security and data privacy are paramount. I will implement strict RBAC, end-to-end encrypted medical attachments, and streamlined appointment scheduling with Twilio SMS integration.',
      submissionDate: new Date('2026-09-07T13:40:00.000Z'),
      expectedTimeline: '4 weeks'
    },
    // Pending 2: Automated Invoicing & Billing Engine
    {
      jobTitle: 'Automated Invoicing & Billing Engine',
      bidAmount: 50000,
      deliveryTime: 14,
      status: 'pending',
      coverLetter: 'Hi Rohan, I will build an idempotent cron engine for automated recurring billing, GST calculation, and PDF invoice generation with zero duplicate payment risks.',
      submissionDate: new Date('2026-09-06T16:00:00.000Z'),
      expectedTimeline: '2 weeks'
    },
    // Rejected 1: FinEdge Finance Dashboard
    {
      jobTitle: 'FinEdge Finance Dashboard',
      bidAmount: 72000,
      deliveryTime: 18,
      status: 'rejected',
      coverLetter: 'Dear Deepa, I have architected institutional fintech analytics engines. I will build your real-time trading metrics dashboard with high-performance WebSocket streaming and compliance data export.',
      submissionDate: new Date('2026-09-06T10:00:00.000Z'),
      decidedAt: new Date('2026-09-09T15:30:00.000Z'),
      rejectionReason: 'Selected another freelancer with prior fintech experience.',
      expectedTimeline: '2.5 weeks'
    },
    // Rejected 2: LearnSphere LMS Portal
    {
      jobTitle: 'LearnSphere LMS Portal',
      bidAmount: 105000,
      deliveryTime: 25,
      status: 'rejected',
      coverLetter: 'Hi Priya, I have designed scalable video learning systems with automated quiz scoring. I can build an intuitive LMS interface with lesson bookmarking and instructor dashboard.',
      submissionDate: new Date('2026-09-01T11:00:00.000Z'),
      decidedAt: new Date('2026-09-05T12:15:00.000Z'),
      rejectionReason: 'Client chose a lower-priced proposal.',
      expectedTimeline: '3.5 weeks'
    },
    // Rejected 3: Travel Booking Platform UI
    {
      jobTitle: 'Travel Booking Platform UI',
      bidAmount: 50000,
      deliveryTime: 14,
      status: 'rejected',
      coverLetter: 'Hello Rahul, I specialize in building responsive travel booking interfaces with interactive seat selection, search filters, and smooth payment gateway checkout.',
      submissionDate: new Date('2026-08-28T09:30:00.000Z'),
      decidedAt: new Date('2026-08-31T11:00:00.000Z'),
      rejectionReason: 'Position filled before proposal review.',
      expectedTimeline: '2 weeks'
    }
  ];

  const proposalMap = {};
  for (const p of proposalsData) {
    const job = jobMap[p.jobTitle];
    if (!job) {
      console.warn(`Job not found for proposal: ${p.jobTitle}`);
      continue;
    }
    const propDoc = {
      job: job._id,
      freelancer: aaravId,
      bidAmount: p.bidAmount,
      deliveryTime: p.deliveryTime,
      coverLetter: p.coverLetter,
      status: p.status,
      rejectionReason: p.rejectionReason || null,
      decidedAt: p.decidedAt || null,
      milestones: [
        { title: 'Phase 1 Delivery', amount: Math.round(p.bidAmount * 0.4), deadline: new Date(Date.now() + 7 * 86400000) },
        { title: 'Final Handover', amount: Math.round(p.bidAmount * 0.6), deadline: new Date(Date.now() + p.deliveryTime * 86400000) }
      ],
      createdAt: p.submissionDate,
      updatedAt: p.decidedAt || p.submissionDate
    };
    const res = await proposalsCol.insertOne(propDoc);
    proposalMap[p.jobTitle] = { _id: res.insertedId, ...propDoc, expectedTimeline: p.expectedTimeline };
  }
  console.log(`✓ Inserted ${Object.keys(proposalMap).length} proposals for Aarav Desai`);

  // 6. Seed 3 Active Contracts with Milestones
  console.log('📄 Seeding 3 Active Contracts...');
  const contract1Job = jobMap['API Integration & Pipeline Analytics'];
  const contract2Job = jobMap['CRM Dashboard Modernization'];
  const contract3Job = jobMap['E-Commerce Performance Optimization'];

  const contractsData = [
    // Contract 1: API Integration & Pipeline Analytics
    {
      title: 'API Integration & Pipeline Analytics',
      client: rajeshId,
      freelancer: aaravId,
      job: contract1Job._id,
      proposal: proposalMap['API Integration & Pipeline Analytics']._id,
      totalAmount: 95000,
      platformFee: 10,
      progress: 72,
      status: 'active',
      escrowStatus: 'funded',
      startDate: new Date('2026-08-27T00:00:00.000Z'),
      endDate: new Date('2026-09-17T00:00:00.000Z'),
      milestones: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Architecture & Token Security',
          description: 'JWT rotation, rate limiting, and Redis token blacklisting.',
          amount: 35000,
          status: 'approved',
          dueDate: new Date('2026-09-05T00:00:00.000Z'),
          fundedAt: new Date('2026-08-28T00:00:00.000Z'),
          approvedAt: new Date('2026-09-05T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'API Integration & Pipeline Analytics',
          description: 'Backend authentication middleware, RESTful API endpoints, and streaming analytics engine.',
          amount: 40000,
          status: 'in_progress',
          progress: 72,
          priority: 'High',
          dueDate: new Date('2026-09-17T00:00:00.000Z'),
          fundedAt: new Date('2026-09-06T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Stress Testing & Final Handover',
          description: 'High concurrency load testing and automated CI/CD pipeline integration.',
          amount: 20000,
          status: 'pending',
          progress: 0,
          priority: 'Medium',
          dueDate: new Date('2026-09-28T00:00:00.000Z')
        }
      ],
      createdAt: new Date('2026-08-27T00:00:00.000Z'),
      updatedAt: new Date('2026-09-12T00:00:00.000Z')
    },
    // Contract 2: CRM Dashboard Modernization
    {
      title: 'CRM Dashboard Modernization',
      client: priyaId,
      freelancer: aaravId,
      job: contract2Job._id,
      proposal: proposalMap['CRM Dashboard Modernization']._id,
      totalAmount: 65000,
      platformFee: 10,
      progress: 46,
      status: 'active',
      escrowStatus: 'funded',
      startDate: new Date('2026-08-30T00:00:00.000Z'),
      endDate: new Date('2026-09-24T00:00:00.000Z'),
      milestones: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Component Library & Responsive Layout',
          description: 'Design system tokens, responsive navbar, and sidebar navigation.',
          amount: 25000,
          status: 'approved',
          dueDate: new Date('2026-09-08T00:00:00.000Z'),
          fundedAt: new Date('2026-08-31T00:00:00.000Z'),
          approvedAt: new Date('2026-09-08T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'CRM Dashboard - Charts & Reports',
          description: 'Interactive analytics charts, lead conversion metrics, and PDF summary exports.',
          amount: 30000,
          status: 'in_progress',
          progress: 46,
          priority: 'Medium',
          dueDate: new Date('2026-09-20T00:00:00.000Z'),
          fundedAt: new Date('2026-09-09T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Role-Based Permissions & Deployment',
          description: 'User permission levels and production Docker deployment.',
          amount: 10000,
          status: 'pending',
          progress: 0,
          priority: 'Normal',
          dueDate: new Date('2026-09-24T00:00:00.000Z')
        }
      ],
      createdAt: new Date('2026-08-30T00:00:00.000Z'),
      updatedAt: new Date('2026-09-12T00:00:00.000Z')
    },
    // Contract 3: E-Commerce Performance Optimization
    {
      title: 'E-Commerce Performance Optimization',
      client: rohanId,
      freelancer: aaravId,
      job: contract3Job._id,
      proposal: proposalMap['E-Commerce Performance Optimization']._id,
      totalAmount: 82000,
      platformFee: 10,
      progress: 88,
      status: 'active',
      escrowStatus: 'funded',
      startDate: new Date('2026-08-22T00:00:00.000Z'),
      endDate: new Date('2026-09-20T00:00:00.000Z'),
      milestones: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Core Web Vitals & Asset Minification',
          description: 'Bundle splitting, Brotli compression, and image WebP conversion.',
          amount: 32000,
          status: 'approved',
          dueDate: new Date('2026-09-02T00:00:00.000Z'),
          fundedAt: new Date('2026-08-23T00:00:00.000Z'),
          approvedAt: new Date('2026-09-02T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'E-Commerce Performance Audit & Caching',
          description: 'Performance audit, edge CDN configuration, and Redis product caching.',
          amount: 35000,
          status: 'in_progress',
          progress: 88,
          priority: 'High',
          dueDate: new Date('2026-09-24T00:00:00.000Z'),
          fundedAt: new Date('2026-09-03T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Mobile Optimization & Final Testing',
          description: 'Mobile checkout journey testing, touch gestures, and cross-browser signoff.',
          amount: 15000,
          status: 'funded',
          progress: 15,
          priority: 'Medium',
          dueDate: new Date('2026-09-29T00:00:00.000Z'),
          fundedAt: new Date('2026-09-04T00:00:00.000Z')
        }
      ],
      createdAt: new Date('2026-08-22T00:00:00.000Z'),
      updatedAt: new Date('2026-09-12T00:00:00.000Z')
    },
    // Contract 4: Mobile Banking UI Revamp (Disputed)
    {
      title: 'Mobile Banking UI Revamp',
      client: deepaId,
      freelancer: aaravId,
      job: jobMap['Mobile Banking UI Revamp']._id,
      proposal: new mongoose.Types.ObjectId(),
      totalAmount: 38000,
      platformFee: 10,
      priority: 'high',
      progress: 90,
      status: 'disputed',
      escrowStatus: 'held',
      startDate: new Date('2026-09-02T00:00:00.000Z'),
      endDate: new Date('2026-09-18T00:00:00.000Z'),
      dispute: {
        status: 'disputed',
        reason: 'Client requested additional features beyond the agreed milestone scope.',
        priority: 'high',
        openedAt: new Date('2026-09-10T11:00:00.000Z'),
        escrowHeld: 38000
      },
      milestones: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'UI Design',
          description: 'Design system tokens and responsive mobile banking mockups.',
          amount: 12000,
          status: 'approved',
          dueDate: new Date('2026-09-05T00:00:00.000Z'),
          fundedAt: new Date('2026-09-02T00:00:00.000Z'),
          approvedAt: new Date('2026-09-05T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Dashboard Screens',
          description: 'Account balance, quick transfers, and card management screens.',
          amount: 14000,
          status: 'approved',
          dueDate: new Date('2026-09-07T00:00:00.000Z'),
          fundedAt: new Date('2026-09-05T00:00:00.000Z'),
          approvedAt: new Date('2026-09-07T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Responsive Testing',
          description: 'iOS and Android device testing and gesture interactions.',
          amount: 6000,
          status: 'in_progress',
          dueDate: new Date('2026-09-09T00:00:00.000Z'),
          fundedAt: new Date('2026-09-07T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Final Approval',
          description: 'Final client signoff and build packaging.',
          amount: 6000,
          status: 'disputed',
          dueDate: new Date('2026-09-10T00:00:00.000Z')
        }
      ],
      createdAt: new Date('2026-09-02T00:00:00.000Z'),
      updatedAt: new Date('2026-09-10T11:00:00.000Z')
    },
    // Contract 5: Inventory Management System (Under Review)
    {
      title: 'Inventory Management System',
      client: rahulId,
      freelancer: aaravId,
      job: jobMap['Inventory Management System']._id,
      proposal: new mongoose.Types.ObjectId(),
      totalAmount: 24000,
      platformFee: 10,
      priority: 'medium',
      progress: 65,
      status: 'under_review',
      escrowStatus: 'held',
      startDate: new Date('2026-08-28T00:00:00.000Z'),
      endDate: new Date('2026-09-18T00:00:00.000Z'),
      dispute: {
        status: 'under_review',
        reason: 'Client reported API synchronization issues during testing.',
        priority: 'medium',
        openedAt: new Date('2026-09-08T14:15:00.000Z'),
        reviewDeadline: new Date('2026-09-18T18:00:00.000Z'),
        escrowHeld: 24000
      },
      milestones: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Database Architecture',
          description: 'PostgreSQL schema design and multi-warehouse relational model.',
          amount: 8000,
          status: 'approved',
          dueDate: new Date('2026-09-01T00:00:00.000Z'),
          fundedAt: new Date('2026-08-28T00:00:00.000Z'),
          approvedAt: new Date('2026-09-01T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'API Synchronization',
          description: 'Real-time Redis pub/sub sync across regional warehouse nodes.',
          amount: 10000,
          status: 'submitted',
          dueDate: new Date('2026-09-08T00:00:00.000Z'),
          fundedAt: new Date('2026-09-01T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Dashboard Testing',
          description: 'Admin stock monitoring and alert triggers.',
          amount: 6000,
          status: 'pending',
          dueDate: new Date('2026-09-18T00:00:00.000Z')
        }
      ],
      createdAt: new Date('2026-08-28T00:00:00.000Z'),
      updatedAt: new Date('2026-09-08T14:15:00.000Z')
    },
    // Contract 6: HR Management Portal (Resolved)
    {
      title: 'HR Management Portal',
      client: kavitaId,
      freelancer: aaravId,
      job: jobMap['HR Management Portal']._id,
      proposal: new mongoose.Types.ObjectId(),
      totalAmount: 46000,
      platformFee: 10,
      priority: 'medium',
      progress: 100,
      status: 'completed',
      escrowStatus: 'released',
      startDate: new Date('2026-08-01T00:00:00.000Z'),
      endDate: new Date('2026-08-22T00:00:00.000Z'),
      dispute: {
        status: 'resolved',
        reason: 'Platform verified that all agreed deliverables were completed, and escrow was released to Aarav.',
        priority: 'medium',
        openedAt: new Date('2026-08-15T09:00:00.000Z'),
        resolvedAt: new Date('2026-08-22T16:00:00.000Z'),
        outcome: 'Freelancer Won',
        amountReleased: 46000,
        escrowHeld: 0
      },
      milestones: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Employee Directory & Attendance System',
          description: 'Biometric device synchronization and shift calendar views.',
          amount: 26000,
          status: 'approved',
          dueDate: new Date('2026-08-10T00:00:00.000Z'),
          fundedAt: new Date('2026-08-01T00:00:00.000Z'),
          approvedAt: new Date('2026-08-10T00:00:00.000Z')
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Automated Payroll & Salary Slips',
          description: 'TDS calculations, bank NEFT file generation, and employee slip downloads.',
          amount: 20000,
          status: 'approved',
          dueDate: new Date('2026-08-20T00:00:00.000Z'),
          fundedAt: new Date('2026-08-10T00:00:00.000Z'),
          approvedAt: new Date('2026-08-22T00:00:00.000Z')
        }
      ],
      createdAt: new Date('2026-08-01T00:00:00.000Z'),
      updatedAt: new Date('2026-08-22T16:00:00.000Z')
    }
  ];

  const contractMap = {};
  for (const c of contractsData) {
    const res = await contractsCol.insertOne(c);
    contractMap[c.title] = { _id: res.insertedId, ...c };
  }
  console.log(`✓ Inserted ${Object.keys(contractMap).length} active contracts for Aarav Desai`);

  // 7. Seed Payments (Earnings History: Total ₹18,60,000 across Apr - Sep + Sep weekly chart releases)
  console.log('💰 Seeding Escrow Payments (Total ₹18,60,000)...');
  const contract1Id = contractMap['API Integration & Pipeline Analytics']._id;
  const contract2Id = contractMap['CRM Dashboard Modernization']._id;
  const contract3Id = contractMap['E-Commerce Performance Optimization']._id;

  const paymentsData = [
    // --- April 2026: Total ₹2,10,000 ---
    {
      invoiceNumber: 'INV-2026-APR12',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 100000,
      netAmount: 90000,
      platformFee: 10000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-04-12T11:00:00.000Z'),
      projectTitle: 'Enterprise Cloud Architecture',
      clientName: 'Rajesh Sharma'
    },
    {
      invoiceNumber: 'INV-2026-APR26',
      payer: priyaId,
      recipient: aaravId,
      contract: contract2Id,
      amount: 110000,
      netAmount: 99000,
      platformFee: 11000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-04-26T15:30:00.000Z'),
      projectTitle: 'HR Portal & Payroll Engine',
      clientName: 'Priya Kapoor'
    },

    // --- May 2026: Total ₹3,20,000 ---
    {
      invoiceNumber: 'INV-2026-MAY10',
      payer: rohanId,
      recipient: aaravId,
      contract: contract3Id,
      amount: 150000,
      netAmount: 135000,
      platformFee: 15000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-05-10T12:15:00.000Z'),
      projectTitle: 'High-Volume Microservices',
      clientName: 'Rohan Patel'
    },
    {
      invoiceNumber: 'INV-2026-MAY24',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 170000,
      netAmount: 153000,
      platformFee: 17000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-05-24T16:45:00.000Z'),
      projectTitle: 'Project Management Kanban Workspace',
      clientName: 'Rajesh Sharma'
    },

    // --- June 2026: Total ₹2,75,000 ---
    {
      invoiceNumber: 'INV-2026-JUN11',
      payer: nehaId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 125000,
      netAmount: 112500,
      platformFee: 12500,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-06-11T10:20:00.000Z'),
      projectTitle: 'Telehealth Consultation Suite',
      clientName: 'Neha Singh'
    },
    {
      invoiceNumber: 'INV-2026-JUN25',
      payer: rohanId,
      recipient: aaravId,
      contract: contract3Id,
      amount: 150000,
      netAmount: 135000,
      platformFee: 15000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-06-25T14:50:00.000Z'),
      projectTitle: 'E-Commerce Headless Checkout',
      clientName: 'Rohan Patel'
    },

    // --- July 2026: Total ₹3,90,000 ---
    {
      invoiceNumber: 'INV-2026-JUL08',
      payer: priyaId,
      recipient: aaravId,
      contract: contract2Id,
      amount: 180000,
      netAmount: 162000,
      platformFee: 18000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-07-08T09:30:00.000Z'),
      projectTitle: 'Real-Time Financial Streaming',
      clientName: 'Priya Kapoor'
    },
    {
      invoiceNumber: 'INV-2026-JUL22',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 210000,
      netAmount: 189000,
      platformFee: 21000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-07-22T17:10:00.000Z'),
      projectTitle: 'Logistics Fleet Tracking App',
      clientName: 'Rajesh Sharma'
    },

    // --- August 2026: Total ₹4,15,000 ---
    {
      invoiceNumber: 'INV-2026-AUG05',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 200000,
      netAmount: 180000,
      platformFee: 20000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-08-05T11:40:00.000Z'),
      projectTitle: 'Inventory Multi-Store Sync',
      clientName: 'Rajesh Sharma'
    },
    {
      invoiceNumber: 'INV-2026-AUG20',
      payer: nehaId,
      recipient: aaravId,
      contract: contract2Id,
      amount: 215000,
      netAmount: 193500,
      platformFee: 21500,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-08-20T16:00:00.000Z'),
      projectTitle: 'Virtual Tour 3D Rendering',
      clientName: 'Neha Singh'
    },

    // --- September 2026: Total ₹2,50,000 (Includes Weekly Chart Releases) ---
    // Sep 2: ₹8,000
    {
      invoiceNumber: 'INV-2026-SEP02',
      payer: rohanId,
      recipient: aaravId,
      contract: contract3Id,
      amount: 8000,
      netAmount: 7200,
      platformFee: 800,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-02T10:00:00.000Z'),
      projectTitle: 'E-Commerce Core Web Vitals Audit',
      clientName: 'Rohan Patel'
    },
    // Sep 5: ₹12,000
    {
      invoiceNumber: 'INV-2026-SEP05',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 12000,
      netAmount: 10800,
      platformFee: 1200,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-05T13:30:00.000Z'),
      projectTitle: 'API Authentication Sprint 1',
      clientName: 'Rajesh Sharma'
    },
    // Sep 8: ₹15,000
    {
      invoiceNumber: 'INV-2026-SEP08',
      payer: priyaId,
      recipient: aaravId,
      contract: contract2Id,
      amount: 15000,
      netAmount: 13500,
      platformFee: 1500,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-08T15:00:00.000Z'),
      projectTitle: 'CRM Modernization Sprint 1',
      clientName: 'Priya Kapoor'
    },
    // Sep 10: ₹9,000
    {
      invoiceNumber: 'INV-2026-SEP10',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 9000,
      netAmount: 8100,
      platformFee: 900,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-10T11:20:00.000Z'),
      projectTitle: 'Pipeline Telemetry Ingestion',
      clientName: 'Rajesh Sharma'
    },
    // Sep 12: ₹18,000
    {
      invoiceNumber: 'INV-2026-SEP12',
      payer: rohanId,
      recipient: aaravId,
      contract: contract3Id,
      amount: 18000,
      netAmount: 16200,
      platformFee: 1800,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-12T14:45:00.000Z'),
      projectTitle: 'Edge Caching & SSR Minification',
      clientName: 'Rohan Patel'
    },
    // Sep 15: ₹22,000
    {
      invoiceNumber: 'INV-2026-SEP15',
      payer: priyaId,
      recipient: aaravId,
      contract: contract2Id,
      amount: 22000,
      netAmount: 19800,
      platformFee: 2200,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-15T16:00:00.000Z'),
      projectTitle: 'CRM Recharts & Visualization Engine',
      clientName: 'Priya Kapoor'
    },
    // Sep 18: ₹66,000
    {
      invoiceNumber: 'INV-2026-SEP18',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 66000,
      netAmount: 59400,
      platformFee: 6600,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-18T10:15:00.000Z'),
      projectTitle: 'High-Throughput Webhook Pipeline',
      clientName: 'Rajesh Sharma'
    },
    // Sep 22: ₹1,00,000
    {
      invoiceNumber: 'INV-2026-SEP22',
      payer: rohanId,
      recipient: aaravId,
      contract: contract3Id,
      amount: 100000,
      netAmount: 90000,
      platformFee: 10000,
      type: 'escrow_release',
      status: 'succeeded',
      createdAt: new Date('2026-09-22T17:30:00.000Z'),
      projectTitle: 'Complete Storefront Speed Audit Signoff',
      clientName: 'Rohan Patel'
    },

    // --- Escrow Pending / Processing Payments ---
    {
      invoiceNumber: 'INV-2026-SEP24-PEND',
      payer: priyaId,
      recipient: aaravId,
      contract: contract2Id,
      amount: 30000,
      netAmount: 27000,
      platformFee: 3000,
      type: 'escrow_release',
      status: 'pending',
      createdAt: new Date('2026-09-11T12:00:00.000Z'),
      projectTitle: 'CRM Dashboard - Charts & Reports',
      clientName: 'Priya Kapoor'
    },
    {
      invoiceNumber: 'INV-2026-SEP26-DEP',
      payer: rajeshId,
      recipient: aaravId,
      contract: contract1Id,
      amount: 40000,
      netAmount: 36000,
      platformFee: 4000,
      type: 'escrow_deposit',
      status: 'pending',
      createdAt: new Date('2026-09-12T09:00:00.000Z'),
      projectTitle: 'API Integration & Pipeline Analytics',
      clientName: 'Rajesh Sharma'
    }
  ];

  await paymentsCol.insertMany(paymentsData);
  console.log(`✓ Inserted ${paymentsData.length} payment records. Succeeded sum: ₹18,60,000`);

  // 8. Seed Work Hours / Time Logs (Mon - Sun: 6.5, 7, 5.5, 8, 6, 4, 2 = 39 hrs total)
  console.log('⏱️ Seeding 39 Hours Work Logs across Mon - Sun...');
  const timeEntries = [
    {
      day: 'Mon',
      duration: 6.5,
      date: new Date('2026-09-07T00:00:00.000Z'),
      startTime: new Date('2026-09-07T09:30:00.000Z'),
      endTime: new Date('2026-09-07T16:00:00.000Z'),
      projectTitle: 'API Integration & Pipeline Analytics',
      contractId: contract1Id,
      description: 'Fixed API authentication middleware and token expiration edge cases.'
    },
    {
      day: 'Tue',
      duration: 7.0,
      date: new Date('2026-09-08T00:00:00.000Z'),
      startTime: new Date('2026-09-08T09:00:00.000Z'),
      endTime: new Date('2026-09-08T16:00:00.000Z'),
      projectTitle: 'CRM Dashboard Modernization',
      contractId: contract2Id,
      description: 'Engineered custom Recharts component canvas and responsive layout primitives.'
    },
    {
      day: 'Wed',
      duration: 5.5,
      date: new Date('2026-09-09T00:00:00.000Z'),
      startTime: new Date('2026-09-09T10:00:00.000Z'),
      endTime: new Date('2026-09-09T15:30:00.000Z'),
      projectTitle: 'E-Commerce Performance Optimization',
      contractId: contract3Id,
      description: 'Implemented Redis cache eviction policies and database connection pooling.'
    },
    {
      day: 'Thu',
      duration: 8.0,
      date: new Date('2026-09-10T00:00:00.000Z'),
      startTime: new Date('2026-09-10T09:00:00.000Z'),
      endTime: new Date('2026-09-10T17:00:00.000Z'),
      projectTitle: 'API Integration & Pipeline Analytics',
      contractId: contract1Id,
      description: 'Streamed high-volume telemetry packets using WebSocket channel and Redis pub/sub.'
    },
    {
      day: 'Fri',
      duration: 6.0,
      date: new Date('2026-09-11T00:00:00.000Z'),
      startTime: new Date('2026-09-11T10:00:00.000Z'),
      endTime: new Date('2026-09-11T16:00:00.000Z'),
      projectTitle: 'CRM Dashboard Modernization',
      contractId: contract2Id,
      description: 'Integrated multi-tenant filtering, search debouncing, and automated CSV export.'
    },
    {
      day: 'Sat',
      duration: 4.0,
      date: new Date('2026-09-12T00:00:00.000Z'),
      startTime: new Date('2026-09-12T11:00:00.000Z'),
      endTime: new Date('2026-09-12T15:00:00.000Z'),
      projectTitle: 'E-Commerce Performance Optimization',
      contractId: contract3Id,
      description: 'Optimized Lighthouse Core Web Vitals to 98 on mobile devices.'
    },
    {
      day: 'Sun',
      duration: 2.0,
      date: new Date('2026-09-13T00:00:00.000Z'),
      startTime: new Date('2026-09-13T14:00:00.000Z'),
      endTime: new Date('2026-09-13T16:00:00.000Z'),
      projectTitle: 'API Integration & Pipeline Analytics',
      contractId: contract1Id,
      description: 'Deployed staging Docker containers and verified HTTPS SSL certificate hooks.'
    }
  ];

  const timeLogsDocs = timeEntries.map(te => ({
    freelancer: aaravId,
    contract: te.contractId,
    projectTitle: te.projectTitle,
    description: te.description,
    startTime: te.startTime,
    endTime: te.endTime,
    duration: te.duration,
    date: te.date,
    day: te.day,
    hourlyRate: 2200,
    amount: Math.round(te.duration * 2200),
    status: 'logged',
    createdAt: te.date,
    updatedAt: te.date
  }));

  await timeLogsCol.insertMany(timeLogsDocs);
  console.log(`✓ Inserted ${timeLogsDocs.length} time log entries. Total: 39 hours.`);

  // 9. Seed Active Conversations & Messages
  console.log('💬 Seeding Messages & Conversations...');
  const convRajesh = {
    participants: [aaravId, rajeshId],
    job: contract1Job._id,
    lastMessage: {
      text: 'Great work on the dashboard updates. Let us schedule a demo tomorrow.',
      sender: rajeshId,
      createdAt: new Date('2026-09-12T11:30:00.000Z')
    },
    unreadCounts: { [aaravId.toString()]: 1, [rajeshId.toString()]: 0 },
    createdAt: new Date('2026-08-27T10:00:00.000Z'),
    updatedAt: new Date('2026-09-12T11:30:00.000Z')
  };
  const convPriya = {
    participants: [aaravId, priyaId],
    job: contract2Job._id,
    lastMessage: {
      text: 'Can we finalize the API documentation? I want to share it with our design team.',
      sender: priyaId,
      createdAt: new Date('2026-09-12T10:15:00.000Z')
    },
    unreadCounts: { [aaravId.toString()]: 1, [priyaId.toString()]: 0 },
    createdAt: new Date('2026-08-30T14:00:00.000Z'),
    updatedAt: new Date('2026-09-12T10:15:00.000Z')
  };
  const convRohan = {
    participants: [aaravId, rohanId],
    job: contract3Job._id,
    lastMessage: {
      text: "I've reviewed your implementation. The response times are drastically faster!",
      sender: rohanId,
      createdAt: new Date('2026-09-11T16:40:00.000Z')
    },
    unreadCounts: { [aaravId.toString()]: 0, [rohanId.toString()]: 0 },
    createdAt: new Date('2026-08-22T11:00:00.000Z'),
    updatedAt: new Date('2026-09-11T16:40:00.000Z')
  };

  const convDeepa = {
    participants: [aaravId, deepaId],
    job: jobMap['Mobile Banking UI Revamp']._id,
    lastMessage: {
      text: "That feature wasn't part of the original milestone. Happy to scope it separately.",
      sender: aaravId,
      createdAt: new Date('2026-09-10T11:45:00.000Z')
    },
    unreadCounts: { [aaravId.toString()]: 0, [deepaId.toString()]: 1 },
    createdAt: new Date('2026-09-02T10:00:00.000Z'),
    updatedAt: new Date('2026-09-10T11:45:00.000Z')
  };
  const convRahul = {
    participants: [aaravId, rahulId],
    job: jobMap['Inventory Management System']._id,
    lastMessage: {
      text: "I'll reproduce the issue and share a fix today.",
      sender: aaravId,
      createdAt: new Date('2026-09-08T15:00:00.000Z')
    },
    unreadCounts: { [aaravId.toString()]: 0, [rahulId.toString()]: 0 },
    createdAt: new Date('2026-08-28T12:00:00.000Z'),
    updatedAt: new Date('2026-09-08T15:00:00.000Z')
  };

  const resConvRajesh = await conversationsCol.insertOne(convRajesh);
  const resConvPriya = await conversationsCol.insertOne(convPriya);
  const resConvRohan = await conversationsCol.insertOne(convRohan);
  const resConvDeepa = await conversationsCol.insertOne(convDeepa);
  const resConvRahul = await conversationsCol.insertOne(convRahul);

  const messagesData = [
    // Rajesh messages
    {
      conversation: resConvRajesh.insertedId,
      sender: rajeshId,
      text: 'Hi Aarav, how is the pipeline analytics module progressing for our sprint?',
      isRead: true,
      createdAt: new Date('2026-09-11T09:00:00.000Z')
    },
    {
      conversation: resConvRajesh.insertedId,
      sender: aaravId,
      text: 'Hey Rajesh! The API integration is 72% complete. Auth middleware, token rotation, and pipeline stress testing are running smoothly.',
      isRead: true,
      createdAt: new Date('2026-09-11T09:45:00.000Z')
    },
    {
      conversation: resConvRajesh.insertedId,
      sender: rajeshId,
      text: 'Great work on the dashboard updates. Let us schedule a demo tomorrow.',
      isRead: false,
      createdAt: new Date('2026-09-12T11:30:00.000Z')
    },
    // Priya messages
    {
      conversation: resConvPriya.insertedId,
      sender: aaravId,
      text: 'Hi Priya, I pushed the updated CRM wireframe components to our staging server.',
      isRead: true,
      createdAt: new Date('2026-09-11T14:20:00.000Z')
    },
    {
      conversation: resConvPriya.insertedId,
      sender: priyaId,
      text: 'Can we finalize the API documentation? I want to share it with our design team.',
      isRead: false,
      createdAt: new Date('2026-09-12T10:15:00.000Z')
    },
    // Rohan messages
    {
      conversation: resConvRohan.insertedId,
      sender: aaravId,
      text: 'Hey Rohan, the Redis edge cache is deployed. The TTFB dropped from 420ms to 48ms.',
      isRead: true,
      createdAt: new Date('2026-09-11T15:30:00.000Z')
    },
    {
      conversation: resConvRohan.insertedId,
      sender: rohanId,
      text: "I've reviewed your implementation. The response times are drastically faster!",
      isRead: true,
      createdAt: new Date('2026-09-11T16:40:00.000Z')
    },
    // Deepa messages (Disputed Contract 1)
    {
      conversation: resConvDeepa.insertedId,
      sender: deepaId,
      text: "We'd like the reporting module included before approval.",
      isRead: true,
      createdAt: new Date('2026-09-09T17:30:00.000Z')
    },
    {
      conversation: resConvDeepa.insertedId,
      sender: aaravId,
      text: "That feature wasn't part of the original milestone. Happy to scope it separately.",
      isRead: true,
      createdAt: new Date('2026-09-10T11:45:00.000Z')
    },
    // Rahul messages (Disputed Contract 2)
    {
      conversation: resConvRahul.insertedId,
      sender: rahulId,
      text: "The inventory sync isn't updating in real time.",
      isRead: true,
      createdAt: new Date('2026-09-08T14:10:00.000Z')
    },
    {
      conversation: resConvRahul.insertedId,
      sender: aaravId,
      text: "I'll reproduce the issue and share a fix today.",
      isRead: true,
      createdAt: new Date('2026-09-08T15:00:00.000Z')
    }
  ];
  await messagesCol.insertMany(messagesData);
  console.log(`✓ Inserted 5 conversations and ${messagesData.length} messages`);

  // 10. Seed Notifications
  console.log('🔔 Seeding Notifications...');
  const notificationsData = [
    {
      receiver: aaravId,
      sender: rajeshId,
      title: 'Milestone Approved',
      message: 'Rajesh Sharma approved Milestone: Architecture & Token Security. ₹35,000 has been transferred to your earnings balance.',
      type: 'milestone_approved',
      read: false,
      linkUrl: `/dashboard/contracts/${contract1Id}`,
      createdAt: new Date('2026-09-12T08:15:00.000Z')
    },
    {
      receiver: aaravId,
      sender: rohanId,
      title: 'Escrow Released',
      message: 'Escrow payout of ₹18,000 released for E-Commerce Performance Sprint.',
      type: 'escrow_released',
      read: false,
      linkUrl: '/dashboard/earnings',
      createdAt: new Date('2026-09-12T07:30:00.000Z')
    },
    {
      receiver: aaravId,
      sender: nehaId,
      title: 'New Proposal Viewed',
      message: 'Singh AI Innovations viewed your proposal for Healthcare Patient Portal & Booking UI.',
      type: 'system',
      read: true,
      linkUrl: '/dashboard/proposals',
      createdAt: new Date('2026-09-11T18:00:00.000Z')
    },
    {
      receiver: aaravId,
      sender: rajeshId,
      title: 'Client Sent a Message',
      message: 'Rajesh Sharma sent you a new message regarding API Integration & Pipeline Analytics.',
      type: 'new_message',
      read: false,
      linkUrl: '/dashboard/messages',
      createdAt: new Date('2026-09-12T11:30:00.000Z')
    },
    {
      receiver: aaravId,
      sender: priyaId,
      title: 'Payment Processed',
      message: 'Payment of ₹22,000 for Invoice INV-2026-SEP15 has been processed successfully.',
      type: 'payment_completed',
      read: true,
      linkUrl: '/dashboard/earnings',
      createdAt: new Date('2026-09-10T14:20:00.000Z')
    },
    {
      receiver: aaravId,
      sender: deepaId,
      title: 'Proposal Status Update',
      message: 'Your proposal for FinEdge Finance Dashboard was declined. Deepa Iyer: Selected another freelancer with prior fintech experience.',
      type: 'proposal_rejected',
      read: false,
      linkUrl: '/dashboard/proposals',
      createdAt: new Date('2026-09-09T15:30:00.000Z')
    },
    {
      receiver: aaravId,
      sender: priyaSharmaId,
      title: 'Proposal Status Update',
      message: 'LearnSphere LMS Portal selected another freelancer. Priya Sharma: Client chose a lower-priced proposal.',
      type: 'proposal_rejected',
      read: false,
      linkUrl: '/dashboard/proposals',
      createdAt: new Date('2026-09-05T12:15:00.000Z')
    },
    {
      receiver: aaravId,
      sender: rahulId,
      title: 'Proposal Closed',
      message: 'Travel Booking Platform UI position was filled before proposal review.',
      type: 'proposal_rejected',
      read: true,
      linkUrl: '/dashboard/proposals',
      createdAt: new Date('2026-08-31T11:00:00.000Z')
    },
    {
      receiver: aaravId,
      sender: rajeshId,
      title: 'Deadline Reminder',
      message: 'Milestone: API Integration & Pipeline Analytics is due in 5 days (17 Sept 2026).',
      type: 'system',
      read: false,
      linkUrl: `/dashboard/contracts/${contract1Id}`,
      createdAt: new Date('2026-09-12T06:00:00.000Z')
    },
    // Dispute Notifications
    {
      receiver: aaravId,
      sender: deepaId,
      title: 'Dispute Opened',
      message: 'A dispute has been opened for Mobile Banking UI Revamp.',
      type: 'dispute_opened',
      read: false,
      linkUrl: `/dashboard/contracts/${contractMap['Mobile Banking UI Revamp']._id}`,
      createdAt: new Date('2026-09-10T11:00:00.000Z')
    },
    {
      receiver: aaravId,
      sender: deepaId,
      title: 'Escrow Frozen',
      message: 'Escrow of ₹38,000 is currently on hold.',
      type: 'escrow_held',
      read: false,
      linkUrl: `/dashboard/contracts/${contractMap['Mobile Banking UI Revamp']._id}`,
      createdAt: new Date('2026-09-10T11:05:00.000Z')
    },
    {
      receiver: aaravId,
      sender: rahulId,
      title: 'Mediator Assigned',
      message: 'Mediator assigned to Inventory Management System.',
      type: 'mediation_started',
      read: true,
      linkUrl: `/dashboard/contracts/${contractMap['Inventory Management System']._id}`,
      createdAt: new Date('2026-09-08T14:30:00.000Z')
    },
    {
      receiver: aaravId,
      sender: kavitaId,
      title: 'Dispute Resolved',
      message: 'HR Management Portal dispute has been resolved.',
      type: 'dispute_resolved',
      read: true,
      linkUrl: `/dashboard/contracts/${contractMap['HR Management Portal']._id}`,
      createdAt: new Date('2026-08-22T16:15:00.000Z')
    }
  ];
  await notificationsCol.insertMany(notificationsData);
  console.log(`✓ Inserted ${notificationsData.length} notifications`);

  // 11. Seed 16 Client Reviews (Each linked to a unique contract with unique {contract, reviewer})
  console.log('⭐ Seeding 16 Client Reviews...');

  // Create additional past completed contracts for historical reviews
  const pastContractsData = [
    { title: 'Enterprise Cloud Architecture', client: rajeshId },
    { title: 'Storefront Latency & Speed Audit', client: rohanId },
    { title: 'Figma Design System & Token UI', client: priyaId },
    { title: 'Healthcare Telehealth Microservices', client: nehaId },
    { title: 'Event-Driven Real-time Ingestion', client: rajeshId },
    { title: 'Financial Streaming Charts Engine', client: priyaId },
    { title: 'Headless Checkout Architecture', client: rohanId },
    { title: 'Third-Party Medical API Gateway', client: nehaId },
    { title: 'Full Stack Agile Kanban Workspace', client: rajeshId },
    { title: 'Distributed Microservices Cluster', client: rohanId },
    { title: 'HR Biometric Sync & Attendance Engine', client: priyaId },
    { title: 'Docker Containerization & CI/CD Pipeline', client: rajeshId },
    { title: 'Automated Testing & QA Framework', client: nehaId },
    { title: 'Production Docker Swarm Scalability', client: priyaId },
    { title: 'High-Volume Payment Gateway Integration', client: rohanId },
    { title: 'Enterprise RBAC & Security Audit', client: rajeshId }
  ];

  const pastContractIds = [];
  for (const pc of pastContractsData) {
    const pastDoc = {
      title: pc.title,
      client: pc.client,
      freelancer: aaravId,
      job: contract1Job._id,
      proposal: proposalMap['API Integration & Pipeline Analytics']._id,
      totalAmount: 50000,
      platformFee: 10,
      progress: 100,
      status: 'completed',
      escrowStatus: 'released',
      startDate: new Date('2026-01-10T00:00:00.000Z'),
      endDate: new Date('2026-08-15T00:00:00.000Z'),
      createdAt: new Date('2026-01-10T00:00:00.000Z'),
      updatedAt: new Date('2026-08-15T00:00:00.000Z')
    };
    const cRes = await contractsCol.insertOne(pastDoc);
    pastContractIds.push(cRes.insertedId);
  }

  const reviewsData = [
    {
      contract: pastContractIds[0],
      reviewer: rajeshId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Excellent communication and high-quality work. Aarav delivered our backend architecture ahead of schedule with zero bugs.',
      createdAt: new Date('2026-09-05T12:00:00.000Z')
    },
    {
      contract: pastContractIds[1],
      reviewer: rohanId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Aarav is top 1% engineering talent. Cut our storefront response latency by 60% and achieved a 98 Lighthouse score.',
      createdAt: new Date('2026-09-02T16:00:00.000Z')
    },
    {
      contract: pastContractIds[2],
      reviewer: priyaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Outstanding developer! Clean modular code, proactive updates, and great UI integration with Figma tokens.',
      createdAt: new Date('2026-09-08T14:30:00.000Z')
    },
    {
      contract: pastContractIds[3],
      reviewer: nehaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 4, overall: 4.8 },
      comment: 'Delivered ahead of schedule. Great understanding of cloud infrastructure, Docker, and API security.',
      createdAt: new Date('2026-08-20T17:00:00.000Z')
    },
    {
      contract: pastContractIds[4],
      reviewer: rajeshId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Exceptional architectural foresight. Built an event-driven system that handles millions of requests without breaking a sweat.',
      createdAt: new Date('2026-08-05T15:20:00.000Z')
    },
    {
      contract: pastContractIds[5],
      reviewer: priyaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Aarav turned our complex financial data into beautiful, actionable charts. The client feedback has been unanimously positive.',
      createdAt: new Date('2026-07-08T11:45:00.000Z')
    },
    {
      contract: pastContractIds[6],
      reviewer: rohanId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Incredible speed and code quality. Handled our high-volume checkout without any downtime during flash sales.',
      createdAt: new Date('2026-06-25T13:00:00.000Z')
    },
    {
      contract: pastContractIds[7],
      reviewer: nehaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Seamless integration with third party medical APIs. Aarav takes complete ownership of his deliverables.',
      createdAt: new Date('2026-06-11T12:00:00.000Z')
    },
    {
      contract: pastContractIds[8],
      reviewer: rajeshId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 4, overall: 4.8 },
      comment: 'Reliable, highly communicative, and technically superb. We look forward to working with Aarav on all future projects.',
      createdAt: new Date('2026-05-24T18:00:00.000Z')
    },
    {
      contract: pastContractIds[9],
      reviewer: rohanId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Microservices architecture designed by Aarav scaled smoothly under heavy load testing. A true professional.',
      createdAt: new Date('2026-05-10T14:15:00.000Z')
    },
    {
      contract: pastContractIds[10],
      reviewer: priyaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Built our HR and payroll system with biometric sync. The automation saved our operations team 40+ hours per week.',
      createdAt: new Date('2026-04-26T16:30:00.000Z')
    },
    {
      contract: pastContractIds[11],
      reviewer: rajeshId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Aarav transformed our legacy monolith into high-performing Docker containers with seamless CI/CD.',
      createdAt: new Date('2026-04-12T13:40:00.000Z')
    },
    {
      contract: pastContractIds[12],
      reviewer: nehaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 4, deadline: 5, overall: 4.8 },
      comment: 'Very thorough testing suite and documentation. Made onboarding our internal team effortless.',
      createdAt: new Date('2026-03-25T15:00:00.000Z')
    },
    {
      contract: pastContractIds[13],
      reviewer: priyaId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'One of the best freelancers on WorkStation. Always meets deadlines and suggests great architectural improvements.',
      createdAt: new Date('2026-03-10T11:20:00.000Z')
    },
    {
      contract: pastContractIds[14],
      reviewer: rohanId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Fast turnaround, zero regressions, and top-tier code hygiene. Will hire again without hesitation!',
      createdAt: new Date('2026-02-28T14:00:00.000Z')
    },
    {
      contract: pastContractIds[15],
      reviewer: rajeshId,
      reviewee: aaravId,
      rating: { communication: 5, quality: 5, deadline: 5, overall: 5.0 },
      comment: 'Consistently provides production-ready code with exhaustive test coverage and clean documentation.',
      createdAt: new Date('2026-02-15T16:00:00.000Z')
    }
  ];

  await reviewsCol.insertMany(reviewsData);
  console.log(`✓ Inserted ${reviewsData.length} reviews for Aarav Desai`);

  // Update Aarav User ratingsAverage and ratingsCount
  await usersCol.updateOne(
    { _id: aaravId },
    {
      $set: {
        ratingsCount: reviewsData.length,
        ratingsAverage: 4.9,
        completedProjects: 24,
        earnings: 1860000
      }
    }
  );
  console.log('✓ Updated Aarav Desai user rating and earnings stats');

  console.log('\n🎉 ALL FREELANCER DASHBOARD SEEDING COMPLETED SUCCESSFULLY!');
  console.log('===========================================================');
  console.log('User: Aarav Desai (aarav.desai@email.com)');
  console.log('Total Earnings: ₹18,60,000 (Apr - Sep)');
  console.log('Active Contracts: 3');
  console.log('Proposals Sent: 12 (7 Accepted, 3 Shortlisted, 2 Pending = 58% Success Rate)');
  console.log('Work Hours Tracked: 39 hours (Mon - Sun)');
  console.log('Client Reviews: 16 (Average Rating: 4.9 / 5.0)');
  console.log('Active Conversations: 3');
  console.log('Notifications: 6');
  console.log('Skills Performance: React (24), Node.js (19), MongoDB (16), TypeScript (12), Docker (8)');
  console.log('===========================================================\n');

  await mongoose.disconnect();
}

seedFreelancerDashboard().catch(err => {
  console.error('❌ Error during freelancer dashboard seeding:', err);
  process.exit(1);
});
