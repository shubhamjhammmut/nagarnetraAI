# 🚀 NagarNetra AI – Civic Issue Reporting Platform

NagarNetra AI is a smart civic issue reporting platform that allows citizens to report problems like potholes, garbage, waterlogging, etc., using AI-powered image analysis.

It connects citizens with authorities through a modern web interface, real-time tracking, and an admin dashboard.

---

## 🌟 Features

### 👤 Citizen Side

* 📸 Upload image of issue
* 🤖 AI detects issue type, severity & description
* 📍 Select location via map
* ⚡ Automatic urgency calculation
* 🗳️ Duplicate detection & voting system
* 📊 Track issue status (Pending → In Progress → Resolved)

### 🛠️ Admin Dashboard

* 📋 View all reported issues
* 🔄 Update issue status in real-time
* 📊 Dashboard analytics
* 📄 Generate municipal reports (PDF)

### 🤖 AI Features

* Image-based issue detection
* Severity classification
* Auto-generated descriptions
* “Why this matters” explanation

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Firebase (Firestore + Storage)

### Backend

* FastAPI (Python)
* Gemini AI (Google GenAI)
* Pillow (Image processing)

### Deployment

* Frontend: Netlify
* Backend: Vercel

---

## 📁 Project Structure

```
nagarnetraAI/
│
├── frontend/        # React frontend
│   ├── src/
│   ├── components/
│   └── ...
│
├── backend/         # FastAPI backend
│   ├── main.py
│   ├── gemini_detector.py
│   └── ...
```

---

## ⚙️ Setup Instructions

---

# 🖥️ 1. Clone Repository

```bash
git clone https://github.com/shubhamjhammmut/nagarnetraAI.git
cd nagarnetraAI
```

---

# 🌐 2. Frontend Setup

```bash
cd frontend
npm install
```

### ▶️ Run locally

```bash
npm run dev
```

### 🔨 Build for production

```bash
npm run build
```

---

## 🔑 Environment Variables (Frontend)

Create `.env` in frontend:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

# ⚙️ 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### ▶️ Run locally

```bash
uvicorn main:app --reload
```

---

## 🔑 Environment Variables (Backend)

Create `.env` in backend:

```
GEMINI_API_KEY=your_gemini_api_key
```

---

# 🔗 4. Connect Frontend & Backend

Replace API URL in frontend:

```ts
const API_URL = "https://your-backend.vercel.app";
```

---

# ☁️ Deployment

---

## 🚀 Frontend (Netlify)

### Option 1: Manual Deploy

1. Run:

```bash
npm run build
```

2. Upload:

```
frontend/build
```

### Option 2: GitHub Deploy

* Build command: `npm run build`
* Publish directory: `build`

---

## ⚡ Backend (Vercel)

1. Connect GitHub repo
2. Set root directory: `backend`
3. Add environment variable:

```
GEMINI_API_KEY
```

---

# ⚠️ Important Notes

* ❌ Do NOT use `localhost` in production
* ❌ Do NOT write files in Vercel (read-only FS)
* ✅ Use in-memory image processing
* ✅ Use Firebase Storage for images

---

# 🐞 Common Errors & Fixes

### ❌ 500 Error on Upload

👉 Fix backend file handling (use memory instead of saving file)

### ❌ Image not showing

👉 Use Firebase Storage URL (not blob URL)

### ❌ Netlify “dist not found”

👉 Upload `build/` folder only

### ❌ Gemini API errors

👉 Ensure correct model + API key

---

# 👨‍💻 Author

**Shubham Kumar Jha**

* 🏆 Finalist – Disrupt IIT Guwahati
* 💻 Web Developer | Coder

---

# 🌍 Future Improvements

* Real-time notifications
* Government API integration
* Mobile app version
* AI model improvements
* Heatmaps for issue clustering

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
