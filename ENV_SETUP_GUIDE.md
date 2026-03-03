# 🔐 Environment Variables Setup Guide

This guide will walk you through obtaining all the required environment variables for the Portfolio.Ai project.

---

## 1. 📊 DATABASE_URL (PostgreSQL)

### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed):
   - **Windows**: Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
   - **Mac**: `brew install postgresql` or download from [PostgreSQL Official Site](https://www.postgresql.org/download/macosx/)
   - **Linux**: `sudo apt-get install postgresql` (Ubuntu/Debian)

2. **Start PostgreSQL Service**:
   - **Windows**: Open Services → Find "postgresql" → Start
   - **Mac/Linux**: `sudo service postgresql start` or `brew services start postgresql`

3. **Create Database**:
   ```bash
   # Open PostgreSQL command line
   psql -U postgres
   
   # Create database
   CREATE DATABASE portfolio_db;
   
   # Exit
   \q
   ```

4. **Format DATABASE_URL**:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/portfolio_db?schema=public"
   ```
   - Replace `your_password` with your PostgreSQL password
   - Default username is usually `postgres`
   - Default port is `5432`

### Option B: Cloud Database (Recommended for Beginners)

1. **Sign up for a free PostgreSQL service**:
   - [Supabase](https://supabase.com/) (Recommended - Free tier available)
   - [Neon](https://neon.tech/) (Free tier available)
   - [Railway](https://railway.app/) (Free tier available)
   - [Render](https://render.com/) (Free tier available)

2. **Using Supabase (Easiest)**:
   - Go to https://supabase.com/
   - Click "Start your project" → Sign up/Login
   - Click "New Project"
   - Fill in project details (name, database password)
   - Wait for project to be created
   - Go to **Settings** → **Database**
   - Copy the **Connection string** under "Connection string" → "URI"
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Use this as your `DATABASE_URL`

---

## 2. 🔑 NEXTAUTH_SECRET

This is a random secret key used to encrypt NextAuth sessions.

### Generate Secret Key:

**Option 1: Using OpenSSL (Recommended)**
```bash
# Windows (PowerShell)
openssl rand -base64 32

# Mac/Linux
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- Go to https://generate-secret.vercel.app/32
- Copy the generated secret

**Example output:**
```
NEXTAUTH_SECRET="aBc123XyZ456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890="
```

---

## 3. 🌐 NEXTAUTH_URL

This is the URL where your application is running.

**For Development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**For Production:**
```
NEXTAUTH_URL="https://your-domain.com"
```

---

## 4. 🐙 GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

### Step-by-Step Guide:

1. **Login to GitHub**:
   - Go to https://github.com/
   - Sign in to your account

2. **Navigate to Developer Settings**:
   - Click your profile picture (top right)
   - Click **Settings**
   - Scroll down in the left sidebar
   - Click **Developer settings**

3. **Go to OAuth Apps**:
   - Click **OAuth Apps** in the left sidebar
   - Click **New OAuth App** button

4. **Fill in OAuth App Details**:
   - **Application name**: `Portfolio.Ai` (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
     - ⚠️ **Important**: This must be exactly: `http://localhost:3000/api/auth/callback/github`
   - Click **Register application**

5. **Get Your Credentials**:
   - You'll see a page with your **Client ID** (copy this)
   - Click **Generate a new client secret** button
   - Copy the **Client secret** (you can only see it once!)
   - Save both values securely

6. **For Production** (when deploying):
   - Edit your OAuth App
   - Update **Homepage URL** to your production URL
   - Update **Authorization callback URL** to `https://your-domain.com/api/auth/callback/github`

**Example:**
```
GITHUB_CLIENT_ID="Iv1.8a61f9b7a1234567"
GITHUB_CLIENT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
```

---

## 5. 🤖 GROQ_API_KEY (Groq API)

### Step-by-Step Guide:

1. **Go to the Groq console**: https://console.groq.com/
2. **Sign in or create an account**
3. **Navigate to API Keys section**
4. **Generate a new API key**
5. **Copy the generated key** – store it securely

**Example:**
```
GROQ_API_KEY="your-groq-api-key-here"
GROQ_API_BASE_URL="https://api.groq.com/openai/v1" # optional, defaults to this
GROQ_MODEL="llama-3.3-70b-versatile" # example model name
```

**Note**: 
- Check the Groq docs / console for available models
- The app uses Groq’s OpenAI-compatible chat completions endpoint: `POST /chat/completions`

---

## 📝 Creating Your .env File

1. **Create `.env` file** in the root directory of your project:
   ```bash
   # In the project root directory
   touch .env
   ```

2. **Add all variables** to the `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/portfolio_db?schema=public"

   # NextAuth
   NEXTAUTH_SECRET="your-generated-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # Groq API
   GROQ_API_KEY="your-groq-api-key"
   GROQ_API_BASE_URL="https://api.groq.com/openai/v1" # optional
   GROQ_MODEL="llama-3.3-70b-versatile" # example
   ```

3. **Replace all placeholder values** with your actual credentials

4. **Important**: 
   - Never commit `.env` file to Git (it should be in `.gitignore`)
   - Keep your secrets secure and private
   - Don't share your API keys publicly

---

## ✅ Verification Checklist

- [ ] PostgreSQL database is running and accessible
- [ ] DATABASE_URL is correctly formatted
- [ ] NEXTAUTH_SECRET is generated (32+ characters)
- [ ] NEXTAUTH_URL is set to `http://localhost:3000`
- [ ] GitHub OAuth App is created
- [ ] GITHUB_CLIENT_ID is copied
- [ ] GITHUB_CLIENT_SECRET is generated and copied
- [ ] GitHub callback URL is set correctly
- [ ] Groq API key is obtained
- [ ] GROQ_API_KEY is set
- [ ] GROQ_API_BASE_URL is set (optional)
- [ ] GROQ_MODEL is set (optional)
- [ ] `.env` file is created in project root
- [ ] All values in `.env` are replaced with actual credentials

---

## 🚀 Quick Start Summary

1. **Database**: Use Supabase (free) → Get connection string
2. **NextAuth Secret**: Run `openssl rand -base64 32`
3. **GitHub OAuth**: Create OAuth App at github.com/settings/developers
4. **Groq API**: Get key from the Groq console
5. **Create .env**: Add all variables with your actual values
6. **Run**: `npx prisma generate && npm run dev`

---

## 🆘 Troubleshooting

### Database Connection Issues
- Check if PostgreSQL is running
- Verify username, password, and database name
- Check if port 5432 is correct
- For cloud databases, check if IP is whitelisted

### GitHub OAuth Not Working
- Verify callback URL is exactly: `http://localhost:3000/api/auth/callback/github`
- Check if Client ID and Secret are correct
- Make sure there are no extra spaces in `.env` file

### Groq API Errors
- Verify GROQ_API_KEY is correct
- Check GROQ_API_BASE_URL matches Groq (e.g. https://api.groq.com/openai/v1)
- Ensure GROQ_MODEL is a valid Groq model name
- Check rate limits in the Groq console

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- See the Groq docs for OpenAI-compatible chat completions

