import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5175; // Different port from homepage

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve assets with correct MIME types
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

// Serve images if they exist
import { existsSync } from 'fs';
if (existsSync(path.join(__dirname, 'images'))) {
  app.use('/images', express.static(path.join(__dirname, 'images')));
}

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Case study server running at http://localhost:${port}`);
});

