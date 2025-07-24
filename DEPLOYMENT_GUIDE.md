# Deployment Guide for EcoTrack MERN Application

This guide explains how to deploy the EcoTrack full-stack MERN application using Vercel for the frontend and Render for the backend, with MongoDB Atlas as the database.

---

## Prerequisites

- MongoDB Atlas cluster set up with connection string ready.
- GitHub repository with your project code.
- Vercel account (https://vercel.com/)
- Render account (https://render.com/)
- pnpm installed locally for development (optional but recommended)

---

## Backend Deployment on Render

1. **Prepare Backend for Deployment**

- Ensure your backend has a `start` script in `backend/package.json` that runs your server, e.g.:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- Make sure your backend reads MongoDB connection string and other secrets from environment variables.

2. **Push Backend Code to GitHub**

- Commit and push all backend code to your GitHub repository.

3. **Create a New Web Service on Render**

- Log in to Render and create a new Web Service.
- Connect your GitHub repository.
- Select the backend folder as the root directory.
- Set the build command to:

```
pnpm install && pnpm run build
```

(if you don't have a build step, just `pnpm install`)

- Set the start command to:

```
pnpm start
```

- Add environment variables in Render dashboard:

  - `MONGODB_URI` (your MongoDB Atlas connection string)
  - Any other secrets your backend requires.

- Choose the instance type and region.
- Deploy the service.

4. **Verify Backend Deployment**

- Once deployed, Render will provide a URL for your backend API.
- Test the API endpoints to ensure they work.

---

## Frontend Deployment on Vercel

1. **Prepare Frontend for Deployment**

- Ensure your frontend `package.json` has the following scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

- Configure your frontend to use the backend API URL from environment variables.

2. **Push Frontend Code to GitHub**

- Commit and push all frontend code to your GitHub repository.

3. **Create a New Project on Vercel**

- Log in to Vercel and import your GitHub repository.
- Set the root directory to the frontend folder.
- Set environment variables in Vercel dashboard:

  - `NEXT_PUBLIC_API_URL` (your deployed backend URL from Render)
  - Any other frontend environment variables.

- Vercel will automatically detect Next.js and set build commands.
- Deploy the project.

4. **Verify Frontend Deployment**

- Access the Vercel URL.
- Test the frontend functionality and API integration.

---

## Additional Notes

- Use `.env` files locally for development but never commit secrets.
- For real-time features, ensure your backend supports WebSocket connections and the frontend connects to the correct backend URL.
- Set up CI/CD pipelines in GitHub Actions or Render/Vercel for automated deployments.
- Monitor logs and errors via Render and Vercel dashboards.

---

## Summary

| Service  | Platform | Root Directory | Build Command           | Start Command | Env Variables                |
|----------|----------|----------------|-------------------------|---------------|-----------------------------|
| Backend  | Render   | backend        | pnpm install && pnpm run build (optional) | pnpm start    | MONGODB_URI, others          |
| Frontend | Vercel   | frontend       | next build              | next start    | NEXT_PUBLIC_API_URL, others  |

---

This completes the deployment setup for your EcoTrack MERN application.
