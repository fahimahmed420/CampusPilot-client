# CampusPilot

Live Link : [https://campus-pilot-24c9b.web.app/](https://campus-pilot-24c9b.web.app/)

**CampusPilot — Your Student Life Co-Pilot**

CampusPilot is a full‑stack web application designed to help students track class schedules, manage budgets, prepare for exams, and plan study sessions — all in one place. 

---

## ✨ Features

### 1. Class Schedule Tracker

* Add, edit, and delete classes (subject, day, time, instructor).
* Color coding per subject.
* Weekly calendar view.

### 2. Budget Tracker

* Track income (allowance, scholarship, part‑time job).
* Track expenses (food, transport, books, entertainment).
* Charts & graphs: monthly pie chart, income vs expense bar chart, trend line.

### 3. Exam Q\&A Generator

* Generate practice questions: MCQs, short answers, and true/false.
* Choose difficulty: Easy, Medium, Hard.
* Genarate Questions using Trivia question database.
* Quiz mode with scoring and history tracking.

### 4. Study Planner

* Break large goals into tasks with subject, topic, priority, and deadline.
* Priority badges and overdue highlights.

---

## 🛠 Tech Stack

**Frontend**

* React + TypeScript (Vite)
* React Router
* Tailwind CSS 
* Recharts (visualizations)

**Backend**

* Node.js + Express
* Firebase Admin SDK (server side authentication verification)
* MongoDB (database)

**Other**

* Firebase Authentication (Email/Password, Google Sign‑In)
* Firebase ID tokens for auth (verified on server)

---

## 📂 Project structure (high level)

```
/campuspilot
  /client      # React + JavaScript (Vite)
  /server      # Express API (Node.js)
  README.md
  .github/
```

### UI layout example (Dashboard)

```
---------------------------------------------------
| Navbar: Logo | Dashboard | Tools | Profile      |
---------------------------------------------------
| Sidebar (icons) | Main Content (Dynamic)        |
|   📅 Schedule   |                               |
|   💰 Budget     |   → Example: Budget Tracker   |
|   📖 Planner    |                               |
|   ❓ Q&A Gen    |                               |
---------------------------------------------------
| Footer: Student Life Toolkit © 2025              |
---------------------------------------------------
```

---

## 🔒 Security

* Firebase Auth secures user access.
* Firestore security rules scoped per user document.
* Server verifies Firebase ID tokens using Firebase Admin SDK.

---

## 🚀 Getting started (local development)

**Prerequisites**

* Node.js >= 18
* npm or pnpm
* A Firebase project with Auth and Firestore enabled

### 1. Clone the repo

```bash
# if project contains separate client & server repos, clone both
git clone https://github.com/fahimahmed420/CampusPilot-client.git client
git clone https://github.com/fahimahmed420/CampusPilot-server.git server
```

### 2. Client: install & run

```bash
cd client
# install
npm install   # or pnpm install

# create env file
cp .env.example .env.local
# edit .env.local with values (see example below)

# start dev server
npm dev        # or pnpm run dev
```

**Client env example (.env.local)**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_AI_API_KEY=optional_ai_api_key
```

### 3. Server: install & run

```bash
cd server
npm install    # or pnpm install
cp .env.example .env
# edit .env with values (see example below)

# start dev server
npm dev        # or pnpm run dev
```

**Server env example (.env)**

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email@your-project.iam.gserviceaccount.com
PORT=4000
AI_API_KEY=optional_ai_api_key
```

> Important: When copying the Firebase private key into `.env`, keep newlines escaped (\n) or use a secrets manager.

### 4. Initialize Firestore rules & indexes (local)

* Use Firebase Console or `firebase deploy --only firestore:rules` after configuring the Firebase CLI.

### 5. Running tests & lint

```bash
# client
npm test
npm lint

# server
npm test
npm lint
```

---

## ☁️ Deployment

* Client: Firebase Hosting (build with `npm build`)
* Server: Vercel Serverless 
* Use environment variables in your platform’s dashboard for secrets.

---

## 🧩 Extensibility ideas

* Add shared study groups & collaborative Pomodoros.
* Add optional Google Calendar sync.

---

## 🙌 Contributing

Feel free to open issues and PRs. Follow the repo’s contributing guidelines and code style rules. Add tests for new features.

---


## 📝 License

© 2025 Fahim Ahmed

---

If anything here should be adjusted (repository URLs, exact npm scripts, or environment variable names), tell me what to use and I’ll update the README accordingly.
