# Research OS — 여기부터 시작하세요

코드를 이해할 필요 없습니다. **아래 5단계만 하면 됩니다.**

## 1. Supabase DB 만들기 — 한 번만

이미 만든 Supabase `research-os` 프로젝트에서:

1. 왼쪽 `SQL Editor` → `New query`
2. 이 프로젝트의 `supabase/schema.sql` 파일 내용을 **전부 복사**
3. SQL Editor에 붙여넣기
4. `Run` 클릭

성공하면 `profiles`, `projects`, `ideas`, `research_logs`, `research_contexts`, `worker_devices`, `ai_jobs` 테이블이 생성됩니다.

> 프로젝트 생성 옵션은 `Enable Data API = ON`, `Automatically expose new tables = OFF`, `Enable automatic RLS = ON`을 권장합니다. schema.sql이 필요한 API 권한과 RLS를 명시적으로 다시 설정합니다.

## 2. Supabase 값 2개 복사

Supabase 프로젝트 상단의 **Connect** 또는 `Settings → API Keys`에서:

- **Project URL**: `https://xxxxx.supabase.co`
- **Publishable key**: `sb_publishable_...`

두 값만 필요합니다. **Secret key는 이 앱에 필요하지 않습니다.**

## 3. 로컬에서 먼저 실행 — 가장 쉬운 확인 방법

Windows PowerShell에서 압축을 푼 폴더로 이동한 후:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup-local.ps1
```

스크립트가 Supabase URL과 Publishable key를 물어봅니다. 붙여 넣으면 패키지를 설치하고 `http://localhost:3000`을 실행합니다.

처음에는 Google 설정 없이 **이메일/비밀번호로 계정을 만들어 테스트**할 수 있습니다.

## 4. 관리자 지정 — 첫 로그인 후 한 번만

Research OS에 관리자 이메일로 계정을 한 번 만든 뒤:

1. `supabase/promote_admin.sql` 열기
2. `YOUR_ADMIN_EMAIL@example.com`을 실제 관리자 이메일로 변경
3. Supabase `SQL Editor`에서 실행
4. 로그아웃 후 다시 로그인

이제 왼쪽에 `Admin` 메뉴가 나타납니다.

관리자는 사용자 수/프로젝트 수/AI Queue/Worker 상태 같은 **집계 상태만 볼 수 있고**, 다른 사용자의 Idea/Research Log/Context 원문은 RLS 때문에 기본적으로 읽을 수 없습니다.

## 5. GitHub → Vercel 배포

GitHub에 만든 `research-os` 저장소 URL을 준비합니다.

PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\push-to-github.ps1
```

GitHub 저장소 URL을 붙여 넣으면 코드가 push됩니다. 해당 저장소를 Vercel과 이미 연결했다면 자동으로 배포가 시작됩니다.

Vercel 프로젝트 → `Settings → Environment Variables`에 아래 두 값을 넣습니다.

```text
NEXT_PUBLIC_SUPABASE_URL = Supabase Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = sb_publishable_...
```

그 후 `Deployments → Redeploy`를 한 번 하면 됩니다.

---

# Google 로그인은 사이트가 먼저 뜬 뒤 설정해도 됩니다

이메일/비밀번호로 모든 기본 기능을 먼저 확인할 수 있습니다.
Google 로그인을 붙일 때 `GOOGLE_LOGIN_KO.md`를 따라 하면 됩니다.

# Claude Code 연결은 마지막입니다

1. Research OS → `Settings`
2. `새 Worker Token` 클릭
3. 표시된 `rosw_...` 토큰 복사
4. Claude Code가 설치된 **각 연구자의 자기 PC**에서:

```powershell
.\worker\setup-worker.ps1
npm run worker
```

Claude Code에는 **그 연구자 자신의 Claude Pro/Max 계정**으로 로그인되어 있어야 합니다.

PC가 꺼져 있어도 Research OS 기록/조회/로그인/동기화는 계속 작동합니다. AI Job만 `queued`로 기다렸다가 PC와 worker가 켜지면 처리됩니다.
