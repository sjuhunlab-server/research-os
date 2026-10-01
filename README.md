# Research OS v0.2

개인/다중 사용자 연구 아이디어·연구로그·Research Context 관리 웹앱입니다.

## 핵심 원칙

- 사용자별 데이터는 `owner_id + Supabase RLS`로 격리
- 관리자는 기본적으로 다른 사용자의 연구 원문을 읽지 않고 집계 상태만 확인
- 아이디어 원문과 AI 결과를 분리 저장
- AI는 자동 호출하지 않고 사용자가 버튼을 눌렀을 때 Queue 생성
- Claude API Key 대신 각 연구자의 로컬 Claude Code + Pro/Max 구독 사용 가능
- Worker token 원문은 생성 시 한 번만 보여주고 DB에는 SHA-256 hash만 저장
- Supabase Secret key 불필요

## 서버

별도 서버 PC는 필요 없습니다.

- Vercel: Next.js 웹사이트
- Supabase: Auth / Postgres / RLS / Realtime
- 사용자 PC: Claude Code AI 작업 처리 시에만 필요

## 먼저 읽기

**`START_HERE_KO.md`**를 따라 하세요.
