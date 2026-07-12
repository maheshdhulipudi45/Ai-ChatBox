# K-Hub AI Chatbot Web Application

A production-ready Full Stack AI Chatbot Web Application inspired by ChatGPT. Built for the K-Hub Junior Developer Intern assignment, utilizing React 19 + Vite on the frontend, Node.js + Express.js on the backend, and MongoDB Atlas for message history persistence, all connected to the Google Gemini API using the modern `@google/genai` SDK.

---

## Features

- **Start a New Conversation**: Clean layout matching modern chatbots with suggestions to start chatting instantly.
- **View Conversation History**: Sidebar loading past conversations retrieved from MongoDB.
- **Continue Previous Conversations**: Click history items to reload the context and messages.
- **Rename Conversations**: Double-click or use the inline edit icon to rename conversations dynamically.
- **Delete Conversations**: Easily clear conversations along with their message histories.
- **Maintain Conversation Context**: Automatically passes previous messages inside a conversation to Gemini for contextual continuity.
- **Markdown & Code Highlighting**: Beautiful rendering of markdown formatting (headers, tables, lists, quotes) and code blocks with syntax highlighting and dynamic Copy buttons.
- **Typing Indicator**: Smooth, glowing bouncing-dots animation using Framer Motion.
- **Error Handling**: Friendly warnings for quota limits, bad API keys, or connection drops.
- **Fully Responsive**: Collapsible sidebar navigation optimized for mobile, tablet, and desktop views.

---

## Tech Stack

### Frontend
- **React 19** & **Vite** (Next-generation frontend tooling)
- **Tailwind CSS v4** (Modern styles, zero config files)
- **React Router DOM** (Routing navigation)
- **Axios** (API requests client)
- **React Markdown** & **React Syntax Highlighter** (Content rendering)
- **Framer Motion** (Fluid micro-animations)
- **React Icons** (SVG iconography)

### Backend
- **Node.js** & **Express.js** (Server platform and framework)
- **MongoDB Atlas** & **Mongoose** (Database persistent storage)
- **@google/genai** (Official Google Gen AI SDK)
- **dotenv** (Configuration environment manager)
- **cors** (Cross-origin sharing)
- **jsonwebtoken** & **bcryptjs** (JWT Architecture prepared for user authorization extensions)

---

## Folder Structure

```text
K-HUB/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── conversationController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Conversation.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   └── conversationRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── MarkdownRenderer.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── context/
│   │   │   └── ChatContext.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_signing_secret
```

---

## How to Configure Services

### How to get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google account.
3. Click on the **Create API Key** button.
4. Copy the API key and paste it as `GEMINI_API_KEY` in `backend/.env`.

### How to configure MongoDB Atlas
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared Free tier is fine).
3. Set up database security:
   - Create a database user with username and password.
   - Allow access from anywhere (`0.0.0.0/0` IP whitelist for testing/development).
4. Click **Connect** on your cluster, select **Drivers**, and copy the connection string.
5. Replace `<password>` with your user's password, append a custom database name if desired (e.g. `/khub_chatbot`), and paste it as `MONGODB_URI` in `backend/.env`.

---

## Installation & Running Locally

### 1. Clone the project
```bash
git clone <repository-url>
cd K-HUB
```

### 2. Run the Backend
```bash
cd backend
npm install
npm run dev
```
The server will connect to MongoDB Atlas and start running on `http://localhost:5000`.

### 3. Run the Frontend
Open a new terminal session in the project root:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will open the application at `http://localhost:5173`.

---

## API Endpoints

The backend exposes the following RESTful routing endpoints under the `/api` prefix:

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/chat` | Send a user message and fetch the AI response | `{ "content": "text", "conversationId": "id" }` |
| **GET** | `/api/conversations` | Retrieve all historical conversations | None |
| **GET** | `/api/conversations/:id` | Retrieve a conversation and its message list | None |
| **PUT** | `/api/conversations/:id` | Rename a conversation's title | `{ "title": "new name" }` |
| **DELETE** | `/api/conversations/:id`| Delete a conversation and all its messages | None |

---

## Build & Deployment

### Build Commands
- **Frontend production build**:
  ```bash
  cd frontend
  npm run build
  ```
  Generates optimized static client assets in `frontend/dist`.

### Deployment

#### Frontend on Vercel
1. Set up a Vercel project connected to your repository.
2. Root directory: `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://khub-chatbot.onrender.com/api`).

#### Backend on Render
1. Set up a Web Service on Render.
2. Root directory: `backend`.
3. Build Command: `npm install`.
4. Start Command: `npm start` (or `node server.js`).
5. Add Environment Variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `PORT`: `5000` or Render's automatic port selection.

---

## Screenshots Placeholder
Below are placeholders for the interface:
- **Chat Welcome Screen**: `[screenshot_welcome_darkmode.png]`
- **Active Code Highlighting**: `[screenshot_code_prism.png]`
- **Responsive History Drawer**: `[screenshot_mobile_drawer.png]`
