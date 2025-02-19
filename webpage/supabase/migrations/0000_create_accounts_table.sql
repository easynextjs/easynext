create table accounts (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  access_token text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

-- 인덱스 생성
CREATE INDEX idx_accounts_access_token ON accounts(access_token);
CREATE INDEX idx_accounts_email ON accounts(email);

-- RLS 정책 설정
alter table accounts enable row level security;

-- 이메일로 is_active 조회 정책 추가 (이메일 필터 필수)
create policy "Anyone can check account status by email"
on accounts for select
using (
  email = any(regexp_split_to_array(current_setting('request.query.email', true), ','))
);
