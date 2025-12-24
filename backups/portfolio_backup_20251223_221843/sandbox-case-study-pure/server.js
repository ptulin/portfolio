/**
 * Static File Server for Case Study Page
 * 
 * Simple Express server to serve the pure HTML/CSS/JS case study page.
 * 
 * @author Pawel Tulin
 * @version 1.0.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5176; // Different port from homepage and exact copy

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve images with correct MIME types
app.use('/images', express.static(path.join(__dirname, 'images'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            res.set('Content-Type', 'image/jpeg');
        } else if (filePath.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        } else if (filePath.endsWith('.webp')) {
            res.set('Content-Type', 'image/webp');
        } else if (filePath.endsWith('.svg')) {
            res.set('Content-Type', 'image/svg+xml');
        }
    }
}));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Case study pure HTML/CSS/JS server running at http://localhost:${port}`);
});

