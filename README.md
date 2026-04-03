# 🌐 TaskPlanet — Mini Social Post App

> A production-grade full-stack social posting application built for the **3W Full Stack Internship Assignment**.
> Inspired by the TaskPlanet social feed — clean, modern, and fully functional.

---

## 🔗 Live Demo

| | URL |
|---|---|
| 🌐 **Frontend** | https://social-media-taskplanet.vercel.app |
| ⚙️ **Backend API** | https://socialsphere-api.onrender.com/api |
| 💓 **Health Check** | https://socialsphere-api.onrender.com/health |

> **Demo Account:** `alex@demo.com` / `demo1234`

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT-based signup & login, token stored in localStorage |
| 📝 Create Posts | Text, image, or both — Cloudinary CDN for images |
| 🌍 Public Feed | Infinite scroll, newest posts first |
| ❤️ Like / Unlike | Instant optimistic UI update |
| 💬 Comments | Live comment count, modal with all comments |
| 🔍 Search | Debounced search by content or username |
| 📊 Filter | All / Most Liked / Most Commented |
| 🔥 Trending | Trending hashtags sidebar |
| 👥 Suggestions | Who to follow panel |
| 📱 Responsive | Mobile-first, works on all screen sizes |
| 🎨 Modern UI | Glassmorphism, animations, skeleton loading |
| 🎉 Confetti | Burst animation on post creation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Bootstrap, Custom CSS |
| Backend | Node.js 20, Express 4, Mongoose |
| Database | MongoDB Atlas (M0 Free Tier) |
| Auth | JWT HS256 + bcryptjs (12 salt rounds) |
| Images | Cloudinary CDN |
| Deploy | Vercel (FE) + Render (BE) |

---

## 🏗️ Architecture

```
Browser (React 18 + Vite)
        │
        │ HTTPS REST API
        ▼
Backend (Node.js + Express) — Render.com
        │
        │ Mongoose ODM
        ▼
Database (MongoDB Atlas)
        │
        ▼
Media (Cloudinary CDN)
```

---

## 📁 Project Structure

```
socialsphere/
├── backend/
│   ├── config/          # DB + Cloudinary setup
│   ├── middleware/       # JWT auth, error handler, rate limiter, upload
│   ├── models/          # User + Post mongoose schemas
│   ├── routes/          # auth + posts REST routes
│   ├── utils/           # JWT token generator
│   ├── seed.js          # Demo data seeder
│   └── server.js        # Express app entry point
│
└── frontend/
    └── src/
        ├── api/         # Axios instance with JWT interceptor
        ├── components/  # Navbar, PostCard, CreatePost, CommentModal...
        ├── context/     # AuthContext (global auth state)
        ├── pages/       # Login, Signup, Feed
        ├── styles/      # CSS design system
        └── utils/       # Date formatter, hashtag parser
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login + get JWT |
| GET | `/api/posts` | No | Get paginated feed |
| POST | `/api/posts` | ✅ | Create post |
| PUT | `/api/posts/:id/like` | ✅ | Toggle like |
| POST | `/api/posts/:id/comment` | ✅ | Add comment |
| DELETE | `/api/posts/:id` | ✅ | Delete own post |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Backend
```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Seed demo data
```bash
cd backend
node seed.js
```

---

## 🔐 Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens expire in 7 days
- Rate limiting: 100 req / 15 min per IP
- CORS restricted to whitelisted origins
- `password` field never returned in API responses
- Author-only post deletion enforced server-side

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| < 576px (mobile) | Full-width feed, bottom-sheet modal |
| 576–768px (sm) | Centered feed, compact cards |
| 768–992px (tablet) | 680px centered feed |
| 992px+ (desktop) | Two-column layout with sidebar |

---

## 👤 Author

**Vedant** — 3W Full Stack Internship Assignment
- GitHub: [@Vedant294](https://github.com/Vedant294)
- Repo: [Social-media-Taskplanet](https://github.com/Vedant294/Social-media-Taskplanet)
