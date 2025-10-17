const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test XML with both blank lines and comments
const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- User comment 1 -->
    <data>


        <!-- User comment 2 after blank lines -->
        <record id="test1" model="ir.model">
            <field name="name">Test 1</field>
        </record>

        <!-- User comment 3 -->

        <record id="test2" model="ir.model">
            <field name="name">Test 2</field>
        </record>
    </data>
</odoo>`;

console.log('=== Testing Blank Lines + Comments ===\n');
console.log('Original XML:');
console.log(testXml);
console.log('\n' + '='.repeat(60) + '\n');

const formatter = new XmlFormatter({
    preserveComments: true,
    maximumBlankLines: 1,
    indentSize: 4,
    indentType: 'spaces'
});

try {
    const formatted = formatter.formatXml(testXml);
    console.log('Formatted XML:');
    console.log(formatted);
    console.log('\n' + '='.repeat(60) + '\n');

    // Check for placeholder comments (should not exist in output)
    const hasPlaceholder = formatted.includes('__BLANK_LINES_');

    if (hasPlaceholder) {
        console.log('❌ FAIL: Placeholder comments found in output!');
        const placeholders = formatted.match(/<!--__BLANK_LINES_\d+__-->/g);
        console.log('Found placeholders:', placeholders);
    } else {
        console.log('✅ PASS: No placeholder comments in output');
    }

    // Check that user comments are preserved
    const userComments = (testXml.match(/<!-- User comment \d+ -->/g) || []);
    const formattedUserComments = (formatted.match(/<!-- User comment \d+ -->/g) || []);

    console.log(`\nUser comments in original: ${userComments.length}`);
    console.log(`User comments in formatted: ${formattedUserComments.length}`);

    if (userComments.length === formattedUserComments.length) {
        console.log('✅ PASS: All user comments preserved');
    } else {
        console.log('❌ FAIL: User comments lost!');
    }

    // Check all comments match exactly
    const allOriginalComments = (testXml.match(/<!--[^>]*-->/g) || []).map(c => c.trim());
    const allFormattedComments = (formatted.match(/<!--[^>]*-->/g) || []).map(c => c.trim());

    console.log(`\nTotal comments in original: ${allOriginalComments.length}`);
    console.log(`Total comments in formatted: ${allFormattedComments.length}`);

    let allMatch = true;
    for (let i = 0; i < Math.min(allOriginalComments.length, allFormattedComments.length); i++) {
        if (allOriginalComments[i] !== allFormattedComments[i]) {
            console.log(`❌ Comment ${i + 1} differs:`);
            console.log(`   Original:  ${allOriginalComments[i]}`);
            console.log(`   Formatted: ${allFormattedComments[i]}`);
            allMatch = false;
        }
    }

    if (allMatch && allOriginalComments.length === allFormattedComments.length) {
        console.log('✅ PASS: All comment contents match exactly');
    }

} catch (error) {
    console.error('❌ Error:', error.message);
}
