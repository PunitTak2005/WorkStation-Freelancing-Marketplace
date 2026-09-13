/**
 * seed_pending_reports.mjs
 *
 * Seeds 8 realistic Pending Reports into the WorkStation database.
 * Idempotent: running multiple times will not create duplicates
 * (checks for existing report titles before inserting).
 *
 * Run: node src/scripts/seed_pending_reports.mjs
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Report from '../models/Report.js';

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';

// ── Helpers ──────────────────────────────────────────────────────────────────
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  // Vary the time slightly so sorting looks natural
  d.setHours(Math.floor(Math.random() * 12) + 8);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
};

// ── Report Data ───────────────────────────────────────────────────────────────
const REPORTS = [
  {
    title: 'Weekly Progress Report',
    project: 'CRM Dashboard',
    submittedByName: 'Rahul Verma',
    priority: 'medium',
    category: 'progress',
    submittedAt: daysAgo(1),
    description:
      'Weekly update covering milestone completion rates, sprint velocity, and client deliverable status for the CRM Dashboard project. Three milestones completed; one pending sign-off.',
  },
  {
    title: 'UI Review Summary',
    project: 'WorkStation Marketplace',
    submittedByName: 'Neha Singh',
    priority: 'high',
    category: 'design',
    submittedAt: daysAgo(0),
    description:
      'Comprehensive UI review of WorkStation Marketplace covering component consistency, accessibility compliance, dark mode rendering, and responsive breakpoints. Flagged 14 issues for remediation.',
  },
  {
    title: 'Bug Verification Report',
    project: 'Mobile Banking App',
    submittedByName: 'Arjun Patel',
    priority: 'high',
    category: 'bug',
    submittedAt: daysAgo(2),
    description:
      'Post-fix verification report for critical authentication bypass and session expiry bugs in Mobile Banking App v2.4. Regression tests passed; production deployment cleared pending admin sign-off.',
  },
  {
    title: 'Sprint Completion Report',
    project: 'AI Chat Assistant',
    submittedByName: 'Priya Sharma',
    priority: 'medium',
    category: 'sprint',
    submittedAt: daysAgo(3),
    description:
      'Sprint 7 closure report for AI Chat Assistant. 18 of 21 story points delivered. Remaining 3 points carried over to Sprint 8. Performance benchmarks met; NLU accuracy at 94.2%.',
  },
  {
    title: 'Design Approval Report',
    project: 'Portfolio Website',
    submittedByName: 'Karan Mehta',
    priority: 'low',
    category: 'design',
    submittedAt: daysAgo(5),
    description:
      'Final design approval request for Portfolio Website redesign including updated typography system, hero section animations, and revised color palette. Awaiting stakeholder sign-off.',
  },
  {
    title: 'Payment Audit Report',
    project: 'E-commerce Platform',
    submittedByName: 'Sneha Gupta',
    priority: 'critical',
    category: 'audit',
    submittedAt: daysAgo(0),
    description:
      'Critical financial audit of payment gateway integration in E-commerce Platform. Identified 3 unreconciled transactions totaling ₹47,300. Immediate review required before next payment cycle.',
  },
  {
    title: 'Feature Testing Report',
    project: 'Event Booking Platform',
    submittedByName: 'Aman Joshi',
    priority: 'medium',
    category: 'feature',
    submittedAt: daysAgo(6),
    description:
      'End-to-end feature testing report for new multi-venue booking flow in Event Booking Platform. 142 test cases executed; 138 passed, 4 minor failures logged. Awaiting fix verification.',
  },
  {
    title: 'Deployment Readiness Report',
    project: 'Society Management System',
    submittedByName: 'Kavya Jain',
    priority: 'high',
    category: 'deployment',
    submittedAt: daysAgo(4),
    description:
      'Pre-production deployment checklist for Society Management System v1.2. Environment parity verified, load tests passed at 500 concurrent users, rollback plan documented. Pending final approval.',
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  let created = 0;
  let skipped = 0;

  for (const data of REPORTS) {
    // Idempotency: skip if a report with the same title + project already exists
    const exists = await Report.findOne({
      title: data.title,
      project: data.project,
      status: 'pending',
    });

    if (exists) {
      console.log(`  SKIP  "${data.title}" (already exists)`);
      skipped++;
      continue;
    }

    await Report.create({
      ...data,
      status: 'pending',
      reviewer: null,
    });

    console.log(`  CREATE "${data.title}" [${data.priority}] — ${data.project}`);
    created++;
  }

  // Verify final count
  const pending = await Report.countDocuments({ status: 'pending' });

  console.log('\n══════════════════════════════════════════');
  console.log('  SEED COMPLETE — Pending Reports');
  console.log('══════════════════════════════════════════');
  console.log(`  Created  : ${created}`);
  console.log(`  Skipped  : ${skipped} (already existed)`);
  console.log(`  DB Total (pending) : ${pending}`);
  console.log('══════════════════════════════════════════');
  console.log('\n  Dashboard "Pending Reports" counter should now read:', pending);
  console.log('  Visit: http://localhost:3256/dashboard/admin\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch((err) => {
  console.error('Seeder error:', err);
  process.exit(1);
});
