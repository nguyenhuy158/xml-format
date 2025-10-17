/**
 * Test Smart Validation Feature
 * This script tests the XML validation with detailed error reporting
 */

const { validateXml } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

console.log('=== Testing Smart Validation Feature ===\n');

// Test 1: Valid XML
console.log('Test 1: Valid XML');
const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test</field>
    </record>
</odoo>`;

const result1 = validateXml(validXml);
console.log('Result:', result1);
console.log('Expected: isValid = true\n');

// Test 2: Invalid XML - Missing closing tag
console.log('Test 2: Invalid XML - Missing closing tag');
const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test
    </record>
</odoo>`;

const result2 = validateXml(invalidXml);
console.log('Result:', result2);
console.log('Expected: isValid = false, with line number and content\n');

// Test 3: Invalid XML - Malformed tag
console.log('Test 3: Invalid XML - Malformed tag');
const invalidXml2 = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test</field>
        <field name="email"
    </record>
</odoo>`;

const result3 = validateXml(invalidXml2);
console.log('Result:', result3);
console.log('Expected: isValid = false, with line number and content\n');

// Test 4: Not XML content
console.log('Test 4: Not XML content');
const notXml = 'This is just plain text, not XML at all';
const result4 = validateXml(notXml);
console.log('Result:', result4);
console.log('Expected: isValid = false\n');

// Test 5: Read from test file
console.log('Test 5: Reading from test-invalid-xml.xml');
try {
    const fileContent = fs.readFileSync('test-invalid-xml.xml', 'utf8');
    const result5 = validateXml(fileContent);
    console.log('Result:', result5);

    if (!result5.isValid) {
        console.log('\nFormatted Error Message:');
        let msg = `⚠️ XML không hợp lệ - Không thể format`;
        if (result5.line !== undefined) {
            msg += `\n\n📍 Dòng ${result5.line}`;
            if (result5.lineContent) {
                msg += `:\n"${result5.lineContent}"`;
            }
        }
        msg += `\n\n❌ Lỗi: ${result5.error}`;
        console.log(msg);
    }
} catch (error) {
    console.error('Error reading file:', error.message);
}

console.log('\n=== Smart Validation Test Complete ===');
