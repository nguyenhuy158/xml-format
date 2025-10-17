const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

// Read test file
const xmlContent = fs.readFileSync('./test-comments.xml', 'utf-8');

console.log('=== Test 1: preserveComments = true (default) ===');
const formatter1 = new XmlFormatter({ preserveComments: true });
const result1 = formatter1.formatXml(xmlContent);
console.log(result1);

console.log('\n=== Test 2: preserveComments = false ===');
const formatter2 = new XmlFormatter({ preserveComments: false });
const result2 = formatter2.formatXml(xmlContent);
console.log(result2);
