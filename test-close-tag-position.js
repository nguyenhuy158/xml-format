#!/usr/bin/env node

const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');
const path = require('path');

// Read test file
const testFile = path.join(__dirname, 'test-close-tag-position.xml');
const xmlContent = fs.readFileSync(testFile, 'utf8');

console.log('=== Testing closeTagOnNewLine option ===\n');

// Test 1: closeTagOnNewLine = false (default)
console.log('Test 1: closeTagOnNewLine = false');
console.log('=======================================');
const formatter1 = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 120,
    closeTagOnNewLine: false
});

try {
    const result1 = formatter1.formatXml(xmlContent);
    console.log(result1);
    fs.writeFileSync(path.join(__dirname, 'test-close-tag-position-result-false.xml'), result1);
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\n\n');

// Test 2: closeTagOnNewLine = true
console.log('Test 2: closeTagOnNewLine = true');
console.log('=======================================');
const formatter2 = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 120,
    closeTagOnNewLine: true
});

try {
    const result2 = formatter2.formatXml(xmlContent);
    console.log(result2);
    fs.writeFileSync(path.join(__dirname, 'test-close-tag-position-result-true.xml'), result2);
} catch (error) {
    console.error('Error:', error.message);
}
