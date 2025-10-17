import * as assert from 'assert';
import { XmlFormatter } from '../formatters/xmlFormatter';

suite('closeTagOnNewLine Test Suite', () => {
    test('Short single-line tags should not be affected', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test"/>\n</root>';

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(xml);

        // Short tags should stay on one line
        assert.ok(result.includes('<field name="test"/>'));
    });

    test('Long tags with closeTagOnNewLine=false should put /> on same line', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test" placeholder="Very long placeholder text that exceeds maximum line length" required="True" readonly="False"/>\n</root>';

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: false
        });

        const result = formatter.formatXml(xml);

        // Should have multiline format with /> on last attribute line
        assert.ok(result.includes('readonly="False"/>'));
        assert.ok(!result.match(/readonly="False"\s*\n\s*\/>/));
    });

    test('Long tags with closeTagOnNewLine=true should put /> on new line', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test" placeholder="Very long placeholder text that exceeds maximum line length" required="True" readonly="False"/>\n</root>';

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(xml);

        // Should have multiline format with /> on new line
        assert.ok(result.includes('readonly="False"'));
        assert.ok(result.match(/readonly="False"\s*\n\s*\/>/));
    });

    test('Tags with closing tag should not be affected', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test">Content</field>\n</root>';

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(xml);

        // Tags with closing tags should not be affected
        assert.ok(result.includes('<field name="test">Content</field>'));
    });

    test('Multiple long attributes should be formatted correctly', () => {
        const xml = `<?xml version="1.0"?>
<root>
    <button name="action" string="Submit" type="object" class="btn-primary" icon="fa-check" attrs="{'invisible': [('state', '=', 'done')]}"/>
</root>`;

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(xml);

        // Should have all attributes on separate lines
        assert.ok(result.includes('name="action"'));
        assert.ok(result.includes('string="Submit"'));
        assert.ok(result.includes('type="object"'));
        assert.ok(result.includes('class="btn-primary"'));
        assert.ok(result.includes('icon="fa-check"'));

        // Should have /> on new line
        assert.ok(result.match(/attrs=.*\n\s*\/>/));
    });

    test('Indentation should be correct for closing tag', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n    <field name="test" placeholder="Very long placeholder text" required="True"/>\n</root>';

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 60,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(xml);

        // Check that /> has same indentation as opening <
        const lines = result.split('\n');
        const fieldLine = lines.findIndex(line => line.includes('<field'));
        const closeLine = lines.findIndex(line => line.trim() === '/>');

        if (fieldLine >= 0 && closeLine >= 0) {
            const fieldIndent = lines[fieldLine].match(/^\s*/)?.[0].length || 0;
            const closeIndent = lines[closeLine].match(/^\s*/)?.[0].length || 0;
            assert.strictEqual(fieldIndent, closeIndent, 'Closing tag should have same indentation as opening tag');
        }
    });
});
