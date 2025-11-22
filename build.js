#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

// Parse CALENDAR_SOURCES from .env
let calendarSources = [];
for (const line of envLines) {
  if (line.startsWith('CALENDAR_SOURCES=')) {
    const value = line.substring('CALENDAR_SOURCES='.length).trim();
    calendarSources = value.split(',').map(s => s.trim()).filter(s => s);
    break;
  }
}

if (calendarSources.length === 0) {
  console.error('Error: No calendar sources found in .env file');
  process.exit(1);
}

// Read template HTML
const templatePath = path.join(__dirname, 'index.html.template');
if (!fs.existsSync(templatePath)) {
  console.error('Error: index.html.template not found');
  process.exit(1);
}

let html = fs.readFileSync(templatePath, 'utf-8');

// Generate calendar array as JavaScript code
const calendarArrayCode = '[\n' + calendarSources
  .map(cal => `            "${cal}"`)
  .join(',\n') + '\n        ]';

// Replace placeholder
html = html.replace('{{CALENDAR_SOURCES}}', calendarArrayCode);

// Write built HTML
const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log(`✓ Built index.html with ${calendarSources.length} calendar source(s)`);

