# IEMS — Internship Management & Evaluation System

A full-stack MERN application for managing student internships, faculty evaluations, and administrative oversight.

## ✨ Key Features

### 👨‍💼 Admin Panel
- **Internship Management** - View all student internships
- **Student Assignment** - Assign internships to faculty reviewers
- **Faculty Management** - Create and manage faculty members
- **Student Management** - Create and manage student accounts
- **Progress Tracking** - Monitor evaluation status and assignments

### 👨‍🏫 Faculty Dashboard
- **Assigned Internships** - View internships assigned for review
- **Detailed Review** - Access student info, certificates, and recommendations
- **Evaluation System** - Rate internships (1-5 stars) and add remarks
- **Status Verification** - Accept or Reject internship submissions
- **Performance Stats** - Dashboard showing review statistics

### 🎓 Student Features
- **Internship Submission** - Submit internship details with documents
- **Certificate Upload** - Upload internship certificates
- **LOR Attachment** - Add Letters of Recommendation
- **My Internships** - View submitted internships and their status
- **Evaluation Viewing** - See faculty evaluations once completed

---

## 🛠 Tech Stack

- **Frontend:** React.js + Tailwind CSS + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based role system
- **File Upload:** Multer (local storage)
- **Charts:** Recharts

## 📁 Project Structure

```
iems/
├── server/          # Express.js backend
│   ├── config/      # Database connection
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth & upload middleware
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── uploads/     # Uploaded files
│   ├── server.js    # Entry point
│   └── seed.js      # Database seeder
├── client/          # React.js frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Auth context
│   │   └── services/   # API service
│   └── ...
└── README.md
└── FEATURES_GUIDE.md       # Detailed feature documentation
└── WORKFLOW_DIAGRAMS.md    # System flow diagrams
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone and Setup

```bash
cd iems
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/iems
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 4. Seed Database

```bash
cd server
npm run seed
```

This creates default accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@iems.com | admin123 |
| Faculty | faculty@iems.com | faculty123 |
| Student | student@iems.com | student123 |

### 5. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔑 User Roles

### Admin
- View system-wide dashboard with stats & charts
- Manage students (CRUD)
- Manage faculty (CRUD)
- View all internships
- Assign faculty to internships

### Faculty
- View assigned internship dashboard
- Review student internship submissions
- Accept or reject internships
- Evaluate with rating (1-5) and remarks

### Student
- View personal dashboard
- Submit internships with file uploads
- Track submission status
- View faculty evaluation feedback

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Student registration |
| POST | `/api/auth/login` | Public | User login |
| GET | `/api/auth/me` | Auth | Get current user |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET/POST | `/api/admin/students` | Admin | List/create students |
| PUT/DELETE | `/api/admin/students/:id` | Admin | Update/delete student |
| GET/POST | `/api/admin/faculty` | Admin | List/create faculty |
| PUT/DELETE | `/api/admin/faculty/:id` | Admin | Update/delete faculty |
| GET | `/api/admin/internships` | Admin | All internships |
| PUT | `/api/admin/internships/:id/assign` | Admin | Assign faculty |
| GET | `/api/faculty/dashboard` | Faculty | Dashboard stats |
| GET | `/api/faculty/internships` | Faculty | Assigned internships |
| PUT | `/api/faculty/internships/:id/status` | Faculty | Accept/reject |
| PUT | `/api/faculty/internships/:id/evaluate` | Faculty | Add evaluation |
| GET | `/api/student/dashboard` | Student | Dashboard stats |
| POST | `/api/student/internships` | Student | Submit internship |
| GET | `/api/student/internships` | Student | My internships |

## 📄 License

MIT
