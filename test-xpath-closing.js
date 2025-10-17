#!/usr/bin/env node

const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test với xpath có opening tag (không phải self-closing)
const xmlContent = `<?xml version="1.0"?>
<odoo>
    <xpath expr="//button[@name='action_view_delivery']" position="attributes">
        <attribute name="invisible">1</attribute>
    </xpath>
    <field name="mobile" widget="phone" options="{'enable_sms': true}" placeholder="Enter mobile" required="True"/>
</odoo>`;

console.log('Original XML:');
console.log(xmlContent);
console.log('\n=================================\n');

console.log('With closeTagOnNewLine = FALSE:');
console.log('=================================');
const formatter1 = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 80,
    closeTagOnNewLine: false
});

try {
    const result1 = formatter1.formatXml(xmlContent);
    console.log(result1);
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\n\nWith closeTagOnNewLine = TRUE:');
console.log('=================================');
const formatter2 = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 80,
    closeTagOnNewLine: true
});

try {
    const result2 = formatter2.formatXml(xmlContent);
    console.log(result2);
} catch (error) {
    console.error('Error:', error.message);
}
