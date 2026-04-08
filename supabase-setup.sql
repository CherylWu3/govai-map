-- Run this in your Supabase SQL Editor (supabase.com > your project > SQL Editor)

create table fellows (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  city text not null,
  latitude double precision not null,
  longitude double precision not null,
  whatsapp text not null,
  dates text,
  created_at timestamp with time zone default now()
);

-- Allow anyone with the anon key to read and insert (site is password-protected)
alter table fellows enable row level security;

create policy "Anyone can read fellows"
  on fellows for select
  using (true);

create policy "Anyone can insert fellows"
  on fellows for insert
  with check (true);

create policy "Anyone can delete fellows"
  on fellows for delete
  using (true);
