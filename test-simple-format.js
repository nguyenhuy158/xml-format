#!/usr/bin/env node

const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Simple test XML with long attributes
const xmlContent = `<?xml version="1.0"?>
<odoo>
    <field name="name" placeholder="Enter name here with a very long text that makes the line exceed maximum length" required="True"/>
    <button name="action_submit" string="Submit" type="object" class="btn-primary" icon="fa-check" attrs="{'invisible': [('state', '=', 'done')]}"/>
</odoo>`;

console.log('Original XML:');
console.log(xmlContent);
console.log('\n=================================\n');

const formatter = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 80,
    closeTagOnNewLine: true
});

try {
    const result = formatter.formatXml(xmlContent);
    console.log('Formatted XML (closeTagOnNewLine=true, maxLineLength=80):');
    console.log(result);

    // Check line lengths
    console.log('\n=== Line Length Analysis ===');
    const lines = result.split('\n');
    lines.forEach((line, idx) => {
        if (line.trim() && line.includes('<')) {
            console.log(`Line ${idx + 1} (${line.length} chars): ${line.substring(0, 100)}...`);
        }
    });
} catch (error) {
    console.error('Error:', error.message);
}
