# Google 로그인 연결하기

Google 로그인은 Research OS가 먼저 배포된 다음 설정하는 것이 가장 쉽습니다.

## A. Supabase callback 주소 확인

Supabase → `Authentication → Providers → Google`에 표시되는 Callback URL을 복사합니다.
보통 다음 형태입니다.

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

## B. Google Cloud에서 OAuth Client 만들기

1. https://console.cloud.google.com 접속
2. 관리자용 Google 계정으로 로그인
3. 새 Project 생성: 예) `Research OS`
4. `Google Auth Platform`에서 앱 정보/Audience 설정
5. OAuth Client 생성 → **Web application**
6. `Authorized redirect URIs`에 위 Supabase callback URL 추가
7. 생성된 **Client ID / Client Secret** 복사

## C. Supabase에 입력

Supabase → `Authentication → Providers → Google`

- Enable Google: ON
- Client ID: Google에서 복사
- Client Secret: Google에서 복사

저장합니다.

## D. Vercel 주소를 Supabase에 등록

예를 들어 Vercel 주소가:

```text
https://research-os-abc.vercel.app
```

이라면 Supabase → `Authentication → URL Configuration`에서:

- Site URL: `https://research-os-abc.vercel.app`
- Redirect URLs에:
  - `https://research-os-abc.vercel.app/**`
  - `http://localhost:3000/**`

을 추가합니다.

완료 후 Research OS 로그인 화면의 `Google로 계속` 버튼이 동작합니다.

## GitHub 로그인은 선택 사항

Research OS 기본 사용에는 GitHub 로그인이 필요하지 않습니다. 나중에 `Authentication → Providers → GitHub`에서 같은 방식으로 추가할 수 있습니다. 실제 private repository 접근 기능은 로그인과 별도의 Integration으로 만드는 것이 안전합니다.

## E. Google 로그인 후 GitHub identity를 같은 계정에 연결하려면

Supabase → `Authentication → Settings / General configuration`에서 **Allow manual linking**을 켭니다.
그 후 Research OS → `Settings → Connected identities`에서 GitHub 연결 버튼을 사용할 수 있습니다.

주의: 이 identity linking은 로그인 계정 연결일 뿐입니다. GitHub private repository 읽기 권한은 아직 부여하지 않습니다.
