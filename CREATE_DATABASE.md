# 🗄️ Database Setup Guide

## Problem
```
Database `portfolio_db` does not exist on the database server at `localhost:5432`
```

## Solution: Create Database

### Method 1: Using psql (Command Line)

1. **Open PostgreSQL Command Line:**
   - Windows Search में `psql` या `SQL Shell (psql)` type करें
   - Enter दबाएँ

2. **Connect to PostgreSQL:**
   - Server: `localhost` (Enter दबाएँ)
   - Database: `postgres` (Enter दबाएँ)
   - Port: `5432` (Enter दबाएँ)
   - Username: `postgres` (Enter दबाएँ)
   - Password: अपना password enter करें

3. **Create Database:**
   ```sql
   CREATE DATABASE portfolio_db;
   ```

4. **Verify Database Created:**
   ```sql
   \l
   ```
   आपको `portfolio_db` list में दिखना चाहिए

5. **Exit:**
   ```sql
   \q
   ```

### Method 2: Using pgAdmin (GUI)

1. **pgAdmin खोलें**
2. **Servers** → **PostgreSQL** → **Databases** पर right-click करें
3. **Create** → **Database** select करें
4. **Database name**: `portfolio_db` enter करें
5. **Save** करें

### Method 3: Using Command Prompt/PowerShell

```powershell
# PostgreSQL bin folder में जाएँ (adjust path as needed)
cd "C:\Program Files\PostgreSQL\16\bin"

# Database create करें
.\psql.exe -U postgres -c "CREATE DATABASE portfolio_db;"
```

Password enter करने के लिए prompt आएगा।

---

## After Creating Database

1. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev
   ```

2. **Or if migrations already exist:**
   ```bash
   npx prisma db push
   ```

---

## Alternative: Use Supabase (Easier)

अगर local PostgreSQL में problem है, तो **Supabase** use करें:

1. https://supabase.com/ पर जाएँ
2. Sign up करें
3. New Project बनाएँ
4. Settings → Database → Connection string copy करें
5. `.env` file में `DATABASE_URL` update करें

Supabase में database automatically create हो जाता है!

