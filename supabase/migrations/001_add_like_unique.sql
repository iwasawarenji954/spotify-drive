-- Ensure one like per user per track
create unique index if not exists uniq_like_user_per_track
  on public.likes(party_track_id, user_id);

