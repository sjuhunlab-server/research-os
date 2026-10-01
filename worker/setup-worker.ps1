$ErrorActionPreference = "Stop"
Write-Host "=== Research OS Claude Worker setup ===" -ForegroundColor Cyan
$url = Read-Host "Supabase Project URL"
$key = Read-Host "Supabase Publishable Key"
$token = Read-Host "Research OS Settings에서 발급한 Worker Token"
$model = Read-Host "Claude model alias (기본 sonnet)"
if ([string]::IsNullOrWhiteSpace($model)) { $model = "sonnet" }
@"
SUPABASE_URL=$url
SUPABASE_PUBLISHABLE_KEY=$key
RESEARCH_OS_WORKER_TOKEN=$token
CLAUDE_MODEL=$model
RESEARCH_OS_POLL_SECONDS=8
"@ | Set-Content -Encoding UTF8 .env.worker

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
  Write-Host "Claude Code CLI가 PATH에 없습니다. Claude Code를 설치/로그인한 뒤 npm run worker를 실행하세요." -ForegroundColor Yellow
} else {
  Write-Host "Claude Code detected:" -ForegroundColor Green
  claude --version
}
Write-Host "Saved .env.worker. Run: npm run worker" -ForegroundColor Green
