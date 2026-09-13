/**
 * seedRevenue.js
 *
 * Seeds 20 realistic completed payment records linked to existing demo users,
 * projects, and contracts for the admin dashboard's Platform Revenue section.
 *
 * Target Metrics:
 * - Completed Payments: 20
 * - Gross Transaction Volume: ~₹11–13 lakh (Target: ~₹12,08,000)
 * - Platform Revenue: ~₹1.2 lakh (Target: ~₹1,20,800, exactly 10%)
 * - Average Payment: ~₹55k–65k (Target: ~₹60,400)
 * - Payment amounts between ₹8,000–₹2,20,000
 * - Platform fee = 10%, Freelancer earnings = 90%
 * - Spread across the last 90 days
 * - Mix of categories: Web Dev, Mobile Dev, UI/UX, AI/ML, DevOps, Content Writing
 * - Fully idempotent (skips duplicates or updates cleanly)
 *
 * Run: node src/scripts/seedRevenue.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Contract from '../models/Contract.js';
import Payment from '../models/Payment.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

// Helper to compute a date N days ago with deterministic hour offset
const getDaysAgo = (days, hourOffset = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hourOffset, 15, 0, 0);
  return d;
};

// Specifications for 20 completed payments summing to exactly ₹12,08,000
// Gross: 12,08,000 | 10% Fee: 1,20,800 | Freelancer: 10,87,200 | Avg: 60,400
export const DEMO_REVENUE_PAYMENTS = [
  {
    transactionId: 'PAY-REV-001',
    invoiceNumber: 'INV-REV-2026-001',
    projectTitle: 'Banking Dashboard & Real-Time Ledger',
    category: 'Web Development',
    amount: 95000,
    daysAgo: 85,
    method: 'UPI',
    clientEmail: 'rajesh.sharma@email.com',
    clientFallbackName: 'Rajesh Kumar',
    freelancerEmail: 'aarav.desai@email.com',
    freelancerFallbackName: 'Aarav Desai',
    notes: 'Milestone 1: Core microservices architecture & double-entry ledger completed.',
  },
  {
    transactionId: 'PAY-REV-002',
    invoiceNumber: 'INV-REV-2026-002',
    projectTitle: 'E-commerce Store & Multi-Vendor Hub',
    category: 'Web Development',
    amount: 120000,
    daysAgo: 80,
    method: 'Card',
    clientEmail: 'priya.patel@email.com',
    clientFallbackName: 'Priya Patel',
    freelancerEmail: 'rohan.kulkarni@email.com',
    freelancerFallbackName: 'Rohan Kulkarni',
    notes: 'Milestone 2: Catalog indexing, Elasticsearch, and checkout funnel delivered.',
  },
  {
    transactionId: 'PAY-REV-003',
    invoiceNumber: 'INV-REV-2026-003',
    projectTitle: 'Restaurant App & Real-Time Kitchen POS',
    category: 'Mobile Development',
    amount: 68000,
    daysAgo: 76,
    method: 'UPI',
    clientEmail: 'sneha.gupta@email.com',
    clientFallbackName: 'Sneha Gupta',
    freelancerEmail: 'ananya.mishra@email.com',
    freelancerFallbackName: 'Ananya Mishra',
    notes: 'Milestone 1: Cross-platform iOS/Android ordering application approved.',
  },
  {
    transactionId: 'PAY-REV-004',
    invoiceNumber: 'INV-REV-2026-004',
    projectTitle: 'Portfolio Website & Headless CMS',
    category: 'UI/UX Design',
    amount: 18000,
    daysAgo: 72,
    method: 'UPI',
    clientEmail: 'deepa.iyer@email.com',
    clientFallbackName: 'Deepa Iyer',
    freelancerEmail: 'ishita.sharma@email.com',
    freelancerFallbackName: 'Ishita Sharma',
    notes: 'Complete portfolio branding, dark mode tokens, and CMS integration.',
  },
  {
    transactionId: 'PAY-REV-005',
    invoiceNumber: 'INV-REV-2026-005',
    projectTitle: 'AI Chatbot & LLM Support Automation',
    category: 'AI/ML',
    amount: 180000,
    daysAgo: 67,
    method: 'Bank Transfer',
    clientEmail: 'amit.joshi@email.com',
    clientFallbackName: 'Amit Joshi',
    freelancerEmail: 'kunal.bhatia@email.com',
    freelancerFallbackName: 'Kunal Bhatia',
    notes: 'Milestone 1 & 2: Autonomous customer retrieval agent with RAG vector search.',
  },
  {
    transactionId: 'PAY-REV-006',
    invoiceNumber: 'INV-REV-2026-006',
    projectTitle: 'DevOps Pipeline & Kubernetes Cluster',
    category: 'DevOps',
    amount: 135000,
    daysAgo: 63,
    method: 'Bank Transfer',
    clientEmail: 'sanjay.pillai@email.com',
    clientFallbackName: 'Sanjay Pillai',
    freelancerEmail: 'aditya.roy@email.com',
    freelancerFallbackName: 'Aditya Roy',
    notes: 'Production CI/CD GitOps workflow, ArgoCD, and AWS EKS cluster provisioning.',
  },
  {
    transactionId: 'PAY-REV-007',
    invoiceNumber: 'INV-REV-2026-007',
    projectTitle: 'Technical Whitepaper & Web3 Security Docs',
    category: 'Content Writing',
    amount: 22000,
    daysAgo: 58,
    method: 'UPI',
    clientEmail: 'aditya.chauhan@email.com',
    clientFallbackName: 'Aditya Chauhan',
    freelancerEmail: 'sakshi.rawat@email.com',
    freelancerFallbackName: 'Sakshi Rawat',
    notes: 'Full smart contract audit whitepaper, cryptographic analysis, and documentation.',
  },
  {
    transactionId: 'PAY-REV-008',
    invoiceNumber: 'INV-REV-2026-008',
    projectTitle: 'FinTech Mobile Wallet & QR Scanner',
    category: 'Mobile Development',
    amount: 85000,
    daysAgo: 54,
    method: 'Card',
    clientEmail: 'ananya.reddy@email.com',
    clientFallbackName: 'Ananya Reddy',
    freelancerEmail: 'pranav.menon@email.com',
    freelancerFallbackName: 'Pranav Menon',
    notes: 'Biometric authorization, dynamic UPI QR generation, and offline caching.',
  },
  {
    transactionId: 'PAY-REV-009',
    invoiceNumber: 'INV-REV-2026-009',
    projectTitle: 'SaaS Design System & Figma UI Kit',
    category: 'UI/UX Design',
    amount: 45000,
    daysAgo: 49,
    method: 'UPI',
    clientEmail: 'rohit.mehta@email.com',
    clientFallbackName: 'Rohit Mehta',
    freelancerEmail: 'priyanka.jain@email.com',
    freelancerFallbackName: 'Priyanka Jain',
    notes: 'Component library design tokens, WCAG 2.1 AA accessible patterns.',
  },
  {
    transactionId: 'PAY-REV-010',
    invoiceNumber: 'INV-REV-2026-010',
    projectTitle: 'Cloud Migration & Terraform Infrastructure',
    category: 'DevOps',
    amount: 75000,
    daysAgo: 45,
    method: 'Bank Transfer',
    clientEmail: 'kavita.nair@email.com',
    clientFallbackName: 'Kavita Nair',
    freelancerEmail: 'sanjay.singh@email.com',
    freelancerFallbackName: 'Sanjay Singh',
    notes: 'Terraform IaC deployment on AWS with auto-scaling groups and multi-AZ failover.',
  },
  {
    transactionId: 'PAY-REV-011',
    invoiceNumber: 'INV-REV-2026-011',
    projectTitle: 'Predictive Analytics & Churn Forecast Model',
    category: 'AI/ML',
    amount: 110000,
    daysAgo: 40,
    method: 'Card',
    clientEmail: 'suresh.kumar@email.com',
    clientFallbackName: 'Suresh Kumar',
    freelancerEmail: 'kavita.sharma@email.com',
    freelancerFallbackName: 'Kavita Sharma',
    notes: 'XGBoost churn model integration with real-time inference API endpoint.',
  },
  {
    transactionId: 'PAY-REV-012',
    invoiceNumber: 'INV-REV-2026-012',
    projectTitle: 'SEO Technical Content & Engineering Blog',
    category: 'Content Writing',
    amount: 16000,
    daysAgo: 36,
    method: 'UPI',
    clientEmail: 'neha.agarwal@email.com',
    clientFallbackName: 'Neha Agarwal',
    freelancerEmail: 'dev.pandey@email.com',
    freelancerFallbackName: 'Dev Pandey',
    notes: 'Series of 8 in-depth engineering case studies and performance benchmarks.',
  },
  {
    transactionId: 'PAY-REV-013',
    invoiceNumber: 'INV-REV-2026-013',
    projectTitle: 'Healthcare Telemedicine Video Consultation',
    category: 'Web Development',
    amount: 52000,
    daysAgo: 32,
    method: 'Bank Transfer',
    clientEmail: 'karan.malhotra@email.com',
    clientFallbackName: 'Karan Malhotra',
    freelancerEmail: 'vikash.yadav@email.com',
    freelancerFallbackName: 'Vikash Yadav',
    notes: 'WebRTC video room integration, doctor prescription module, and audit logs.',
  },
  {
    transactionId: 'PAY-REV-014',
    invoiceNumber: 'INV-REV-2026-014',
    projectTitle: 'Fitness Tracker & Wearable Bluetooth Sync',
    category: 'Mobile Development',
    amount: 38000,
    daysAgo: 28,
    method: 'UPI',
    clientEmail: 'pooja.deshmukh@email.com',
    clientFallbackName: 'Pooja Deshmukh',
    freelancerEmail: 'harsh.soni@email.com',
    freelancerFallbackName: 'Harsh Soni',
    notes: 'BLE background protocol handler for heart rate & step count synchronization.',
  },
  {
    transactionId: 'PAY-REV-015',
    invoiceNumber: 'INV-REV-2026-015',
    projectTitle: 'Cryptocurrency Exchange Mobile UI',
    category: 'UI/UX Design',
    amount: 32000,
    daysAgo: 24,
    method: 'Card',
    clientEmail: 'meera.saxena@email.com',
    clientFallbackName: 'Meera Saxena',
    freelancerEmail: 'tanvi.shetty@email.com',
    freelancerFallbackName: 'Tanvi Shetty',
    notes: 'Live order book trading interface and candlestick chart UI specifications.',
  },
  {
    transactionId: 'PAY-REV-016',
    invoiceNumber: 'INV-REV-2026-016',
    projectTitle: 'Automated Document OCR & Entity Extraction',
    category: 'AI/ML',
    amount: 47000,
    daysAgo: 20,
    method: 'UPI',
    clientEmail: 'divya.kapoor@email.com',
    clientFallbackName: 'Divya Kapoor',
    freelancerEmail: 'rahul.thakur@email.com',
    freelancerFallbackName: 'Rahul Thakur',
    notes: 'PaddleOCR layout parser for invoice PDF fields and tax tables.',
  },
  {
    transactionId: 'PAY-REV-017',
    invoiceNumber: 'INV-REV-2026-017',
    projectTitle: 'Site Reliability Engineering & Monitoring Stack',
    category: 'DevOps',
    amount: 28000,
    daysAgo: 16,
    method: 'Bank Transfer',
    clientEmail: 'arjun.verma@email.com',
    clientFallbackName: 'Arjun Verma',
    freelancerEmail: 'mayank.joshi@email.com',
    freelancerFallbackName: 'Mayank Joshi',
    notes: 'Prometheus & Grafana dashboards, alerting rules, and PagerDuty routing.',
  },
  {
    transactionId: 'PAY-REV-018',
    invoiceNumber: 'INV-REV-2026-018',
    projectTitle: 'API Documentation & Developer Portal Copy',
    category: 'Content Writing',
    amount: 12000,
    daysAgo: 12,
    method: 'UPI',
    clientEmail: 'vikram.singh@email.com',
    clientFallbackName: 'Vikram Singh',
    freelancerEmail: 'nisha.banerjee@email.com',
    freelancerFallbackName: 'Nisha Banerjee',
    notes: 'Interactive OpenAPI Swagger reference guide and Quickstart SDK manuals.',
  },
  {
    transactionId: 'PAY-REV-019',
    invoiceNumber: 'INV-REV-2026-019',
    projectTitle: 'Microservices Payment Gateway Integration',
    category: 'Web Development',
    amount: 14000,
    daysAgo: 7,
    method: 'Card',
    clientEmail: 'ritu.bhatia@email.com',
    clientFallbackName: 'Ritu Bhatia',
    freelancerEmail: 'riya.kapoor@email.com',
    freelancerFallbackName: 'Riya Kapoor',
    notes: 'Idempotent webhook listener, replay safety, and reconciliation cron job.',
  },
  {
    transactionId: 'PAY-REV-020',
    invoiceNumber: 'INV-REV-2026-020',
    projectTitle: 'Real-Time Fleet Delivery Tracking System',
    category: 'Mobile Development',
    amount: 16000,
    daysAgo: 3,
    method: 'UPI',
    clientEmail: 'manish.tiwari@email.com',
    clientFallbackName: 'Manish Tiwari',
    freelancerEmail: 'neha.desai@email.com',
    freelancerFallbackName: 'Neha Desai',
    notes: 'Driver GPS route optimization, map pins, and geofence delivery confirmation.',
  },
];

export async function seedRevenueData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB for revenue seeding...');

    // Fetch pool of existing clients and freelancers
    const allClients = await User.find({ role: 'client' });
    const allFreelancers = await User.find({ role: 'freelancer' });

    if (!allClients.length || !allFreelancers.length) {
      throw new Error('Database missing clients or freelancers. Run base seeders first.');
    }

    let createdCount = 0;
    let skippedCount = 0;
    let totalGrossVolume = 0;
    let totalPlatformRevenue = 0;

    for (let i = 0; i < DEMO_REVENUE_PAYMENTS.length; i++) {
      const def = DEMO_REVENUE_PAYMENTS[i];

      // Exact 10% fee and 90% payout
      const amount = def.amount;
      const platformFee = Math.round(amount * 0.1);
      const freelancerAmount = amount - platformFee;
      const paidDate = getDaysAgo(def.daysAgo, 10 + (i % 8));
      const submittedDate = new Date(paidDate.getTime() - 3 * 24 * 3600 * 1000);

      // Check if payment already exists (Idempotent - update amounts if needed)
      let paymentDoc = await Payment.findOne({ transactionId: def.transactionId });
      const gst = Math.round(platformFee * 0.18);

      if (paymentDoc) {
        skippedCount++;
        paymentDoc.amount = amount;
        paymentDoc.platformFee = platformFee;
        paymentDoc.netAmount = freelancerAmount;
        paymentDoc.netPayout = freelancerAmount;
        paymentDoc.gst = gst;
        paymentDoc.status = 'completed';
        paymentDoc.escrowStatus = 'released';
        await paymentDoc.save();
        totalGrossVolume += amount;
        totalPlatformRevenue += platformFee;
        continue;
      }

      // Resolve valid client & freelancer users
      let clientUser = allClients.find(
        (c) => c.email?.toLowerCase() === def.clientEmail.toLowerCase()
      );
      if (!clientUser) {
        clientUser = allClients[i % allClients.length];
      }

      let freelancerUser = allFreelancers.find(
        (f) => f.email?.toLowerCase() === def.freelancerEmail.toLowerCase()
      );
      if (!freelancerUser) {
        freelancerUser = allFreelancers[i % allFreelancers.length];
      }

      // Ensure a valid completed Job exists
      let job = await Job.findOne({ title: def.projectTitle });
      if (!job) {
        job = await Job.create({
          title: def.projectTitle,
          description: `Comprehensive industry deliverables for ${def.projectTitle}. Completed with verified test coverage and documentation.`,
          category: def.category,
          budget: { min: Math.round(amount * 0.9), max: amount, type: 'fixed' },
          client: clientUser._id,
          status: 'completed',
          skillsRequired: [def.category, 'Full Stack', 'Enterprise Architecture'],
          deadline: new Date(Date.now() + (30 + i) * 24 * 3600 * 1000),
          experienceLevel: 'expert',
        });
      }

      // Ensure a valid completed Contract exists
      let contract = await Contract.findOne({
        job: job._id,
        freelancer: freelancerUser._id,
        client: clientUser._id,
      });

      if (!contract) {
        contract = await Contract.create({
          client: clientUser._id,
          freelancer: freelancerUser._id,
          job: job._id,
          title: def.projectTitle,
          totalAmount: amount,
          platformFee: 10,
          status: 'completed',
          escrowStatus: 'released',
          progress: 100,
          startDate: submittedDate,
          endDate: paidDate,
          milestones: [
            {
              title: 'Final Project Delivery & Deployment',
              description: def.notes,
              amount: amount,
              status: 'approved',
              fundedAt: submittedDate,
              approvedAt: paidDate,
              dueDate: paidDate,
            },
          ],
        });
      } else {
        contract.status = 'completed';
        contract.escrowStatus = 'released';
        contract.progress = 100;
        await contract.save();
      }

      // Create Payment document with status: 'completed' AND type: 'escrow_deposit'
      // to seamlessly satisfy both admin payment views & platform aggregations
      const timeline = [
        {
          stage: 'Initiated',
          description: `Payment invoice ${def.invoiceNumber} generated for ${def.projectTitle}`,
          timestamp: submittedDate,
          user: clientUser.name,
        },
        {
          stage: 'Escrow Funded',
          description: `₹${amount.toLocaleString('en-IN')} deposited into nodal escrow via ${def.method}`,
          timestamp: new Date(submittedDate.getTime() + 30 * 60 * 1000),
          user: clientUser.name,
        },
        {
          stage: 'Milestone Approved',
          description: 'Deliverables verified and accepted by client',
          timestamp: new Date(paidDate.getTime() - 2 * 3600 * 1000),
          user: clientUser.name,
        },
        {
          stage: 'Payout Completed',
          description: `Net payout of ₹${freelancerAmount.toLocaleString('en-IN')} released to ${freelancerUser.name}`,
          timestamp: paidDate,
          user: 'Platform Escrow Bot',
        },
      ];

      await Payment.create({
        transactionId: def.transactionId,
        invoiceId: def.invoiceNumber,
        invoiceNumber: def.invoiceNumber,
        projectName: def.projectTitle,
        clientName: clientUser.name || def.clientFallbackName,
        freelancerName: freelancerUser.name || def.freelancerFallbackName,
        contract: contract._id,
        payer: clientUser._id,
        recipient: freelancerUser._id,
        amount: amount,
        platformFee: platformFee,
        gst: gst,
        netAmount: freelancerAmount,
        netPayout: freelancerAmount,
        currency: 'INR',
        paymentMethod: def.method,
        escrowStatus: 'released',
        status: 'completed',
        type: 'escrow_deposit',
        createdAt: submittedDate,
        paidAt: paidDate,
        updatedAt: paidDate,
        notes: def.notes,
        timeline: timeline,
      });

      createdCount++;
      totalGrossVolume += amount;
      totalPlatformRevenue += platformFee;
    }

    const avgPayment = Math.round(totalGrossVolume / DEMO_REVENUE_PAYMENTS.length);

    console.log('\n======================================================');
    console.log('          PLATFORM REVENUE SEEDER COMPLETED           ');
    console.log('======================================================');
    console.log(`Completed payments created: ${createdCount}`);
    if (skippedCount > 0) {
      console.log(`Payments already existing (skipped): ${skippedCount}`);
    }
    console.log(`Gross Volume: ₹${totalGrossVolume.toLocaleString('en-IN')}`);
    console.log(`Platform Revenue: ₹${totalPlatformRevenue.toLocaleString('en-IN')}`);
    console.log(`Average Payment: ₹${avgPayment.toLocaleString('en-IN')}`);
    console.log(`Platform Fee: Exactly 10% on every record`);
    console.log('======================================================\n');

    return {
      createdCount,
      skippedCount,
      totalGrossVolume,
      totalPlatformRevenue,
      avgPayment,
    };
  } catch (error) {
    console.error('❌ Error during revenue seeding:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

// Execute seeder
seedRevenueData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
