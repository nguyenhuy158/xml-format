const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all test files
const testFiles = glob.sync('src/test/**/*.test.ts');

console.log(`Found ${testFiles.length} test files`);

testFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Skip if already has import
    if (content.includes('getTestConfig')) {
        console.log(`✓ ${file} - already using getTestConfig`);
        return;
    }

    // Check if file uses XmlFormatter
    if (!content.includes('new XmlFormatter')) {
        console.log(`⊘ ${file} - doesn't use XmlFormatter`);
        return;
    }

    // Add import if needed
    if (content.includes("from '../../formatters/xmlFormatter'")) {
        content = content.replace(
            "from '../../formatters/xmlFormatter';",
            "from '../../formatters/xmlFormatter';\nimport { getTestConfig } from '../testConfig';"
        );
        modified = true;
    } else if (content.includes("from '../../../formatters/xmlFormatter'")) {
        content = content.replace(
            "from '../../../formatters/xmlFormatter';",
            "from '../../../formatters/xmlFormatter';\nimport { getTestConfig } from '../../testConfig';"
        );
        modified = true;
    }

    // Replace XmlFormatter({}) with XmlFormatter(getTestConfig())
    const regex1 = /new XmlFormatter\(\{\s*\}\)/g;
    if (regex1.test(content)) {
        content = content.replace(regex1, 'new XmlFormatter(getTestConfig())');
        modified = true;
    }

    // Replace XmlFormatter({ single property }) with getTestConfig({ property })
    const regex2 = /new XmlFormatter\(\{\s*(\w+):\s*([^,}]+)\s*\}\)/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, (match, prop, value) => {
            return `new XmlFormatter(getTestConfig({ ${prop}: ${value} }))`;
        });
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`✓ ${file} - updated`);
    } else {
        console.log(`⊘ ${file} - no changes needed`);
    }
});

console.log('\nDone!');
