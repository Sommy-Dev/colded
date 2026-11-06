import { adminClient } from '../config/supabase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await adminClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if the user has admin role - typically we'd check user metadata
    // For now, we'll check for a specific email or metadata flag
    const userEmail = req.user.email || '';
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

    if (!adminEmails.includes(userEmail)) {
      // Alternative: check for user metadata flag
      const { data: userMeta } = await adminClient
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (userMeta?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};