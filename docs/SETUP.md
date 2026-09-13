# Local Development Setup Guide

Follow these steps to set up the Workstation project on your local machine for development.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **Yarn**
- **Git**

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Workstation.git
cd Workstation
```

## 2. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### Environment Variables (Server)
Copy the `.env.example` file to `.env` and fill in the values:

```bash
cp .env.example .env
```

**Required Environment Variables:**
- `PORT`: Server port (e.g., 9005)
- `NODE_ENV`: 'development'
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `JWT_EXPIRES_IN`: E.g., '7d'
- `CLOUDINARY_CLOUD_NAME`: From your Cloudinary dashboard
- `CLOUDINARY_API_KEY`: From your Cloudinary dashboard
- `CLOUDINARY_API_SECRET`: From your Cloudinary dashboard
- `RAZORPAY_KEY_ID`: From your Razorpay test account
- `RAZORPAY_KEY_SECRET`: From your Razorpay test account
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For email sending (use Mailtrap for dev)
- `FRONTEND_URL`: Usually `http://localhost:3256`

### External Services Setup

#### MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster.
3. In Database Access, add a new database user.
4. In Network Access, allow access from anywhere (`0.0.0.0/0`) for development.
5. Click "Connect" -> "Connect your application" and copy the connection string. Replace `<password>` with your database user password and paste it as `MONGO_URI` in `.env`.

#### Cloudinary
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Go to your Dashboard and copy the Cloud Name, API Key, and API Secret to your `.env` file.

#### Razorpay
1. Sign up for a [Razorpay](https://razorpay.com/) account.
2. Generate API Keys in **Test Mode** (Settings -> API Keys).
3. Copy Key ID and Key Secret to your `.env` file.

#### Mailtrap (For Email Testing)
1. Sign up for [Mailtrap](https://mailtrap.io/).
2. Create a new inbox and get the SMTP credentials.
3. Add these credentials to your `.env` file.

### Seed Database
Populate your local database with initial test data:
```bash
npm run seed
```

## 3. Client Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

### Environment Variables (Client)
Copy the `.env.example` file to `.env` and update values if necessary:

```bash
cp .env.example .env
```

**Required Environment Variables:**
- `VITE_API_URL`: Usually `http://localhost:9005/api`
- `VITE_SOCKET_URL`: Usually `http://localhost:9005`
- `VITE_RAZORPAY_KEY_ID`: Your Razorpay Test Key ID

## 4. Run the Application

Start the Backend Server (Terminal 1):
```bash
cd server
npm run dev
```

Start the Frontend Dev Server (Terminal 2):
```bash
cd client
npm run dev
```

The application should now be accessible at `http://localhost:3256`.

## Troubleshooting

- **MongoDB Connection Error**: Check your IP whitelist in MongoDB Atlas and ensure the password in the URI doesn't contain special characters that need URL encoding.
- **CORS Errors**: Make sure your `FRONTEND_URL` in the server `.env` exactly matches the URL where your React app is running (`http://localhost:3256`).
- **Socket Connection Fails**: Ensure `VITE_SOCKET_URL` points to the base server URL (e.g., `http://localhost:9005`), not the `/api` route.
