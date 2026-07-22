import app from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5000;

// Start Server locally
const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
