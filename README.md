# SmartHire AI — Campus Recruitment Management System

An obsidian-themed, AI-powered **Campus Recruitment Management System** designed for students, recruiters, and placement administrators. SmartHire AI automates resume review, generates career action feedback, matches candidates programmatically, simulates interview rounds, and visualizes hiring pipelines in real time.

---

## 🚀 Key Features

### 👨‍🎓 Student Portal
*   **Intelligent Dashboard**: View active application states, placement funnel ratios, and recommended job drives.
*   **Explore Drives**: Search and filter positions with live **AI Match Score** calculations (scoring CGPA, skills overlay, degree match, and batch year).
*   **AI Copilot Tools**:
    *   *Skill Extractor*: Paste resume bios to dynamically inventory technical competencies.
    *   *Match Analyzer*: Compare algorithmic breakdowns side-by-side with semantic review verdicts.
    *   *Coaching Feedback*: Generate detailed SWOT reports and actionable preparation timelines.
*   **ATS Resume Builder**: Pick from 10 print-optimized HTML templates, edit profiles in real time, and compile A4 resumes using `html2pdf.js`.
*   **Interview Prep**: Generate simulated study questions and complete interactive, timed MCQ placement exams.

### 🏢 Recruiter Portal
*   **Placement Metric Summaries**: Monitor total applicant counts, selection metrics, and average profile score alignments.
*   **Campaign Board**: Publish, edit, and open/close positions. Define strict cutoff rules for degrees, CGPA, and specific skill clusters.
*   **Candidate Pipelines**: Review matching statistics, trigger status transitions (Applied ➔ Test ➔ Interview ➔ Selected/Rejected), view full candidate sheets, and export recruitment records to CSV.

### 👑 Campus Administrator Portal
*   **Overview KPI Center**: Review student registration growth, corporate engagement levels, and overall placement success rates.
*   **Directories**: Audit and manage enrolled candidate sheets, partner company profiles, and posted campaigns.
*   **Analytics Panel**: View 4 dynamic charts detailing:
    *   *Submissions Timeline* (Area chart)
    *   *Hires by Department* (Bar chart)
    *   *Corporate Engagements* (Grouped comparative chart)
    *   *Pipeline Stages* (Donut distribution chart)
*   **Bulk provisioning**: Directly pre-provision student and recruiter credentials.

---

## 🛠️ Technology Stack
*   **Core**: React 18 + Vite (configured with SPA fallback routes)
*   **Styling**: Tailwind CSS (custom dark theme + glassmorphism UI)
*   **Charts**: Recharts (fully responsive canvas charts)
*   **Export Tools**: `html2pdf.js` (A4 print-to-PDF compilation) + custom CSV exporters
*   **AI API Client**: Custom API wrapper matching Google Gemini and Anthropic Claude endpoints

---

## 📂 Project Structure

```
smarthire-ai/
├── public/
│   └── _redirects              # Netlify SPA routing redirects
├── src/
│   ├── main.jsx                # React Entry & DB initialization
│   ├── App.jsx                 # Base Router + RequireAuth session guards
│   ├── index.css               # Tailwind directives + font definitions
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx     # Navigation sidebar (Student, Recruiter, Admin)
│   │   │   └── TopBar.jsx      # Header with user profiles and logout controls
│   │   ├── shared/
│   │   │   └── Chatbot.jsx     # Multi-turn placement chatbot assistant
│   │   └── ui/
│   │       ├── Badge.jsx       # Selection status indicator badges
│   │       ├── ScoreBar.jsx    # Weighted match progress bars
│   │       ├── StatCard.jsx    # Glassmorphic KPI widgets
│   │       ├── Toast.jsx       # Custom notification overlay containers
│   │       ├── Modal.jsx       # Responsive modal backdrop frames
│   │       └── Skeleton.jsx    # Content loading animation placeholders
│   │
│   ├── data/
│   │   └── seed.js             # Initial mock dataset (Students, Companies, Drives)
│   │
│   ├── hooks/
│   │   ├── useSession.js       # Session control wrapper
│   │   └── useToast.jsx        # Notification dispatch hooks
│   │
│   ├── pages/
│   │   ├── Landing.jsx         # Portal gateway with statistics counters
│   │   ├── Login.jsx           # Multi-role authentication page
│   │   ├── register/           # Role-specific sign-up sheets
│   │   ├── student/            # Student workspace pages
│   │   ├── company/            # Recruiter workspace pages
│   │   └── admin/              # Admin workspace pages
│   │
│   └── utils/
│       ├── storage.js          # LocalStorage CRUD client
│       ├── aiScore.js          # Skill-cluster mapping algorithm
│       ├── claudeApi.js        # Flexible API client (Gemini/Claude)
│       ├── resumeTemplates.js  # 10 ATS-friendly resume templates
│       └── csvExport.js        # CSV generation helper
│
├── tailwind.config.js          # Obsidian color theme configurations
├── vite.config.js              # Routing and server configs
├── netlify.toml                # Netlify deployment configurations
└── .env.example                # API environment configurations template
```

---

## ⚙️ Installation & Setup

1.  **Clone/Extract** the project folder.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment API Keys**:
    Copy `.env.example` to `.env` in the root directory:
    ```bash
    cp .env.example .env
    ```
    Configure your Google Gemini API key:
    ```env
    VITE_GEMINI_KEY=your_gemini_api_key
    ```
    *Note: The API client is pre-configured to prioritize Google Gemini Flash models when standard keys are present.*
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Compile Production Build**:
    ```bash
    npm run build
    ```

---

## 💾 Local Storage Engine
On the first application render, `seed.js` triggers initialization and establishes structured datasets in your browser's local storage:
*   `smarthire_students`: Candidate profiles and academic scores.
*   `smarthire_companies`: Recruiter portals metadata.
*   `smarthire_drives`: Job requirements and eligibility criteria.
*   `smarthire_applications`: Placement pipeline submissions tracking dates, statuses, and scores.

Pre-seeded accounts can be accessed using credentials specified on the portal's `Landing` and `Login` pages.
