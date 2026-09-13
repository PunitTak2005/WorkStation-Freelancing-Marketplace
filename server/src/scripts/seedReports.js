/**
 * seedReports.js
 *
 * Seeds 20 realistic moderation reports for the Admin Reports page.
 * Idempotent: Only inserts if database has fewer than 20 reports,
 * or safely verifies existence before creating.
 *
 * Run: node src/scripts/seedReports.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Report from '../models/Report.js';

const MONGO_URI =
  process.env.ATLAS_URI ||
  (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv') ? process.env.MONGODB_URI : null) ||
  'mongodb+srv://Punit:JdHhJ9JvcEKLyTWW@cluster0.rf9mdc2.mongodb.net/workstation';

const reportsData = [
  // ── 1. Critical Reports (4 total) ──
  {
    title: 'Off-platform wire transfer solicitations and payment bypass',
    description: 'Client TechNova Solutions requested bank details via external Telegram link instead of depositing into platform milestone escrow. Multiple chat screenshots captured showing explicit off-platform transaction attempts.',
    category: 'Payment Fraud',
    project: 'FinTech Mobile Banking Dashboard',
    submittedByName: 'Ananya Sharma',
    reviewerName: 'Ananya Sharma',
    status: 'under_review',
    priority: 'critical',
    submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30m ago
    attachments: [
      { fileName: 'telegram_wire_request.png', fileType: 'png', url: 'https://placehold.co/600x400' },
      { fileName: 'chat_export_contract_92.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Escalated to Fraud Investigation unit. Client account temporarily restricted from initiating new contracts.',
  },
  {
    title: 'Compromised developer account broadcasting phishing links in proposals',
    description: 'Abnormal login from unexpected IP geolocation detected. Account is spamming job postings with malicious shortened URLs redirecting to a fake WorkStation login portal.',
    category: 'Account Security',
    project: 'WorkStation Marketplace',
    submittedByName: 'Vikram Aditya',
    reviewerName: 'Arjun Joshi',
    status: 'under_review',
    priority: 'critical',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    attachments: [
      { fileName: 'suspicious_ip_access_log.txt', fileType: 'txt', url: 'https://placehold.co/600x400' },
      { fileName: 'phishing_url_sample.png', fileType: 'png', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Sessions invalidated, password reset enforced, and 2FA challenge triggered.',
  },
  {
    title: 'Extortion and refusal to release milestone funds without extra work',
    description: 'Client PixelCraft Studio is withholding approved ₹85,000 milestone release, demanding 40 additional hours of uncontracted scope and threatening a 1-star review if not fulfilled.',
    category: 'Contract Dispute',
    project: 'AI Resume Analyzer Platform',
    submittedByName: 'Rahul Mehta',
    reviewerName: null,
    status: 'pending',
    priority: 'critical',
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
    attachments: [
      { fileName: 'milestone_blackmail_threats.png', fileType: 'png', url: 'https://placehold.co/600x400' },
      { fileName: 'signed_contract_scope_v2.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Awaiting dispute officer assignment for arbitration.',
  },
  {
    title: 'Unauthorized release of confidential source code to public GitHub repo',
    description: 'Freelancer published client private proprietary FinTech algorithmic code on a public GitHub repository in violation of Signed NDA Section 4.2.',
    category: 'Copyright Violation',
    project: 'Mobile Banking App',
    submittedByName: 'FinEdge Technologies',
    reviewerName: 'Rahul Mehta',
    status: 'resolved',
    priority: 'critical',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5d ago
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'DMCA takedown notice filed and successfully executed with GitHub. Repository removed. Freelancer penalised with formal warning.',
    attachments: [
      { fileName: 'nda_agreement_executed.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
      { fileName: 'github_public_repo_archive.zip', fileType: 'zip', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Issue resolved with confirmation from client legal counsel.',
  },

  // ── 2. High Priority Reports (6 total) ──
  {
    title: 'Suspected identity fraud: Fake portfolio and stolen Behance assets',
    description: 'Applicant profile exhibits verified designs belonging to an award-winning Tokyo agency. Watermarks were lazily blurred out on portfolio samples.',
    category: 'Fake Freelancer',
    project: 'Portfolio CMS',
    submittedByName: 'GrowEasy Pvt Ltd',
    reviewerName: 'Neha Patel',
    status: 'under_review',
    priority: 'high',
    submittedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18h ago
    attachments: [
      { fileName: 'original_behance_source.png', fileType: 'png', url: 'https://placehold.co/600x400' },
      { fileName: 'stolen_portfolio_sample.png', fileType: 'png', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Sent KYC verification request with video selfie challenge to user.',
  },
  {
    title: 'Milestone delivery rejected despite 100% test coverage and client signoff',
    description: 'Client has been completely unresponsive for 14 days following final delivery on June 12th. Automated milestone release requested per Platform Terms of Service.',
    category: 'Contract Dispute',
    project: 'E-commerce Platform',
    submittedByName: 'Neha Singh',
    reviewerName: 'Vikram Singh',
    status: 'under_review',
    priority: 'high',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1d ago
    attachments: [
      { fileName: 'delivery_manifest_and_tests.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Sent formal 72-hour notice of release to client registered email.',
  },
  {
    title: 'Abusive language and persistent harassment in contract messaging',
    description: 'Freelancer received profane messages and disparaging remarks from client manager after requesting clarification on database architectural requirements.',
    category: 'Harassment',
    project: 'CRM Dashboard',
    submittedByName: 'Arjun Patel',
    reviewerName: null,
    status: 'pending',
    priority: 'high',
    submittedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5d ago
    attachments: [
      { fileName: 'chat_log_harassment_timestamps.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Pending moderation triage under Community Standards policy.',
  },
  {
    title: 'Automated bot proposals spamming enterprise job posting',
    description: 'Over 45 generic AI-generated proposals submitted within 3 minutes of publishing job #1049, all repeating identical boilerplate text and dead links.',
    category: 'Spam Proposal',
    project: 'Society Management System',
    submittedByName: 'BlueWave Digital',
    reviewerName: null,
    status: 'pending',
    priority: 'high',
    submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2d ago
    attachments: [
      { fileName: 'bot_proposals_ip_cluster.csv', fileType: 'csv', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Automated rate limits triggered on IP cluster. Investigation pending.',
  },
  {
    title: 'Chargeback dispute filed via card issuer for completed and approved project',
    description: 'Client initiated an external bank chargeback of ₹1,40,000 for mobile app project marked 100% completed two months ago.',
    category: 'Payment Fraud',
    project: 'Mobile Banking App',
    submittedByName: 'Vikram Aditya',
    reviewerName: 'Rahul Mehta',
    status: 'resolved',
    priority: 'high',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7d ago
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Evidence packet including code deliverables, contract logs, and approval timestamps submitted to payment gateway. Bank ruled in favor of WorkStation.',
    attachments: [
      { fileName: 'evidence_dossier_chargeback.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
      { fileName: 'bank_arbitration_award.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Client repeatedly submitting fake credit cards during project deposit',
    description: 'Account triggered 7 consecutive payment failure alerts with differing card names and high-risk bin origin within 15 minutes.',
    category: 'Payment Fraud',
    project: 'WorkStation Marketplace',
    submittedByName: 'TechNova Solutions',
    reviewerName: 'Ananya Sharma',
    status: 'rejected',
    priority: 'high',
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4d ago
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Investigation showed user entered expired card details repeatedly due to bank OTP timeout. Verified legitimate card later processed successfully. Case dismissed.',
    attachments: [
      { fileName: 'stripe_declines_audit.json', fileType: 'json', url: 'https://placehold.co/600x400' },
    ],
  },

  // ── 3. Medium Priority Reports (6 total) ──
  {
    title: 'Client posting fake job listing to conduct free candidate test tasks',
    description: 'Job description required applicants to build an entire functional microservice without compensation as a mandatory technical evaluation test.',
    category: 'Fake Client',
    project: 'AI Chat Assistant',
    submittedByName: 'Ananya Sharma',
    reviewerName: 'Priya Sharma',
    status: 'under_review',
    priority: 'medium',
    submittedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20h ago
    attachments: [
      { fileName: 'job_specification_unpaid_work.png', fileType: 'png', url: 'https://placehold.co/600x400' },
    ],
    notes: 'Notified client to convert unpaid task into a paid discovery milestone.',
  },
  {
    title: 'Misleading skills claims and falsified university degree credentials',
    description: 'Profile claims Master degree from IIT Bombay, however verification checks with alumni registry return no matching candidate records.',
    category: 'Identity Verification',
    project: 'Portfolio CMS',
    submittedByName: 'PixelCraft Studio',
    reviewerName: null,
    status: 'pending',
    priority: 'medium',
    submittedAt: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30h ago
    attachments: [
      { fileName: 'credential_audit_query.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Unlicensed use of stock audio and proprietary fonts in deliverable',
    description: 'Freelancer delivered commercial video explainer utilizing royalty-restricted typography and watermarked audio without purchasing commercial licenses.',
    category: 'Copyright Violation',
    project: 'E-commerce Platform',
    submittedByName: 'BlueWave Digital',
    reviewerName: null,
    status: 'pending',
    priority: 'medium',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3d ago
    attachments: [
      { fileName: 'font_license_infringement_notice.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Delayed project delivery exceeding contract deadline by 3 weeks',
    description: 'Freelancer missed three scheduled delivery sprints without providing prior notification or blockers update.',
    category: 'Contract Dispute',
    project: 'CRM Dashboard',
    submittedByName: 'GrowEasy Pvt Ltd',
    reviewerName: 'Vikram Singh',
    status: 'resolved',
    priority: 'medium',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10d ago
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Parties reached mutual settlement: contract deadline extended by 10 days with a 10% milestone discount credited back to client escrow.',
    attachments: [
      { fileName: 'settlement_agreement.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Dispute over code quality standards and linting conventions',
    description: 'Client claims delivered frontend does not comply with Airbnb style guide mentioned in optional notes of proposal.',
    category: 'Contract Dispute',
    project: 'React Dashboard 1',
    submittedByName: 'Rahul Mehta',
    reviewerName: 'Rohan Patel',
    status: 'resolved',
    priority: 'medium',
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8d ago
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Freelancer resolved 12 ESLint formatting warnings in follow-up commit. Code review passed and client confirmed acceptance.',
    attachments: [
      { fileName: 'eslint_report_clean.txt', fileType: 'txt', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Reported spam proposal containing promotional service link',
    description: 'Client flagged a proposal claiming it contained affiliate advertising for an external hosting service provider.',
    category: 'Spam Proposal',
    project: 'WorkStation Marketplace',
    submittedByName: 'TechNova Solutions',
    reviewerName: 'Deepa Iyer',
    status: 'rejected',
    priority: 'medium',
    submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6d ago
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Link reviewed. The link was a standard Vercel live staging demo of previous client work, not spam. Report determined to be a false positive.',
    attachments: [
      { fileName: 'proposal_link_verification.png', fileType: 'png', url: 'https://placehold.co/600x400' },
    ],
  },

  // ── 4. Low Priority Reports (4 total) ──
  {
    title: 'Profile avatar contains suggestive iconography violating guidelines',
    description: 'User avatar uses an edgy meme graphic with inappropriate subtle background illustration.',
    category: 'Inappropriate Content',
    project: 'WorkStation Marketplace',
    submittedByName: 'Neha Singh',
    reviewerName: null,
    status: 'pending',
    priority: 'low',
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
    attachments: [
      { fileName: 'flagged_avatar_preview.jpg', fileType: 'jpg', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Duplicate job listing posted across two different categories',
    description: 'Client created identical job postings for "Full Stack Developer" under both Web Development and Mobile Development categories simultaneously.',
    category: 'Spam Proposal',
    project: 'WorkStation Marketplace',
    submittedByName: 'Arjun Patel',
    reviewerName: 'Sneha Gupta',
    status: 'resolved',
    priority: 'low',
    submittedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9d ago
    resolvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Duplicate listing merged and archived. Client informed of multi-category tagging best practices.',
    attachments: [
      { fileName: 'duplicate_job_ids.txt', fileType: 'txt', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Minor typographical dispute in project contract title',
    description: 'Contract title has misspelled client company legal entity name ("PixelCraf" instead of "PixelCraft Studio").',
    category: 'Contract Dispute',
    project: 'Portfolio CMS',
    submittedByName: 'PixelCraft Studio',
    reviewerName: 'Rahul Mehta',
    status: 'resolved',
    priority: 'low',
    submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12d ago
    resolvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Contract addendum generated with corrected legal entity spelling. Re-signed by both parties.',
    attachments: [
      { fileName: 'amendment_deed_signed.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
  },
  {
    title: 'Client reported freelancer for slow response during weekend hours',
    description: 'Client expressed dissatisfaction that freelancer did not reply to non-urgent Slack messages sent on Sunday afternoon.',
    category: 'Harassment',
    project: 'Mobile Banking App',
    submittedByName: 'FinEdge Technologies',
    reviewerName: 'Deepa Iyer',
    status: 'rejected',
    priority: 'low',
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14d ago
    resolvedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    resolutionNotes: 'Standard service contract specifies Monday-Friday business operating hours. Freelancer is not obligated to provide 24/7 weekend availability unless contracted.',
    attachments: [
      { fileName: 'sla_terms_clause_8.pdf', fileType: 'pdf', url: 'https://placehold.co/600x400' },
    ],
  },
];

async function seedReports() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas.');

    const currentCount = await Report.countDocuments();
    console.log(`Current reports in collection: ${currentCount}`);

    if (currentCount >= 20) {
      console.log(`Collection already has ${currentCount} reports. Seed skipped to preserve data.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const allUsers = await User.find({}, { name: 1, _id: 1 }).lean();
    const userMap = {};
    allUsers.forEach((u) => {
      userMap[u.name.toLowerCase().trim()] = u._id;
    });

    const docsToInsert = reportsData.map((r) => {
      const copy = { ...r };
      const subKey = r.submittedByName.toLowerCase().trim();
      if (userMap[subKey]) {
        copy.submittedBy = userMap[subKey];
      }
      if (r.reviewerName) {
        const revKey = r.reviewerName.toLowerCase().trim();
        if (userMap[revKey]) {
          copy.reviewer = userMap[revKey];
        }
      }
      return copy;
    });

    console.log(`Inserting ${docsToInsert.length} reports...`);
    await Report.insertMany(docsToInsert);
    console.log('Successfully seeded 20 moderation reports!');

    const [total, pending, underReview, resolved, rejected, critical, high, medium, low] = await Promise.all([
      Report.countDocuments({}),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'under_review' }),
      Report.countDocuments({ status: 'resolved' }),
      Report.countDocuments({ status: 'rejected' }),
      Report.countDocuments({ priority: 'critical' }),
      Report.countDocuments({ priority: 'high' }),
      Report.countDocuments({ priority: 'medium' }),
      Report.countDocuments({ priority: 'low' }),
    ]);

    console.log('---------------------------------------------');
    console.log('Verified Seed Statistics:');
    console.log(`Total Reports:      ${total}`);
    console.log(`Pending:            ${pending} (Expected: 6)`);
    console.log(`Under Review:       ${underReview} (Expected: 5)`);
    console.log(`Resolved:           ${resolved} (Expected: 6)`);
    console.log(`Rejected:           ${rejected} (Expected: 3)`);
    console.log(`Critical Priority:  ${critical} (Expected: 4)`);
    console.log(`High Priority:      ${high} (Expected: 6)`);
    console.log(`Medium Priority:    ${medium} (Expected: 6)`);
    console.log(`Low Priority:       ${low} (Expected: 4)`);
    console.log('---------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding reports:', err);
    process.exit(1);
  }
}

seedReports();
