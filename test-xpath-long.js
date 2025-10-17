#!/usr/bin/env node

const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test với xpath có opening tag dài
const xmlContent = `<?xml version="1.0"?>
<odoo>
    <xpath expr="//button[@name='action_view_delivery_and_picking_operations']" position="attributes" mode="extension">
        <attribute name="invisible">1</attribute>
    </xpath>
</odoo>`;

console.log('Original XML:');
console.log(xmlContent);
console.log('\n=================================\n');

console.log('With closeTagOnNewLine = FALSE (maxLineLength=80):');
console.log('====================================================');
const formatter1 = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 80,
    closeTagOnNewLine: false
});

try {
    const result1 = formatter1.formatXml(xmlContent);
    console.log(result1);

    // Analyze lines
    console.log('\n--- Line Analysis ---');
    result1.split('\n').forEach((line, idx) => {
        if (line.includes('<xpath') || line.trim() === '>') {
            console.log(`Line ${idx + 1} (${line.length} chars): "${line}"`);
        }
    });
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\n\nWith closeTagOnNewLine = TRUE (maxLineLength=80):');
console.log('===================================================');
const formatter2 = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 80,
    closeTagOnNewLine: true
});

try {
    const result2 = formatter2.formatXml(xmlContent);
    console.log(result2);

    // Analyze lines
    console.log('\n--- Line Analysis ---');
    result2.split('\n').forEach((line, idx) => {
        if (line.includes('<xpath') || line.includes('expr=') || line.includes('position=') || line.trim() === '>') {
            console.log(`Line ${idx + 1} (${line.length} chars): "${line}"`);
        }
    });
} catch (error) {
    console.error('Error:', error.message);
}
