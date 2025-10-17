const fs = require('fs');

// Read the test XML file
const xmlContent = fs.readFileSync('test-menuitem-multiline.xml', 'utf-8');

console.log('=== Testing Multi-line Self-Closing Tag Formatting ===\n');
console.log('Input XML:');
console.log(xmlContent);
console.log('\n' + '='.repeat(50) + '\n');

// Expected behavior:
// - Multi-line self-closing tags like <menuitem /> should remain self-closing
// - Attributes should be sorted according to rules
// - Indentation should be preserved
// - The closing /> should stay on the last line with the last attribute

console.log('Expected Output:');
console.log('- <menuitem /> tag should remain self-closing');
console.log('- Attributes should be sorted (id, name, action, parent, sequence, groups)');
console.log('- Each attribute on separate line with proper indentation');
console.log('- Closing /> on the same line as last attribute');
