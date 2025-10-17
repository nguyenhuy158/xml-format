const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

// Test XML with multiple consecutive blank lines
const xmlWithBlankLines = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="test1" model="test.model">
            <field name="name">Test 1</field>
        </record>



        <record id="test2" model="test.model">
            <field name="name">Test 2</field>
        </record>




        <record id="test3" model="test.model">
            <field name="name">Test 3</field>
        </record>
    </data>
</odoo>`;

console.log('========== ORIGINAL XML (with 3-4 blank lines between records) ==========');
console.log(xmlWithBlankLines);

console.log('\n========== TEST 1: maximumBlankLines: 0 (remove all blank lines) ==========');
const formatter0 = new XmlFormatter({
    indentSize: 4,
    maximumBlankLines: 0
});
const result0 = formatter0.formatXml(xmlWithBlankLines);
console.log(result0);

console.log('\n========== TEST 2: maximumBlankLines: 1 (keep max 1 blank line) ==========');
const formatter1 = new XmlFormatter({
    indentSize: 4,
    maximumBlankLines: 1
});
const result1 = formatter1.formatXml(xmlWithBlankLines);
console.log(result1);

console.log('\n========== TEST 3: maximumBlankLines: 2 (keep max 2 blank lines) ==========');
const formatter2 = new XmlFormatter({
    indentSize: 4,
    maximumBlankLines: 2
});
const result2 = formatter2.formatXml(xmlWithBlankLines);
console.log(result2);

// Count blank lines in each result
function countMaxConsecutiveBlankLines(text) {
    const lines = text.split('\n');
    let consecutive = 0;
    let max = 0;
    for (const line of lines) {
        if (line.trim() === '') {
            consecutive++;
            max = Math.max(max, consecutive);
        } else {
            consecutive = 0;
        }
    }
    return max;
}

console.log('\n========== STATISTICS ==========');
console.log(`Result 0 - Max consecutive blank lines: ${countMaxConsecutiveBlankLines(result0)} (expected: 0)`);
console.log(`Result 1 - Max consecutive blank lines: ${countMaxConsecutiveBlankLines(result1)} (expected: 1)`);
console.log(`Result 2 - Max consecutive blank lines: ${countMaxConsecutiveBlankLines(result2)} (expected: 2)`);
