import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 5174

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
}

const server = http.createServer((req, res) => {
    let filePath
    
    if (req.url === '/') {
        filePath = path.join(__dirname, 'index.html')
    } else {
        filePath = path.join(__dirname, req.url)
    }
    
    // Security: prevent directory traversal
    const resolvedPath = path.resolve(filePath)
    const rootPath = path.resolve(__dirname)
    if (!resolvedPath.startsWith(rootPath)) {
        res.writeHead(403)
        res.end('Forbidden')
        return
    }

    const extname = String(path.extname(filePath)).toLowerCase()
    const contentType = mimeTypes[extname] || 'application/octet-stream'

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found, try index.html for SPA routing
                fs.readFile(path.join(__dirname, 'index.html'), (error, content) => {
                    if (error) {
                        res.writeHead(404)
                        res.end('File not found')
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' })
                        res.end(content, 'utf-8')
                    }
                })
            } else {
                res.writeHead(500)
                res.end(`Server Error: ${error.code}`)
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf-8')
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
})

