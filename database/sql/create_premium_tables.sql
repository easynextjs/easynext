-- 이용권 테이블
create table premium_coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  is_used boolean default false,
  created_at timestamp with time zone default now(),
  used_at timestamp with time zone,
  used_by text
);

-- 프리미엄 계정 테이블
create table premium_accounts (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  activated_at timestamp with time zone default now(),
  coupon_code text references premium_coupons(code),
  created_at timestamp with time zone default now()
);

-- 인덱스 생성
create index premium_coupons_code_idx on premium_coupons(code);
create index premium_accounts_email_idx on premium_accounts(email); 