/**
 * seed_review_resolved_reports.mjs
 *
 * Seeds 6 "under_review" and 14 "resolved" reports into the WorkStation database.
 * Idempotent: checks for existing reports by (title + status) before inserting.
 *
 * Target DB Counts after run:
 * - Pending: 8 (existing)
 * - Under Review: 6
 * - Resolved: 14
 * - Total: 28
 *
 * Run: node src/scripts/seed_review_resolved_reports.mjs
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Report from '../models/Report.js';
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

// ── 6 Under Review Reports ───────────────────────────────────────────────────
const UNDER_REVIEW_REPORTS = [
  {
    title: 'Security Audit Findings',
    project: 'Mobile Banking App',
    assignedReviewer: 'Ananya Sharma',
    submittedByName: 'Vikram Aditya',
    priority: 'critical',
    category: 'audit',
    updatedAt: daysAgo(0, 2),
    submittedAt: daysAgo(2),
    description:
      'Critical vulnerability assessment identifying session management vulnerabilities, JWT expiration issues, and insecure local storage handling in the Android authentication module.',
  },
  {
    title: 'Contract Compliance Review',
    project: 'WorkStation Marketplace',
    assignedReviewer: 'Rahul Mehta',
    submittedByName: 'Deepa Iyer',
    priority: 'high',
    category: 'audit',
    updatedAt: daysAgo(1),
    submittedAt: daysAgo(4),
    description:
      'Auditing contract terms and milestone escrow disbursements against platform terms of service and statutory compliance requirements for high-value enterprise contracts.',
  },
  {
    title: 'Payment Dispute Investigation',
    project: 'E-commerce Platform',
    assignedReviewer: 'Vikram Singh',
    submittedByName: 'Priya Kapoor',
    priority: 'high',
    category: 'payment',
    updatedAt: daysAgo(2),
    submittedAt: daysAgo(5),
    description:
      'Investigation into disputed milestone payment #PAY-8821 involving chargeback claim on multi-vendor cart checkout flow. Reviewing transaction logs and bank settlement responses.',
  },
  {
    title: 'UI Accessibility Review',
    project: 'Portfolio CMS',
    assignedReviewer: 'Neha Patel',
    submittedByName: 'Karan Mehta',
    priority: 'medium',
    category: 'design',
    updatedAt: daysAgo(3),
    submittedAt: daysAgo(6),
    description:
      'WCAG 2.1 AA audit on CMS template layouts, color contrast ratios on navigation bar, screen reader semantics, and keyboard tab focus traps.',
  },
  {
    title: 'API Performance Analysis',
    project: 'CRM Dashboard',
    assignedReviewer: 'Arjun Joshi',
    submittedByName: 'Rahul Verma',
    priority: 'medium',
    category: 'progress',
    updatedAt: daysAgo(0, 1),
    submittedAt: daysAgo(3),
    description:
      'Profiling slow query responses on /api/analytics/funnel endpoint experiencing 1.8s latency under peak concurrency. Reviewing pipeline execution and indexing recommendations.',
  },
  {
    title: 'Deployment Verification',
    project: 'Society Management System',
    assignedReviewer: 'Sneha Gupta',
    submittedByName: 'Kavya Jain',
    priority: 'high',
    category: 'deployment',
    updatedAt: daysAgo(1),
    submittedAt: daysAgo(3),
    description:
      'Verification of blue-green deployment pipeline, automated rollbacks, and Redis session store persistence on staging cluster ahead of v1.2 release.',
  },
];

// ── 14 Resolved Reports ──────────────────────────────────────────────────────
const RESOLVED_REPORTS = [
  {
    title: 'Login Bug Resolution',
    project: 'Mobile Banking App',
    assignedReviewer: 'Ananya Sharma',
    submittedByName: 'Arjun Patel',
    priority: 'critical',
    category: 'bug',
    submittedAt: daysAgo(28),
    resolvedAt: daysAgo(25),
    updatedAt: daysAgo(25),
    description:
      'Critical issue where OAuth login flow failed on token refresh with 401 Unauthorized errors for accounts with special characters in email.',
    resolutionNotes:
      'Fixed null pointer exception in OAuth callback handler and deployed hotfix v2.4.1. Unit and integration tests added.',
  },
  {
    title: 'Invoice PDF Fix',
    project: 'WorkStation Marketplace',
    assignedReviewer: 'Rahul Mehta',
    submittedByName: 'Deepa Iyer',
    priority: 'medium',
    category: 'bug',
    submittedAt: daysAgo(25),
    resolvedAt: daysAgo(23),
    updatedAt: daysAgo(23),
    description:
      'Generated invoice PDFs truncated the summary table on invoices with more than 6 milestone billing items.',
    resolutionNotes:
      'Updated PDF generation buffer stream with automatic page-break calculations to prevent truncated invoice footer signatures.',
  },
  {
    title: 'Dashboard Performance Optimization',
    project: 'CRM Dashboard',
    assignedReviewer: 'Arjun Joshi',
    submittedByName: 'Rahul Verma',
    priority: 'high',
    category: 'progress',
    submittedAt: daysAgo(22),
    resolvedAt: daysAgo(20),
    updatedAt: daysAgo(20),
    description:
      'Analytics dashboard loading took over 4.2s for accounts with more than 10,000 recorded customer leads.',
    resolutionNotes:
      'Added compound MongoDB indexes on user activity collection and implemented cursor-based pagination; reduced query time by 74%.',
  },
  {
    title: 'Notification System Patch',
    project: 'AI Chat Assistant',
    assignedReviewer: 'Sneha Gupta',
    submittedByName: 'Priya Sharma',
    priority: 'medium',
    category: 'bug',
    submittedAt: daysAgo(19),
    resolvedAt: daysAgo(18),
    updatedAt: daysAgo(18),
    description:
      'Push notifications failed to arrive when client switched mobile browser tabs during active assistant sessions.',
    resolutionNotes:
      'Resolved WebSocket heartbeat connection drop bug on iOS Safari background tab transitions. Reconnection logic verified.',
  },
  {
    title: 'Search Filter Enhancement',
    project: 'E-commerce Platform',
    assignedReviewer: 'Vikram Singh',
    submittedByName: 'Aman Joshi',
    priority: 'low',
    category: 'feature',
    submittedAt: daysAgo(17),
    resolvedAt: daysAgo(15),
    updatedAt: daysAgo(15),
    description:
      'Category search results lacked price range and rating filters requested by marketplace vendors.',
    resolutionNotes:
      'Implemented multi-facet price and rating filters with debounced URL search parameters and cached aggregate query counts.',
  },
  {
    title: 'Payment Gateway Validation',
    project: 'WorkStation Marketplace',
    assignedReviewer: 'Sneha Gupta',
    submittedByName: 'Rohan Patel',
    priority: 'critical',
    category: 'payment',
    submittedAt: daysAgo(15),
    resolvedAt: daysAgo(14),
    updatedAt: daysAgo(14),
    description:
      'Discrepancy in webhook signature verification causing delayed escrow status updates on international credit cards.',
    resolutionNotes:
      'Fixed raw request payload parsing bug in Stripe webhook endpoint and added automated signature replay tests.',
  },
  {
    title: 'Contract Approval Fix',
    project: 'Portfolio CMS',
    assignedReviewer: 'Rahul Mehta',
    submittedByName: 'Karan Mehta',
    priority: 'high',
    category: 'progress',
    submittedAt: daysAgo(14),
    resolvedAt: daysAgo(12),
    updatedAt: daysAgo(12),
    description:
      'Contract status remained in "pending_client" even after digital signature confirmation due to race condition.',
    resolutionNotes:
      'Wrapped contract state transitions in atomic MongoDB session transactions with distributed lock check.',
  },
  {
    title: 'Image Upload Issue',
    project: 'Society Management System',
    assignedReviewer: 'Neha Patel',
    submittedByName: 'Kavya Jain',
    priority: 'medium',
    category: 'bug',
    submittedAt: daysAgo(12),
    resolvedAt: daysAgo(10),
    updatedAt: daysAgo(10),
    description:
      'Profile and receipt uploads above 5MB returned 413 Payload Too Large without clear validation feedback.',
    resolutionNotes:
      'Configured client-side image compression pipeline before multipart upload and updated nginx body size limit to 20MB.',
  },
  {
    title: 'Profile Update Bug',
    project: 'CRM Dashboard',
    assignedReviewer: 'Priya Sharma',
    submittedByName: 'Neha Singh',
    priority: 'low',
    category: 'bug',
    submittedAt: daysAgo(10),
    resolvedAt: daysAgo(9),
    updatedAt: daysAgo(9),
    description:
      'Phone number validation failed on valid international country codes containing hyphenated area prefixes.',
    resolutionNotes:
      'Sanitized phone number regex validation to accommodate international E.164 country code formats.',
  },
  {
    title: 'Mobile Responsive Fix',
    project: 'Portfolio CMS',
    assignedReviewer: 'Rohan Patel',
    submittedByName: 'Karan Mehta',
    priority: 'medium',
    category: 'design',
    submittedAt: daysAgo(9),
    resolvedAt: daysAgo(7),
    updatedAt: daysAgo(7),
    description:
      'Portfolio grid cards overflowed viewport width on iPhone SE and smaller screen widths.',
    resolutionNotes:
      'Corrected CSS grid template columns from fixed minmax(300px, 1fr) to minmax(min(100%, 280px), 1fr).',
  },
  {
    title: 'Database Cleanup',
    project: 'E-commerce Platform',
    assignedReviewer: 'Arjun Joshi',
    submittedByName: 'Vikram Aditya',
    priority: 'low',
    category: 'audit',
    submittedAt: daysAgo(8),
    resolvedAt: daysAgo(6),
    updatedAt: daysAgo(6),
    description:
      'Accumulation of expired guest checkout carts and abandoned sessions causing unindexed scan overhead.',
    resolutionNotes:
      'Implemented TTL index on guest_sessions collection and archived 14,000 orphaned cart session records older than 90 days.',
  },
  {
    title: 'Email Verification Issue',
    project: 'Mobile Banking App',
    assignedReviewer: 'Ananya Sharma',
    submittedByName: 'Priya Kapoor',
    priority: 'high',
    category: 'bug',
    submittedAt: daysAgo(6),
    resolvedAt: daysAgo(4),
    updatedAt: daysAgo(4),
    description:
      'OTP email verification tokens expired prematurely due to server UTC time drift on secondary container.',
    resolutionNotes:
      'Synchronized container time via NTP daemon and extended verification OTP window to 15 minutes with rate-limiting.',
  },
  {
    title: 'Report Export Improvement',
    project: 'WorkStation Marketplace',
    assignedReviewer: 'Rahul Mehta',
    submittedByName: 'Deepa Iyer',
    priority: 'medium',
    category: 'feature',
    submittedAt: daysAgo(5),
    resolvedAt: daysAgo(3),
    updatedAt: daysAgo(3),
    description:
      'Admin reports page required CSV export capability with date range filtering for compliance audits.',
    resolutionNotes:
      'Added streaming CSV and XLSX download endpoints with progress indicators and role-based audit access checks.',
  },
  {
    title: 'Analytics Chart Rendering Fix',
    project: 'Society Management System',
    assignedReviewer: 'Neha Patel',
    submittedByName: 'Sneha Gupta',
    priority: 'low',
    category: 'bug',
    submittedAt: daysAgo(3),
    resolvedAt: daysAgo(1),
    updatedAt: daysAgo(1),
    description:
      'Monthly maintenance fee collection chart distorted during responsive container resize on tablet orientation change.',
    resolutionNotes:
      'Fixed SVG viewBox recalculation hook and enabled debounce on resize observer for Recharts responsive wrapper.',
  },
];

// ── Main Seeder ──────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  // Fetch all users to link reviewer ObjectIds if available
  const existingUsers = await User.find({}, 'name email role').lean();
  const findUser = (name) => existingUsers.find((u) => u.name?.toLowerCase() === name?.toLowerCase());

  console.log('\n--- Seeding 6 Under Review Reports ---');
  let underReviewCreated = 0;
  let underReviewSkipped = 0;

  for (const item of UNDER_REVIEW_REPORTS) {
    const exists = await Report.findOne({
      title: item.title,
      project: item.project,
      status: 'under_review',
    });

    if (exists) {
      console.log(`  SKIP [under_review] "${item.title}" (already exists)`);
      underReviewSkipped++;
      continue;
    }

    const reviewerUser = findUser(item.assignedReviewer);
    const submitterUser = findUser(item.submittedByName);

    await Report.create({
      title: item.title,
      project: item.project,
      description: item.description,
      category: item.category,
      priority: item.priority,
      status: 'under_review',
      reviewer: reviewerUser?._id || null,
      reviewerName: item.assignedReviewer,
      submittedBy: submitterUser?._id || null,
      submittedByName: item.submittedByName,
      submittedAt: item.submittedAt,
      updatedAt: item.updatedAt,
      notes: `Assigned to ${item.assignedReviewer} for active review.`,
    });

    console.log(`  CREATE [under_review] "${item.title}" [${item.priority}] -> ${item.assignedReviewer}`);
    underReviewCreated++;
  }

  console.log('\n--- Seeding 14 Resolved Reports ---');
  let resolvedCreated = 0;
  let resolvedSkipped = 0;

  for (const item of RESOLVED_REPORTS) {
    const exists = await Report.findOne({
      title: item.title,
      project: item.project,
      status: 'resolved',
    });

    if (exists) {
      console.log(`  SKIP [resolved] "${item.title}" (already exists)`);
      resolvedSkipped++;
      continue;
    }

    const reviewerUser = findUser(item.assignedReviewer);
    const submitterUser = findUser(item.submittedByName);

    await Report.create({
      title: item.title,
      project: item.project,
      description: item.description,
      category: item.category,
      priority: item.priority,
      status: 'resolved',
      reviewer: reviewerUser?._id || null,
      reviewerName: item.assignedReviewer,
      submittedBy: submitterUser?._id || null,
      submittedByName: item.submittedByName,
      submittedAt: item.submittedAt,
      resolvedAt: item.resolvedAt,
      updatedAt: item.updatedAt,
      notes: item.resolutionNotes,
      resolutionNotes: item.resolutionNotes,
    });

    console.log(`  CREATE [resolved] "${item.title}" [${item.priority}] -> Resolved by ${item.assignedReviewer}`);
    resolvedCreated++;
  }

  // ── Verification & Final Counts ───────────────────────────────────────────
  const pendingCount = await Report.countDocuments({ status: 'pending' });
  const underReviewCount = await Report.countDocuments({ status: 'under_review' });
  const resolvedCount = await Report.countDocuments({ status: 'resolved' });
  const totalCount = await Report.countDocuments({});

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('             DATABASE REPORT COUNTS                   ');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Pending Reports      : ${pendingCount}`);
  console.log(`  Under Review Reports : ${underReviewCount} (Target: 6)`);
  console.log(`  Resolved Reports     : ${resolvedCount} (Target: 14)`);
  console.log(`  Total Reports        : ${totalCount} (Expected: 28)`);
  console.log('═══════════════════════════════════════════════════════');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB\n');
}

main().catch((err) => {
  console.error('Seeder execution failed:', err);
  process.exit(1);
});
