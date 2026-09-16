create table public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    subject text not null,
    message text not null,
    status text not null default 'unread',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Anyone can insert
create policy "Anyone can insert contact messages"
    on public.contact_messages for insert
    with check (true);

-- Only authenticated users (admins) can view
create policy "Only authenticated users can view messages"
    on public.contact_messages for select
    using (auth.role() = 'authenticated');

-- Only authenticated users (admins) can update
create policy "Only authenticated users can update messages"
    on public.contact_messages for update
    using (auth.role() = 'authenticated');
