# PromptPilot - Your Intelligent AI Workspace

PromptPilot is a premium, production-ready full-stack AI SaaS application designed to deliver an outstanding conversational user experience. Built with a clean, minimalist design language, it offers natural chat dialogues, persistent database conversation history, context awareness, and beautiful markdown/code formatting, all powered by a robust Node.js backend connected to OpenRouter/Gemini APIs.

---

## Features

- **Smart AI Conversations**: Interactive chat interfaces with context-aware, logical dialogue threads.
- **Chat History**: Sidebar listing past conversations retrieved from MongoDB, allowing users to reload, rename, and delete logs dynamically.
- **Context Awareness**: Remembers conversational messages to maintain logical continuity across requests.
- **Markdown & Code Highlighting**: Beautiful rendering of markdown structures (headers, bold, tables, lists, quotes) and code blocks with syntax highlighting and instant copy buttons.
- **Typing Indicator**: Smooth, glowing, bouncing-dots loading indicator designed with Framer Motion.
- **Beautiful User Experience**: Minimalist design system using a default light theme (`#FFFFFF` background, `#F8FAFC` secondary accent, and `#2563EB` highlight color).
- **Secure Authentication**: JSON Web Token (JWT) architecture to register and sign in user accounts securely.
- **Responsive Layout**: Designed from the ground up for mobile, tablet, and desktop views.

---

## Folder Structure

```text
Ai-ChatBox/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── conversationController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── conversationRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── _redirects
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MarkdownRenderer.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── PageWrapper.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChatContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vercel.json
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
JWT_SECRET=your_jwt_signing_secret
```

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## API Configuration

PromptPilot uses a centralized API configuration at `frontend/src/config/api.js`.
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = `${BASE_URL}/api`;
export default API_BASE_URL;
```
Every Axios endpoint in the frontend uses this exported base URL. Changing the API location for production requires changing only the `VITE_API_BASE_URL` env variable.

---

## Local Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd K-HUB
```

### 2. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server starts on `http://localhost:5000`.

### 3. Run the Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
The client starts on `http://localhost:5173`.

---

## Deployment Guide

### Backend (Render / Railway)
1. Push your repository to GitHub.
2. Sign in to **Render** (or Railway) and create a new **Web Service**.
3. Select your repository.
4. Set the **Build Command** to `npm install` and **Start Command** to `node server.js` (or `npm start`).
5. Under Environment Variables, add:
   - `PORT=5000` (or let Render set it automatically)
   - `MONGODB_URI` (your production MongoDB Atlas URL)
   - `AI_API_KEY` (your OpenRouter/Gemini API key)
   - `JWT_SECRET` (a strong random token)
6. Copy your deployed Render service URL (e.g. `https://promptpilot-api.onrender.com`).

### Frontend (Vercel / Netlify)
1. Sign in to **Vercel** and import a new project.
2. Choose your repository and select the `frontend` folder as the root directory.
3. Under Build and Development settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Under Environment Variables, add:
   - `VITE_API_BASE_URL` = `https://promptpilot-api.onrender.com` (your deployed backend URL)
5. Deploy. The `vercel.json` SPA configuration automatically handles routing redirects on client refreshes.

---

## Troubleshooting

- **CORS Errors**: The backend has CORS whitelisted for all origins (`*`) by default, making development and deployment to arbitrary Vercel domains error-free.
- **Refresh 404s**: Configured redirects in `vercel.json` and `_redirects` ensure Vercel/Netlify map page reload events to `index.html` successfully.
