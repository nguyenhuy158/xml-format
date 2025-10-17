import { XmlFormatter } from '../formatters/xmlFormatter';

// Simple test for attribute formatting
export function testAttributeFormatting() {
    console.log('\n=== Testing Attribute Formatting Based on Line Length ===');

    // Test data
    const longLineXml = '<record id="very_long_record_name_that_makes_line_too_long" model="some.very.long.model.name" context="{\\"key1\\": \\"very_long_value_1\\", \\"key2\\": \\"very_long_value_2\\"}" active="true">content</record>';

    const shortLineXml = '<record id="short" model="test">content</record>';

    // Test with formatAttributes enabled and short maxLineLength
    const formatter = new XmlFormatter({
        formatAttributes: true,
        maxLineLength: 80,
        indentSize: 2,
        indentType: 'spaces'
    });

    try {
        console.log('Original long line length:', longLineXml.length);
        console.log('Max line length setting:', 80);

        console.log('\n--- Long Line Test (should break attributes) ---');
        console.log('Input:');
        console.log(longLineXml);

        const formattedLong = formatter.formatXml(longLineXml);
        console.log('\nFormatted output:');
        console.log(formattedLong);

        console.log('\n--- Short Line Test (should stay on one line) ---');
        console.log('Input:');
        console.log(shortLineXml);
        console.log('Input length:', shortLineXml.length);

        const formattedShort = formatter.formatXml(shortLineXml);
        console.log('\nFormatted output:');
        console.log(formattedShort);

        console.log('\n=== Attribute Formatting Test Completed ===');
        return true;
    } catch (error) {
        console.error('Attribute formatting test failed:', error);
        return false;
    }
}