-- 1) Research OS에 관리자 Google/Email 계정으로 최소 한 번 로그인한 뒤
-- 2) 아래 이메일만 본인의 관리자 이메일로 바꾸고 실행하세요.

update public.profiles
set role = 'admin'
where email = 'YOUR_ADMIN_EMAIL@example.com';

select id,email,role from public.profiles where role='admin';
