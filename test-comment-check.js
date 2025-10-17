const fs = require('fs');
const path = require('path');

// Import the compiled formatter
const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test XML with comments
const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- This is a user comment -->
    <data>
        <!-- Another comment with special chars: <>&"' -->
        <record id="test" model="ir.model">
            <field name="name">Test</field>
            <!-- Inline comment -->
        </record>

        <!-- Multi-line comment
             with multiple lines
             should be preserved -->
    </data>
</odoo>`;

console.log('=== Testing Comment Preservation ===\n');
console.log('Original XML:');
console.log(testXml);
console.log('\n' + '='.repeat(50) + '\n');

// Format with default options
const formatter = new XmlFormatter({
    preserveComments: true,
    indentSize: 4,
    indentType: 'spaces'
});

try {
    const formatted = formatter.formatXml(testXml);
    console.log('Formatted XML:');
    console.log(formatted);
    console.log('\n' + '='.repeat(50) + '\n');

    // Check if all comments are preserved
    const originalComments = (testXml.match(/<!--[\s\S]*?-->/g) || []);
    const formattedComments = (formatted.match(/<!--[\s\S]*?-->/g) || []);

    console.log(`Original comments count: ${originalComments.length}`);
    console.log(`Formatted comments count: ${formattedComments.length}`);

    if (originalComments.length === formattedComments.length) {
        console.log('✅ All comments preserved!');

        // Check content of each comment
        console.log('\nComment comparison:');
        let allMatch = true;
        for (let i = 0; i < originalComments.length; i++) {
            const original = originalComments[i].trim();
            const formatted = formattedComments[i].trim();

            if (original === formatted) {
                console.log(`✅ Comment ${i + 1} matches`);
            } else {
                console.log(`❌ Comment ${i + 1} differs:`);
                console.log(`   Original:  ${original}`);
                console.log(`   Formatted: ${formatted}`);
                allMatch = false;
            }
        }

        if (allMatch) {
            console.log('\n✅ All comment contents are identical!');
        } else {
            console.log('\n❌ Some comment contents changed!');
        }
    } else {
        console.log('❌ Comment count mismatch!');
        console.log('\nOriginal comments:');
        originalComments.forEach((c, i) => console.log(`${i + 1}. ${c}`));
        console.log('\nFormatted comments:');
        formattedComments.forEach((c, i) => console.log(`${i + 1}. ${c}`));
    }

} catch (error) {
    console.error('❌ Error:', error.message);
}
