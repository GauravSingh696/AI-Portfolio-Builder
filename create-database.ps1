# PowerShell Script to Create PostgreSQL Database
# Run this script if you have PostgreSQL installed locally

Write-Host "Creating PostgreSQL Database..." -ForegroundColor Green

# PostgreSQL connection details
$PGUSER = "postgres"
$PGHOST = "localhost"
$PGPORT = "5432"
$DBNAME = "portfolio_db"

# Get password from user
$PGPASSWORD = Read-Host "Enter PostgreSQL password for user '$PGUSER'" -AsSecureString
$PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($PGPASSWORD)
)

# Try to find psql
$psqlPath = $null
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "psql.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        break
    }
    # Try to find in PATH
    $found = Get-Command $path -ErrorAction SilentlyContinue
    if ($found) {
        $psqlPath = $found.Source
        break
    }
}

if (-not $psqlPath) {
    Write-Host "ERROR: PostgreSQL (psql) not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or use Supabase instead." -ForegroundColor Yellow
    Write-Host "See SUPABASE_SETUP.md for instructions." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found psql at: $psqlPath" -ForegroundColor Green

# Set environment variable for password
$env:PGPASSWORD = $PGPASSWORD

# Create database
Write-Host "Creating database '$DBNAME'..." -ForegroundColor Yellow

$createDbCommand = "CREATE DATABASE $DBNAME;"
$result = & $psqlPath -U $PGUSER -h $PGHOST -p $PGPORT -d postgres -c $createDbCommand 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database '$DBNAME' created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: npx prisma migrate dev" -ForegroundColor White
    Write-Host "2. Run: npm run dev" -ForegroundColor White
} else {
    if ($result -match "already exists") {
        Write-Host "⚠️  Database '$DBNAME' already exists!" -ForegroundColor Yellow
        Write-Host "You can proceed with migrations." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error creating database:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Check if PostgreSQL is running" -ForegroundColor White
        Write-Host "2. Verify username and password" -ForegroundColor White
        Write-Host "3. Check if PostgreSQL service is started" -ForegroundColor White
        Write-Host "4. Consider using Supabase (see SUPABASE_SETUP.md)" -ForegroundColor White
    }
}

# Clear password from environment
$env:PGPASSWORD = $null

