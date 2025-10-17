import { XmlFormatter } from '../src/formatters/xmlFormatter';

// Simple standalone test
const testXml1 = '<record id="very_long_record_name_that_makes_line_way_too_long" model="some.very.long.model.name.here" context="{\\"key1\\": \\"very_long_value_1\\", \\"key2\\": \\"very_long_value_2\\"}" active="true">content</record>';

const testXml2 = '<record id="short" model="test">content</record>';

console.log('=== Testing Attribute Formatting Feature ===');

const formatter = new XmlFormatter({
    formatAttributes: true,
    maxLineLength: 80,
    indentSize: 2,
    indentType: 'spaces'
});

console.log('\n--- Test 1: Long line (length:', testXml1.length, ') ---');
console.log('Should break attributes because it exceeds maxLineLength of 80');
console.log('Input:', testXml1);

try {
    const result1 = formatter.formatXml(testXml1);
    console.log('Output:');
    console.log(result1);
} catch (e) {
    console.error('Error:', e);
}

console.log('\n--- Test 2: Short line (length:', testXml2.length, ') ---');
console.log('Should stay on one line because it\'s under maxLineLength');
console.log('Input:', testXml2);

try {
    const result2 = formatter.formatXml(testXml2);
    console.log('Output:');
    console.log(result2);
} catch (e) {
    console.error('Error:', e);
}