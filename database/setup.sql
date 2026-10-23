create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text not null default '',
    role text not null default 'user' check (role in ('user', 'admin')),
    created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, display_name)
    values (
        new.id,
        coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), '')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

create or replace function public.is_shipintel_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles
        where id = (select auth.uid())
          and role = 'admin'
    );
$$;

revoke all on function public.is_shipintel_admin() from public;
grant execute on function public.is_shipintel_admin() to authenticated;

create table if not exists public.shipments (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    bl text not null check (char_length(trim(bl)) between 1 and 120),
    container text not null check (char_length(trim(container)) between 1 and 60),
    carrier text not null check (char_length(trim(carrier)) between 1 and 120),
    origin text not null check (char_length(trim(origin)) between 1 and 160),
    dest text not null check (char_length(trim(dest)) between 1 and 160),
    eta date not null,
    status text not null check (status in ('sea', 'customs', 'delivered')),
    timeline jsonb not null default '[]'::jsonb
        check (jsonb_typeof(timeline) = 'array'),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists shipments_owner_bl_unique
    on public.shipments (owner_id, lower(bl));
create unique index if not exists shipments_owner_container_unique
    on public.shipments (owner_id, lower(container));
create index if not exists shipments_owner_created_at_idx
    on public.shipments (owner_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_shipments_updated_at on public.shipments;
create trigger set_shipments_updated_at
    before update on public.shipments
    for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.shipments enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
revoke all on public.shipments from anon, authenticated;
grant select, insert, update, delete on public.shipments to authenticated;

drop policy if exists "Users can read their profile; admins can read all" on public.profiles;
create policy "Users can read their profile; admins can read all"
    on public.profiles for select to authenticated
    using (id = (select auth.uid()) or (select public.is_shipintel_admin()));

drop policy if exists "Users and admins can read permitted shipments" on public.shipments;
create policy "Users and admins can read permitted shipments"
    on public.shipments for select to authenticated
    using (owner_id = (select auth.uid()) or (select public.is_shipintel_admin()));

drop policy if exists "Users can create their own shipments" on public.shipments;
create policy "Users can create their own shipments"
    on public.shipments for insert to authenticated
    with check (owner_id = (select auth.uid()));

drop policy if exists "Users can update their own shipments; admins can update all" on public.shipments;
create policy "Users can update their own shipments; admins can update all"
    on public.shipments for update to authenticated
    using (owner_id = (select auth.uid()) or (select public.is_shipintel_admin()))
    with check (owner_id = (select auth.uid()) or (select public.is_shipintel_admin()));

drop policy if exists "Users can delete their own shipments; admins can delete all" on public.shipments;
create policy "Users can delete their own shipments; admins can delete all"
    on public.shipments for delete to authenticated
    using (owner_id = (select auth.uid()) or (select public.is_shipintel_admin()));
