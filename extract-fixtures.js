#!/usr/bin/env node

/**
 * Tool to extract test data from test files and create fixture files
 * Usage: node extract-fixtures.js <test-file-path>
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node extract-fixtures.js <test-file-path>');
    console.log('Example: node extract-fixtures.js src/test/formatting/apostrophe.test.ts');
    process.exit(1);
}

const testFilePath = args[0];

// Validate file exists
if (!fs.existsSync(testFilePath)) {
    console.error(`Error: File not found: ${testFilePath}`);
    process.exit(1);
}

// Read test file
const content = fs.readFileSync(testFilePath, 'utf-8');

// Extract test cases
// Pattern: const input = `...`; or const xml = `...`;
const inputPattern = /const\s+(input|xml)\s*=\s*`([\s\S]*?)`\s*;/g;
const testNamePattern = /test\(['"]([^'"]+)['"]/g;

let match;
let testCases = [];
let testNames = [];

// Extract test names
while ((match = testNamePattern.exec(content)) !== null) {
    testNames.push(match[1]);
}

// Extract inputs
let inputIndex = 0;
const inputMatches = [];
while ((match = inputPattern.exec(content)) !== null) {
    inputMatches.push(match[2]);
}

console.log(`Found ${testNames.length} test names`);
console.log(`Found ${inputMatches.length} input blocks`);

// Determine category from file path
const category = path.basename(path.dirname(testFilePath));
const fixtureDir = path.join('src', 'test', 'fixtures', category);

// Create fixture directory if it doesn't exist
if (!fs.existsSync(fixtureDir)) {
    fs.mkdirSync(fixtureDir, { recursive: true });
    console.log(`Created directory: ${fixtureDir}`);
}

// Generate fixture files
console.log('\n--- Generating Fixtures ---');
inputMatches.forEach((input, index) => {
    const testName = testNames[index] || `test-${index}`;

    // Create a simple slug from test name
    const slug = testName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);

    const inputFile = path.join(fixtureDir, `${slug}-input.xml`);
    const expectedFile = path.join(fixtureDir, `${slug}-expected.xml`);

    // Write input file
    fs.writeFileSync(inputFile, input.trim());
    console.log(`Created: ${inputFile}`);

    // Create placeholder expected file (needs manual editing)
    if (!fs.existsSync(expectedFile)) {
        fs.writeFileSync(expectedFile, input.trim());
        console.log(`Created: ${expectedFile} (PLACEHOLDER - EDIT MANUALLY)`);
    }
});

console.log('\n--- Summary ---');
console.log(`Total fixtures created: ${inputMatches.length}`);
console.log('\n⚠️  IMPORTANT: Review and edit all *-expected.xml files manually');
console.log('    They are currently just copies of input files.');
