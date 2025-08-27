# 📚 CampusPilot – Your Student Life Co-Pilot

CampusPilot is a **full-stack web application** built to make student life easier by helping you **track schedules, manage budgets, prepare for exams, and plan study sessions** — all in one place.  
It also comes with a unique feature called **Pulse Mode**, which generates a daily agenda that blends your classes, tasks, and focus sessions into a smart schedule.

---

## ✨ Features

### 1. 🗓 Class Schedule Tracker
- Add, edit, and delete classes with **subject, day, time, and instructor**.
- Color coding for each subject.
- Weekly calendar view.
- Optional export to **.ics (calendar format)**.

### 2. 💰 Budget Tracker
- Track income (allowance, scholarship, part-time job).
- Track expenses (food, transport, books, entertainment).
- Charts & graphs (monthly pie chart, income vs. expense bar chart, trend line).
- **SpendGuard Alert**: warns when you’re trending toward overspending.

### 3. 📝 Exam Q&A Generator
- Generate random practice questions: **MCQs, short answers, or true/false**.
- Choose difficulty: Easy, Medium, Hard.
- AI-powered (via LLM API if available), with a **fallback question generator** so it works offline too.
- Quiz mode with scoring and history tracking.

### 4. 📑 Study Planner
- Break big study goals into manageable tasks.
- Assign **subject, topic, priority level, and deadline**.
- Drag and drop tasks onto the weekly schedule.
- Visual priority badges and overdue highlights.

### 5. ⚡ Pulse Mode (Unique Feature)
- One-click button that **generates today’s plan**:
  - Pulls in classes, urgent tasks, and budget reminders.
  - Builds a **Pomodoro-style focus timer** agenda with breaks between sessions.
- Keeps students on track without decision fatigue.

---

## 🖼 Screenshots
> *(Add screenshots here after running the app)*  
- Dashboard  
- Schedule Tracker  
- Budget Charts  
- Q&A Generator  
- Study Planner  
- Pulse Mode Timer  

---

## 🛠 Tech Stack

**Frontend**
- React + TypeScript (Vite)
- React Router
- Zustand (state management)
- React Query (server cache & data fetching)
- Tailwind CSS + shadcn/ui (UI components)
- Recharts (visualizations)

**Backend**
- Node.js + Express
- Firebase Admin SDK for authentication
- Firestore (database)
- Zod (validation)

**Other**
- Firebase Authentication (Email/Password, Google Sign-In)
- JWT via Firebase ID Tokens
- Optional AI API integration (OpenAI/Groq/etc.)

---

## 📂 Project Structure

.....



---

## 🔒 Security
- **Firebase Auth** ensures only logged-in students can access their own data.
- **Firestore Security Rules** restrict access to each user’s documents.
- **Input Validation** using Zod both client- and server-side.
- Tokens verified with **Firebase Admin SDK** on backend.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>=18)
- Firebase project (Auth + Firestore enabled)
- (Optional) AI API key for question generation

### 1. Clone the repo
```bash
git clone https://github.com/fahimahmed420/CampusPilot-client
cd CampusPilot-client
