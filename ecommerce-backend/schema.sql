-- E-commerce Database Schema for Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Collections (like Shopify collections)
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text not null unique,
  description text,
  image_url text,
  collection_type text not null default 'manual' check (collection_type in ('manual', 'automatic')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (like Shopify products)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text not null unique,
  description text,
  description_html text,
  vendor text,
  product_type text,
  tags text[],
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  inventory_quantity integer not null default 0,
  inventory_policy text not null default 'deny' check (inventory_policy in ('deny', 'allow')),
  price integer not null default 0,
  compare_at_price integer,
  currency text not null default 'USD',
  images text[],
  featured_image text,
  options jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  seo jsonb default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  collection_id uuid references collections(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product-Collection relationship (many-to-many)
create table if not exists collection_products (
  collection_id uuid not null references collections(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  position integer not null default 0,
  primary key (collection_id, product_id)
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total integer not null default 0,
  currency text not null default 'USD',
  shipping_address jsonb default '{}'::jsonb,
  billing_address jsonb default '{}'::jsonb,
  customer_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table collections enable row level security;
alter table products enable row level security;
alter table collection_products enable row level security;
alter table orders enable row level security;

-- RLS Policies for collections
create policy "Allow public read access to collections"
  on collections for select
  using (true);

create policy "Allow admin write access to collections"
  on collections for all
  using (
    auth.role() = 'admin' or auth.role() = 'authenticated'
  );

-- RLS Policies for products
create policy "Allow public read access to products"
  on products for select
  using (status = 'active');

create policy "Allow admin write access to products"
  on products for all
  using (
    auth.role() = 'admin' or auth.role() = 'authenticated'
  );

-- RLS Policies for collection_products
create policy "Allow public read access to collection_products"
  on collection_products for select
  using (true);

create policy "Allow admin write access to collection_products"
  on collection_products for all
  using (
    auth.role() = 'admin' or auth.role() = 'authenticated'
  );

-- RLS Policies for orders
create policy "Allow users to read own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Allow admin read all orders"
  on orders for select
  using (auth.role() = 'admin');
