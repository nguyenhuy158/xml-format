const fs = require('fs');
const path = require('path');

// Import the formatter
const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Read test file
const xmlPath = path.join(__dirname, 'test-odoo-container.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

console.log('=== Original XML ===');
console.log(xmlContent);
console.log('\n');

// Test with odooTagSpacing enabled
console.log('=== With Odoo Tag Spacing (enabled) ===');
const formatter = new XmlFormatter({
    odooTagSpacing: true,
    indentSize: 4
});
const result = formatter.formatXml(xmlContent);
console.log(result);
console.log('\n=== Test Complete ===');
