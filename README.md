# 🧠 AI Portfolio Builder

AI Portfolio Builder is an AI-powered platform that helps developers, designers, and freelancers create and manage personal portfolios effortlessly. Built with Next.js and powered by generative AI, it automates the portfolio-building process—giving you pixel-perfect, completely customized template-driven portfolios with zero coding required.

## 🌐 Live Demo

🔗 [https://falcon-portfolio-ai.vercel.app/](https://falcon-portfolio-ai.vercel.app/)

## 🚀 What It Does & Features

- 📄 **Resume Parsing:** Upload your resume (PDF or TXT) and we'll extract your key information (skills, experience, projects) directly in the browser.
- 🎨 **Visual Template Selection:** Browse and select from multiple beautifully designed, highly functional UI templates loaded dynamically from the backend. 
- 🤖 **Strict AI Generation:** Uses Groq API to inject your parsed resume details into your exact selected template, guaranteeing that no CSS classes or overarching layouts break while adapting perfectly to your data.
- 🧑‍💻 **Global Unified Profile Navigation:** Features an authenticated unified Dropdown Menu and Avatar (built with `shadcn/ui`) active across every dashboard and generator route for quick navigation.
- 🐙 **Connect GitHub:** Auto-sync your repositories and project details.
- 🌍 **Social Integrations:** Easily link your LinkedIn, Twitter, and other vital platforms.

## 🧩 Built With

- **Next.js 15 (App Router)** – React framework for highly responsive frontend UI and robust backend API routing.
- **TypeScript** – Type-safe development experience.
- **Tailwind CSS & Shadcn/ui** – Utility-first CSS framework styled with stunning Radix UI component primitives.
- **Groq API (`llama-3.3-70b-versatile`)** – Lightning-fast Generative AI engine enforcing strict markup injection.
- **GitHub API** – Auto-sync repositories and pull live project data.
- **NextAuth.js** – Secure authentication and persistent session management.
- **PostgreSQL & Prisma** – Relational database and type-safe ORM for user persistent states.
- **PDF.js** – In-browser Parsing for resume PDFs.
- **Framer Motion** – Smooth and interactive UI animations.

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- GitHub OAuth App credentials
- Groq API key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-portfolio-builder.git
cd ai-portfolio-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Groq API
GROQ_API_KEY="your-groq-api-key"
GROQ_API_BASE_URL="https://api.groq.com/openai/v1" # optional
GROQ_MODEL="llama-3.3-70b-versatile" # example
```

📖 **Need help getting these keys?** See the detailed step-by-step guide in `ENV_SETUP_GUIDE.md`

4. **Generate Prisma Client**
```bash
npx prisma generate
```

5. **Run database migrations** (if needed)
```bash
npx prisma migrate dev
```

6. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Important Architecture & Technical Decisions

- **Local Storage API Loading (`/api/templates`)**: Available layout templates are fetched dynamically rather than via static paths, ensuring new templates can be rapidly drag-and-dropped into `./src/templates` without recompiling frontend routing.
- **Global Auth Layout Injection**: Authentication validation is handled centrally in `src/app/layout.tsx` combined with NextAuth providers, enabling instantaneous rendering and switching of Avatar dropdown options with global navbar mounting.
- **Robust AI Constraints (`generateHTMLHandler`)**: We've programmed strictly defined conditional contexts so the LLM acts as an "injector" (when a template is selected) and a "generator" (when no template is selected).
