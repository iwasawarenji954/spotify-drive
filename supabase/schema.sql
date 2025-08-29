-- Supabase/PostgreSQL schema for initial app data layer (not yet wired)
-- Safe to run multiple times

create extension if not exists "pgcrypto";

-- Parties
create table if not exists public.parties (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_user_id text not null,
  playlist_id text,
  status text not null default 'ACTIVE',
  created_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone
);

-- Party tracks (suggested/queued tracks per party)
create table if not exists public.party_tracks (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.parties(id) on delete cascade,
  track_id text not null, -- Spotify track ID
  added_by text,          -- Spotify user ID (optional)
  added_at timestamp with time zone not null default now(),
  unique (party_id, track_id)
);

-- Likes for a party track
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  party_track_id uuid not null references public.party_tracks(id) on delete cascade,
  user_id text, -- optional: anonymous like when null
  created_at timestamp with time zone not null default now()
);

-- Indexes
create index if not exists idx_party_tracks_party on public.party_tracks(party_id);
create index if not exists idx_likes_party_track on public.likes(party_track_id);

-- Optional: prevent double-like per user on same track (allows multiple NULLs)
-- create unique index if not exists uniq_like_per_user_per_track
--   on public.likes(party_track_id, user_id)
--   where user_id is not null;

