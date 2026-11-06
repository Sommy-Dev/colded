import { z } from 'zod';
import { adminClient } from '../config/supabase.js';

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  handle: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  description_html: z.string().optional(),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  inventory_quantity: z.number().int().min(0).optional(),
  inventory_policy: z.enum(['deny', 'allow']).optional(),
  price: z.number().int().min(0).optional(),
  compare_at_price: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
  images: z.array(z.string().url()).optional(),
  featured_image: z.string().url().nullable().optional(),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
  })).optional(),
  variants: z.array(z.object({
    id: z.string().optional(),
    title: z.string(),
    price: z.number().int().min(0),
    compare_at_price: z.number().int().min(0).nullable().optional(),
    inventory_quantity: z.number().int().min(0).optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    options: z.array(z.string()).optional(),
  })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  collection_id: z.string().uuid().nullable().optional(),
});

const updateProductSchema = createProductSchema.partial();

const productQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  collection_id: z.string().uuid().optional(),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  sort: z.enum(['created_at', 'updated_at', 'name', 'price']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createProduct = async (req, res) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const userId = req.user?.id;

    const productData = {
      ...validatedData,
      created_by: userId,
      status: validatedData.status || 'draft',
      published_at: validatedData.status === 'active' ? new Date().toISOString() : null,
      options: validatedData.options || [],
      variants: validatedData.variants || [],
      images: validatedData.images || [],
      tags: validatedData.tags || [],
    };

    const { data: product, error } = await adminClient
      .insert(productData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Product handle already exists' });
      }
      throw error;
    }

    if (validatedData.collection_id) {
      await adminClient
        .from('collection_products')
        .insert({
          collection_id: validatedData.collection_id,
          product_id: product.id,
        });
    }

    res.status(201).json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const query = productQuerySchema.parse(req.query);

    let dbQuery = adminClient
      .from('products')
      .select(`
        *,
        collection:collections(*)
      `);

    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status);
    }
    if (query.collection_id) {
      dbQuery = dbQuery.eq('collection_id', query.collection_id);
    }
    if (query.vendor) {
      dbQuery = dbQuery.eq('vendor', query.vendor);
    }
    if (query.product_type) {
      dbQuery = dbQuery.eq('product_type', query.product_type);
    }

    const { data: products, error, count } = await dbQuery
      .order(query.sort, { ascending: query.order === 'asc' })
      .range(query.offset, query.offset + query.limit - 1);

    if (error) throw error;

    res.json({
      products,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: count,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await adminClient
      .select(`
        *,
        collection:collections(*),
        collection_products(collection_id)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw error;
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);

    const updateData = {
      ...validatedData,
      updated_at: new Date().toISOString(),
      published_at: validatedData.status === 'active' ? new Date().toISOString() : null,
    };

    const { data: product, error } = await adminClient
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Product handle already exists' });
      }
      throw error;
    }

    if (validatedData.collection_id !== undefined) {
      await adminClient
        .from('collection_products')
        .delete()
        .eq('product_id', id);

      if (validatedData.collection_id) {
        await adminClient
          .from('collection_products')
          .insert({
            collection_id: validatedData.collection_id,
            product_id: id,
          });
      }
    }

    res.json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await adminClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw error;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};