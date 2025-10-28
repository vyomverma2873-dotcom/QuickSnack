#!/usr/bin/env node

/**
 * Health check script for Render deployment
 * This script checks if the server is responding to requests
 */

const http = require('http');

const PORT = process.env.PORT || 4000;
const HOST = 'localhost';

const options = {
  hostname: HOST,
  port: PORT,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Server is healthy');
      console.log('Response:', data);
      process.exit(0);
    } else {
      console.error('❌ Server returned non-200 status');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Health check failed:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Health check timeout');
  req.destroy();
  process.exit(1);
});

req.end();
