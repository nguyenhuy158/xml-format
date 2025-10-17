import { XmlFormatter } from '../formatters/xmlFormatter';

// Test attribute sorting feature
export function testAttributeSorting() {
    console.log('\n=== Testing Attribute Sorting ===');

    // Test XML with attributes in non-alphabetical order
    const unsortedXml = '<record id="test_record" model="test.model" active="true" name="Test Name" context="test_context" priority="high">content</record>';

    try {
        // Test 1: With sorting disabled (default behavior)
        console.log('\n1. Sorting disabled (should preserve original order):');
        const formatterNoSort = new XmlFormatter({
            formatAttributes: true,
            sortAttributes: false,
            maxLineLength: 50, // Force attributes on separate lines
            indentSize: 2,
            indentType: 'spaces'
        });

        const resultNoSort = formatterNoSort.formatXml(unsortedXml);
        console.log('Result:');
        console.log(resultNoSort);

        // Test 2: With sorting enabled
        console.log('\n2. Sorting enabled (should sort alphabetically):');
        const formatterWithSort = new XmlFormatter({
            formatAttributes: true,
            sortAttributes: true,
            maxLineLength: 50, // Force attributes on separate lines
            indentSize: 2,
            indentType: 'spaces'
        });

        const resultWithSort = formatterWithSort.formatXml(unsortedXml);
        console.log('Result:');
        console.log(resultWithSort);
        console.log('Expected order: active, context, id, model, name, priority');

        // Test 3: Short line with sorting (should stay on one line)
        console.log('\n3. Short line with sorting enabled:');
        const shortXml = '<field name="test" type="char"/>';
        const resultShort = formatterWithSort.formatXml(shortXml);
        console.log('Result:');
        console.log(resultShort);

        console.log('\n=== Attribute Sorting Test Completed ===');
        return true;
    } catch (error) {
        console.error('Attribute sorting test failed:', error);
        return false;
    }
}