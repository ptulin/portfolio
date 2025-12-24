#!/usr/bin/env python3
"""
Static File Server for Combined Portfolio Pages

Simple Python HTTP server to serve both homepage and case study pages.
Avoids npm dependency issues.

@author Pawel Tulin
@version 1.0.0
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse

PORT = 5177  # New port for combined sandbox

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL path
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Route handling
        if path == '/' or path == '/index.html':
            self.path = '/index.html'
        elif path == '/case-study' or path == '/case-study.html':
            self.path = '/case-study.html'
        
        # Serve files with correct MIME types
        if self.path.endswith('.css'):
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open(self.path[1:], 'rb') as file:
                self.wfile.write(file.read())
            return
        elif self.path.endswith('.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open(self.path[1:], 'rb') as file:
                self.wfile.write(file.read())
            return
        elif self.path.startswith('/images/'):
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
        
        # Serve other files normally
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Change to the directory where files are located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Combined portfolio server running at http://localhost:{PORT}")
    print(f"Homepage: http://localhost:{PORT}/")
    print(f"Case Study: http://localhost:{PORT}/case-study")
    print("Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")

