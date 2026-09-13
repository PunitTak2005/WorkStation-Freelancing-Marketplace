import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

// Curated 30 demo jobs adhering strictly to prompt distributions:
// - Web Development (8)
// - Mobile Development (5)
// - UI/UX Design (4)
// - AI/ML (4)
// - DevOps (3)
// - Content Writing (3)
// - Digital Marketing (3)
const DEMO_JOBS = [
  // ── Web Development (8) ──
  {
    title: 'Enterprise Multi-Vendor E-Commerce Platform Architecture',
    description: 'We require a senior Full-Stack architect to lead the development of our multi-vendor commerce platform with real-time inventory synchronization, Razorpay automated payouts, and Elasticsearch indexing.',
    category: 'Web Development',
    budget: { min: 85000, max: 180000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'Redis', 'Tailwind CSS', 'Razorpay'],
    status: 'open',
    isFeatured: true,
    views: 142,
    deliverables: ['Custom Vendor Portal', 'Escrow Payment Splits', 'Elasticsearch Catalog', 'Automated Invoicing'],
  },
  {
    title: 'Modern Healthcare Telemedicine Portal with WebRTC Video',
    description: 'Architect a HIPAA/NDHM compliant consultation platform featuring WebRTC encrypted video consultations, doctor appointment scheduling, and electronic prescription generation.',
    category: 'Web Development',
    budget: { min: 70000, max: 140000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Next.js', 'WebRTC', 'Node.js', 'Socket.io', 'MongoDB'],
    status: 'in_progress',
    isFeatured: true,
    views: 98,
    deliverables: ['Doctor Consultation Room', 'Prescription PDF Generator', 'Calendar Synchronization'],
  },
  {
    title: 'Real Estate Virtual Tour & Property Management System',
    description: 'Build an interactive 3D virtual tour real estate portal for residential housing societies across Rajasthan with interactive floor plans and lead routing.',
    category: 'Web Development',
    budget: { min: 50000, max: 95000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['React', 'Three.js', 'Tailwind CSS', 'Node.js'],
    status: 'completed',
    isFeatured: false,
    views: 64,
    deliverables: ['3D Tour Viewer', 'Agent Dashboard', 'WhatsApp Lead Integration'],
  },
  {
    title: 'SaaS Subscription Billing & Customer Analytics Dashboard',
    description: 'Implement a Stripe and Razorpay subscription billing portal with usage-based metered billing, churn prediction, and webhook event processing.',
    category: 'Web Development',
    budget: { min: 45000, max: 90000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL'],
    status: 'open',
    isFeatured: false,
    views: 85,
    deliverables: ['Subscription Checkout', 'Customer Portal', 'Revenue Analytics'],
  },
  {
    title: 'Fintech Corporate Expense Management System',
    description: 'Developing an automated receipt scanning, corporate expense approval workflow, and ERP ledger reconciliation system for Indian mid-market enterprises.',
    category: 'Web Development',
    budget: { min: 65000, max: 125000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Next.js', 'Node.js', 'MongoDB', 'Tesseract.js', 'Tailwind CSS'],
    status: 'in_progress',
    isFeatured: false,
    views: 110,
    deliverables: ['OCR Receipt Processing', 'Approval Hierarchy', 'Tally XML Exporter'],
  },
  {
    title: 'Educational LMS Portal with Interactive Coding Sandbox',
    description: 'Looking for a developer to build an interactive learning management system featuring Monaco code editor, automated unit test evaluation, and student progress tracking.',
    category: 'Web Development',
    budget: { min: 55000, max: 110000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['React', 'Monaco Editor', 'Docker', 'Node.js'],
    status: 'open',
    isFeatured: false,
    views: 73,
    deliverables: ['Code Execution Sandbox', 'Course Builder', 'Certificate Generator'],
  },
  {
    title: 'High-Performance Landing Pages for D2C Brand Launch',
    description: 'Design and build blazing-fast landing pages with 95+ Google Lighthouse scores, micro-interactions, and conversion-optimized checkout funnels.',
    category: 'Web Development',
    budget: { min: 15000, max: 35000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Shopify Storefront API'],
    status: 'completed',
    isFeatured: false,
    views: 52,
    deliverables: ['3 Responsive Pages', 'Speed Optimization', 'A/B Testing Setup'],
  },
  {
    title: 'B2B Wholesale Procurement Portal with RFQ Engine',
    description: 'Build a Request for Quotation (RFQ) negotiation portal for industrial equipment distributors with tiered volume discounts and quote approval chains.',
    category: 'Web Development',
    budget: { min: 60000, max: 115000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'Redis'],
    status: 'pending_review',
    isFeatured: false,
    views: 31,
    deliverables: ['RFQ Engine', 'Quote PDF Generation', 'Vendor Comparison Matrix'],
  },

  // ── Mobile Development (5) ──
  {
    title: 'Hyperlocal Grocery & Quick-Commerce Delivery Mobile App',
    description: 'Develop cross-platform Flutter mobile applications for customer ordering, picker fulfillment, and delivery rider route optimization with live map tracking.',
    category: 'Mobile Development',
    budget: { min: 90000, max: 195000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Flutter', 'Dart', 'Google Maps API', 'Firebase', 'Node.js'],
    status: 'open',
    isFeatured: true,
    views: 165,
    deliverables: ['Customer iOS & Android Apps', 'Driver Route App', 'Live Telemetry'],
  },
  {
    title: 'Neobank UPI Payments & Personal Finance App',
    description: 'React Native mobile application for zero-fee bank transfers, UPI QR code scanner, automated recurring bills, and spend categorisation.',
    category: 'Mobile Development',
    budget: { min: 110000, max: 220000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['React Native', 'TypeScript', 'Redux Toolkit', 'Biometric Auth', 'UPI'],
    status: 'in_progress',
    isFeatured: true,
    views: 189,
    deliverables: ['Biometric Login', 'UPI Scanner', 'Expense Categorizer'],
  },
  {
    title: 'Gym & Fitness Tracking Mobile App with IoT BLE Sync',
    description: 'Build a workout companion mobile app connecting via Bluetooth Low Energy (BLE) to smart heart rate monitors and gym resistance machines.',
    category: 'Mobile Development',
    budget: { min: 40000, max: 80000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Flutter', 'BLE', 'HealthKit', 'Google Fit'],
    status: 'open',
    isFeatured: false,
    views: 67,
    deliverables: ['BLE Sync Engine', 'Workout Routines', 'Social Leaderboards'],
  },
  {
    title: 'Field Service Technician Dispatch Mobile Application',
    description: 'Offline-first React Native application for field service engineers to inspect solar installations, capture photos, and collect customer digital signatures.',
    category: 'Mobile Development',
    budget: { min: 45000, max: 90000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['React Native', 'WatermelonDB', 'Offline Sync', 'Camera API'],
    status: 'completed',
    isFeatured: false,
    views: 45,
    deliverables: ['Offline Database', 'Digital Signature Pad', 'PDF Job Sheet'],
  },
  {
    title: 'Real-Time Audio Chat & Community Social App',
    description: 'Looking to engineer an invite-only audio room discussion platform with low-latency Agora audio streaming and listener moderation tools.',
    category: 'Mobile Development',
    budget: { min: 65000, max: 130000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Flutter', 'Agora SDK', 'WebSockets', 'Node.js'],
    status: 'suspended',
    isFeatured: false,
    views: 28,
    deliverables: ['Audio Room Engine', 'Speaker Moderation', 'Push Notifications'],
  },

  // ── UI/UX Design (4) ──
  {
    title: 'Design System & Component Library for FinTech Platform',
    description: 'Create an atomic Figma design system with 200+ components, light and dark mode tokens, accessibility compliance (WCAG AA), and interactive micro-animations.',
    category: 'UI/UX Design',
    budget: { min: 35000, max: 75000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Figma', 'Design Systems', 'UI/UX', 'Wireframing', 'Prototyping'],
    status: 'open',
    isFeatured: true,
    views: 120,
    deliverables: ['Figma Token Architecture', 'Component Library', 'Interactive Prototype'],
  },
  {
    title: 'SaaS Analytics Dashboard UI/UX Redesign',
    description: 'Overhaul our existing B2B marketing attribution dashboard into an ultra-clean, minimalist interface inspired by Linear and Stripe.',
    category: 'UI/UX Design',
    budget: { min: 25000, max: 60000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Figma', 'Dashboard Design', 'Data Visualization', 'User Research'],
    status: 'completed',
    isFeatured: false,
    views: 94,
    deliverables: ['UX Audit Report', 'High-Fidelity Dashboard Mockups', 'Mobile Responsive Layouts'],
  },
  {
    title: 'E-Commerce Mobile App Onboarding & Checkout Flow UX',
    description: 'Audit and redesign the registration, address selector, and checkout friction points for our luxury apparel mobile app to maximize funnel conversion.',
    category: 'UI/UX Design',
    budget: { min: 20000, max: 45000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Figma', 'Mobile UX', 'User Testing', 'Interaction Design'],
    status: 'open',
    isFeatured: false,
    views: 58,
    deliverables: ['Wireframes', 'Interactive Figma Prototype', 'Usability Test Findings'],
  },
  {
    title: 'Brand Identity & Web Style Guide for GreenTech Startup',
    description: 'Establish modern visual brand guidelines including vector logo assets, color palettes, typography scales, and custom icon sets for our renewable energy company.',
    category: 'UI/UX Design',
    budget: { min: 18000, max: 40000, type: 'fixed' },
    experienceLevel: 'entry',
    skillsRequired: ['Illustrator', 'Figma', 'Branding', 'Typography', 'Logo Design'],
    status: 'in_progress',
    isFeatured: false,
    views: 61,
    deliverables: ['Brand Guidelines PDF', 'Vector Logo Suite', 'Social Media Templates'],
  },

  // ── AI/ML (4) ──
  {
    title: 'Enterprise Document Intelligence & RAG Question-Answering System',
    description: 'Build a production Retrieval-Augmented Generation (RAG) pipeline to query legal contracts and financial statements using LangChain, pgvector, and Claude 3.5 Sonnet.',
    category: 'AI/ML',
    budget: { min: 95000, max: 210000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Python', 'LangChain', 'FastAPI', 'pgvector', 'OpenAI API', 'Docker'],
    status: 'open',
    isFeatured: true,
    views: 204,
    deliverables: ['RAG Ingestion Pipeline', 'Vector Database Setup', 'FastAPI Microservice', 'Evaluation Benchmark'],
  },
  {
    title: 'Computer Vision Defect Detection for Manufacturing Assembly',
    description: 'Train and deploy lightweight YOLOv8 models on edge devices (Jetson Nano) to identify manufacturing defects on automotive assembly conveyor lines in real time.',
    category: 'AI/ML',
    budget: { min: 80000, max: 175000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['PyTorch', 'YOLOv8', 'OpenCV', 'NVIDIA TensorRT', 'Python'],
    status: 'in_progress',
    isFeatured: false,
    views: 135,
    deliverables: ['Annotated Dataset', 'Fine-Tuned YOLO Weights', 'Edge Inference Script'],
  },
  {
    title: 'Multilingual Customer Support AI Chatbot with Human Handoff',
    description: 'Develop an intelligent customer service agent supporting Hindi, English, and Gujarati that handles booking inquiries and seamlessly routes complex cases to live agents.',
    category: 'AI/ML',
    budget: { min: 45000, max: 95000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Python', 'Llama-Index', 'Streamlit', 'Redis', 'NLP'],
    status: 'open',
    isFeatured: false,
    views: 112,
    deliverables: ['Conversational Agent', 'Agent Handoff Logic', 'Sentiment Analytics'],
  },
  {
    title: 'Churn Prediction & Customer Lifetime Value (LTV) Model',
    description: 'Analyze subscription behavioral telemetry across 50,000 users and train gradient boosted trees (XGBoost) to forecast churn risk 30 days in advance.',
    category: 'AI/ML',
    budget: { min: 40000, max: 85000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Python', 'Scikit-Learn', 'XGBoost', 'Pandas', 'SQL'],
    status: 'completed',
    isFeatured: false,
    views: 82,
    deliverables: ['Jupyter Analysis Notebook', 'Trained Model Artifacts', 'Automated Daily Inference Job'],
  },

  // ── DevOps (3) ──
  {
    title: 'AWS Kubernetes (EKS) Production Cluster Architecture & GitOps CI/CD',
    description: 'Architect a multi-AZ AWS EKS infrastructure using Terraform, ArgoCD GitOps, Helm charts, and Istio Service Mesh with Prometheus and Grafana observability.',
    category: 'DevOps',
    budget: { min: 75000, max: 160000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['AWS', 'Kubernetes', 'Terraform', 'ArgoCD', 'Prometheus', 'Docker'],
    status: 'open',
    isFeatured: true,
    views: 156,
    deliverables: ['Terraform Infrastructure Code', 'ArgoCD Pipelines', 'Prometheus Dashboards'],
  },
  {
    title: 'Zero-Downtime Database Migration to MongoDB Atlas',
    description: 'Plan and execute seamless zero-downtime replication and cutover of a 250GB MongoDB replica set into MongoDB Atlas with automated failover testing.',
    category: 'DevOps',
    budget: { min: 35000, max: 75000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['MongoDB Atlas', 'Linux', 'Bash', 'Docker', 'Backup & Recovery'],
    status: 'completed',
    isFeatured: false,
    views: 74,
    deliverables: ['Migration Runbook', 'Replica Mirroring Script', 'Performance Benchmark Report'],
  },
  {
    title: 'Security Hardening & SOC 2 Cloud Infrastructure Compliance',
    description: 'Conduct vulnerability assessments, configure AWS GuardDuty, enforce least privilege IAM policies, and automate CIS benchmark compliance scans.',
    category: 'DevOps',
    budget: { min: 50000, max: 100000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['AWS Security Hub', 'IAM', 'CloudTrail', 'WAF', 'DevSecOps'],
    status: 'in_progress',
    isFeatured: false,
    views: 89,
    deliverables: ['SOC 2 Readiness Report', 'WAF Security Rules', 'Automated Compliance Scans'],
  },

  // ── Content Writing (3) ──
  {
    title: 'Technical Whitepaper & Documentation for Web3 Protocol',
    description: 'Author an exhaustive 24-page technical whitepaper detailing consensus algorithms, tokenomics models, and developer SDK documentation for our decentralized network.',
    category: 'Content Writing',
    budget: { min: 25000, max: 55000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Technical Writing', 'Whitepapers', 'Blockchain', 'API Documentation'],
    status: 'open',
    isFeatured: false,
    views: 71,
    deliverables: ['Executive Summary', 'Technical Whitepaper PDF', 'Architecture Diagrams'],
  },
  {
    title: 'SEO Long-Form Content Cluster for B2B SaaS Product',
    description: 'Write 8 in-depth, data-backed 2,500-word search-optimized pillar articles focusing on cloud cost optimization and infrastructure governance.',
    category: 'Content Writing',
    budget: { min: 18000, max: 40000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['SEO Writing', 'Content Strategy', 'B2B SaaS', 'Keyword Research'],
    status: 'completed',
    isFeatured: false,
    views: 58,
    deliverables: ['8 Pillar Articles', 'Meta Descriptions', 'Internal Linking Matrix'],
  },
  {
    title: 'Enterprise Case Studies & Customer Success Story Series',
    description: 'Interview executive stakeholders and write 4 persuasive customer transformation case studies highlighting quantified ROI and productivity improvements.',
    category: 'Content Writing',
    budget: { min: 15000, max: 32000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Copywriting', 'Case Studies', 'Interviews', 'Storytelling'],
    status: 'in_progress',
    isFeatured: false,
    views: 43,
    deliverables: ['4 Published Case Studies', 'One-Page PDF Handouts', 'Pull Quote Assets'],
  },

  // ── Digital Marketing (3) ──
  {
    title: 'Full-Funnel Google Search & LinkedIn B2B Ad Campaign Management',
    description: 'Set up, structure, and optimize targeted Google Ads and LinkedIn Lead Gen campaigns for high-ACV enterprise IT consulting clients with conversion tracking.',
    category: 'Digital Marketing',
    budget: { min: 30000, max: 65000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Google Ads', 'LinkedIn Ads', 'Conversion Tracking', 'B2B Lead Gen'],
    status: 'open',
    isFeatured: false,
    views: 92,
    deliverables: ['Keyword Research', 'Ad Copy Matrix', 'Conversion Tracking Setup', 'Weekly ROI Reports'],
  },
  {
    title: 'Organic Growth & Technical SEO Audit for Global Marketplace',
    description: 'Comprehensive technical SEO audit across 50,000 dynamic URLs resolving Core Web Vitals issues, duplicate meta tags, and structured schema markup.',
    category: 'Digital Marketing',
    budget: { min: 25000, max: 55000, type: 'fixed' },
    experienceLevel: 'expert',
    skillsRequired: ['Technical SEO', 'Schema.org', 'Screaming Frog', 'Core Web Vitals'],
    status: 'completed',
    isFeatured: false,
    views: 79,
    deliverables: ['Technical SEO Audit Report', 'Schema JSON-LD Code', 'Fix Implementation Roadmap'],
  },
  {
    title: 'Email Marketing Automation & Retention Funnel Architecture',
    description: 'Design and deploy automated customer onboarding, milestone re-engagement, and win-back email drip campaigns with dynamic personalization in Klaviyo.',
    category: 'Digital Marketing',
    budget: { min: 20000, max: 45000, type: 'fixed' },
    experienceLevel: 'intermediate',
    skillsRequired: ['Klaviyo', 'Email Marketing', 'Copywriting', 'Lifecycle Marketing'],
    status: 'pending_review',
    isFeatured: false,
    views: 39,
    deliverables: ['5 Automated Flows', 'Responsive Email Templates', 'Segmentation Rules'],
  },
];

async function seedAdminJobs() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI);

  // 1. Fetch available clients
  const clients = await User.find({ role: 'client' }).lean();
  if (!clients || clients.length === 0) {
    console.error('No client users found. Please seed users first.');
    process.exit(1);
  }
  console.log(`Found ${clients.length} clients in database for job attribution.`);

  // 2. Fetch available freelancers for proposals
  const freelancers = await User.find({ role: 'freelancer' }).lean();
  console.log(`Found ${freelancers.length} freelancers in database for proposal associations.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < DEMO_JOBS.length; i++) {
    const jobSpec = DEMO_JOBS[i];
    const client = clients[i % clients.length];

    // Compute deterministic deadline in the future (30-60 days)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 25 + (i * 3));

    let existingJob = await Job.findOne({ title: jobSpec.title });
    if (!existingJob) {
      existingJob = new Job({
        title: jobSpec.title,
        description: jobSpec.description,
        category: jobSpec.category,
        budget: jobSpec.budget,
        deadline,
        experienceLevel: jobSpec.experienceLevel,
        skillsRequired: jobSpec.skillsRequired,
        client: client._id,
        company: client.company || `${client.name}'s Enterprise`,
        status: jobSpec.status,
        isFeatured: jobSpec.isFeatured,
        views: jobSpec.views || 45,
        deliverables: jobSpec.deliverables || [],
        proposalCount: 0,
        locationType: 'remote',
      });
      await existingJob.save();
      createdCount++;
    } else {
      existingJob.category = jobSpec.category;
      existingJob.budget = jobSpec.budget;
      existingJob.experienceLevel = jobSpec.experienceLevel;
      existingJob.skillsRequired = jobSpec.skillsRequired;
      existingJob.status = jobSpec.status;
      existingJob.isFeatured = jobSpec.isFeatured;
      existingJob.views = jobSpec.views || existingJob.views;
      existingJob.deliverables = jobSpec.deliverables || existingJob.deliverables;
      await existingJob.save();
      updatedCount++;
    }

    // Ensure realistic proposals (3 to 12 proposals per job)
    const targetProposalCount = 4 + (i % 8);
    const existingProposalsCount = await Proposal.countDocuments({ job: existingJob._id });

    if (existingProposalsCount < targetProposalCount && freelancers.length > 0) {
      const needed = targetProposalCount - existingProposalsCount;
      for (let p = 0; p < needed; p++) {
        const freelancer = freelancers[(i + p) % freelancers.length];
        const alreadyProposed = await Proposal.findOne({ job: existingJob._id, freelancer: freelancer._id });
        if (!alreadyProposed) {
          const bidAmount = Math.round((existingJob.budget.min + existingJob.budget.max) / 2 + (p * 2000));
          await Proposal.create({
            job: existingJob._id,
            freelancer: freelancer._id,
            bidAmount,
            deliveryTime: 14 + (p * 3),
            coverLetter: `Hello! I have extensive experience in ${jobSpec.skillsRequired.slice(0, 2).join(' & ')} and have delivered multiple enterprise solutions. I can complete this within ${14 + (p * 3)} days with clean documentation and tests.`,
            status: p === 0 && existingJob.status === 'in_progress' ? 'accepted' : p === 1 ? 'shortlisted' : 'pending',
            milestones: [
              { title: 'System Architecture & Prototype', amount: Math.round(bidAmount * 0.4) },
              { title: 'Full Implementation & Integration', amount: Math.round(bidAmount * 0.6) },
            ],
          });
        }
      }
      // Update cached count
      const updatedCountProp = await Proposal.countDocuments({ job: existingJob._id });
      existingJob.proposalCount = updatedCountProp;
      await existingJob.save();
    }
  }

  // Print summary analytics
  const [totalJobs, openJobs, completedJobs, inProgressJobs, pendingJobs, totalProposals] = await Promise.all([
    Job.countDocuments({ isDeleted: { $ne: true } }),
    Job.countDocuments({ status: 'open', isDeleted: { $ne: true } }),
    Job.countDocuments({ status: 'completed', isDeleted: { $ne: true } }),
    Job.countDocuments({ status: 'in_progress', isDeleted: { $ne: true } }),
    Job.countDocuments({ status: { $in: ['pending_review', 'suspended'] }, isDeleted: { $ne: true } }),
    Proposal.countDocuments(),
  ]);

  const catAgg = await Job.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  console.log('======================================================');
  console.log('           ADMIN JOBS SEEDING COMPLETED               ');
  console.log('======================================================');
  console.log(`Created Jobs:         ${createdCount}`);
  console.log(`Updated Jobs:         ${updatedCount}`);
  console.log(`Total Platform Jobs:  ${totalJobs}`);
  console.log(`Open (Active):        ${openJobs}`);
  console.log(`In Progress:          ${inProgressJobs}`);
  console.log(`Completed:            ${completedJobs}`);
  console.log(`Pending/Suspended:    ${pendingJobs}`);
  console.log(`Total Proposals:      ${totalProposals}`);
  console.log('------------------------------------------------------');
  console.log('Categories Distribution:');
  catAgg.forEach(c => console.log(` - ${c._id}: ${c.count}`));
  console.log('======================================================');

  await mongoose.disconnect();
  process.exit(0);
}

seedAdminJobs().catch(err => {
  console.error('Seed Admin Jobs failed:', err);
  process.exit(1);
});
