# Workstation — Database Schema & Data Models Documentation

## Overview
Workstation uses MongoDB with Mongoose as its primary document store. Relationships are maintained via ObjectId references, compound unique indexes, and schema validations.

---

## Collections & Schemas

### 1. Users (`User`)
- **Fields**:
  - `name`: String, required, 2-50 chars, trimmed.
  - `email`: String, required, unique, lowercase, trimmed.
  - `password`: String, select: false, hashed via bcryptjs (salt rounds = 12).
  - `role`: Enum (`'freelancer' | 'client' | 'admin'`).
  - `avatar`: Object (`url`, `publicId`).
  - `hourlyRate`: Number, min: 0, max: 50,000.
  - `skills`: Array of strings, indexed.
  - `portfolio`: Array of project objects (`title`, `description`, `images`, `projectUrl`).
  - `ratingsAverage`: Number, default 0, max 5.
  - `ratingsCount`: Number, default 0.
- **Indexes**:
  - `{ email: 1 }` (unique)
  - `{ role: 1 }`
  - `{ name: 'text', bio: 'text', skills: 'text' }`

---

### 2. Jobs (`Job`)
- **Fields**:
  - `title`: String, required, 5-100 chars, trimmed.
  - `description`: String, required, 20-5000 chars, trimmed.
  - `category`: String, required.
  - `budget`: Object (`min`, `max`, `type: 'fixed' | 'hourly'`).
  - `deadline`: Date (validated to prevent past timestamps on creation).
  - `client`: ObjectId referencing `User`.
  - `status`: Enum (`'open' | 'in_progress' | 'completed' | 'cancelled'`).
  - `skillsRequired`: Array of strings (min length 1).
  - `proposalCount`: Number, default 0.
- **Indexes**:
  - `{ title: 'text', description: 'text', skillsRequired: 'text' }`
  - `{ status: 1, category: 1, createdAt: -1 }`
  - `{ client: 1 }`

---

### 3. Proposals (`Proposal`)
- **Fields**:
  - `job`: ObjectId referencing `Job`.
  - `freelancer`: ObjectId referencing `User`.
  - `coverLetter`: String, 10-3000 chars, trimmed.
  - `bidAmount`: Number, required, > 0.
  - `deliveryTime`: Number, 1-365 days.
  - `milestones`: Array of milestone objects (`title`, `amount`, `deadline`).
  - `status`: Enum (`'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn'`).
- **Indexes**:
  - `{ job: 1, freelancer: 1 }` (Compound unique — prevents double-bidding)
  - `{ freelancer: 1, status: 1 }`

---

### 4. Contracts (`Contract`)
- **Fields**:
  - `job`: ObjectId referencing `Job`.
  - `client`: ObjectId referencing `User`.
  - `freelancer`: ObjectId referencing `User`.
  - `totalAmount`: Number.
  - `milestones`: Array (`title`, `amount`, `status: 'pending' | 'funded' | 'submitted' | 'approved'`).
  - `status`: Enum (`'active' | 'completed' | 'cancelled' | 'disputed'`).

---

### 5. Payments (`Payment`)
- **Fields**:
  - `contract`: ObjectId referencing `Contract`.
  - `payer`: ObjectId referencing `User`.
  - `recipient`: ObjectId referencing `User`.
  - `amount`: Number, positive.
  - `razorpayOrderId`: String.
  - `razorpayPaymentId`: String.
  - `status`: Enum (`'pending' | 'succeeded' | 'failed' | 'refunded'`).
