#!/usr/bin/env python3
"""
Static File Server for Case Study Page (Pure HTML/CSS/JS)

Simple Python HTTP server to serve the pure HTML/CSS/JS case study page.
Avoids npm dependency issues.

@author Pawel Tulin
@version 1.0.0
"""

import http.server
import socketserver
import os

PORT = 5176  # Different port from homepage and exact copy

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve images with correct MIME types
        if self.path.startswith('/images/'):
            if self.path.endswith(('.jpg', '.jpeg')):
                self.send_response(200)
                self.send_header('Content-type', 'image/jpeg')
                self.end_headers()
                with open(self.path[1:], 'rb') as file:
                    self.wfile.write(file.read())
                return
            elif self.path.endswith('.png'):
                self.send_response(200)
                self.send_header('Content-type', 'image/png')
                self.end_headers()
                with open(self.path[1:], 'rb') as file:
                    self.wfile.write(file.read())
                return
            elif self.path.endswith('.webp'):
                self.send_response(200)
                self.send_header('Content-type', 'image/webp')
                self.end_headers()
                with open(self.path[1:], 'rb') as file:
                    self.wfile.write(file.read())
                return
            elif self.path.endswith('.svg'):
                self.send_response(200)
                self.send_header('Content-type', 'image/svg+xml')
                self.end_headers()
                with open(self.path[1:], 'rb') as file:
                    self.wfile.write(file.read())
                return
        
        # Serve CSS with correct MIME type
        if self.path.endswith('.css'):
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open(self.path[1:], 'rb') as file:
                self.wfile.write(file.read())
            return
        
        # Serve JS with correct MIME type
        if self.path.endswith('.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open(self.path[1:], 'rb') as file:
                self.wfile.write(file.read())
            return
        
        # Serve other files normally
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Change to the directory where index.html and assets are located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Case study pure HTML/CSS/JS server running at http://localhost:{PORT}")
    httpd.serve_forever()

