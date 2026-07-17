# AI ATS Resume Analyzer & Score Auditor

A premium, responsive full-stack SaaS web application to parse resumes, analyze compatibility against target job descriptions using Google Gemini AI, generate detailed ATS audit reports, and manage scan histories.

Built with **React, Vite, Tailwind CSS (v3), Framer Motion, Node.js, Express, MongoDB (Mongoose)**, and the official **Google Gen AI SDK (`@google/genai`)**.

---

## Key Features

1. **AI ATS Scoring & Breakdown**: Animated SVG score gauge and Recharts stats mapping keyword density, visual formatting, achievement impact, and structure.
2. **Job Description Alignment**: Paste any job description to evaluate keyword matches and custom recommendations.
3. **Structured Resume Parsing**: Extracts contact details, education history, work experience summary, and inferred skills.
4. **Sleek Display preferences**: Instant dark/light mode toggle with custom glassmorphism styles and smooth animations.
5. **Print & Export Audits**: Layout designed with CSS media print properties, allowing clean PDF report downloads.
6. **Authentication & History**: Account registration and login via hashed passwords and JWT validation to save resume history.

---

## Directory Structure

```
AI Resume Analyzer/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Sidebar, Navbar, ThemeToggle, Loader
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── pages/       # Landing, Login, Register, Dashboard, Upload, Analysis, History, Settings
│   │   ├── services/    # api.js (Axios)
│   │   └── App.jsx      # Router & Layout paths
│   └── tailwind.config.js
└── server/              # Node.js + Express Backend
    ├── controllers/     # Auth & Resume logical handlers
    ├── middleware/      # Auth & Multer upload limits
    ├── models/          # Mongoose Schemas (User, Analysis)
    ├── routes/          # Express route endpoints
    └── server.js        # Main entry point
```

---

## Setup & Running Guide

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or a MongoDB Atlas URI string)
- **Gemini API Key** (Obtained from [Google AI Studio](https://aistudio.google.com))

---

### 1. Backend Server Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in `server/.env`:
   - Duplicate `.env.example` as `.env` (already done for local development).
   - Edit `GEMINI_API_KEY` to include your valid API key.
4. Start the server (runs on port `5000` by default):
   - For production: `npm start`
   - For hot-reloaded development: `npm run dev`

---

### 2. Frontend Client Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Log in and retrieve JWT token
- `GET /profile` - Retrieve logged-in user profile (requires Bearer Token)
- `PUT /profile` - Update user details (requires Bearer Token)

### Resumes & History (`/api/resume`)
- `POST /upload` - Upload PDF/DOCX file and parse/analyze with Gemini (requires Bearer Token)
- `GET /history` - List all past scans for the user (requires Bearer Token)
- `GET /history/:id` - Fetch details for a specific analysis (requires Bearer Token)
- `DELETE /history/:id` - Remove a scan from history (requires Bearer Token)
