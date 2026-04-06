-- Create shipping_addresses table
create table if not exists public.shipping_addresses (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    full_name text not null,
    phone text not null,
    pincode text not null,
    house_no text not null,
    address_line text not null,
    locality text not null,
    city text not null,
    state text not null,
    address_type text check (address_type in ('home', 'work', 'other')) default 'home',
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.shipping_addresses enable row level security;

-- Policies
create policy "Users can view their own shipping addresses"
    on public.shipping_addresses for select
    using (auth.uid() = user_id);

create policy "Users can insert their own shipping addresses"
    on public.shipping_addresses for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own shipping addresses"
    on public.shipping_addresses for update
    using (auth.uid() = user_id);

create policy "Users can delete their own shipping addresses"
    on public.shipping_addresses for delete
    using (auth.uid() = user_id);

-- Function to handle default address logic (only one default per user)
create or replace function public.handle_default_shipping_address()
returns trigger as $$
begin
    if new.is_default then
        update public.shipping_addresses
        set is_default = false
        where user_id = new.user_id and id != new.id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for default address
drop trigger if exists on_shipping_address_default on public.shipping_addresses;
create trigger on_shipping_address_default
    before insert or update on public.shipping_addresses
    for each row execute function public.handle_default_shipping_address();
