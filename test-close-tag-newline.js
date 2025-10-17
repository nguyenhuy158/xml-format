const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

// Read test XML
const xmlContent = fs.readFileSync('test-close-tag-newline.xml', 'utf-8');

console.log('=== Original XML ===');
console.log(xmlContent);

// Test 1: closeTagOnNewLine = false (default)
console.log('\n=== Test 1: closeTagOnNewLine = false (default) ===');
const formatter1 = new XmlFormatter({
    formatAttributes: true,
    sortAttributes: true,
    closeTagOnNewLine: false
});
const result1 = formatter1.formatXml(xmlContent);
console.log(result1);

// Test 2: closeTagOnNewLine = true
console.log('\n=== Test 2: closeTagOnNewLine = true ===');
const formatter2 = new XmlFormatter({
    formatAttributes: true,
    sortAttributes: true,
    closeTagOnNewLine: true
});
const result2 = formatter2.formatXml(xmlContent);
console.log(result2);

// Save results
fs.writeFileSync('test-close-tag-newline-result-false.xml', result1);
fs.writeFileSync('test-close-tag-newline-result-true.xml', result2);

console.log('\n=== Results saved to files ===');
console.log('- test-close-tag-newline-result-false.xml');
console.log('- test-close-tag-newline-result-true.xml');
