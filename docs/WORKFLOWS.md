# Workstation — Marketplace Workflow & User Journey Specifications

This document outlines the detailed workflows for the three primary user roles (**Client**, **Freelancer**, **Admin**) in the **Workstation** ecosystem.

---

## 1. Complete End-to-End Marketplace Lifecycle

```mermaid
graph TD
    A[Client Posts Project] -->|Enters board| B[Project Listed on Board]
    B -->|Search & Filters| C[Freelancer Discovers Project]
    C -->|Submits proposal & bid| D[Proposal Pending Review]
    D -->|Client shortlists/interviews| E[Real-Time Messaging & Due Diligence]
    E -->|Client accepts proposal| F[Contract Generated & Other Bids Closed]
    F -->|Client funds milestone| G[Escrow Secured]
    G -->|Freelancer delivers work| H[Milestone Under Client Review]
    H -->|Revisions needed| G
    H -->|Client approves delivery| I[Escrow Funds Released to Freelancer]
    I --> J[Both Parties Exchange Ratings & Reviews]
```

---

## 2. Client User Journey

```mermaid
flowchart TD
    Start([Client Signs Up / Logs In]) --> ProfileSetup[Setup Company Profile & Description]
    ProfileSetup --> ActionSelect{Action}
    
    ActionSelect -->|Post Project| CreateJob[Fill Project Wizard: Title, Category, Budget, Skills, Files]
    CreateJob --> JobActive[Job Published to Marketplace]
    
    JobActive --> CheckProposals[Monitor Inbound Proposals in Dashboard]
    CheckProposals --> ReviewProposal{Proposal Decision}
    
    ReviewProposal -->|Reject| MarkRejected[Mark Proposal as Rejected]
    ReviewProposal -->|Shortlist| MarkShortlist[Mark as Shortlisted & Start Chat]
    ReviewProposal -->|Accept & Hire| AcceptBid[Accept Proposal]
    
    AcceptBid --> ContractCreated[Auto-generate Digital Contract]
    ContractCreated --> DepositEscrow[Fund Milestone via Razorpay Checkout]
    DepositEscrow --> WorkMonitored[Monitor Progress via Milestone Tracker]
    
    WorkMonitored --> DeliveryReceived{Review Deliverable}
    DeliveryReceived -->|Request Changes| SendFeedback[Provide Feedback via Chat]
    DeliveryReceived -->|Approve| ReleaseEscrow[Approve Milestone & Release Funds]
    
    ReleaseEscrow --> FinalReview[Leave 5-Star Rating & Written Testimonial]
    FinalReview --> Completed([Project Closed])
```

### Key Client Features & Permissions:
1. **Job Management**: Create, edit, and cancel open project postings.
2. **Proposal Review Table**: Inspect candidate cover letters, milestones, ratings, and portfolio projects.
3. **Escrow Funding**: Safe financial deposits held in escrow before work commences.
4. **Milestone Tracker**: Inspect work deliverables, request adjustments, and authorize payouts.
5. **Direct Collaboration**: Access real-time chat with typing indicators and file sharing.

---

## 3. Freelancer User Journey

```mermaid
flowchart TD
    Start([Freelancer Registers / Logs In]) --> ProfileBuild[Build Professional Profile, Hourly Rate & Portfolio]
    ProfileBuild --> ExploreJobs[Browse Project Marketplace with Multi-Facet Filters]
    
    ExploreJobs --> SelectJob[Inspect Job Scope & Client Verification Status]
    SelectJob --> SubmitBid[Submit Custom Proposal: Cover Letter, Milestones, Pricing]
    
    SubmitBid --> ProposalStatus[Track Status in Proposal Tracker]
    ProposalStatus --> StatusEvent{Status Update}
    
    StatusEvent -->|Shortlisted| Interview[Engage in Real-time Interview via Messages]
    StatusEvent -->|Declined| Archive[Archived to Unsuccessful Proposals]
    StatusEvent -->|Accepted| ContractInitiated[Contract Created & Escrow Awaited]
    
    Interview --> ContractInitiated
    ContractInitiated --> EscrowFunded[Notification: Escrow Milestone Funded!]
    
    EscrowFunded --> WorkPhase[Develop Deliverables & Track Hours]
    WorkPhase --> SubmitWork[Submit Milestone Files & Completion Note]
    
    SubmitWork --> ApprovalEvent{Client Review}
    ApprovalEvent -->|Changes Requested| Refine[Address Revision Notes]
    Refine --> SubmitWork
    ApprovalEvent -->|Approved| Payout[Funds Credited to Freelancer Balance]
    
    Payout --> Feedback[Exchange Client Review & Rating]
    Feedback --> Done([Completed Contract Recorded on Public Profile])
```

### Key Freelancer Features & Permissions:
1. **Dynamic Profile**: Showcase portfolio items with preview images, hourly rates, skills, education, and availability badge.
2. **Project Exploration**: Filter by 10 domains, remote vs. on-site, entry/intermediate/expert experience, and budget.
3. **Proposal Submission**: Define milestone breakdowns and custom delivery estimates.
4. **Earnings & Hours Tracking**: Analytical Recharts dashboard showing weekly earnings and billable hours.

---

## 4. Administrator Workflow & Platform Governance

```mermaid
flowchart TD
    AdminLogin([Admin Logs In]) --> AdminDashboard[Access Workstation Platform Overview]
    
    AdminDashboard --> MetricsAudit[Review Growth Analytics, Revenue & Category Splits]
    AdminDashboard --> ModuleSelect{Governance Module}
    
    ModuleSelect -->|Users| UserManagement[Inspect User Roster: Suspend / Reactivate / Verify]
    ModuleSelect -->|Projects| JobModeration[Moderate Spam, Low-Quality, or Prohibited Projects]
    ModuleSelect -->|Financials| PaymentMonitoring[Audit Escrow Deposits, Invoices & Platform Fees]
    ModuleSelect -->|Disputes| ReportHandling[Investigate Open Dispute Tickets & Arbitrate Escrow]
```

### Key Admin Features & Permissions:
1. **Platform Telemetry**: Inspect total users, freelancers, clients, platform gross volume, and open disputes.
2. **User Moderation**: Suspend malicious accounts or activate verified KYC badges.
3. **Project Moderation**: Moderate spam or policy-violating job listings.
4. **Financial Oversight**: Audit Razorpay transaction IDs, escrow balances, and generated invoice records (`WS-INV-XXXXX`).
