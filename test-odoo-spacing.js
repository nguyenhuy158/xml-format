const fs = require('fs');
const path = require('path');

// Import the formatter
const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Read test file
const xmlPath = path.join(__dirname, 'test-odoo-spacing.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

console.log('=== Original XML ===');
console.log(xmlContent);
console.log('\n');

// Test with odooTagSpacing enabled (default)
console.log('=== With Odoo Tag Spacing (enabled) ===');
const formatterEnabled = new XmlFormatter({
    odooTagSpacing: true,
    odooSpacingTags: ['record', 'menuitem', 'template', 'function', 'delete', 'report']
});
const resultEnabled = formatterEnabled.formatXml(xmlContent);
console.log(resultEnabled);
console.log('\n');

// Test with odooTagSpacing disabled
console.log('=== With Odoo Tag Spacing (disabled) ===');
const formatterDisabled = new XmlFormatter({
    odooTagSpacing: false
});
const resultDisabled = formatterDisabled.formatXml(xmlContent);
console.log(resultDisabled);
console.log('\n');

// Test with custom spacing tags
console.log('=== With Custom Spacing Tags (only record and menuitem) ===');
const formatterCustom = new XmlFormatter({
    odooTagSpacing: true,
    odooSpacingTags: ['record', 'menuitem']
});
const resultCustom = formatterCustom.formatXml(xmlContent);
console.log(resultCustom);

console.log('\n=== Test Complete ===');
