create table templates (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text null,
  storage_bucket_name text not null,
  storage_object_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_templates_name on templates(name);

alter table templates enable row level security;