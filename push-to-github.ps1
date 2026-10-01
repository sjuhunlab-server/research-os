$ErrorActionPreference = "Stop"
Write-Host "=== Push Research OS to GitHub ===" -ForegroundColor Cyan
$repo = Read-Host "GitHub repository HTTPS URL (예: https://github.com/NAME/research-os.git)"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git이 없습니다. https://git-scm.com/download/win 에서 설치한 뒤 다시 실행하세요." -ForegroundColor Red
  exit 1
}
if (-not (Test-Path .git)) { git init }
git add .
git commit -m "Initial Research OS v0.2" 2>$null
$hasOrigin = git remote 2>$null | Select-String -Pattern '^origin$'
if ($hasOrigin) { git remote set-url origin $repo } else { git remote add origin $repo }
git branch -M main
git push -u origin main
Write-Host "Push complete. 연결된 Vercel 프로젝트가 있으면 자동 배포가 시작됩니다." -ForegroundColor Green
