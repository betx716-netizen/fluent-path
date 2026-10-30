-- Fluent Path — phase 1 : comptes, progression et gamification.
-- Chaque table liée à l'utilisateur est protégée par RLS : chacun ne voit que ses lignes.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  native_lang text not null default 'fr',
  goal text,
  daily_minutes int,
  cefr_level text not null default 'A1',
  timezone text,
  reminder_time time,
  created_at timestamptz not null default now()
);

create table if not exists public.unit_progress (
  user_id uuid not null references auth.users on delete cascade,
  unit_id text not null,
  stars int not null default 0 check (stars between 0 and 5),
  best_score int not null default 0,
  plays int not null default 0,
  completed_at timestamptz,
  primary key (user_id, unit_id)
);

create table if not exists public.gamification (
  user_id uuid primary key references auth.users on delete cascade,
  xp_total int not null default 0,
  gems int not null default 0,
  streak int not null default 0,
  streak_best int not null default 0,
  last_active_day int,
  freezes int not null default 0,
  state jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  kind text not null default 'lesson',
  unit_id text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  minutes int,
  xp_earned int
);

alter table public.profiles enable row level security;
alter table public.unit_progress enable row level security;
alter table public.gamification enable row level security;
alter table public.sessions enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own progress" on public.unit_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own gamification" on public.gamification
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own sessions" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
