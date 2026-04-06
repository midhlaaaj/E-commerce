-- Create orders table
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    status text not null default 'confirmed',
    total_amount numeric(10, 2) not null,
    shipping_address_id uuid references public.shipping_addresses(id) on delete set null,
    payment_status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid not null, -- References can be added if products table is stable
    quantity integer not null,
    price numeric(10, 2) not null,
    size text,
    color text,
    product_name text, -- Storing name in case product is deleted/changed
    product_image text, -- Storing image for historical record
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for orders
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Users can insert their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

-- Policies for order_items (linked via order ownership)
create policy "Users can view their own order items"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

create policy "Users can insert their own order items"
    on public.order_items for insert
    with check (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );
