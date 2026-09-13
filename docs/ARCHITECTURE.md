# Workstation — Technical System Architecture & Engineering Specifications

This document outlines the architectural patterns, database schemas, authentication lifecycle, WebSocket event streams, and financial state machines implemented in **Workstation**.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    ClientApp["Client Application (React 18 + Vite)"]
    ReduxStore["Redux Toolkit (Auth, UI, Chat State)"]
    AxiosLayer["Axios API Client (with Silent Refresh Interceptors)"]
    SocketClient["Socket.io Client (Real-time events)"]

    ClientApp --> ReduxStore
    ClientApp --> AxiosLayer
    ClientApp --> SocketClient

    APIGateway["Express.js Server (Node.js)"]
    AxiosLayer -->|HTTPS REST Requests| APIGateway
    SocketClient -->|WSS Bi-directional Connection| SocketServer["Socket.io Server (JWT Handshake)"]

    subgraph "Middleware & Security Layer"
        APIGateway --> Helmet["Helmet & CORS"]
        APIGateway --> RateLimit["Rate Limiter"]
        APIGateway --> AuthGuard["JWT Protect & RBAC Guard"]
        APIGateway --> Sanitize["MongoSanitize & XSS"]
    end

    subgraph "Business Services & Integrations"
        AuthGuard --> Controllers["Controllers Layer"]
        Controllers --> AuthService["Auth & Token Service"]
        Controllers --> PaymentService["Razorpay Escrow Service"]
        Controllers --> CloudinaryService["Cloudinary Media Pipeline"]
        Controllers --> NotificationService["Notification & Mailer Service"]
    end

    subgraph "Persistence & Caching"
        AuthService --> MongoDB[("MongoDB Database")]
        PaymentService --> MongoDB
        CloudinaryService --> Cloudinary["Cloudinary CDN"]
        Controllers --> MongoDB
    end
```

---

## 2. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ JOB : "posts (as client)"
    USER ||--o{ PROPOSAL : "submits (as freelancer)"
    USER ||--o{ CONTRACT : "participates in"
    USER ||--o{ REVIEW : "gives / receives"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ CONVERSATION : "messages in"

    JOB ||--o{ PROPOSAL : "receives"
    JOB ||--o| CONTRACT : "results in"
    
    PROPOSAL ||--o| CONTRACT : "generates"
    
    CONTRACT ||--o{ PAYMENT : "milestone payments"
    CONTRACT ||--o| REVIEW : "final review"
    
    CONVERSATION ||--o{ MESSAGE : "contains"

    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string role "client | freelancer | admin"
        object avatar
        object coverBanner
        string bio
        string[] skills
        number hourlyRate
        object[] portfolio
        string industry "Client field"
        object companyLogo "Client field"
        string companyDescription "Client field"
        string availability "available | busy | not_available"
        number earnings
        number totalSpent
        number ratingsAverage
        number ratingsCount
    }

    JOB {
        ObjectId _id PK
        ObjectId client FK
        string title
        string description
        string category
        string[] skillsRequired
        object budget "min, max, type"
        string experienceLevel "entry | intermediate | expert"
        string locationType "remote | onsite | hybrid"
        string status "open | in_progress | completed | cancelled"
        number proposalCount
        date deadline
    }

    PROPOSAL {
        ObjectId _id PK
        ObjectId job FK
        ObjectId freelancer FK
        string coverLetter
        number bidAmount
        number deliveryTime
        object[] milestones
        string status "pending | viewed | shortlisted | accepted | rejected | withdrawn"
    }

    CONTRACT {
        ObjectId _id PK
        ObjectId client FK
        ObjectId freelancer FK
        ObjectId job FK
        ObjectId proposal FK
        number totalAmount
        string status "active | completed | terminated"
        object[] milestones "title, amount, dueDate, status"
    }

    PAYMENT {
        ObjectId _id PK
        ObjectId contract FK
        ObjectId payer FK
        ObjectId recipient FK
        number milestoneIndex
        number amount
        string currency "INR"
        string status "pending | completed | failed | refunded"
        string razorpayOrderId
        string razorpayPaymentId
        string invoiceNumber "WS-INV-XXXXX"
    }
```

---

## 3. Authentication & Silent Refresh Token Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client (Redux)
    participant Server as Express Server
    participant DB as MongoDB

    User->>Client: Enters Email & Password
    Client->>Server: POST /api/auth/login
    Server->>DB: Validate User & Password Hash (bcrypt)
    DB-->>Server: User record matches
    Server->>Server: Generate Access Token (15m) & Refresh Token (7d)
    Server-->>Client: HTTP 200: { user, accessToken } + Set-Cookie: refreshToken (httpOnly, Secure)
    Client->>Client: Store accessToken in Redux memory

    Note over Client,Server: Access Token expires after 15 minutes

    Client->>Server: GET /api/dashboard/client (Expired Access Token)
    Server-->>Client: HTTP 401 Unauthorized (TokenExpiredError)
    Client->>Client: Axios Response Interceptor catches 401
    Client->>Server: POST /api/auth/refresh-token (Cookie sent automatically)
    Server->>DB: Verify Refresh Token in Database
    Server->>Server: Generate new Access Token
    Server-->>Client: HTTP 200: { accessToken: newAccessToken }
    Client->>Client: Update Redux state with new accessToken
    Client->>Server: Re-issues original GET /api/dashboard/client
    Server-->>Client: HTTP 200 OK (Data retrieved seamlessly)
```

---

## 4. Socket.io Real-Time Event Communication

```mermaid
sequenceDiagram
    autonumber
    actor Freelancer
    actor Client
    participant SocketServer as Socket.io Server (Node.js)
    participant DB as MongoDB

    Freelancer->>SocketServer: Connection Handshake (with Bearer Token)
    SocketServer->>SocketServer: jwt.verify(token)
    SocketServer->>SocketServer: Join room "user_{freelancerId}"

    Client->>SocketServer: Connection Handshake (with Bearer Token)
    SocketServer->>SocketServer: jwt.verify(token)
    SocketServer->>SocketServer: Join room "user_{clientId}"

    Client->>SocketServer: emit('join_conversation', { conversationId })
    SocketServer->>SocketServer: socket.join(conversationId)

    Freelancer->>SocketServer: emit('typing_start', { conversationId })
    SocketServer-->>Client: broadcast to conversationId: 'user_typing'

    Freelancer->>SocketServer: emit('send_message', { conversationId, text, recipientId })
    SocketServer->>DB: Persist Message record & update Conversation
    SocketServer-->>Client: emit('new_message', savedMessage)
    SocketServer-->>Client: emit('notification', { type: 'message', senderName })
```

---

## 5. Razorpay Escrow State Machine

```mermaid
stateDiagram-v2
    [*] --> MilestonePending: Proposal Accepted & Contract Created
    
    MilestonePending --> EscrowDepositInitiated: Client clicks "Fund Milestone"
    EscrowDepositInitiated --> EscrowFunded: Razorpay Payment Verified via HMAC-SHA256
    EscrowDepositInitiated --> MilestonePending: Payment Failed or Cancelled

    EscrowFunded --> WorkSubmitted: Freelancer submits deliverable attachments
    WorkSubmitted --> RevisionRequested: Client requests changes
    RevisionRequested --> WorkSubmitted: Freelancer uploads revisions

    WorkSubmitted --> FundsReleased: Client approves work
    FundsReleased --> MilestoneCompleted: Milestone marked approved & Invoice generated
    MilestoneCompleted --> [*]: All milestones completed -> Contract Finished
```

---

## 6. Directory Structure & Layer Separation

```
Freelancing Marketplace/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── public/                 # Static SVG icons and favicon assets
│   ├── src/
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable atomic UI (Button, Card, Input, Modal, etc.)
│   │   ├── context/            # React context providers (SocketContext)
│   │   ├── features/           # Domain-driven feature modules
│   │   │   ├── admin/          # Admin moderation, jobs, payments, dispute pages
│   │   │   ├── auth/           # Login, Register, OTP verify, Password reset
│   │   │   ├── chat/           # Real-time chat window, conversations list
│   │   │   ├── contracts/      # Contract view, milestone submission & release
│   │   │   ├── dashboard/      # Client, Freelancer, and Admin analytical dashboards
│   │   │   ├── freelancers/    # Freelancer directory & public profile gallery
│   │   │   ├── jobs/           # Project board, job details, and posting wizard
│   │   │   ├── landing/        # Educational showcase, workflow, categories, hero
│   │   │   ├── payments/       # Razorpay checkout, invoices, success/failed pages
│   │   │   ├── profile/        # Unified profile editor (company + freelancer info)
│   │   │   ├── proposals/      # Proposal submission modal & client review table
│   │   │   └── reviews/        # Review submission modal & rating distribution
│   │   ├── hooks/              # Custom React hooks (useAuth, useSocket, useDebounce, etc.)
│   │   ├── routes/             # AppRoutes definition with Suspense lazy loading
│   │   ├── services/           # Axios HTTP client with auto-refresh interceptors
│   │   ├── store/              # Redux Toolkit store and feature slices
│   │   └── utils/              # Formatters, constants, and Tailwind merge helpers
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── config/             # DB connection, Cloudinary, and Razorpay configs
│   │   ├── constants/          # Status enums, 10 categories, and role constants
│   │   ├── controllers/        # Request handling and HTTP response dispatchers
│   │   ├── middleware/         # Auth guard, RBAC, error handler, rate limiters
│   │   ├── models/             # Mongoose schemas with indexes and hooks
│   │   ├── routes/             # REST endpoint route definitions
│   │   ├── seeder/             # Realistic demo dataset (61 users, 60 jobs, 120 proposals)
│   │   ├── services/           # Business logic (Auth, Cloudinary, Razorpay, Email)
│   │   ├── sockets/            # Socket.io connection handlers and event routers
│   │   └── utils/              # ApiError, ApiResponse, token generators, invoice formatters
└── docs/                       # Architecture, Workflows, API, and Setup Guides
```
