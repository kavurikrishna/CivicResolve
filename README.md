# CivicResolve — AI-Powered Civic Issue Reporting & Resolution Platform

> 🏆 Built for AI Hackathon | Powered by Google Gemini AI + Next.js

CivicResolve is a production-quality, full-stack web application that empowers citizens to report public infrastructure issues and helps administrators resolve them efficiently using Google Gemini AI.

---

## 🚀 Features

### For Citizens
- **📝 Report Issues** — Submit civic complaints with title, description, location, and optional photo
- **🤖 AI Classification** — Google Gemini AI automatically classifies, prioritizes, and routes complaints
- **🔍 Track Complaints** — Real-time tracking with unique complaint IDs and status timeline
- **🗺️ Issue Map** — Visualize reported issues on an interactive map with priority-based markers
- **📊 Dashboard** — Personal overview with charts showing complaint statistics

### For Administrators
- **🛡️ Admin Dashboard** — Secure management panel with role-based access control
- **🔧 Complaint Management** — Full CRUD operations on complaints with search and filters
- **📈 Analytics** — Department workload charts, resolution performance metrics
- **⚡ Status Updates** — Add notes, update status, reassign departments
- **🤖 AI Review** — View complete Gemini AI analysis for each complaint

### AI Features
- **Google Gemini** — Intelligent complaint analysis, priority detection, department routing
- **Fallback Mode** — Keyword-based classification when Gemini is unavailable
- **Duplicate Detection** — Identifies similar open complaints
- **Urgency Assessment** — Multi-factor priority scoring (safety, severity, impact)

---

## 🛠️ Technology Stack

| Technology | Usage |
|---|---|
| **Next.js 14** | Full-stack React framework with App Router |
| **TypeScript** | Type-safe codebase |
| **Tailwind CSS** | Utility-first styling |
| **Google Gemini AI** | AI complaint analysis via REST API |
| **Firebase** (optional) | Persistent cloud storage + authentication |
| **Leaflet / React-Leaflet** | Interactive map visualization |
| **Recharts** | Analytics charts |
| **Lucide React** | Icon library |
| **React Hot Toast** | Notifications |

---

## 📋 Prerequisites

- Node.js 18.17+ (LTS recommended)
- npm or pnpm
- Google Gemini API key (optional — app works without it)
- Firebase project (optional — app uses localStorage in demo mode)

---

## ⚡ Quick Start

### 1. Clone and install

```bash
git clone <repository-url>
cd civicresolve
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - Firebase (app works without these)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Getting Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API key"** → **"Create API key"**
4. Copy the key and add it to `.env.local`

The app works **without an API key** using intelligent keyword-based fallback classification.

---

## 🏗️ Project Structure

```
civicresolve/
├── app/
│   ├── (app)/              # App layout group (with sidebar)
│   │   ├── dashboard/      # Citizen dashboard
│   │   ├── report/         # Submit complaint form
│   │   ├── track/          # Track complaint status
│   │   ├── map/            # Issue map visualization
│   │   └── admin/          # Admin management panel
│   ├── api/
│   │   ├── analyze/        # Gemini AI analysis endpoint
│   │   └── admin/          # Admin API endpoints
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Sidebar, Topbar
│   ├── ui/                 # Reusable components (Badge, Button, Card, ComplaintCard)
│   └── MapComponent.tsx    # Leaflet map
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── utils.ts            # Utility functions, constants
│   ├── storage.ts          # LocalStorage persistence + demo data
│   ├── firebase.ts         # Firebase configuration
│   └── aiAnalysis.ts       # Fallback AI classification
├── __tests__/              # Jest test suite
├── .env.example            # Environment template
└── README.md
```

---

## 🎮 Demo Mode

**CivicResolve runs fully without any API keys.** In demo mode:

- **Storage**: Browser localStorage (persists across sessions)
- **AI**: Keyword-based fallback classification (clearly labeled)
- **Demo data**: 8 realistic sample complaints pre-loaded
- **Reset**: Click "Reset Demo" in the dashboard to restore sample data

---

## 🔐 Security Features

- Gemini API key is **server-side only** (never exposed to browser)
- Admin routes protected by **server-side token verification**
- Input sanitization on all user-provided data
- File upload validation (type + size limits)
- Role-based access control for administrative actions
- Session-based admin authentication

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

Tests cover:
- Utility functions (ID generation, input sanitization, file validation)
- Storage operations (CRUD, demo data integrity)
- Component rendering

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (<768px) | Slide-in sidebar, stacked layouts |
| Tablet (768-1024px) | Collapsible sidebar, 2-column grids |
| Desktop (>1024px) | Fixed sidebar, full multi-column layout |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

Add environment variables in Vercel dashboard.

### Docker

```bash
docker build -t civicresolve .
docker run -p 3000:3000 --env-file .env.local civicresolve
```

---

## 🤝 Issue Categories Supported

| Category | Department |
|---|---|
| 🛣️ Road Damage | Roads and Infrastructure |
| 🗑️ Garbage & Waste | Sanitation and Waste Management |
| 💧 Water & Drainage | Water Supply and Drainage |
| 💡 Street Lighting | Electricity and Public Lighting |
| 🚰 Sewage | Sewage and Plumbing |
| 🏗️ Public Infrastructure | Public Works Department |
| 📋 Other | Urban Development |

---

## 📊 AI Priority Levels

| Priority | Criteria |
|---|---|
| 🔴 Critical | Immediate safety risk, active emergency, risk to life |
| 🟠 High | Significant safety hazard, urgent health risk |
| 🟡 Medium | Moderate quality-of-life impact, non-emergency |
| 🟢 Low | Minor inconvenience, aesthetic issues |

---

## 🏆 Google Technologies Used

1. **Google Gemini 1.5 Flash** — AI complaint analysis and classification
2. **Firebase Firestore** — Cloud database (when configured)
3. **Firebase Authentication** — User auth (when configured)
4. **Google Fonts (Inter)** — Typography

---

## 📄 License

MIT License — built for educational and hackathon purposes.

---

*Built with ❤️ for citizens everywhere — CivicResolve Team*
