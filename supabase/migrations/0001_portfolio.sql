-- Portfolio backend. Run once in the Supabase SQL editor.

-- Who may use the admin dashboard. Add yourself after creating your user (see README).
create table if not exists admins (user_id uuid primary key references auth.users (id) on delete cascade);
alter table admins enable row level security;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid())
$$;

-- Admins can see whether they are an admin (the dashboard uses this to gate its UI).
create policy "admins see themselves" on admins for select using (user_id = auth.uid());

-- ---------- contact messages ----------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 5 and 4000),
  lang text check (char_length(lang) <= 5),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table messages enable row level security;
create policy "anyone can send a message" on messages for insert with check (is_read = false);
create policy "admin reads messages" on messages for select using (is_admin());
create policy "admin updates messages" on messages for update using (is_admin()) with check (is_admin());
create policy "admin deletes messages" on messages for delete using (is_admin());

-- ---------- extra projects (shown after the curated ones) ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 600),
  category text not null check (category in ('apps', 'data', 'education')),
  stack text[] not null default '{}',
  live_url text check (live_url is null or live_url ~* '^https?://'),
  code_url text check (code_url is null or code_url ~* '^https?://'),
  status text not null default 'done' check (status in ('done', 'in-progress')),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table projects enable row level security;
create policy "public reads published projects" on projects for select using (published or is_admin());
create policy "admin writes projects" on projects for all using (is_admin()) with check (is_admin());

-- ---------- anonymous visit counter (no cookies, no personal data) ----------
create table if not exists visits (
  id bigint generated always as identity primary key,
  path text not null check (char_length(path) <= 200),
  lang text check (char_length(lang) <= 5),
  created_at timestamptz not null default now()
);
alter table visits enable row level security;
create policy "anyone can record a visit" on visits for insert with check (true);
create policy "admin reads visits" on visits for select using (is_admin());
create index if not exists visits_created_idx on visits (created_at desc);
