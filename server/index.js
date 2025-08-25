import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Url from './models/Url.js';
import urlRoutes from './routes/urls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..','dist')));

// API Routes
app.use('/api', urlRoutes);

// Redirect route - must be before catch-all
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  
  try {
    const url = Url.findByShortCode(shortCode);
    
    if (!url) {
      // Redirect to home page if short code not found
      return res.redirect('/');
    }

    // Increment click count
    Url.incrementClicks(shortCode);

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.redirect('/');
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..','dist', 'index.html'));
});

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});