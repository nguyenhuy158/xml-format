
const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test các loại comment đặc biệt
const testCases = [
    {
        name: 'Comment with code snippets',
        xml: `<odoo>
    <!-- Example: <field name="test">value</field> -->
    <data></data>
</odoo>`
    },
    {
        name: 'Comment with XPath expressions',
        xml: `<odoo>
    <!-- XPath: //field[@name='test'] -->
    <data></data>
</odoo>`
    },
    {
        name: 'Comment with special XML entities',
        xml: `<odoo>
    <!-- Special chars: &lt; &gt; &amp; &quot; &apos; -->
    <data></data>
</odoo>`
    },
    {
        name: 'Comment with quotes',
        xml: `<odoo>
    <!-- Text with "double" and 'single' quotes -->
    <data></data>
</odoo>`
    },
    {
        name: 'Multi-line comment with indentation',
        xml: `<odoo>
    <!--
        Multi-line comment
            with indentation
        preserved?
    -->
    <data></data>
</odoo>`
    },
    {
        name: 'Comment with Vietnamese',
        xml: `<odoo>
    <!-- Đây là comment tiếng Việt có dấu -->
    <data></data>
</odoo>`
    }
];

const formatter = new XmlFormatter({
    preserveComments: true,
    indentSize: 4,
    indentType: 'spaces'
});

console.log('=== Testing Special Comment Cases ===\n');

let allPassed = true;

testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(50));

    try {
        const formatted = formatter.formatXml(testCase.xml);

        // Extract comments
        const originalComments = (testCase.xml.match(/<!--[\s\S]*?-->/g) || []);
        const formattedComments = (formatted.match(/<!--[\s\S]*?-->/g) || []);

        // Compare
        if (originalComments.length !== formattedComments.length) {
            console.log(`❌ FAIL: Comment count mismatch`);
            console.log(`   Original: ${originalComments.length}`);
            console.log(`   Formatted: ${formattedComments.length}`);
            allPassed = false;
        } else {
            let match = true;
            for (let i = 0; i < originalComments.length; i++) {
                const orig = originalComments[i].trim();
                const fmt = formattedComments[i].trim();

                if (orig !== fmt) {
                    console.log(`❌ FAIL: Comment content changed`);
                    console.log(`   Original:  ${orig}`);
                    console.log(`   Formatted: ${fmt}`);
                    match = false;
                    allPassed = false;
                }
            }

            if (match) {
                console.log(`✅ PASS: Comment preserved exactly`);
                console.log(`   ${originalComments[0].trim()}`);
            }
        }

    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        allPassed = false;
    }
});

console.log('\n' + '='.repeat(50));
if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
} else {
    console.log('❌ SOME TESTS FAILED!');
}
