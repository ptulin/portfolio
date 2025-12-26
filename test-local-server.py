#!/usr/bin/env python3
"""
Local Test Server for Production Code
Tests the production website locally before deployment
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL path
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Route handling for case studies
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
        
        # Serve other files normally
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Change to the directory where files are located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("=" * 60)
    print("🚀 Production Code Local Test Server")
    print("=" * 60)
    print(f"\nServer running at: http://localhost:{PORT}")
    print(f"\nTest URLs:")
    print(f"  Homepage: http://localhost:{PORT}/")
    print(f"  GLG Case Study: http://localhost:{PORT}/case-study.html?project=glg-expert-network")
    print(f"  TD Ameritrade: http://localhost:{PORT}/case-study.html?project=td-ameritrade-ux-analysis")
    print(f"\nPress Ctrl+C to stop")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped")

