import { z } from 'zod';
import { adminClient } from '../config/supabase.js';

const createCollectionSchema = z.object({
  name: z.string().min(1).max(255),
  handle: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  collection_type: z.enum(['manual', 'automatic']).optional(),
  published_at: z.string().optional(),
});

const updateCollectionSchema = createCollectionSchema.partial();

const collectionQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  collection_type: z.enum(['manual', 'automatic']).optional(),
  sort: z.enum(['created_at', 'updated_at', 'name']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createCollection = async (req, res) => {
  try {
    const validatedData = createCollectionSchema.parse(req.body);

    const collectionData = {
      ...validatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: collection, error } = await adminClient
      .from('collections')
      .insert(collectionData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Collection handle already exists' });
      }
      throw error;
    }

    res.status(201).json({ collection });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create collection error:', error);
    res.status(500).json({ message: 'Failed to create collection' });
  }
};

export const getCollections = async (req, res) => {
  try {
    const query = collectionQuerySchema.parse(req.query);

    let dbQuery = adminClient
      .from('collections')
      .select('*');

    if (query.collection_type) {
      dbQuery = dbQuery.eq('collection_type', query.collection_type);
    }

    const { data: collections, error, count } = await dbQuery
      .order(query.sort, { ascending: query.order === 'asc' })
      .range(query.offset, query.offset + query.limit - 1);

    if (error) throw error;

    res.json({
      collections,
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
    console.error('Get collections error:', error);
    res.status(500).json({ message: 'Failed to fetch collections' });
  }
};

export const getCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: collection, error } = await adminClient
      .from('collections')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Collection not found' });
      }
      throw error;
    }

    res.json({ collection });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ message: 'Failed to fetch collection' });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateCollectionSchema.parse(req.body);

    const updateData = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    };

    const { data: collection, error } = await adminClient
      .from('collections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Collection not found' });
      }
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Collection handle already exists' });
      }
      throw error;
    }

    res.json({ collection });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update collection error:', error);
    res.status(500).json({ message: 'Failed to update collection' });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await adminClient
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Collection not found' });
      }
      throw error;
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({ message: 'Failed to delete collection' });
  }
};