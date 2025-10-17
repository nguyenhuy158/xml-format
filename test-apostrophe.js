/**
 * Test script to verify apostrophe handling in XML formatting
 */

const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

// Read test XML
const xmlContent = fs.readFileSync('test-apostrophe.xml', 'utf8');

console.log('Original XML:');
console.log(xmlContent);
console.log('\n' + '='.repeat(80) + '\n');

// Test with default options
const formatter = new XmlFormatter({
    indentSize: 4,
    indentType: 'spaces',
    formatAttributes: true,
    sortAttributes: true,
    selfClosingTags: true,
    maxLineLength: 120
});

try {
    const formatted = formatter.formatXml(xmlContent);
    console.log('Formatted XML:');
    console.log(formatted);

    // Check if apostrophes are preserved
    if (formatted.includes("&apos;")) {
        console.log('\n❌ FAILED: Apostrophes were converted to &apos;');
    } else if (formatted.includes("'")) {
        console.log('\n✅ SUCCESS: Apostrophes are preserved as single quotes');
    }

    // Save formatted output
    fs.writeFileSync('test-apostrophe-formatted.xml', formatted);
    console.log('\nFormatted XML saved to: test-apostrophe-formatted.xml');

} catch (error) {
    console.error('Error formatting XML:', error.message);
}
