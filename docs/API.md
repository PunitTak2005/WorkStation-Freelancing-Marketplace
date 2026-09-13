# Workstation API Documentation

Base URL: `/api`

## Authentication Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | `/auth/register` | Register a new user | Public | `{ name, email, password, role }` |
| POST | `/auth/login` | Login user | Public | `{ email, password }` |
| POST | `/auth/logout` | Logout user | Private | N/A |
| GET | `/auth/me` | Get current user info | Private | N/A |
| POST | `/auth/refresh-token` | Refresh access token | Public | `{ refreshToken }` |
| POST | `/auth/forgot-password`| Send password reset email | Public | `{ email }` |
| POST | `/auth/reset-password` | Reset password | Public | `{ token, newPassword }` |

## Users Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/users` | Get list of users (filtered) | Private/Admin | N/A |
| GET | `/users/:id` | Get user by ID | Private | N/A |
| PUT | `/users/profile` | Update user profile | Private | `{ bio, skills, hourlyRate, title, location... }` |
| POST | `/users/avatar` | Upload avatar image | Private | `FormData { avatar }` |

## Jobs Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/jobs` | Get all jobs (with filters/pagination) | Public | N/A |
| GET | `/jobs/:id` | Get job details | Public | N/A |
| POST | `/jobs` | Create a new job | Client | `{ title, description, budget, category, skills... }` |
| PUT | `/jobs/:id` | Update job details | Client (Owner) | `{ title, description... }` |
| DELETE | `/jobs/:id` | Delete job | Client/Admin | N/A |

## Proposals Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | `/jobs/:id/proposals`| Submit proposal | Freelancer | `{ coverLetter, bidAmount, estimatedTime... }` |
| GET | `/jobs/:id/proposals`| Get proposals for job | Client (Owner) | N/A |
| GET | `/proposals/me` | Get my proposals | Freelancer | N/A |
| PUT | `/proposals/:id/status`| Update proposal status | Client | `{ status: 'accepted' | 'rejected' }` |

## Contracts Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | `/contracts` | Create contract | Client | `{ jobId, proposalId, terms, amount... }` |
| GET | `/contracts` | Get my contracts | Private | N/A |
| GET | `/contracts/:id` | Get contract details | Private | N/A |
| PUT | `/contracts/:id/milestone`| Add milestone | Client | `{ description, amount, dueDate }` |
| POST | `/contracts/:id/submit`| Submit work for milestone | Freelancer | `{ milestoneId, workLinks, message }` |
| POST | `/contracts/:id/approve`| Approve work | Client | `{ milestoneId }` |

## Payments Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | `/payments/create-order`| Create Razorpay order | Client | `{ contractId, amount }` |
| POST | `/payments/verify` | Verify payment | Private | `{ razorpay_order_id, razorpay_payment_id... }` |
| GET | `/payments/history` | Get payment history | Private | N/A |

## Chat Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/chat/conversations`| Get all conversations | Private | N/A |
| GET | `/chat/conversations/:id`| Get messages in conversation| Private | N/A |
| POST | `/chat/messages` | Send message | Private | `{ receiverId, text }` |

## Dashboard Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/dashboard/freelancer`| Freelancer stats | Freelancer | N/A |
| GET | `/dashboard/client` | Client stats | Client | N/A |

## Admin Routes

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/admin/stats` | Platform overview stats | Admin | N/A |
| GET | `/admin/users` | Manage all users | Admin | N/A |
| PUT | `/admin/users/:id/status`| Suspend/Activate user | Admin | `{ status }` |
