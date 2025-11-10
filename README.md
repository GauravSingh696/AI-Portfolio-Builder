# 🧠 AI Portfolio Builder

AI Portfolio Builder is an AI-powered platform that helps developers, designers, and freelancers create and manage personal portfolios effortlessly. Built during a Major League Hacking hackathon, it uses generative AI and social integrations to automate and personalize the portfolio-building process — no coding required.

## 🌐 Live Demo

🔗 [https://falcon-portfolio-ai.vercel.app/](https://falcon-portfolio-ai.vercel.app/)

## 🚀 What It Does

- 📄 Upload your resume (PDF) — we extract key information using AI
- 🐙 Connect GitHub — auto-sync your repositories and project details
- 🎨 Choose from multiple sleek, customizable templates
- ✍️ Edit your portfolio content live — update text, add images, and reorder sections
- 🌍 Integrate platforms like LinkedIn, Twitter, and more
- 🧠 Generate project descriptions, bios, and summaries with Gemini API

## 🧩 Built With

- Next.js – React-based framework for frontend and routing  
- TypeScript – Type-safe development experience  
- Tailwind CSS – Utility-first CSS framework  
- Gemini API – Google’s generative AI for content generation & resume parsing  
- GitHub API – Auto-sync repositories and user data  
- NextAuth.js – Secure authentication and session management  
- PostgreSQL – Relational database to store user data and content  
- Prisma – Type-safe ORM for interacting with PostgreSQL  
- PDF.js – Parsing and reading resume PDFs in-browser  
- Vercel – Hosting and seamless CI/CD  

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- GitHub OAuth App credentials
- Google Gemini API key

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

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
```

📖 **Need help getting these keys?** See the detailed step-by-step guide in [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)

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

### Important Notes

- Make sure to run `npx prisma generate` before starting the dev server
- Ensure your PostgreSQL database is running and accessible
- For GitHub OAuth, create an OAuth App at https://github.com/settings/developers
- Get your Gemini API key from https://makersuite.google.com/app/apikey
