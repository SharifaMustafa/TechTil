create table public.lesson_completions (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  lesson_id integer not null check (lesson_id >= 0),
  primary key (user_id, lesson_id)
);

create table public.learning_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  playback_speed text not null check (playback_speed in ('slow', 'normal', 'fast'))
);

alter table public.lesson_completions enable row level security;
alter table public.learning_preferences enable row level security;

revoke all on public.lesson_completions, public.learning_preferences from public, anon, authenticated;
grant select, insert on public.lesson_completions to authenticated;
grant select, insert, update on public.learning_preferences to authenticated;

create policy "Read own completions" on public.lesson_completions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own completions" on public.lesson_completions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Read own preferences" on public.learning_preferences
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own preferences" on public.learning_preferences
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own preferences" on public.learning_preferences
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
