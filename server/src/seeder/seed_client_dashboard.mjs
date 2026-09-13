import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

async function seed() {
  console.log('🌱 Starting Client Dashboard Seeding for Rajesh Sharma...');
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  const usersCol = mongoose.connection.collection('users');
  const jobsCol = mongoose.connection.collection('jobs');
  const proposalsCol = mongoose.connection.collection('proposals');
  const contractsCol = mongoose.connection.collection('contracts');
  const paymentsCol = mongoose.connection.collection('payments');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Client: Rajesh Sharma
  let client = await usersCol.findOne({ email: 'rajesh.sharma@email.com' });
  const clientId = client ? client._id : new mongoose.Types.ObjectId();

  const clientData = {
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@email.com',
    password: hashedPassword,
    role: 'client',
    phone: '+91 6367088841',
    location: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
    bio: 'Founder & Managing Director at Sharma Enterprises. Scaling next-generation web, mobile, and AI solutions.',
    industry: 'FinTech & SaaS',
    companyDescription: 'Sharma Enterprises is a premier digital technology studio based in Udaipur, India, partnering with elite freelance engineers and designers worldwide.',
    verified: true,
    status: 'active',
    totalSpent: 128860,
    avatar: {
      url: '/freelancers/rajesh-kumar.webp',
    },
    fullAvatarUrl: '/freelancers/rajesh-kumar.webp',
    profileImage: '/freelancers/rajesh-kumar.webp',
    updatedAt: new Date(),
  };

  if (client) {
    await usersCol.updateOne({ _id: clientId }, { $set: clientData });
    console.log('✓ Updated client Rajesh Sharma:', clientId.toString());
  } else {
    clientData._id = clientId;
    clientData.createdAt = new Date('2026-03-01T00:00:00.000Z');
    await usersCol.insertOne(clientData);
    console.log('✓ Inserted client Rajesh Sharma:', clientId.toString());
  }

  // Also update Admin user so admin testing matches
  await usersCol.updateOne(
    { email: 'punittak2005@gmail.com' },
    {
      $set: {
        location: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
        phone: '+91 6367088841',
        totalSpent: 128860,
      },
    }
  );

  // 2. 8 Named Freelancers
  const freelancersList = [
    {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@freelance.io',
      title: 'Senior MERN Stack Engineer',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Next.js'],
      ratingsAverage: 4.9,
      ratingsCount: 28,
      completedProjects: 24,
      earnings: 385000,
      hourlyRate: 1800,
      location: 'Bengaluru, Karnataka',
      availability: 'available',
      online: true,
      avatar: '/freelancers/aarav-sharma.webp',
      profileImage: '/freelancers/aarav-sharma.webp',
    },
    {
      name: 'Priya Kapoor',
      email: 'priya.kapoor@freelance.io',
      title: 'Principal UI/UX Designer',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Mobile UI', 'Prototyping'],
      ratingsAverage: 5.0,
      ratingsCount: 35,
      completedProjects: 31,
      earnings: 420000,
      hourlyRate: 2200,
      location: 'Mumbai, Maharashtra',
      availability: 'available',
      online: true,
      avatar: '/freelancers/priya-mehta.webp',
      profileImage: '/freelancers/priya-mehta.webp',
    },
    {
      name: 'Rohan Patel',
      email: 'rohan.patel@freelance.io',
      title: 'Lead Frontend Architect',
      skills: ['React', 'Tailwind CSS', 'Redux', 'Webflow', 'Performance Optimization'],
      ratingsAverage: 4.8,
      ratingsCount: 22,
      completedProjects: 19,
      earnings: 290000,
      hourlyRate: 1600,
      location: 'Ahmedabad, Gujarat',
      availability: 'available',
      online: false,
      avatar: '/freelancers/rohan-kulkarni.webp',
      profileImage: '/freelancers/rohan-kulkarni.webp',
    },
    {
      name: 'Neha Singh',
      email: 'neha.singh@freelance.io',
      title: 'Senior AI & NLP Engineer',
      skills: ['Python', 'OpenAI API', 'LangChain', 'FastAPI', 'PyTorch', 'Vector DBs'],
      ratingsAverage: 5.0,
      ratingsCount: 19,
      completedProjects: 16,
      earnings: 540000,
      hourlyRate: 2800,
      location: 'Hyderabad, Telangana',
      availability: 'available',
      online: true,
      avatar: '/freelancers/neha-singh.webp',
      profileImage: '/freelancers/neha-singh.webp',
    },
    {
      name: 'Kunal Verma',
      email: 'kunal.verma@freelance.io',
      title: 'Backend Systems & API Architect',
      skills: ['Node.js', 'Microservices', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      ratingsAverage: 4.9,
      ratingsCount: 26,
      completedProjects: 22,
      earnings: 360000,
      hourlyRate: 1900,
      location: 'Pune, Maharashtra',
      availability: 'available',
      online: false,
      avatar: '/freelancers/kunal-bhatia.webp',
      profileImage: '/freelancers/kunal-bhatia.webp',
    },
    {
      name: 'Sneha Iyer',
      email: 'sneha.iyer@freelance.io',
      title: 'Product Designer & Design Lead',
      skills: ['Product Design', 'Figma', 'User Research', 'Interaction Design', 'SaaS UX'],
      ratingsAverage: 4.9,
      ratingsCount: 30,
      completedProjects: 28,
      earnings: 410000,
      hourlyRate: 2100,
      location: 'Chennai, Tamil Nadu',
      availability: 'available',
      online: true,
      avatar: '/freelancers/sneha-patel.webp',
      profileImage: '/freelancers/sneha-patel.webp',
    },
    {
      name: 'Aditya Joshi',
      email: 'aditya.joshi@freelance.io',
      title: 'Full Stack Cloud Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Serverless'],
      ratingsAverage: 4.8,
      ratingsCount: 20,
      completedProjects: 18,
      earnings: 275000,
      hourlyRate: 1700,
      location: 'Jaipur, Rajasthan',
      availability: 'available',
      online: true,
      avatar: '/freelancers/aditya-roy.webp',
      profileImage: '/freelancers/aditya-roy.webp',
    },
    {
      name: 'Meera Nair',
      email: 'meera.nair@freelance.io',
      title: 'Mobile App Engineer (iOS/Android)',
      skills: ['React Native', 'Flutter', 'iOS Swift', 'Android Kotlin', 'Firebase'],
      ratingsAverage: 4.9,
      ratingsCount: 24,
      completedProjects: 21,
      earnings: 395000,
      hourlyRate: 2000,
      location: 'Kochi, Kerala',
      availability: 'available',
      online: false,
      avatar: '/freelancers/kavita-sharma.webp',
      profileImage: '/freelancers/kavita-sharma.webp',
    },
  ];

  const freelancerMap = {};

  for (const fl of freelancersList) {
    let existing = await usersCol.findOne({ email: fl.email });
    const flId = existing ? existing._id : new mongoose.Types.ObjectId();
    const doc = {
      name: fl.name,
      email: fl.email,
      password: hashedPassword,
      role: 'freelancer',
      phone: '+91 98765 43210',
      title: fl.title,
      skills: fl.skills,
      ratingsAverage: fl.ratingsAverage,
      ratingsCount: fl.ratingsCount,
      completedProjects: fl.completedProjects,
      earnings: fl.earnings,
      hourlyRate: fl.hourlyRate,
      location: fl.location,
      availability: fl.availability,
      online: fl.online,
      verified: true,
      status: 'active',
      bio: `Top-rated ${fl.title} specializing in enterprise-scale digital applications and responsive platforms.`,
      avatar: { url: fl.avatar },
      fullAvatarUrl: fl.avatar,
      updatedAt: new Date(),
    };

    if (existing) {
      await usersCol.updateOne({ _id: flId }, { $set: doc });
    } else {
      doc._id = flId;
      doc.createdAt = new Date('2026-01-15T00:00:00.000Z');
      await usersCol.insertOne(doc);
    }
    freelancerMap[fl.name] = flId;
  }
  console.log(`✓ Upserted ${freelancersList.length} freelancers`);

  // Clear existing client-specific jobs, proposals, contracts, payments for Rajesh Sharma to avoid duplicates
  await jobsCol.deleteMany({ client: clientId });
  await contractsCol.deleteMany({ client: clientId });
  await paymentsCol.deleteMany({ payer: clientId });

  // 3. 6 Projects for Rajesh Sharma
  const now = new Date();
  const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const projectsToCreate = [
    {
      key: 'p1',
      title: 'E-commerce Website',
      description: 'End-to-end multi-vendor e-commerce marketplace with real-time inventory management, Razorpay escrow checkout, coupon engine, and high-performance React frontend.',
      category: 'Web Development',
      budget: { min: 40000, max: 48000, type: 'fixed' },
      status: 'in_progress',
      experienceLevel: 'expert',
      skillsRequired: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Redux'],
      proposalCount: 6,
      hiredFreelancerName: 'Aarav Mehta',
      progress: 65,
      priority: 'High',
      deadline: daysFromNow(25),
      createdAt: daysAgo(20),
    },
    {
      key: 'p2',
      title: 'Mobile Banking UI',
      description: 'Ultra-modern, highly accessible mobile banking interface design system, including dark mode, biometric authorization flows, and interactive micro-animations in Figma.',
      category: 'UI/UX Design',
      budget: { min: 28000, max: 32000, type: 'fixed' },
      status: 'open',
      stage: 'Reviewing',
      experienceLevel: 'intermediate',
      skillsRequired: ['Figma', 'UI/UX Design', 'Design Systems', 'Mobile UI', 'Prototyping'],
      proposalCount: 4,
      hiredFreelancerName: null,
      progress: 30,
      priority: 'Urgent',
      deadline: daysFromNow(18),
      createdAt: daysAgo(5),
    },
    {
      key: 'p3',
      title: 'AI Resume Analyzer',
      description: 'Intelligent candidate evaluation web app utilizing GPT-4 embeddings to score resumes against job descriptions, generate candidate summaries, and suggest skill benchmarks.',
      category: 'AI & ML',
      budget: { min: 22000, max: 26000, type: 'fixed' },
      status: 'open',
      stage: 'Active',
      experienceLevel: 'expert',
      skillsRequired: ['Python', 'OpenAI API', 'NLP', 'FastAPI', 'React'],
      proposalCount: 3,
      hiredFreelancerName: null,
      progress: 15,
      priority: 'Medium',
      deadline: daysFromNow(30),
      createdAt: daysAgo(2),
    },
    {
      key: 'p4',
      title: 'Restaurant Website',
      description: 'Luxury dining experience website with digital reservation system, interactive food menu, chef spotlight, and Google Maps location integration.',
      category: 'Web Development',
      budget: { min: 15000, max: 18000, type: 'fixed' },
      status: 'completed',
      stage: 'Completed',
      experienceLevel: 'intermediate',
      skillsRequired: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'SEO'],
      proposalCount: 2,
      hiredFreelancerName: 'Rohan Patel',
      progress: 100,
      priority: 'Normal',
      deadline: daysAgo(10),
      createdAt: daysAgo(45),
    },
    {
      key: 'p5',
      title: 'Portfolio Redesign',
      description: 'Minimalist, typography-focused executive portfolio website for venture capital showcase, featuring smooth scroll interactions and clean case-study layouts.',
      category: 'UI/UX Design',
      budget: { min: 10000, max: 12000, type: 'fixed' },
      status: 'completed',
      stage: 'Completed',
      experienceLevel: 'intermediate',
      skillsRequired: ['Figma', 'Webflow', 'Brand Identity', 'Responsive Design'],
      proposalCount: 2,
      hiredFreelancerName: 'Priya Kapoor',
      progress: 100,
      priority: 'Normal',
      deadline: daysAgo(20),
      createdAt: daysAgo(60),
    },
    {
      key: 'p6',
      title: 'CRM Dashboard',
      description: 'Enterprise pipeline management dashboard with Kanban lead boards, email synchronization, and customer analytics charts.',
      category: 'Web Development',
      budget: { min: 40000, max: 45000, type: 'fixed' },
      status: 'open',
      stage: 'Pending',
      experienceLevel: 'expert',
      skillsRequired: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      proposalCount: 1,
      hiredFreelancerName: null,
      progress: 0,
      priority: 'High',
      deadline: daysFromNow(40),
      createdAt: daysAgo(1),
    },
  ];

  const projectMap = {};

  for (const p of projectsToCreate) {
    const jobDoc = {
      _id: new mongoose.Types.ObjectId(),
      client: clientId,
      title: p.title,
      description: p.description,
      category: p.category,
      budget: p.budget,
      status: p.status,
      experienceLevel: p.experienceLevel,
      skillsRequired: p.skillsRequired,
      proposalCount: p.proposalCount,
      deadline: p.deadline,
      locationType: 'remote',
      createdAt: p.createdAt,
      updatedAt: p.createdAt,
    };
    await jobsCol.insertOne(jobDoc);
    projectMap[p.key] = { ...p, _id: jobDoc._id };
  }
  console.log(`✓ Inserted 6 realistic projects for Rajesh Sharma`);

  // 4. Seed 18 Proposals
  const proposalDefinitions = [
    // P1: E-commerce Website (6 proposals)
    { projectKey: 'p1', flName: 'Aarav Mehta', bid: 48000, days: 28, status: 'accepted', cover: 'I specialize in MERN marketplaces and have delivered 12+ multi-vendor e-commerce platforms with escrow workflows.' },
    { projectKey: 'p1', flName: 'Neha Singh', bid: 46000, days: 25, status: 'rejected', cover: 'Strong experience with backend microservices and modern React UI.' },
    { projectKey: 'p1', flName: 'Kunal Verma', bid: 47500, days: 30, status: 'shortlisted', cover: 'I can build a scalable Node.js/MongoDB architecture for high concurrency during peak sale events.' },
    { projectKey: 'p1', flName: 'Aditya Joshi', bid: 44000, days: 22, status: 'pending', cover: 'Full-stack developer ready to implement clean modular architecture.' },
    { projectKey: 'p1', flName: 'Priya Kapoor', bid: 48000, days: 30, status: 'rejected', cover: 'Can provide complete UX design and frontend implementation.' },
    { projectKey: 'p1', flName: 'Sneha Iyer', bid: 45000, days: 27, status: 'pending', cover: 'Passionate about seamless e-commerce purchasing flows and clean interfaces.' },

    // P2: Mobile Banking UI (4 proposals)
    { projectKey: 'p2', flName: 'Priya Kapoor', bid: 32000, days: 16, status: 'shortlisted', cover: 'I have designed FinTech apps with over 2M active users in India. Excited to craft this banking design system.' },
    { projectKey: 'p2', flName: 'Sneha Iyer', bid: 30000, days: 14, status: 'shortlisted', cover: 'Deep specialization in banking micro-interactions and mobile ergonomics.' },
    { projectKey: 'p2', flName: 'Meera Nair', bid: 29000, days: 18, status: 'pending', cover: 'Mobile UI/UX designer with production iOS and Android experience.' },
    { projectKey: 'p2', flName: 'Rohan Patel', bid: 31500, days: 15, status: 'pending', cover: 'Can deliver design system tokens and ready-to-code components.' },

    // P3: AI Resume Analyzer (3 proposals)
    { projectKey: 'p3', flName: 'Neha Singh', bid: 26000, days: 21, status: 'shortlisted', cover: 'LLM and embeddings specialist. I will configure cosine similarity matching with OpenAI models and FastAPI.' },
    { projectKey: 'p3', flName: 'Aditya Joshi', bid: 24000, days: 18, status: 'pending', cover: 'Full-stack AI developer experienced in LangChain, Python, and React.' },
    { projectKey: 'p3', flName: 'Kunal Verma', bid: 25500, days: 24, status: 'pending', cover: 'I will build a robust async queue system for parsing thousands of PDF resumes.' },

    // P4: Restaurant Website (2 proposals)
    { projectKey: 'p4', flName: 'Rohan Patel', bid: 18000, days: 12, status: 'accepted', cover: 'Delivered multiple high-converting hospitality and fine-dining websites with online reservation booking.' },
    { projectKey: 'p4', flName: 'Kunal Verma', bid: 17000, days: 14, status: 'rejected', cover: 'Full stack development with reservation calendar.' },

    // P5: Portfolio Redesign (2 proposals)
    { projectKey: 'p5', flName: 'Priya Kapoor', bid: 12000, days: 8, status: 'accepted', cover: 'Award-winning portfolio designer. Crafted custom layouts for top venture leaders.' },
    { projectKey: 'p5', flName: 'Sneha Iyer', bid: 11500, days: 10, status: 'rejected', cover: 'Clean minimalist aesthetic with responsive typography.' },

    // P6: CRM Dashboard (1 proposal)
    { projectKey: 'p6', flName: 'Aditya Joshi', bid: 45000, days: 35, status: 'pending', cover: 'Extensive CRM development background with drag-and-drop pipeline stages.' },
  ];

  const proposalMap = {};

  for (const p of proposalDefinitions) {
    const flId = freelancerMap[p.flName];
    const project = projectMap[p.projectKey];
    if (!flId || !project) continue;

    const propDoc = {
      _id: new mongoose.Types.ObjectId(),
      freelancer: flId,
      job: project._id,
      coverLetter: p.cover,
      bidAmount: p.bid,
      deliveryTime: p.days,
      status: p.status,
      createdAt: daysAgo(Math.floor(Math.random() * 5) + 1),
      updatedAt: new Date(),
    };
    await proposalsCol.insertOne(propDoc);
    proposalMap[`${p.projectKey}_${p.flName}`] = propDoc._id;
  }
  console.log(`✓ Inserted 18 realistic proposals linked to projects and freelancers`);

  // 5. Seed Contracts & Milestones
  // Contract 1: E-commerce Website (Rajesh Sharma ↔ Aarav Mehta)
  const p1 = projectMap['p1'];
  const aaravId = freelancerMap['Aarav Mehta'];
  const p1PropId = proposalMap['p1_Aarav Mehta'];

  const contract1Id = new mongoose.Types.ObjectId();
  const contract1Doc = {
    _id: contract1Id,
    client: clientId,
    freelancer: aaravId,
    job: p1._id,
    proposal: p1PropId,
    totalAmount: 48000,
    platformFee: 10,
    status: 'active',
    escrowStatus: 'funded',
    milestones: [
      {
        title: 'API Integration',
        description: 'Implement secure backend RESTful APIs, authentication, and inventory endpoints.',
        amount: 8000,
        status: 'in_progress',
        dueDate: daysFromNow(3),
        fundedAt: daysAgo(5),
      },
      {
        title: 'UI Approval',
        description: 'Deliver responsive storefront, checkout screens, and user profile management UI.',
        amount: 5000,
        status: 'funded',
        dueDate: daysFromNow(5),
        fundedAt: daysAgo(2),
      },
      {
        title: 'Final Delivery',
        description: 'Production deployment, payment gateway escrow setup, and performance sign-off.',
        amount: 15000,
        status: 'pending',
        dueDate: daysFromNow(12),
      },
    ],
    startDate: daysAgo(10),
    endDate: daysFromNow(25),
    createdAt: daysAgo(10),
    updatedAt: new Date(),
  };
  await contractsCol.insertOne(contract1Doc);

  // Contract 2: Restaurant Website (Rajesh Sharma ↔ Rohan Patel)
  const p4 = projectMap['p4'];
  const rohanId = freelancerMap['Rohan Patel'];
  const p4PropId = proposalMap['p4_Rohan Patel'];
  const contract2Id = new mongoose.Types.ObjectId();
  const contract2Doc = {
    _id: contract2Id,
    client: clientId,
    freelancer: rohanId,
    job: p4._id,
    proposal: p4PropId,
    totalAmount: 18000,
    platformFee: 10,
    status: 'completed',
    escrowStatus: 'released',
    milestones: [
      {
        title: 'Menu and Reservations Module',
        amount: 12000,
        status: 'approved',
        fundedAt: daysAgo(35),
        approvedAt: daysAgo(25),
      },
      {
        title: 'SEO and Final Launch',
        amount: 6000,
        status: 'approved',
        fundedAt: daysAgo(20),
        approvedAt: daysAgo(10),
      },
    ],
    startDate: daysAgo(40),
    endDate: daysAgo(10),
    createdAt: daysAgo(40),
    updatedAt: daysAgo(10),
  };
  await contractsCol.insertOne(contract2Doc);

  // Contract 3: Portfolio Redesign (Rajesh Sharma ↔ Priya Kapoor)
  const p5 = projectMap['p5'];
  const priyaId = freelancerMap['Priya Kapoor'];
  const p5PropId = proposalMap['p5_Priya Kapoor'];
  const contract3Id = new mongoose.Types.ObjectId();
  const contract3Doc = {
    _id: contract3Id,
    client: clientId,
    freelancer: priyaId,
    job: p5._id,
    proposal: p5PropId,
    totalAmount: 12000,
    platformFee: 10,
    status: 'completed',
    escrowStatus: 'released',
    milestones: [
      {
        title: 'Design System & Figma Mockups',
        amount: 8500,
        status: 'approved',
        fundedAt: daysAgo(50),
        approvedAt: daysAgo(30),
      },
      {
        title: 'Responsive Webflow Build',
        amount: 3500,
        status: 'approved',
        fundedAt: daysAgo(25),
        approvedAt: daysAgo(20),
      },
    ],
    startDate: daysAgo(55),
    endDate: daysAgo(20),
    createdAt: daysAgo(55),
    updatedAt: daysAgo(20),
  };
  await contractsCol.insertOne(contract3Doc);
  console.log(`✓ Inserted 3 contracts with active & completed milestones`);

  // 6. Seed Payments & Monthly Spending
  // Dates matching prompt:
  // Aug 4: ₹12,000 - Released
  // Aug 12: ₹8,500 - Released
  // Aug 21: ₹18,000 - Held
  // Sep 2: ₹22,000 - Released
  // Sep 5: ₹14,000 - Processing
  const paymentsList = [
    {
      contract: contract2Id,
      payer: clientId,
      recipient: rohanId,
      amount: 12000,
      netAmount: 10800,
      type: 'escrow_deposit',
      status: 'succeeded',
      escrowState: 'Released',
      invoiceNumber: 'INV-2026-AUG04',
      projectTitle: 'Restaurant Website — Core Build',
      freelancerName: 'Rohan Patel',
      createdAt: new Date('2026-08-04T11:20:00.000Z'),
    },
    {
      contract: contract3Id,
      payer: clientId,
      recipient: priyaId,
      amount: 8500,
      netAmount: 7650,
      type: 'escrow_deposit',
      status: 'succeeded',
      escrowState: 'Released',
      invoiceNumber: 'INV-2026-AUG12',
      projectTitle: 'Portfolio Redesign — Figma Prototype',
      freelancerName: 'Priya Kapoor',
      createdAt: new Date('2026-08-12T15:45:00.000Z'),
    },
    {
      contract: contract1Id,
      payer: clientId,
      recipient: aaravId,
      amount: 18000,
      netAmount: 16200,
      type: 'escrow_deposit',
      status: 'succeeded',
      escrowState: 'Held in Escrow',
      invoiceNumber: 'INV-2026-AUG21',
      projectTitle: 'E-commerce Website — Milestone 1',
      freelancerName: 'Aarav Mehta',
      createdAt: new Date('2026-08-21T18:10:00.000Z'),
    },
    {
      contract: contract1Id,
      payer: clientId,
      recipient: aaravId,
      amount: 22000,
      netAmount: 19800,
      type: 'escrow_deposit',
      status: 'succeeded',
      escrowState: 'Released',
      invoiceNumber: 'INV-2026-SEP02',
      projectTitle: 'E-commerce Website — Sprint Delivery',
      freelancerName: 'Aarav Mehta',
      createdAt: new Date('2026-09-02T10:05:00.000Z'),
    },
    {
      contract: contract1Id,
      payer: clientId,
      recipient: aaravId,
      amount: 14000,
      netAmount: 12600,
      type: 'escrow_deposit',
      status: 'pending',
      escrowState: 'Processing',
      invoiceNumber: 'INV-2026-SEP05',
      projectTitle: 'E-commerce Website — Milestone 2 Escrow',
      freelancerName: 'Aarav Mehta',
      createdAt: new Date('2026-09-05T14:30:00.000Z'),
    },
    // Historical payments for monthly charts:
    // Apr: ₹12,000
    {
      contract: contract3Id,
      payer: clientId,
      recipient: priyaId,
      amount: 12000,
      netAmount: 10800,
      type: 'escrow_deposit',
      status: 'succeeded',
      invoiceNumber: 'INV-2026-APR15',
      projectTitle: 'Design Sprint Setup',
      freelancerName: 'Priya Kapoor',
      createdAt: new Date('2026-04-15T10:00:00.000Z'),
    },
    // May: ₹18,000
    {
      contract: contract2Id,
      payer: clientId,
      recipient: rohanId,
      amount: 18000,
      netAmount: 16200,
      type: 'escrow_deposit',
      status: 'succeeded',
      invoiceNumber: 'INV-2026-MAY18',
      projectTitle: 'Architecture Setup',
      freelancerName: 'Rohan Patel',
      createdAt: new Date('2026-05-18T12:00:00.000Z'),
    },
    // Jun: ₹21,500
    {
      contract: contract1Id,
      payer: clientId,
      recipient: aaravId,
      amount: 21500,
      netAmount: 19350,
      type: 'escrow_deposit',
      status: 'succeeded',
      invoiceNumber: 'INV-2026-JUN20',
      projectTitle: 'Full Stack Integration',
      freelancerName: 'Aarav Mehta',
      createdAt: new Date('2026-06-20T16:00:00.000Z'),
    },
    // Jul: ₹28,000
    {
      contract: contract1Id,
      payer: clientId,
      recipient: aaravId,
      amount: 28000,
      netAmount: 25200,
      type: 'escrow_deposit',
      status: 'succeeded',
      invoiceNumber: 'INV-2026-JUL22',
      projectTitle: 'Platform Sprint 1',
      freelancerName: 'Aarav Mehta',
      createdAt: new Date('2026-07-22T14:00:00.000Z'),
    },
  ];

  for (const pay of paymentsList) {
    const doc = {
      _id: new mongoose.Types.ObjectId(),
      contract: pay.contract,
      payer: pay.payer,
      recipient: pay.recipient,
      amount: pay.amount,
      netAmount: pay.netAmount,
      platformFee: 10,
      currency: 'INR',
      type: pay.type,
      status: pay.status,
      invoiceNumber: pay.invoiceNumber,
      createdAt: pay.createdAt,
      updatedAt: pay.createdAt,
    };
    await paymentsCol.insertOne(doc);
  }
  console.log(`✓ Inserted payments & 6-month historical spending ledgers`);

  console.log('🎉 Client Dashboard Seeding Complete!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
