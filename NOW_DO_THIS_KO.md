# 지금 딱 이것만 하세요

## 1) Supabase에 DB 만들기
- Supabase → SQL Editor → New query
- `supabase/schema.sql` 전체 복사 → 붙여넣기 → Run

## 2) 내 PC에서 실행 확인
- Supabase `Connect`에서 아래 2개 복사
  - Project URL
  - Publishable key (`sb_publishable_...`)
- 압축 푼 폴더에서 PowerShell 실행

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup-local.ps1
```

- 스크립트 질문에 두 값을 붙여넣기
- 브라우저에서 `http://localhost:3000`
- Google 설정 전에는 이메일/비밀번호로 테스트

## 3) GitHub/Vercel에 올리기

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\push-to-github.ps1
```

- 이미 만든 GitHub `research-os` repository의 HTTPS URL 붙여넣기
- Vercel이 그 repository에 연결되어 있으면 자동 배포
- Vercel → Project → Settings → Environment Variables에 아래 2개 추가

```text
NEXT_PUBLIC_SUPABASE_URL = Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = Publishable key
```

- Redeploy

---

여기까지 되면 Research OS 기본 기능은 실제로 사용 가능합니다.
Google 로그인은 `GOOGLE_LOGIN_KO.md`, Claude Code는 사이트의 Settings에서 Worker Token을 만든 뒤 `worker/setup-worker.ps1`을 사용하면 됩니다.
