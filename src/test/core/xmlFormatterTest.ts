import { XmlFormatter, formatXml, validateXml } from '../../formatters/xmlFormatter';

// Test XML content
const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<root><child attr="value">text content</child><empty/></root>`;

const complexXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo><data noupdate="0"><record id="test_record" model="test.model"><field name="name">Test Name</field><field name="active">true</field></record></data></odoo>`;

// Test the formatter
export function testXmlFormatter() {
    console.log('=== Testing XML Formatter ===');

    try {
        // Test 1: Basic formatting
        console.log('\n1. Basic XML formatting:');
        const formatted1 = formatXml(testXml);
        console.log('Formatted XML:');
        console.log(formatted1);

        // Test 2: Complex XML formatting
        console.log('\n2. Complex XML formatting:');
        const formatted2 = formatXml(complexXml, { indentSize: 4 });
        console.log('Formatted XML:');
        console.log(formatted2);

        // Test 3: Validation
        console.log('\n3. XML validation:');
        const validation1 = validateXml(testXml);
        console.log('Valid XML:', validation1);

        const validation2 = validateXml('<invalid>unclosed tag');
        console.log('Invalid XML:', validation2);

        // Test 4: Different options
        console.log('\n4. Different formatting options:');
        const formatter = new XmlFormatter({
            indentType: 'tabs',
            indentSize: 1
        });
        const formatted3 = formatter.formatXml(testXml);
        console.log('Tab-indented XML:');
        console.log(formatted3);

        // Test 5: Attribute formatting based on line length
        console.log('\n5. Attribute formatting based on line length:');

        // Long line that should be broken down
        const longAttributeXml = `<record id="very_long_record_name_that_makes_line_too_long" model="some.very.long.model.name" context="{'key1': 'very_long_value_1', 'key2': 'very_long_value_2'}">content</record>`;

        // Short line that should stay on one line
        const shortAttributeXml = `<record id="short" model="test.model">content</record>`;

        const formatterWithAttributes = new XmlFormatter({
            formatAttributes: true,
            maxLineLength: 80
        });

        console.log('Long line (should break attributes):');
        console.log('Original length:', longAttributeXml.length);
        const formattedLong = formatterWithAttributes.formatXml(longAttributeXml);
        console.log('Formatted:');
        console.log(formattedLong);

        console.log('\nShort line (should stay on one line):');
        console.log('Original length:', shortAttributeXml.length);
        const formattedShort = formatterWithAttributes.formatXml(shortAttributeXml);
        console.log('Formatted:');
        console.log(formattedShort);

        console.log('\n=== All tests completed ===');
        return true;
    } catch (error) {
        console.error('Test failed:', error);
        return false;
    }
}