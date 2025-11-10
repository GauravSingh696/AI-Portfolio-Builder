# 🔍 PostgreSQL Username कैसे पता करें

## Method 1: Default Username (सबसे आसान)

**ज्यादातर cases में:**
```
username = "postgres"
```

यह default username है जो PostgreSQL install करते समय automatically set होता है।

---

## Method 2: Windows में Check करना

### Step 1: PostgreSQL Command Line खोलें

1. **Windows Search** में जाएँ
2. Type करें: `psql` या `SQL Shell (psql)`
3. Enter दबाएँ

### Step 2: Connection Details देखें

जब psql खुलेगा, तो यह पूछेगा:
```
Server [localhost]:
Database [postgres]:
Port [5432]:
Username [postgres]:  ← यहाँ आपका username दिखेगा
Password for user postgres:
```

**Username वहाँ दिखेगा जो brackets `[]` में है।**

### Step 3: अगर पहले से connected हैं

अगर आप पहले से PostgreSQL में connected हैं, तो यह command run करें:

```sql
SELECT current_user;
```

या

```sql
SELECT user;
```

---

## Method 3: Command Prompt से Check करना

### Windows PowerShell में:

```powershell
# PostgreSQL service check करें
Get-Service postgresql*

# या psql command से
psql -U postgres -c "SELECT current_user;"
```

### Command Prompt में:

```cmd
psql -U postgres -l
```

यहाँ `-U postgres` में `postgres` ही username है।

---

## Method 4: PostgreSQL Installation Folder Check करना

1. **File Explorer** खोलें
2. Navigate करें: `C:\Program Files\PostgreSQL\[version]\data\`
3. `pg_hba.conf` file खोलें (Notepad में)
4. Username वहाँ mention होगा

---

## Method 5: Services में Check करना

1. **Windows + R** दबाएँ
2. Type करें: `services.msc`
3. Enter दबाएँ
4. **PostgreSQL** service ढूँढें
5. Right-click → **Properties**
6. **Log On** tab में username दिखेगा

---

## 🎯 Quick Answer (जल्दी जवाब)

**99% cases में:**
```
Username = "postgres"
```

यह default username है। अगर आपने install करते समय कोई specific username नहीं बनाया, तो `postgres` ही use करें।

---

## 📝 Complete DATABASE_URL Example

अगर आपका:
- **Username**: `postgres` (default)
- **Password**: `mypassword123` (जो आपने set किया था)
- **Database Name**: `portfolio_db`

तो आपकी `.env` file में:

```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/portfolio_db?schema=public"
```

---

## ⚠️ अगर Password याद नहीं है

### Option 1: Password Reset करें

1. `C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf` file खोलें
2. Line ढूँढें: `host all all 127.0.0.1/32 md5`
3. Change करें: `host all all 127.0.0.1/32 trust`
4. PostgreSQL service restart करें
5. अब password के बिना connect हो जाएगा
6. नया password set करें

### Option 2: Supabase Use करें (आसान)

अगर local PostgreSQL में problem है, तो **Supabase** use करें (free और easy):

1. https://supabase.com/ पर जाएँ
2. Sign up करें
3. New Project बनाएँ
4. Settings → Database
5. Connection string copy करें
6. `.env` में paste करें

Supabase में username हमेशा `postgres` होता है, और password आप project create करते समय set करते हैं।

---

## ✅ Final Check

अपना username verify करने के लिए:

```bash
# PowerShell में
psql -U postgres -c "SELECT current_user;"
```

अगर यह command काम करे, तो आपका username `postgres` है!

---

## 🆘 अगर अभी भी Problem है

1. **Supabase use करें** (सबसे आसान solution)
2. या **PostgreSQL reinstall** करें और username/password note करें

