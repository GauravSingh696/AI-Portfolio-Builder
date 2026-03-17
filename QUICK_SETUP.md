# ⚡ Quick Setup Reference

## 🎯 Quick Steps to Get All Keys

### 1. DATABASE_URL (PostgreSQL)
**Easiest Method: Use Supabase (Free)**
1. Go to https://supabase.com/
2. Sign up → Create New Project
3. Settings → Database → Copy Connection String
4. Replace `[YOUR-PASSWORD]` with your password

**Format:** `postgresql://postgres:password@host:5432/postgres`

---

### 2. NEXTAUTH_SECRET
**Generate Secret:**
```bash
# Windows/Mac/Linux
openssl rand -base64 32
```
Copy the output and use it as your secret.

---

### 3. NEXTAUTH_URL
**For Development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

---

### 4. GitHub OAuth Credentials
1. Go to https://github.com/settings/developers
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Name**: Portfolio.Ai
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/github` ⚠️
4. Click **Register application**
5. Copy **Client ID**
6. Click **Generate a new client secret** → Copy it

---

### 5. Groq API Key
1. Go to the Groq console: https://console.groq.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the generated key

**Note**: Check Groq documentation for available models and usage.

---

## 📝 Final .env File Template

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/portfolio_db?schema=public"
NEXTAUTH_SECRET="paste-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="paste-github-client-id-here"
GITHUB_CLIENT_SECRET="paste-github-client-secret-here"
GROQ_API_KEY="paste-groq-api-key-here"
GROQ_API_BASE_URL="https://api.groq.com/openai/v1"
GROQ_MODEL="llama-3.3-70b-versatile"
```

---

## ✅ After Setup

1. Run: `npx prisma generate`
2. Run: `npx prisma migrate dev` (if needed)
3. Run: `npm run dev`

---

📖 **For detailed instructions, see [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)**

