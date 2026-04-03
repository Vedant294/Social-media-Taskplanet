# 🌐 TaskPlanet — Mini Social Post App

> Full-stack social posting application built for the 3W Full Stack Internship Assignment.

## 🔗 Live Demo
- **Frontend:** https://socialsphere.vercel.app
- **Backend API:** https://socialsphere-api.onrender.com/api
- **Health Check:** https://socialsphere-api.onrender.com/health

## ✨ Features
- 🔐 JWT Authentication (Signup / Login)
- 📝 Create posts with text and/or images (Cloudinary)
- 🌍 Public feed with infinite scroll
- ❤️ Like / Unlike with instant UI update
- 💬 Comment with live count update
- 🔍 Search posts by content or username
- 📊 Filter: All / Most Liked / Most Commented
- 📱 Fully responsive (mobile-first)
- 🎨 Modern glassmorphism UI

## 🛠️ Tech Stack
| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 18, Vite, React Bootstrap, Custom CSS |
| Backend  | Node.js, Express.js, Mongoose               |
| Database | MongoDB Atlas                               |
| Auth     | JWT + bcryptjs                              |
| Images   | Cloudinary                                  |
| Deploy   | Vercel (FE) + Render (BE)                   |

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local with: VITE_API_URL=http://localhost:5000/api
npm run dev
```

## 🔌 API Endpoints
| Method | Route                  | Auth | Description         |
|--------|------------------------|------|---------------------|
| POST   | /api/auth/signup       | No   | Register user       |
| POST   | /api/auth/login        | No   | Login user          |
| GET    | /api/posts             | No   | Get paginated posts |
| POST   | /api/posts             | Yes  | Create post         |
| PUT    | /api/posts/:id/like    | Yes  | Toggle like         |
| POST   | /api/posts/:id/comment | Yes  | Add comment         |
| DELETE | /api/posts/:id         | Yes  | Delete own post     |
