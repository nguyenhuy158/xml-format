const { XmlFormatter } = require('./out/formatters/xmlFormatter');

const xmlWithBlankLines = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="test1" model="test.model">
            <field name="name">Test 1</field>
        </record>



        <record id="test2" model="test.model">
            <field name="name">Test 2</field>
        </record>
    </data>
</odoo>`;

console.log('========== ORIGINAL XML ==========');
console.log(xmlWithBlankLines);

// Test the preserveBlankLinesAsComments method manually
const formatter = new XmlFormatter({ indentSize: 4, maximumBlankLines: 1 });

// Manually call the private method (hacky but for debugging)
const lines = xmlWithBlankLines.split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
        let consecutiveBlankCount = 1;
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === '') {
            consecutiveBlankCount++;
            j++;
        }

        if (consecutiveBlankCount > 0) {
            result.push(`<!--__BLANK_LINES_${consecutiveBlankCount}__-->`);
            i = j - 1;
        }
    } else {
        result.push(line);
    }
}

const xmlWithPlaceholders = result.join('\n');

console.log('\n========== AFTER PRESERVING BLANK LINES AS COMMENTS ==========');
console.log(xmlWithPlaceholders);

console.log('\n========== AFTER FULL FORMAT ==========');
const formatted = formatter.formatXml(xmlWithBlankLines);
console.log(formatted);
