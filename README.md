# ReadTogether

ReadTogether is a full-stack reading and book club platform built to make reading more social, organized, and insightful. It combines a modern React interface with a Node.js/Express backend, MongoDB storage, real-time discussion features, and an AI-powered librarian experience for recommendations, summaries, and reading support.

## Features

- User authentication with persistent sessions
- Role-based access for readers and admins
- Reading dashboard with active books, progress insights, and note spaces
- AI librarian workspace for recommendations, summaries, and discussion prompts
- Real-time discussion rooms powered by Socket.IO
- Notes management for themes, reflections, and discussion prep
- Invite generation for sharing book club access
- Admin dashboard for managing users, roles, and saved notes

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Axios, Socket.IO Client
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- AI Integration: OpenRouter-compatible API key flow with recommendation fallbacks

## Project Structure

```text
FRONTEND-BACKEND/
|-- frontend/   # React + Vite client
|-- backend/    # Express API, MongoDB models, Socket.IO server
`-- README.md
```

## Getting Started

### 1. Install dependencies

Install packages in both apps:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Create backend environment file

Create `backend/.env` and add the values your app needs:

```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://127.0.0.1:27017/readtogether
LOCAL_MONGODB_URI=mongodb://127.0.0.1:27017/readtogether
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp
FRONTEND_URL=http://localhost:5173
FRONTEND_APP_URL=http://localhost:5173
PORT=5050
```

Notes:

- `JWT_SECRET` is required for the backend to start.
- `OPENROUTER_API_KEY` is optional if you only want to run the core app without live AI responses.
- In local development, the backend prefers port `5050` and can automatically try nearby fallback ports if needed.

### 3. Optional frontend environment file

If you want to lock the frontend to a specific API URL, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

If this file is not set, the frontend already tries local API fallbacks automatically.

### 4. Run the backend

```bash
cd backend
npm run dev
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

Frontend default:

- `http://localhost:5173`

Backend default:

- `http://localhost:5050`

## Admin Seed

To create the default admin account:

```bash
cd backend
node scripts/seedAdmin.js
```

Default seeded admin credentials:

- Email: `admin@readtogether.com`
- Password: `adminpassword123`

Change the password after first login.

## Available Scripts

### Backend

- `npm run dev` - start the backend with file watching
- `npm start` - start the backend normally

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Why This Project

ReadTogether is designed for readers who want more than a simple book tracker. The goal is to bring together personal reading focus, shared discussion, note-taking, and AI assistance in one experience that feels modern and collaborative.
