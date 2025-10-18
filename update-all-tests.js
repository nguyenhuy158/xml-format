#!/usr/bin/env node

/**
 * Script to automatically update all test files to use global test config
 * Usage: node update-all-tests.js
 */

const fs = require('fs');
const path = require('path');

// Recursively find all .test.ts files
function findTestFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findTestFiles(fullPath, files);
        } else if (item.endsWith('.test.ts')) {
            files.push(fullPath);
        }
    }

    return files;
}

// Determine import path based on file location
function getImportPath(filePath) {
    const parts = filePath.split(path.sep);
    const testIndex = parts.indexOf('test');
    const depth = parts.length - testIndex - 2; // -2 for test folder and filename

    if (depth === 1) return '../testConfig';
    if (depth === 2) return '../../testConfig';
    return '../../testConfig'; // default
}

// Update a single file
function updateTestFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Check if already uses getTestConfig
    if (content.includes('getTestConfig')) {
        return { file: filePath, status: 'already-updated' };
    }

    // Check if uses XmlFormatter
    if (!content.includes('new XmlFormatter')) {
        return { file: filePath, status: 'no-formatter' };
    }

    // Add import statement
    const importPath = getImportPath(filePath);

    if (content.includes("from '../../formatters/xmlFormatter'") && !content.includes('getTestConfig')) {
        content = content.replace(
            "from '../../formatters/xmlFormatter';",
            `from '../../formatters/xmlFormatter';\nimport { getTestConfig } from '${importPath}';`
        );
        modified = true;
    } else if (content.includes("from '../../../formatters/xmlFormatter'") && !content.includes('getTestConfig')) {
        content = content.replace(
            "from '../../../formatters/xmlFormatter';",
            `from '../../../formatters/xmlFormatter';\nimport { getTestConfig } from '${importPath}';`
        );
        modified = true;
    }

    // Replace formatter = new XmlFormatter({ in setup()
    content = content.replace(
        /formatter = new XmlFormatter\(\{[\s\S]*?\}\);/g,
        (match) => {
            modified = true;
            return 'formatter = new XmlFormatter(getTestConfig());';
        }
    );

    if (modified && content !== originalContent) {
        fs.writeFileSync(filePath, content);
        return { file: filePath, status: 'updated' };
    }

    return { file: filePath, status: 'no-changes' };
}

// Main function
function main() {
    const testDir = path.join(__dirname, 'src', 'test');
    const testFiles = findTestFiles(testDir);

    console.log(`Found ${testFiles.length} test files\n`);

    const results = {
        updated: [],
        alreadyUpdated: [],
        noFormatter: [],
        noChanges: []
    };

    for (const file of testFiles) {
        const result = updateTestFile(file);
        const relativePath = path.relative(process.cwd(), result.file);

        switch (result.status) {
            case 'updated':
                results.updated.push(relativePath);
                console.log(`✓ Updated: ${relativePath}`);
                break;
            case 'already-updated':
                results.alreadyUpdated.push(relativePath);
                console.log(`✓ Already updated: ${relativePath}`);
                break;
            case 'no-formatter':
                results.noFormatter.push(relativePath);
                console.log(`⊘ No formatter: ${relativePath}`);
                break;
            case 'no-changes':
                results.noChanges.push(relativePath);
                console.log(`⊘ No changes: ${relativePath}`);
                break;
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Updated: ${results.updated.length}`);
    console.log(`Already updated: ${results.alreadyUpdated.length}`);
    console.log(`No formatter: ${results.noFormatter.length}`);
    console.log(`No changes needed: ${results.noChanges.length}`);
}

main();
