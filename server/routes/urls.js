import express from 'express';
import Url from '../models/Url.js';

const router = express.Router();

// POST /api/shorten - Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid URL format' 
      });
    }

    const urlData = Url.create(url);

    res.json({
      success: true,
      shortUrl: `${req.protocol}://${req.get('host')}/${urlData.shortCode}`,
      shortCode: urlData.shortCode,
      originalUrl: urlData.originalUrl
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// GET /api/admin/urls - Get all URLs (admin)
router.get('/admin/urls', async (req, res) => {
  try {
    const urls = Url.findAll();
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;