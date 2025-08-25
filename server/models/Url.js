import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'data', 'urls.json');

// Ensure data directory exists
try {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize data file if it doesn't exist
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
} catch (error) {
  console.error('Error initializing data storage:', error);
  // Continue execution - the readData method will handle missing files gracefully
}

class Url {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.originalUrl = data.originalUrl;
    this.shortCode = data.shortCode || this.generateShortCode();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.clicks = data.clicks || 0;
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static readData() {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }

  static findByShortCode(shortCode) {
    const urls = this.readData();
    return urls.find(url => url.shortCode === shortCode);
  }

  static findAll() {
    return this.readData().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static create(originalUrl) {
    const urls = this.readData();
    
    // Check if URL already exists
    const existing = urls.find(url => url.originalUrl === originalUrl);
    if (existing) {
      return existing;
    }

    const newUrl = new Url({ originalUrl });
    
    // Ensure unique short code
    while (urls.find(url => url.shortCode === newUrl.shortCode)) {
      newUrl.shortCode = newUrl.generateShortCode();
    }
    
    urls.push(newUrl);
    this.writeData(urls);
    
    return newUrl;
  }

  static incrementClicks(shortCode) {
    const urls = this.readData();
    const urlIndex = urls.findIndex(url => url.shortCode === shortCode);
    
    if (urlIndex !== -1) {
      urls[urlIndex].clicks += 1;
      this.writeData(urls);
      return urls[urlIndex];
    }
    
    return null;
  }
}

export default Url;