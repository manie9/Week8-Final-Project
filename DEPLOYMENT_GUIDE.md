# Deployment Guide for EcoTrack MERN Application

This guide explains how to deploy the EcoTrack frontend and backend applications using Vercel and Render, respectively, with pnpm and MongoDB Atlas.

---

## Prerequisites

- MongoDB Atlas cluster with connection URI
- Vercel account (https://vercel.com/)
- Render account (https://render.com/)
- GitHub repository with your project code

---

## Backend Deployment on Render

1. **Create a new Web Service on Render:**

   - Go to Render dashboard and click "New" > "Web Service".
   - Connect your GitHub repository.
   - Select the backend directory (e.g., `/backend`) as the root.
   - Set the build command to:
     ```
     pnpm install
     ```
   - Set the start command to:
     ```
     pnpm start
     ```
   - Choose the environment (Node 18+ recommended).
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string.
     - `ACCESS_TOKEN_SECRET`: A secure secret string for JWT signing.
     - `PORT`: (optional) Default is 4000.

2. **Deploy the service.**

3. **Note the service URL (e.g., `https://your-backend.onrender.com`).**

---

## Frontend Deployment on Vercel

1. **Create a new project on Vercel:**

   - Import your GitHub repository.
   - Set the root directory to the frontend folder (e.g., `/frontend`).
   - Set the framework preset to Next.js.
   - Set the build command to:
     ```
     pnpm install && pnpm build
     ```
   - Set the output directory to `.next`.

2. **Set environment variables:**

   - `NEXT_PUBLIC_BACKEND_URL`: The URL of your deployed backend service on Render (e.g., `https://your-backend.onrender.com`).

3. **Deploy the frontend.**

---

## Additional Notes

- Ensure CORS is configured properly on the backend to allow requests from your frontend domain.
- Use secure environment variables and secrets.
- For local development, use `.env` files and `pnpm` to manage dependencies.
- Run backend tests with:
  ```
  cd backend
  pnpm install
  pnpm test
  ```
- Run frontend development with:
  ```
  cd frontend
  pnpm install
  pnpm dev
  ```

---

## Summary

- Backend on Render with MongoDB Atlas and JWT authentication.
- Frontend on Vercel with environment variable pointing to backend.
- Use pnpm for package management.
- Follow best practices for environment variables and security.

This completes the deployment setup for the EcoTrack MERN application.
