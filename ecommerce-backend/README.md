# E-commerce Backend with Supabase

This is a Shopify-like e-commerce backend built with Node.js/Express and Supabase.

## Features

- **Products Management**: Create, read, update, delete products
- **Collections Management**: Create, read, update, delete collections
- **Authentication**: Supabase-based user authentication
- **Admin Access**: Admin-only routes for product/collection management
- **Public API**: Public read access to products and collections

## Tech Stack

- Node.js / Express
- Supabase (PostgreSQL, Auth, Storage)
- Zod (validation)
- CORS support

## Prerequisites

1. A Supabase project with the schema from `schema.sql` applied
2. Node.js 20+

## Setup

1. Copy the environment variables:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials from the Supabase dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Run the database schema:
```sql
-- Execute the schema.sql file in your Supabase SQL editor
```

4. Start the server:
```bash
npm install
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Collections
- `GET /api/collections` - List all collections
- `GET /api/collections/:id` - Get collection by ID
- `POST /api/collections` - Create collection (admin only)
- `PUT /api/collections/:id` - Update collection (admin only)
- `DELETE /api/collections/:id` - Delete collection (admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

## Deployment

Deploy to Render using the `render.yaml` file or use the Dockerfile.

## Admin Access

Set `ADMIN_EMAILS` environment variable to a comma-separated list of admin emails.