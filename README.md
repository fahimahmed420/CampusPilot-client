# CampusPilot

**CampusPilot — Your Student Life Co-Pilot**

CampusPilot is a full‑stack web application designed to help students track class schedules, manage budgets, prepare for exams, and plan study sessions — all in one place. It includes **Pulse Mode**, a one‑click daily agenda generator that blends classes, urgent tasks, and focused Pomodoro sessions into a smart plan.

---

## ✨ Features

### 1. Class Schedule Tracker

* Add, edit, and delete classes (subject, day, time, instructor).
* Color coding per subject.
* Weekly calendar view.
* Optional export to **.ics** (calendar format).

### 2. Budget Tracker

* Track income (allowance, scholarship, part‑time job).
* Track expenses (food, transport, books, entertainment).
* Charts & graphs: monthly pie chart, income vs expense bar chart, trend line.
* **SpendGuard Alert** warns when you’re trending toward overspending.

### 3. Exam Q\&A Generator

* Generate practice questions: MCQs, short answers, and true/false.
* Choose difficulty: Easy, Medium, Hard.
* AI‑powered through an LLM API (if available) with a fallback offline generator.
* Quiz mode with scoring and history tracking.

### 4. Study Planner

* Break large goals into tasks with subject, topic, priority, and deadline.
* Drag & drop tasks onto the weekly schedule.
* Priority badges and overdue highlights.

### 5. Pulse Mode (Unique)

* Builds a Pomodoro‑style agenda for the day using classes, urgent tasks, and budget reminders.
* Automatically inserts short breaks and long breaks.

---

## 🛠 Tech Stack

**Frontend**

* React + TypeScript (Vite)
* React Router
* Zustand (state management)
* React Query (data & cache)
* Tailwind CSS + shadcn/ui
* Recharts (visualizations)

**Backend**

* Node.js + Express
* Firebase Admin SDK (server side authentication verification)
* Firestore (database)
* Zod (validation)

**Other**

* Firebase Authentication (Email/Password, Google Sign‑In)
* Firebase ID tokens for auth (verified on server)
* Optional AI API (OpenAI, etc.) for question generation

---

## 📂 Project structure (high level)

```
/campuspilot
  /client      # React + TypeScript (Vite)
  /server      # Express API (Node.js)
  README.md
  .github/
```

UI layout example (dashboard):

---

## | Navbar: Logo | Dashboard | Tools | Profile     |

\| Sidebar (icons) | Main Content (Dynamic)       |
\|   📅 Schedule   |                               |
\|   💰 Budget     |   → Example: Budget Tracker  |
\|   📖 Planner    |                               |
\|   ❓ Q\&A Gen    |                               |
----------------------------------------------------

## | Footer: Student Life Toolkit © 2025            |

---

## 🔒 Security

* Firebase Auth secures user access.
* Firestore security rules scoped per user document.
* Zod validation on both client and server.
* Server verifies Firebase ID tokens using Firebase Admin SDK.

---

## 🚀 Getting started (local development)

**Prerequisites**

* Node.js >= 18
* pnpm or npm
* A Firebase project with Auth and Firestore enabled
* (Optional) AI API key (OpenAI or similar) for enhanced question generation

### 1. Clone the repo

```bash
# if project contains separate client & server repos, clone both
git clone https://github.com/fahimahmed420/CampusPilot-client.git client
git clone https://github.com/fahimahmed420/CampusPilot-server.git server
# OR if mono-repo
git clone https://github.com/fahimahmed420/CampusPilot.git
```

### 2. Client: install & run

```bash
cd client
# install
pnpm install   # or npm install

# create env file
cp .env.example .env.local
# edit .env.local with values (see example below)

# start dev server
pnpm dev        # or npm run dev
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
pnpm install    # or npm install
cp .env.example .env
# edit .env with values (see example below)

# start dev server
pnpm dev        # or npm run dev
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
pnpm test
pnpm lint

# server
pnpm test
pnpm lint
```

---

## ☁️ Deployment

* Client: Vercel / Netlify / Firebase Hosting (build with `pnpm build`)
* Server: Vercel Serverless / Heroku / Render / Cloud Run
* Use environment variables in your platform’s dashboard for secrets.

---

## 🔁 Data export / import

* Schedule exports: `.ics` generation is available from the client and server endpoints.
* Budget and planner data can be exported/imported as JSON.

---

## 🧪 Fallback offline features

* Q\&A generator uses the AI API when available; if not, a deterministic fallback generator produces questions from saved templates so the app remains usable offline.

---

## 🧩 Extensibility ideas

* Integrate campus maps & room locations.
* Add shared study groups & collaborative Pomodoros.
* Add optional Google Calendar sync.

---

## 🙌 Contributing

Feel free to open issues and PRs. Follow the repo’s contributing guidelines and code style rules. Add tests for new features.

---

## 📷 Screenshots

*(Place screenshots under `/client/public/screenshots` and reference them here.)*

* Dashboard
* Schedule Tracker
* Budget Charts
* Q\&A Generator
* Study Planner
* Pulse Mode Timer

---

## 📝 License

MIT © 2025 Fahim Ahmed

---

If anything here should be adjusted (repository URLs, exact npm scripts, or environment variable names), tell me what to use and I’ll update the README accordingly.
