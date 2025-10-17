#!/usr/bin/env node

const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Simple test XML with long attributes
const xmlContent = `<?xml version="1.0"?>
<odoo>
    <field name="name" placeholder="Enter name here with a very long text that makes the line exceed maximum length" required="True"/>
    <button name="action_submit" string="Submit" type="object" class="btn-primary" icon="fa-check" attrs="{'invisible': [('state', '=', 'done')]}"/>
</odoo>`;

console.log('=== Test with closeTagOnNewLine = FALSE ===\n');

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

console.log('\n=== Test with closeTagOnNewLine = TRUE ===\n');

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
