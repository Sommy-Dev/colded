// Health check and simple route for testing
export const healthCheck = (req, res) => {
  res.json({ status: 'ok', message: 'E-commerce backend is running' });
};