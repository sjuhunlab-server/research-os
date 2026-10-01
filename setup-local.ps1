$ErrorActionPreference = "Stop"
Write-Host "=== Research OS local setup ===" -ForegroundColor Cyan

$url = Read-Host "Supabase Project URL (https://xxxxx.supabase.co)"
$key = Read-Host "Supabase Publishable Key (sb_publishable_...)"

@"
NEXT_PUBLIC_SUPABASE_URL=$url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$key
"@ | Set-Content -Encoding UTF8 .env.local

Write-Host "Created .env.local" -ForegroundColor Green
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js가 없습니다. https://nodejs.org 에서 LTS를 설치한 뒤 다시 실행하세요." -ForegroundColor Red
  exit 1
}
Write-Host "Installing packages..."
npm install
Write-Host "Starting Research OS at http://localhost:3000" -ForegroundColor Green
npm run dev
