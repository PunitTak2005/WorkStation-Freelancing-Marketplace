# Production Deployment Guide

This guide covers how to deploy the Workstation application to production using **Render** for the backend and **Vercel** for the frontend.

## 1. Database & Services Prep

Before deploying, ensure you have production-ready accounts and credentials for:
- **MongoDB Atlas**: Ensure IP Access List allows connections from everywhere (`0.0.0.0/0`) or specific Render IPs. Use a strong password.
- **Cloudinary**: Create a production environment if needed.
- **Razorpay**: Switch to Live Mode to get production keys (only when ready for real transactions).
- **Email Service**: Use a real SMTP provider (e.g., SendGrid, AWS SES) instead of Mailtrap.

## 2. Backend Deployment (Render)

Render is excellent for hosting Node.js applications.

1. Create a [Render](https://render.com/) account and link your GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your Workstation repository.
4. Configure the service:
   - **Name**: `Workstation-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (Ensure you have `"start": "node index.js"` in `package.json`)
5. **Environment Variables**: Add all variables from your `.env` file.
   - Set `NODE_ENV` to `production`.
   - Update `FRONTEND_URL` to your future Vercel domain (e.g., `https://Workstation-app.vercel.app`).
6. Click **Create Web Service**. Render will build and deploy your API.

*Note the URL provided by Render (e.g., `https://Workstation-api.onrender.com`). You will need this for the frontend.*

## 3. Frontend Deployment (Vercel)

Vercel provides seamless deployment for Vite/React applications.

1. Ensure you have the `vercel.json` file in your `client` directory (handles client-side routing).
2. Create a [Vercel](https://vercel.com/) account and link your GitHub.
3. Click **Add New...** -> **Project**.
4. Import your Workstation repository.
5. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
6. **Environment Variables**:
   - `VITE_API_URL`: Your Render API URL + `/api` (e.g., `https://Workstation-api.onrender.com/api`)
   - `VITE_SOCKET_URL`: Your Render API URL (e.g., `https://Workstation-api.onrender.com`)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID
7. Click **Deploy**.

## 4. Post-Deployment Checks

1. **CORS**: Double-check that the backend `FRONTEND_URL` exactly matches the Vercel URL. If you add a custom domain later, update the backend environment variable.
2. **Websockets**: Test the real-time chat and notifications to ensure Socket.io connects properly over WSS.
3. **Uploads**: Test profile picture or portfolio uploads to verify Cloudinary integration in production.
4. **Payments**: Perform a test transaction (if Razorpay is still in test mode) to ensure the webhook/verification flow works.

## Custom Domain Setup

- **Frontend**: In Vercel, go to Project Settings -> Domains and add your custom domain. Update DNS records as instructed.
- **Backend (Optional)**: In Render, go to Settings -> Custom Domains.

*Remember to update environment variables on both ends if domains change!*
