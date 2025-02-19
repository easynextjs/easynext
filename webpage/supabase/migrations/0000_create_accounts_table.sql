create table accounts (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 정책 설정
alter table accounts enable row level security;
