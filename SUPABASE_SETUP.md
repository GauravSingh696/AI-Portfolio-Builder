# 🚀 Supabase Setup (Easiest Method)

## Step-by-Step Guide

### Step 1: Create Supabase Account
1. Go to https://supabase.com/
2. Click **"Start your project"**
3. Sign up with GitHub/Google/Email

### Step 2: Create New Project
1. Click **"New Project"** button
2. Fill in:
   - **Organization**: Select or create new
   - **Project Name**: `portfolio-ai` (या कोई भी name)
   - **Database Password**: अपना strong password set करें (याद रखें!)
   - **Region**: Choose closest (e.g., `Southeast Asia (Mumbai)`)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be created

### Step 3: Get Connection String
1. Project खुलने के बाद, left sidebar में **Settings** (⚙️ icon) click करें
2. **Database** section में click करें
3. Scroll down to **"Connection string"** section
4. **"URI"** tab select करें
5. Connection string copy करें

**Format:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### Step 4: Update .env File
1. `.env` file खोलें
2. `DATABASE_URL` line को replace करें copied string से
3. `[YOUR-PASSWORD]` को अपने actual password से replace करें

**Example:**
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:[mypassword123]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
```

### Step 5: Run Prisma Migrations
```bash
npx prisma migrate dev
```

या

```bash
npx prisma db push
```

### Step 6: Restart Dev Server
```bash
npm run dev
```

---

## ✅ Advantages of Supabase

- ✅ Free tier available
- ✅ Database automatically created
- ✅ No local installation needed
- ✅ Works from anywhere
- ✅ Easy to manage
- ✅ Automatic backups

---

## 🔧 Troubleshooting

### If connection fails:
1. Check if password is correct (no brackets `[]`)
2. Verify connection string is complete
3. Check if project is active in Supabase dashboard

### If migrations fail:
1. Make sure `.env` file has correct `DATABASE_URL`
2. Run: `npx prisma generate` first
3. Then run: `npx prisma migrate dev`

