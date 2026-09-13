/**
 * seedAdminPayments.js
 *
 * Seeds/ensures realistic payments in MongoDB matching the exact required distributions:
 * - 25 Completed payments
 * - 5 Pending payments
 * - 3 Failed payments
 * - 4 Refunded payments (with structured refundDetails)
 * - 3 Disputed payments (with detailed disputeDetails)
 * Total: 40 Payments (~₹15L Gross Volume, ~₹1.5L Platform Fee)
 *
 * All amounts between ₹8,000 - ₹2,20,000
 * Platform fee strictly 10%, Freelancer Net Payout strictly 90%
 * Dates spread across last 90 days
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Contract from '../models/Contract.js';
import Job from '../models/Job.js';
import Payment from '../models/Payment.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

const getDaysAgo = (days, hourOffset = 11) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hourOffset, 20, 0, 0);
  return d;
};

// 40 target payments
export const ADMIN_PAYMENTS_SEED = [
  // ── 25 COMPLETED PAYMENTS ──
  {
    transactionId: 'TXN-COMP-001',
    invoiceNumber: 'INV-ADM-2026-001',
    projectName: 'Mobile Banking App',
    clientName: 'Rajesh Sharma',
    freelancerName: 'Aarav Desai',
    amount: 145000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 88,
    notes: 'Milestone 1: Clean architecture, Redux Toolkit, and JWT authentication modules.',
  },
  {
    transactionId: 'TXN-COMP-002',
    invoiceNumber: 'INV-ADM-2026-002',
    projectName: 'WorkStation Marketplace',
    clientName: 'Priya Patel',
    freelancerName: 'Rohan Kulkarni',
    amount: 185000,
    paymentMethod: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 82,
    notes: 'Full stack marketplace deployment on AWS with Redis cache.',
  },
  {
    transactionId: 'TXN-COMP-003',
    invoiceNumber: 'INV-ADM-2026-003',
    projectName: 'E-commerce Platform',
    clientName: 'Sneha Gupta',
    freelancerName: 'Ananya Mishra',
    amount: 95000,
    paymentMethod: 'Net Banking',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 79,
    notes: 'Automated checkout with Razorpay webhook synchronization.',
  },
  {
    transactionId: 'TXN-COMP-004',
    invoiceNumber: 'INV-ADM-2026-004',
    projectName: 'Portfolio CMS',
    clientName: 'Deepa Iyer',
    freelancerName: 'Ishita Sharma',
    amount: 32000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 75,
    notes: 'Responsive Next.js portfolio with Sanity.io CMS.',
  },
  {
    transactionId: 'TXN-COMP-005',
    invoiceNumber: 'INV-ADM-2026-005',
    projectName: 'CRM Dashboard',
    clientName: 'Amit Joshi',
    freelancerName: 'Kunal Bhatia',
    amount: 120000,
    paymentMethod: 'Debit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 71,
    notes: 'Lead tracking Kanban, Recharts data visualization, and role permissions.',
  },
  {
    transactionId: 'TXN-COMP-006',
    invoiceNumber: 'INV-ADM-2026-006',
    projectName: 'Society Management System',
    clientName: 'Sanjay Pillai',
    freelancerName: 'Aditya Roy',
    amount: 78000,
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 68,
    notes: 'Resident visitor logs, maintenance billing, and WhatsApp alerts.',
  },
  {
    transactionId: 'TXN-COMP-007',
    invoiceNumber: 'INV-ADM-2026-007',
    projectName: 'AI Chat Assistant',
    clientName: 'Aditya Chauhan',
    freelancerName: 'Sakshi Rawat',
    amount: 160000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 64,
    notes: 'OpenAI embeddings, Pinecone vector search, and streaming tokens.',
  },
  {
    transactionId: 'TXN-COMP-008',
    invoiceNumber: 'INV-ADM-2026-008',
    projectName: 'DigitalDine',
    clientName: 'Ananya Reddy',
    freelancerName: 'Pranav Menon',
    amount: 54000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 60,
    notes: 'Contactless QR digital menu and kitchen order ticket printing.',
  },
  {
    transactionId: 'TXN-COMP-009',
    invoiceNumber: 'INV-ADM-2026-009',
    projectName: 'Event Booking Platform',
    clientName: 'Rohit Mehta',
    freelancerName: 'Priyanka Jain',
    amount: 88000,
    paymentMethod: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 57,
    notes: 'Seat selection grid, barcode ticket generation, and refund worker.',
  },
  {
    transactionId: 'TXN-COMP-010',
    invoiceNumber: 'INV-ADM-2026-010',
    projectName: 'Healthcare Telemedicine App',
    clientName: 'Kavita Nair',
    freelancerName: 'Sanjay Singh',
    amount: 135000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 53,
    notes: 'Encrypted WebRTC consultation room and digital Rx generator.',
  },
  {
    transactionId: 'TXN-COMP-011',
    invoiceNumber: 'INV-ADM-2026-011',
    projectName: 'B2B Logistics Freight Tracker',
    clientName: 'Vikram Malhotra',
    freelancerName: 'Neha Verma',
    amount: 110000,
    paymentMethod: 'Net Banking',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 49,
    notes: 'GPS vehicle telematics and automated dispatch scheduler.',
  },
  {
    transactionId: 'TXN-COMP-012',
    invoiceNumber: 'INV-ADM-2026-012',
    projectName: 'EdTech Learning Management Portal',
    clientName: 'Pooja Agarwal',
    freelancerName: 'Tanvi Shah',
    amount: 65000,
    paymentMethod: 'Debit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 46,
    notes: 'Interactive quiz assessments, certificates, and video streaming.',
  },
  {
    transactionId: 'TXN-COMP-013',
    invoiceNumber: 'INV-ADM-2026-013',
    projectName: 'Real Estate Virtual Tours & 3D',
    clientName: 'Manish Tiwari',
    freelancerName: 'Aarav Desai',
    amount: 72000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 43,
    notes: 'Three.js panoramic walkthroughs with high-res asset loading.',
  },
  {
    transactionId: 'TXN-COMP-014',
    invoiceNumber: 'INV-ADM-2026-014',
    projectName: 'FinTech Algorithmic Trading Bot',
    clientName: 'Nitin Gadkari',
    freelancerName: 'Rohan Kulkarni',
    amount: 175000,
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 39,
    notes: 'WebSocket tick streams, RSI strategy backtesting, and automated risk orders.',
  },
  {
    transactionId: 'TXN-COMP-015',
    invoiceNumber: 'INV-ADM-2026-015',
    projectName: 'Restaurant Supply Chain System',
    clientName: 'Divya Kapoor',
    freelancerName: 'Ishita Sharma',
    amount: 48000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 36,
    notes: 'Perishable stock alerts, batch expiry warnings, and supplier POs.',
  },
  {
    transactionId: 'TXN-COMP-016',
    invoiceNumber: 'INV-ADM-2026-016',
    projectName: 'AI Resume Screener & ATS',
    clientName: 'Karan Mehra',
    freelancerName: 'Sakshi Rawat',
    amount: 82000,
    paymentMethod: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 32,
    notes: 'PDF text extraction, semantic matching, and applicant ranking.',
  },
  {
    transactionId: 'TXN-COMP-017',
    invoiceNumber: 'INV-ADM-2026-017',
    projectName: 'DevOps Kubernetes Automation',
    clientName: 'Suresh Raina',
    freelancerName: 'Aditya Roy',
    amount: 125000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 28,
    notes: 'Multi-cluster ArgoCD deployment, cert-manager, and Prometheus grafana stack.',
  },
  {
    transactionId: 'TXN-COMP-018',
    invoiceNumber: 'INV-ADM-2026-018',
    projectName: 'Crypto Portfolio Tracker',
    clientName: 'Gaurav Sen',
    freelancerName: 'Pranav Menon',
    amount: 39000,
    paymentMethod: 'Wallet',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 25,
    notes: 'CoinGecko sync, tax PnL calculations, and ledger exports.',
  },
  {
    transactionId: 'TXN-COMP-019',
    invoiceNumber: 'INV-ADM-2026-019',
    projectName: 'Fitness Tracking & Wearable Sync',
    clientName: 'Meera Nambiar',
    freelancerName: 'Ananya Mishra',
    amount: 62000,
    paymentMethod: 'Debit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 21,
    notes: 'Apple HealthKit and Google Fit BLE sensor synchronization.',
  },
  {
    transactionId: 'TXN-COMP-020',
    invoiceNumber: 'INV-ADM-2026-020',
    projectName: 'Legal Document Automation CMS',
    clientName: 'Harsh Vardhan',
    freelancerName: 'Kunal Bhatia',
    amount: 92000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 18,
    notes: 'DocuSign API webhook integration and tamper-proof PDF hashing.',
  },
  {
    transactionId: 'TXN-COMP-021',
    invoiceNumber: 'INV-ADM-2026-021',
    projectName: 'Micro-SaaS Billing Engine',
    clientName: 'Alok Nath',
    freelancerName: 'Aarav Desai',
    amount: 58000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 14,
    notes: 'Metered usage calculation, tier upgrades, and automated invoices.',
  },
  {
    transactionId: 'TXN-COMP-022',
    invoiceNumber: 'INV-ADM-2026-022',
    projectName: 'IoT Smart Energy Dashboard',
    clientName: 'Sunil Chetri',
    freelancerName: 'Rohan Kulkarni',
    amount: 115000,
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 11,
    notes: 'MQTT broker setup, telemetry time-series charts, and peak load alerts.',
  },
  {
    transactionId: 'TXN-COMP-023',
    invoiceNumber: 'INV-ADM-2026-023',
    projectName: 'Hospital Management Suite',
    clientName: 'Preeti Deshmukh',
    freelancerName: 'Tanvi Shah',
    amount: 86000,
    paymentMethod: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 8,
    notes: 'OPD queue management, bed occupancy matrix, and pharmacy inventory.',
  },
  {
    transactionId: 'TXN-COMP-024',
    invoiceNumber: 'INV-ADM-2026-024',
    projectName: 'Video Streaming CDN Pipeline',
    clientName: 'Kishore Kumar',
    freelancerName: 'Aditya Roy',
    amount: 140000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 5,
    notes: 'FFmpeg HLS transcoding, CloudFront signed cookies, and adaptive bitrate.',
  },
  {
    transactionId: 'TXN-COMP-025',
    invoiceNumber: 'INV-ADM-2026-025',
    projectName: 'HR Attendance & Payroll Portal',
    clientName: 'Swati Sen',
    freelancerName: 'Priyanka Jain',
    amount: 45000,
    paymentMethod: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    payoutStatus: 'completed',
    daysAgo: 2,
    notes: 'Biometric device sync, PF/ESI deductions, and payslip dispatch.',
  },

  // ── 5 PENDING PAYMENTS ──
  {
    transactionId: 'TXN-PEND-001',
    invoiceNumber: 'INV-ADM-2026-026',
    projectName: 'Mobile Banking App',
    clientName: 'Rajesh Sharma',
    freelancerName: 'Aarav Desai',
    amount: 55000,
    paymentMethod: 'UPI',
    status: 'pending',
    escrowStatus: 'held',
    payoutStatus: 'pending',
    daysAgo: 4,
    notes: 'Milestone 2: Biometric login and push notification service awaiting review.',
  },
  {
    transactionId: 'TXN-PEND-002',
    invoiceNumber: 'INV-ADM-2026-027',
    projectName: 'E-commerce Platform',
    clientName: 'Sneha Gupta',
    freelancerName: 'Ananya Mishra',
    amount: 42000,
    paymentMethod: 'Credit Card',
    status: 'pending',
    escrowStatus: 'held',
    payoutStatus: 'pending',
    daysAgo: 3,
    notes: 'Vendor settlement ledger and monthly invoice consolidation.',
  },
  {
    transactionId: 'TXN-PEND-003',
    invoiceNumber: 'INV-ADM-2026-028',
    projectName: 'CRM Dashboard',
    clientName: 'Amit Joshi',
    freelancerName: 'Kunal Bhatia',
    amount: 38000,
    paymentMethod: 'Debit Card',
    status: 'pending',
    escrowStatus: 'held',
    payoutStatus: 'pending',
    daysAgo: 2,
    notes: 'Custom CSV export module and contact deduplication scripts.',
  },
  {
    transactionId: 'TXN-PEND-004',
    invoiceNumber: 'INV-ADM-2026-029',
    projectName: 'AI Chat Assistant',
    clientName: 'Aditya Chauhan',
    freelancerName: 'Sakshi Rawat',
    amount: 70000,
    paymentMethod: 'UPI',
    status: 'pending',
    escrowStatus: 'held',
    payoutStatus: 'pending',
    daysAgo: 1,
    notes: 'Fine-tuned LLM model deployment on AWS SageMaker.',
  },
  {
    transactionId: 'TXN-PEND-005',
    invoiceNumber: 'INV-ADM-2026-030',
    projectName: 'DigitalDine',
    clientName: 'Ananya Reddy',
    freelancerName: 'Pranav Menon',
    amount: 25000,
    paymentMethod: 'Wallet',
    status: 'pending',
    escrowStatus: 'held',
    payoutStatus: 'pending',
    daysAgo: 0,
    notes: 'Kitchen display screen dark mode styling and thermal printer driver.',
  },

  // ── 3 FAILED PAYMENTS ──
  {
    transactionId: 'TXN-FAIL-001',
    invoiceNumber: 'INV-ADM-2026-031',
    projectName: 'Event Booking Platform',
    clientName: 'Rohit Mehta',
    freelancerName: 'Priyanka Jain',
    amount: 35000,
    paymentMethod: 'Credit Card',
    status: 'failed',
    escrowStatus: 'pending',
    payoutStatus: 'failed',
    daysAgo: 15,
    notes: 'Transaction declined by issuer: Card limit exceeded during 3D Secure step.',
  },
  {
    transactionId: 'TXN-FAIL-002',
    invoiceNumber: 'INV-ADM-2026-032',
    projectName: 'Real Estate Virtual Tours & 3D',
    clientName: 'Manish Tiwari',
    freelancerName: 'Aarav Desai',
    amount: 28000,
    paymentMethod: 'Net Banking',
    status: 'failed',
    escrowStatus: 'pending',
    payoutStatus: 'failed',
    daysAgo: 9,
    notes: 'Bank gateway timeout: Session expired before OTP verification.',
  },
  {
    transactionId: 'TXN-FAIL-003',
    invoiceNumber: 'INV-ADM-2026-033',
    projectName: 'DevOps Kubernetes Automation',
    clientName: 'Suresh Raina',
    freelancerName: 'Aditya Roy',
    amount: 45000,
    paymentMethod: 'UPI',
    status: 'failed',
    escrowStatus: 'pending',
    payoutStatus: 'failed',
    daysAgo: 3,
    notes: 'UPI Collect request expired after 15 minutes window.',
  },

  // ── 4 REFUNDED / REFUND CASE PAYMENTS ──
  {
    transactionId: 'TXN-RFND-001',
    invoiceNumber: 'INV-ADM-2026-034',
    projectName: 'FinTech Mobile Wallet & QR Scanner',
    clientName: 'Ananya Reddy',
    freelancerName: 'Pranav Menon',
    amount: 32000,
    paymentMethod: 'UPI',
    status: 'refunded',
    escrowStatus: 'refunded',
    payoutStatus: 'failed',
    daysAgo: 24,
    notes: 'Escrow refunded: Project requirements changed mutually prior to development.',
    refundDetails: {
      status: 'completed',
      amount: 32000,
      reason: 'Mutual contract cancellation prior to code delivery',
      requestedAt: getDaysAgo(26),
      processedAt: getDaysAgo(24),
      processedBy: 'Admin Escrow Desk',
      notes: 'Full ₹32,000 returned to client UPI handle.',
    },
  },
  {
    transactionId: 'TXN-RFND-002',
    invoiceNumber: 'INV-ADM-2026-035',
    projectName: 'SaaS Design System & Figma UI Kit',
    clientName: 'Rohit Mehta',
    freelancerName: 'Priyanka Jain',
    amount: 18000,
    paymentMethod: 'Credit Card',
    status: 'refunded',
    escrowStatus: 'refunded',
    payoutStatus: 'failed',
    daysAgo: 17,
    notes: 'Client cancelled duplicate escrow funding order.',
    refundDetails: {
      status: 'completed',
      amount: 18000,
      reason: 'Duplicate milestone funding transaction',
      requestedAt: getDaysAgo(18),
      processedAt: getDaysAgo(17),
      processedBy: 'Admin System',
      notes: 'Automated reverse credit to original card.',
    },
  },
  {
    transactionId: 'TXN-RFND-003',
    invoiceNumber: 'INV-ADM-2026-036',
    projectName: 'Content Writing & SEO Blog Posts',
    clientName: 'Priya Patel',
    freelancerName: 'Sakshi Rawat',
    amount: 12000,
    paymentMethod: 'Debit Card',
    status: 'processing',
    escrowStatus: 'held',
    payoutStatus: 'held',
    daysAgo: 7,
    notes: 'Client requested refund due to delivery date miss.',
    refundDetails: {
      status: 'under_review',
      amount: 12000,
      reason: 'Freelancer missed final milestone deadline by 10 days',
      requestedAt: getDaysAgo(8),
      processedBy: 'Admin Arbitrator',
      notes: 'Freelancer given 48 hours to submit draft before refund execution.',
    },
  },
  {
    transactionId: 'TXN-RFND-004',
    invoiceNumber: 'INV-ADM-2026-037',
    projectName: 'WebRTC Video Conferencing Demo',
    clientName: 'Kavita Nair',
    freelancerName: 'Sanjay Singh',
    amount: 24000,
    paymentMethod: 'UPI',
    status: 'processing',
    escrowStatus: 'held',
    payoutStatus: 'held',
    daysAgo: 3,
    notes: 'Refund approved by admin; disbursement queued.',
    refundDetails: {
      status: 'approved',
      amount: 24000,
      reason: 'Agreed 100% refund after mediation meeting',
      requestedAt: getDaysAgo(5),
      processedAt: getDaysAgo(3),
      processedBy: 'Admin Lead',
      notes: 'Scheduled for next settlement cycle.',
    },
  },

  // ── 3 ACTIVE DISPUTES ──
  {
    transactionId: 'TXN-DISP-001',
    invoiceNumber: 'INV-ADM-2026-038',
    projectName: 'Society Management System',
    clientName: 'Sanjay Pillai',
    freelancerName: 'Aditya Roy',
    amount: 48000,
    paymentMethod: 'Bank Transfer',
    status: 'disputed',
    escrowStatus: 'disputed',
    payoutStatus: 'held',
    daysAgo: 12,
    notes: 'Dispute filed by client: Missing tenant access control modules in delivered APK.',
    disputeDetails: {
      status: 'investigating',
      reason: 'Delivered build crashes on iOS 17 and missing QR visitor module',
      claimant: 'Sanjay Pillai (Client)',
      evidence: 'Crash logs and screenshot comparisons against initial Figma specification submitted.',
      openedAt: getDaysAgo(12),
      outcome: 'pending',
    },
  },
  {
    transactionId: 'TXN-DISP-002',
    invoiceNumber: 'INV-ADM-2026-039',
    projectName: 'Portfolio CMS',
    clientName: 'Deepa Iyer',
    freelancerName: 'Ishita Sharma',
    amount: 22000,
    paymentMethod: 'UPI',
    status: 'disputed',
    escrowStatus: 'disputed',
    payoutStatus: 'held',
    daysAgo: 6,
    notes: 'Dispute filed by freelancer: Client unresponsive for 14 days after code handoff.',
    disputeDetails: {
      status: 'open',
      reason: 'Client refuses to release completed milestone without scope-creep revisions',
      claimant: 'Ishita Sharma (Freelancer)',
      evidence: 'GitHub PR merge logs and agreed contract scope document uploaded.',
      openedAt: getDaysAgo(6),
      outcome: 'pending',
    },
  },
  {
    transactionId: 'TXN-DISP-003',
    invoiceNumber: 'INV-ADM-2026-040',
    projectName: 'Healthcare Telemedicine App',
    clientName: 'Kavita Nair',
    freelancerName: 'Sanjay Singh',
    amount: 75000,
    paymentMethod: 'Credit Card',
    status: 'disputed',
    escrowStatus: 'disputed',
    payoutStatus: 'held',
    daysAgo: 4,
    notes: 'Dispute under formal arbitration: Milestone code audit requested.',
    disputeDetails: {
      status: 'investigating',
      reason: 'Dispute over WebRTC latency and backend server cost allocation',
      claimant: 'Kavita Nair (Client)',
      evidence: 'Load testing benchmark reports showing 1400ms latency spikes.',
      openedAt: getDaysAgo(4),
      outcome: 'pending',
    },
  },
];

export async function seedAdminPayments() {
  console.log('Connecting to MongoDB for Admin Payments Seeding...');
  await mongoose.connect(MONGO_URI);

  // Fetch reference users to ensure valid ObjectIds
  const users = await User.find({ isDeleted: { $ne: true } }).lean();
  const userMap = new Map();
  users.forEach((u) => {
    userMap.set(u.name?.toLowerCase(), u);
    userMap.set(u.email?.toLowerCase(), u);
  });

  const fallbackAdmin = users.find((u) => u.role === 'admin') || users[0];
  const fallbackClient = users.find((u) => u.role === 'client') || users[1] || users[0];
  const fallbackFreelancer = users.find((u) => u.role === 'freelancer') || users[2] || users[0];

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of ADMIN_PAYMENTS_SEED) {
    const createdDate = getDaysAgo(item.daysAgo);
    const amount = item.amount;
    const platformFee = Math.round(amount * 0.1);
    const netPayout = amount - platformFee;
    const gst = Math.round(platformFee * 0.18);

    const payer = userMap.get(item.clientName.toLowerCase()) || fallbackClient;
    const recipient = userMap.get(item.freelancerName.toLowerCase()) || fallbackFreelancer;

    const timeline = [
      {
        stage: 'Escrow Initiated',
        description: `Client deposited ₹${amount.toLocaleString('en-IN')} into WorkStation Nodal Escrow via ${item.paymentMethod}`,
        timestamp: createdDate,
        user: item.clientName,
      },
    ];

    if (item.status === 'completed') {
      timeline.push({
        stage: 'Milestone Verified',
        description: `Deliverables approved. ₹${netPayout.toLocaleString('en-IN')} disbursed to freelancer; ₹${platformFee.toLocaleString('en-IN')} platform fee retained.`,
        timestamp: new Date(createdDate.getTime() + 86400000 * 2),
        user: 'WorkStation Trustee',
      });
    } else if (item.status === 'failed') {
      timeline.push({
        stage: 'Payment Failed',
        description: item.notes,
        timestamp: createdDate,
        user: 'Payment Gateway',
      });
    } else if (item.status === 'refunded') {
      timeline.push({
        stage: 'Refund Executed',
        description: item.refundDetails?.notes || 'Escrow refund processed back to payer source.',
        timestamp: item.refundDetails?.processedAt || new Date(createdDate.getTime() + 86400000 * 2),
        user: item.refundDetails?.processedBy || 'Admin Desk',
      });
    } else if (item.status === 'disputed') {
      timeline.push({
        stage: 'Dispute Registered',
        description: item.disputeDetails?.reason || 'Escrow frozen pending evidence review.',
        timestamp: item.disputeDetails?.openedAt || createdDate,
        user: item.disputeDetails?.claimant || 'Claimant',
      });
    }

    const payload = {
      payer: payer?._id,
      recipient: recipient?._id,
      clientName: item.clientName,
      freelancerName: item.freelancerName,
      projectName: item.projectName,
      transactionId: item.transactionId,
      invoiceId: item.invoiceNumber,
      invoiceNumber: item.invoiceNumber,
      amount,
      platformFee,
      gst,
      netAmount: amount,
      netPayout,
      currency: 'INR',
      paymentMethod: item.paymentMethod,
      escrowStatus: item.escrowStatus,
      status: item.status,
      payoutStatus: item.payoutStatus,
      paidAt: item.status === 'completed' ? new Date(createdDate.getTime() + 86400000 * 2) : undefined,
      payoutDate: item.status === 'completed' ? new Date(createdDate.getTime() + 86400000 * 2) : undefined,
      notes: item.notes,
      refundDetails: item.refundDetails || { status: 'none' },
      disputeDetails: item.disputeDetails || { status: 'none' },
      timeline,
      createdAt: createdDate,
      updatedAt: createdDate,
    };

    const existing = await Payment.findOne({ $or: [{ transactionId: item.transactionId }, { invoiceNumber: item.invoiceNumber }] });
    if (existing) {
      await Payment.updateOne({ transactionId: item.transactionId }, { $set: payload });
      updatedCount++;
    } else {
      await Payment.create(payload);
      createdCount++;
    }
  }

  // Summary calculation
  const allPayments = await Payment.find().lean();
  const summary = {
    total: allPayments.length,
    completed: allPayments.filter(p => p.status === 'completed' || p.status === 'succeeded').length,
    pending: allPayments.filter(p => p.status === 'pending').length,
    processing: allPayments.filter(p => p.status === 'processing').length,
    failed: allPayments.filter(p => p.status === 'failed').length,
    refunded: allPayments.filter(p => p.status === 'refunded').length,
    disputed: allPayments.filter(p => p.status === 'disputed').length,
    grossVolume: allPayments.filter(p => p.status === 'completed' || p.status === 'succeeded').reduce((acc, p) => acc + (p.amount || 0), 0),
    platformFee: allPayments.filter(p => p.status === 'completed' || p.status === 'succeeded').reduce((acc, p) => acc + (p.platformFee || 0), 0),
  };

  console.log('======================================================');
  console.log('         ADMIN PAYMENTS SEEDING COMPLETE              ');
  console.log('======================================================');
  console.log(`Created:          ${createdCount}`);
  console.log(`Updated:          ${updatedCount}`);
  console.log(`Total in DB:      ${summary.total}`);
  console.log(`Completed:        ${summary.completed}`);
  console.log(`Pending:          ${summary.pending}`);
  console.log(`Processing:       ${summary.processing}`);
  console.log(`Failed:           ${summary.failed}`);
  console.log(`Refunded:         ${summary.refunded}`);
  console.log(`Disputed:         ${summary.disputed}`);
  console.log(`Gross Volume:     ₹${summary.grossVolume.toLocaleString('en-IN')}`);
  console.log(`Platform Revenue: ₹${summary.platformFee.toLocaleString('en-IN')}`);
  console.log('======================================================');

  await mongoose.disconnect();
}

seedAdminPayments().catch((err) => {
  console.error('Fatal seedAdminPayments error:', err);
  process.exit(1);
});
