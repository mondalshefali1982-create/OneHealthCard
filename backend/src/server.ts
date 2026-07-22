import app from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5000;

// Ensure database connection on each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection middleware error:', err);
  }
  next();
});

// Start server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
