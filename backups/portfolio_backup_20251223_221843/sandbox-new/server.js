/**
 * Static File Server for Combined Portfolio Pages
 * 
 * Serves both homepage and case study pages with proper MIME types.
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
const port = 5177; // New port for combined sandbox

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

// Serve CSS files with correct MIME type
app.use((req, res, next) => {
    if (req.path.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
    } else if (req.path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
    }
    next();
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve case-study.html for /case-study route
app.get('/case-study', (req, res) => {
    res.sendFile(path.join(__dirname, 'case-study.html'));
});

// Serve case-study.html for /case-study.html route
app.get('/case-study.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'case-study.html'));
});

// Fallback: serve index.html for all other routes (for SPA-like behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Combined portfolio server running at http://localhost:${port}`);
    console.log(`Homepage: http://localhost:${port}/`);
    console.log(`Case Study: http://localhost:${port}/case-study`);
});

