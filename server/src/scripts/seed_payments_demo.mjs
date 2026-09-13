/**
 * seed_payments_demo.mjs
 *
 * Seeds exactly 32 realistic fintech payment records into MongoDB.
 * Distribution:
 * - 18 Completed
 * - 6 Pending
 * - 4 Processing
 * - 2 Disputed
 * - 2 Refunded
 *
 * Run: node src/scripts/seed_payments_demo.mjs
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';

// ── Helpers ──────────────────────────────────────────────────────────────────
const daysAgo = (n, hourOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.max(0, Math.min(23, 10 + hourOffset)));
  d.setMinutes(Math.floor(Math.random() * 50) + 5);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

// ── 32 Payment Records Specification ─────────────────────────────────────────
const RAW_PAYMENTS = [
  // ── 18 COMPLETED PAYMENTS ──────────────────────────────────────────────────
  {
    txn: 1001,
    inv: 1,
    project: 'CRM Dashboard',
    client: 'Rahul Verma',
    freelancer: 'Arjun Patel',
    amount: 45000,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 52,
    daysAgoPaid: 49,
    notes: 'Milestone 1: Backend architecture & database indexing delivered and approved.',
  },
  {
    txn: 1002,
    inv: 2,
    project: 'Mobile Banking App',
    client: 'Deepa Iyer',
    freelancer: 'Ananya Sharma',
    amount: 82000,
    method: 'Razorpay',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 48,
    daysAgoPaid: 45,
    notes: 'Milestone 2: Biometric authentication and multi-factor security flow.',
  },
  {
    txn: 1003,
    inv: 3,
    project: 'WorkStation Marketplace',
    client: 'Priya Kapoor',
    freelancer: 'Rahul Mehta',
    amount: 120000,
    method: 'Bank Transfer',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 45,
    daysAgoPaid: 42,
    notes: 'Milestone 3: Escrow release after contract digital signature verification.',
  },
  {
    txn: 1004,
    inv: 4,
    project: 'E-commerce Platform',
    client: 'Vikram Aditya',
    freelancer: 'Sneha Gupta',
    amount: 25000,
    method: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 42,
    daysAgoPaid: 39,
    notes: 'Milestone 1: Multi-vendor catalog filtering & cart checkout pipeline.',
  },
  {
    txn: 1005,
    inv: 5,
    project: 'Portfolio CMS',
    client: 'Karan Mehta',
    freelancer: 'Neha Patel',
    amount: 18500,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 38,
    daysAgoPaid: 35,
    notes: 'Milestone 1: Responsive design system & dark mode accessibility standards.',
  },
  {
    txn: 1006,
    inv: 6,
    project: 'Society Management System',
    client: 'Neha Singh',
    freelancer: 'Aman Joshi',
    amount: 45000,
    method: 'Net Banking',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 35,
    daysAgoPaid: 32,
    notes: 'Milestone 2: Resident maintenance fee automated billing gateway integration.',
  },
  {
    txn: 1007,
    inv: 7,
    project: 'AI Chat Assistant',
    client: 'Deepa Iyer',
    freelancer: 'Kavya Jain',
    amount: 82000,
    method: 'Razorpay',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 32,
    daysAgoPaid: 29,
    notes: 'Milestone 3: LLM prompt streaming & WebSocket recovery module.',
  },
  {
    txn: 1008,
    inv: 8,
    project: 'Event Booking Platform',
    client: 'Rahul Verma',
    freelancer: 'Arjun Patel',
    amount: 12000,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 30,
    daysAgoPaid: 28,
    notes: 'Milestone 1: Seat map reservation & ticket QR code generator.',
  },
  {
    txn: 1009,
    inv: 9,
    project: 'DigitalDine',
    client: 'Priya Kapoor',
    freelancer: 'Sneha Gupta',
    amount: 8200,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 27,
    daysAgoPaid: 25,
    notes: 'Milestone 1: Digital restaurant menu touch UI and order dispatch queue.',
  },
  {
    txn: 1010,
    inv: 10,
    project: 'WorkStation Marketplace',
    client: 'Vikram Aditya',
    freelancer: 'Rahul Mehta',
    amount: 25000,
    method: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 24,
    daysAgoPaid: 22,
    notes: 'Milestone 2: Analytics conversion funnel & contractor rating system.',
  },
  {
    txn: 1011,
    inv: 11,
    project: 'CRM Dashboard',
    client: 'Karan Mehta',
    freelancer: 'Ananya Sharma',
    amount: 45000,
    method: 'Bank Transfer',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 22,
    daysAgoPaid: 20,
    notes: 'Milestone 2: Multi-tenant permission management and audit trail logs.',
  },
  {
    txn: 1012,
    inv: 12,
    project: 'Mobile Banking App',
    client: 'Neha Singh',
    freelancer: 'Arjun Patel',
    amount: 120000,
    method: 'Net Banking',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 19,
    daysAgoPaid: 17,
    notes: 'Milestone 3: Core UPI transaction pipeline and compliance reports.',
  },
  {
    txn: 1013,
    inv: 13,
    project: 'E-commerce Platform',
    client: 'Deepa Iyer',
    freelancer: 'Sneha Gupta',
    amount: 18500,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 17,
    daysAgoPaid: 15,
    notes: 'Milestone 2: Abandoned cart automated email reminders & coupon engine.',
  },
  {
    txn: 1015,
    inv: 15,
    project: 'Portfolio CMS',
    client: 'Rahul Verma',
    freelancer: 'Neha Patel',
    amount: 4500,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 14,
    daysAgoPaid: 12,
    notes: 'Milestone 2: Custom domain DNS mapping and SSL automation.',
  },
  {
    txn: 1016,
    inv: 16,
    project: 'Society Management System',
    client: 'Priya Kapoor',
    freelancer: 'Aman Joshi',
    amount: 25000,
    method: 'Razorpay',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 12,
    daysAgoPaid: 10,
    notes: 'Milestone 3: Visitor gate pass QR generation and SMS OTP dispatch.',
  },
  {
    txn: 1017,
    inv: 17,
    project: 'AI Chat Assistant',
    client: 'Vikram Aditya',
    freelancer: 'Kavya Jain',
    amount: 45000,
    method: 'Bank Transfer',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 10,
    daysAgoPaid: 8,
    notes: 'Milestone 2: Vector embedding search on client PDF documents.',
  },
  {
    txn: 1018,
    inv: 18,
    project: 'Event Booking Platform',
    client: 'Karan Mehta',
    freelancer: 'Arjun Patel',
    amount: 82000,
    method: 'Credit Card',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 8,
    daysAgoPaid: 6,
    notes: 'Milestone 2: Live ticket inventory sync across concurrent checkouts.',
  },
  {
    txn: 1019,
    inv: 19,
    project: 'DigitalDine',
    client: 'Neha Singh',
    freelancer: 'Sneha Gupta',
    amount: 12000,
    method: 'UPI',
    status: 'completed',
    escrowStatus: 'released',
    daysAgoSubmitted: 5,
    daysAgoPaid: 3,
    notes: 'Milestone 2: Kitchen display system WebSocket real-time updates.',
  },

  // ── 6 PENDING PAYMENTS ──────────────────────────────────────────────────────
  {
    txn: 1020,
    inv: 20,
    project: 'CRM Dashboard',
    client: 'Rahul Verma',
    freelancer: 'Arjun Patel',
    amount: 45000,
    method: 'UPI',
    status: 'pending',
    escrowStatus: 'held',
    daysAgoSubmitted: 3,
    notes: 'Milestone 3: Client reviewing custom lead export and pipeline reports.',
  },
  {
    txn: 1021,
    inv: 21,
    project: 'Mobile Banking App',
    client: 'Deepa Iyer',
    freelancer: 'Ananya Sharma',
    amount: 82000,
    method: 'Bank Transfer',
    status: 'pending',
    escrowStatus: 'held',
    daysAgoSubmitted: 4,
    notes: 'Milestone 4: Security penetration testing and compliance sign-off.',
  },
  {
    txn: 1022,
    inv: 22,
    project: 'WorkStation Marketplace',
    client: 'Priya Kapoor',
    freelancer: 'Rahul Mehta',
    amount: 25000,
    method: 'Credit Card',
    status: 'pending',
    escrowStatus: 'held',
    daysAgoSubmitted: 2,
    notes: 'Milestone 3: Proposal conversion tracking enhancements.',
  },
  {
    txn: 1023,
    inv: 23,
    project: 'E-commerce Platform',
    client: 'Vikram Aditya',
    freelancer: 'Sneha Gupta',
    amount: 18500,
    method: 'Razorpay',
    status: 'pending',
    escrowStatus: 'held',
    daysAgoSubmitted: 5,
    notes: 'Milestone 3: Multi-warehouse stock tracking inventory module.',
  },
  {
    txn: 1024,
    inv: 24,
    project: 'Portfolio CMS',
    client: 'Karan Mehta',
    freelancer: 'Neha Patel',
    amount: 8200,
    method: 'UPI',
    status: 'pending',
    escrowStatus: 'held',
    daysAgoSubmitted: 1,
    notes: 'Milestone 2: Image optimization pipeline and lazy loading.',
  },
  {
    txn: 1025,
    inv: 25,
    project: 'Society Management System',
    client: 'Neha Singh',
    freelancer: 'Aman Joshi',
    amount: 12000,
    method: 'Net Banking',
    status: 'pending',
    escrowStatus: 'held',
    daysAgoSubmitted: 2,
    notes: 'Milestone 4: Clubhouse amenity booking calendar and waitlist.',
  },

  // ── 4 PROCESSING PAYMENTS ───────────────────────────────────────────────────
  {
    txn: 1026,
    inv: 26,
    project: 'AI Chat Assistant',
    client: 'Deepa Iyer',
    freelancer: 'Kavya Jain',
    amount: 45000,
    method: 'Bank Transfer',
    status: 'processing',
    escrowStatus: 'held',
    daysAgoSubmitted: 2,
    notes: 'Escrow release authorized; Automated NEFT bank clearing in progress.',
  },
  {
    txn: 1028,
    inv: 28,
    project: 'Event Booking Platform',
    client: 'Rahul Verma',
    freelancer: 'Arjun Patel',
    amount: 25000,
    method: 'Razorpay',
    status: 'processing',
    escrowStatus: 'held',
    daysAgoSubmitted: 1,
    notes: 'Client approved milestone; Payment gateway batch payout processing.',
  },
  {
    txn: 1029,
    inv: 29,
    project: 'DigitalDine',
    client: 'Priya Kapoor',
    freelancer: 'Sneha Gupta',
    amount: 18500,
    method: 'UPI',
    status: 'processing',
    escrowStatus: 'held',
    daysAgoSubmitted: 1,
    notes: 'Instant UPI payout queued with partner nodal bank.',
  },
  {
    txn: 1030,
    inv: 30,
    project: 'WorkStation Marketplace',
    client: 'Karan Mehta',
    freelancer: 'Rahul Mehta',
    amount: 120000,
    method: 'Bank Transfer',
    status: 'processing',
    escrowStatus: 'held',
    daysAgoSubmitted: 2,
    notes: 'RTGS clearance in progress for enterprise deliverable release.',
  },

  // ── 2 DISPUTED PAYMENTS ────────────────────────────────────────────────────
  {
    txn: 1014,
    inv: 14,
    project: 'E-commerce Platform',
    client: 'Priya Kapoor',
    freelancer: 'Arjun Patel',
    amount: 82000,
    method: 'Credit Card',
    status: 'disputed',
    escrowStatus: 'disputed',
    daysAgoSubmitted: 15,
    notes: 'Dispute opened: Chargeback claim on multi-vendor cart checkout flow.',
    disputeDetails: {
      reason: 'Chargeback claim on multi-vendor cart checkout flow',
      claimant: 'Priya Kapoor',
      evidence: 'Cardholder filed dispute citing unauthorized merchant charge; gateway placed nodal hold.',
      openedAt: daysAgo(3),
      status: 'Under Investigation',
      resolutionNotes: 'Gateway compliance team requested settlement proof and delivery sign-off.',
    },
  },
  {
    txn: 1027,
    inv: 27,
    project: 'CRM Dashboard',
    client: 'Vikram Aditya',
    freelancer: 'Sneha Gupta',
    amount: 45000,
    method: 'Bank Transfer',
    status: 'disputed',
    escrowStatus: 'disputed',
    daysAgoSubmitted: 7,
    notes: 'Dispute opened: Milestone deliverable disagreement on analytics export feature.',
    disputeDetails: {
      reason: 'Milestone deliverable disagreement on analytics export feature',
      claimant: 'Vikram Aditya',
      evidence: 'Client claims exported CSV lacks custom date filters; freelancer submitted GitHub commit log.',
      openedAt: daysAgo(5),
      status: 'Mediation In Progress',
      resolutionNotes: 'Arbitrator reviewing GitHub pull request #142 commit history.',
    },
  },

  // ── 2 REFUNDED PAYMENTS ────────────────────────────────────────────────────
  {
    txn: 1031,
    inv: 31,
    project: 'Mobile Banking App',
    client: 'Neha Singh',
    freelancer: 'Ananya Sharma',
    amount: 25000,
    method: 'Credit Card',
    status: 'refunded',
    escrowStatus: 'refunded',
    daysAgoSubmitted: 26,
    daysAgoPaid: 24,
    notes: 'Mutual contract cancellation refund issued back to source credit card.',
  },
  {
    txn: 1032,
    inv: 32,
    project: 'Portfolio CMS',
    client: 'Vikram Aditya',
    freelancer: 'Neha Patel',
    amount: 12000,
    method: 'UPI',
    status: 'refunded',
    escrowStatus: 'refunded',
    daysAgoSubmitted: 18,
    daysAgoPaid: 16,
    notes: 'Project scope discontinued by mutual agreement; 100% escrow refunded.',
  },
];

// ── Main Seeder ──────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  // Fetch users to link payer / recipient
  const users = await User.find({}, 'name email role').lean();
  const findUser = (name) => users.find((u) => u.name?.toLowerCase() === name?.toLowerCase());

  console.log('\n--- Seeding 32 Admin Payments Dataset ---');

  // Remove previous demo payments if they exist with PAY- pattern so we have clean, exact 32 records
  const deleteResult = await Payment.deleteMany({ transactionId: { $regex: '^PAY-' } });
  if (deleteResult.deletedCount > 0) {
    console.log(`Cleaned up ${deleteResult.deletedCount} previous PAY- demo payments.`);
  }

  let createdCount = 0;

  for (const item of RAW_PAYMENTS) {
    const platformFee = Math.round(item.amount * 0.10); // 10%
    const gst = Math.round(platformFee * 0.18);        // 18% GST on platform fee
    const netPayout = item.amount - platformFee;

    const payerUser = findUser(item.client);
    const recipientUser = findUser(item.freelancer);

    const transactionId = `PAY-${item.txn}`;
    const invoiceId = `INV-2026-${String(item.inv).padStart(3, '0')}`;
    const createdAt = daysAgo(item.daysAgoSubmitted);
    const paidAt = item.daysAgoPaid ? daysAgo(item.daysAgoPaid) : null;

    // Timeline generator
    const timeline = [
      {
        stage: 'Initiated',
        description: `Payment invoice ${invoiceId} generated for ${item.project}`,
        timestamp: createdAt,
        user: item.client,
      },
      {
        stage: 'Escrow Funded',
        description: `₹${item.amount.toLocaleString('en-IN')} deposited into RBI-compliant nodal escrow via ${item.method}`,
        timestamp: new Date(createdAt.getTime() + 1000 * 60 * 15),
        user: item.client,
      },
    ];

    if (item.status === 'completed') {
      timeline.push({
        stage: 'Milestone Approved',
        description: 'Client accepted deliverables and released milestone funds',
        timestamp: new Date(paidAt.getTime() - 1000 * 60 * 30),
        user: item.client,
      });
      timeline.push({
        stage: 'Payout Completed',
        description: `Net payout of ₹${netPayout.toLocaleString('en-IN')} disbursed to ${item.freelancer}`,
        timestamp: paidAt,
        user: 'Platform Escrow Bot',
      });
    } else if (item.status === 'processing') {
      timeline.push({
        stage: 'Payout Processing',
        description: 'Escrow release approved; clearing through banking partner network',
        timestamp: new Date(createdAt.getTime() + 1000 * 60 * 60 * 2),
        user: 'Platform Escrow Bot',
      });
    } else if (item.status === 'disputed') {
      timeline.push({
        stage: 'Dispute Raised',
        description: item.disputeDetails?.reason || 'Dispute raised on milestone deliverable',
        timestamp: item.disputeDetails?.openedAt || new Date(),
        user: item.disputeDetails?.claimant || item.client,
      });
    } else if (item.status === 'refunded') {
      timeline.push({
        stage: 'Refund Processed',
        description: `Full amount of ₹${item.amount.toLocaleString('en-IN')} refunded to ${item.client}`,
        timestamp: paidAt || new Date(),
        user: 'Admin Workstation',
      });
    }

    await Payment.create({
      transactionId,
      invoiceId,
      invoiceNumber: invoiceId,
      projectName: item.project,
      clientName: item.client,
      freelancerName: item.freelancer,
      payer: payerUser?._id || new mongoose.Types.ObjectId(),
      recipient: recipientUser?._id || new mongoose.Types.ObjectId(),
      amount: item.amount,
      platformFee,
      gst,
      netAmount: netPayout,
      netPayout,
      currency: 'INR',
      paymentMethod: item.method,
      escrowStatus: item.escrowStatus,
      status: item.status,
      type: item.status === 'refunded' ? 'refund' : 'escrow_deposit',
      createdAt,
      paidAt,
      notes: item.notes,
      disputeDetails: item.disputeDetails || null,
      timeline,
    });

    createdCount++;
  }

  // ── Final Verification & Counts ───────────────────────────────────────────
  const total = await Payment.countDocuments({ transactionId: { $regex: '^PAY-' } });
  const completed = await Payment.countDocuments({ transactionId: { $regex: '^PAY-' }, status: 'completed' });
  const pending = await Payment.countDocuments({ transactionId: { $regex: '^PAY-' }, status: 'pending' });
  const processing = await Payment.countDocuments({ transactionId: { $regex: '^PAY-' }, status: 'processing' });
  const disputed = await Payment.countDocuments({ transactionId: { $regex: '^PAY-' }, status: 'disputed' });
  const refunded = await Payment.countDocuments({ transactionId: { $regex: '^PAY-' }, status: 'refunded' });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('              ADMIN PAYMENTS DEMO DATASET SEEDED               ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Total Seeded Records  : ${total} (Target: 32)`);
  console.log(`  Completed Payments    : ${completed} (Target: 18)`);
  console.log(`  Pending Payments      : ${pending} (Target: 6)`);
  console.log(`  Processing Payments   : ${processing} (Target: 4)`);
  console.log(`  Disputed Payments     : ${disputed} (Target: 2)`);
  console.log(`  Refunded Payments     : ${refunded} (Target: 2)`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seeder execution failed:', err);
  process.exit(1);
});
