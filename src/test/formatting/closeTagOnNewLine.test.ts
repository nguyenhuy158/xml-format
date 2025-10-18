import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('closeTagOnNewLine Test Suite', () => {
    test('Short single-line tags should not be affected', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test"/>\n</root>';

        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(xml);

        // Short tags should stay on one line
        assert.ok(result.includes('<field name="test"/>'));
    });

    test('Long tags with closeTagOnNewLine=false should put /> on same line', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test" placeholder="Very long placeholder text that exceeds maximum line length" required="True" readonly="False"/>\n</root>';

        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: false
        }));

        const result = formatter.formatXml(xml);

        // Should have multiline format with /> on last attribute line (not on new line)
        // After sorting: name, placeholder, readonly, required
        assert.ok(result.includes('required="True"/>') || result.includes('readonly="False"/>'));
        assert.ok(!result.match(/required="True"\s*\n\s*\/>/) && !result.match(/readonly="False"\s*\n\s*\/>/));
    });

    test('Long tags with closeTagOnNewLine=true should put /> on new line', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test" placeholder="Very long placeholder text that exceeds maximum line length" required="True" readonly="False"/>\n</root>';

        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(xml);

        // Should have multiline format with /> on new line
        // After sorting: name, placeholder, readonly, required
        assert.ok(result.includes('readonly="False"') || result.includes('required="True"'));
        // Check that /> is on new line after the last attribute
        assert.ok(result.match(/required="True"\s*\n\s*\/>/) || result.match(/readonly="False"\s*\n\s*\/>/));
    });

    test('Tags with closing tag should not be affected', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n<field name="test">Content</field>\n</root>';

        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(xml);

        // Tags with closing tags should not be affected
        assert.ok(result.includes('<field name="test">Content</field>'));
    });

    test('Multiple long attributes should be formatted correctly', () => {
        const xml = `<?xml version="1.0"?>
<root>
    <button name="action" string="Submit" type="object" class="btn-primary" icon="fa-check" attrs="{'invisible': [('state', '=', 'done')]}"/>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(xml);

        // Should have all attributes on separate lines (sorted: attrs, class, icon, name, string, type)
        assert.ok(result.includes('name="action"'));
        assert.ok(result.includes('string="Submit"'));
        assert.ok(result.includes('type="object"'));
        assert.ok(result.includes('class="btn-primary"'));
        assert.ok(result.includes('icon="fa-check"'));

        // Should have /> on new line after last attribute
        // After sorting, last attribute could be "type"
        assert.ok(result.match(/type="object"\s*\n\s*\/>/) || result.match(/attrs=.*\n\s*\/>/));
    });

    test('Indentation should be correct for closing tag', () => {
        const xml = '<?xml version="1.0"?>\n<root>\n    <field name="test" placeholder="Very long placeholder text" required="True"/>\n</root>';

        const formatter = new XmlFormatter(getTestConfig({
            maxLineLength: 60,
            closeTagOnNewLine: true
        }));

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

    test('Opening tags (not self-closing) with closeTagOnNewLine=false should have > on same line', () => {
        const xml = `<?xml version="1.0"?>
<root>
    <xpath expr="//button[@name='action_view_delivery_and_picking_operations']" position="attributes" mode="extension">
        <attribute name="invisible">1</attribute>
    </xpath>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: false
        }));

        const result = formatter.formatXml(xml);

        // Should have multiline format with > on last attribute line
        // After sorting: expr, mode, position
        assert.ok(result.includes('position="attributes">') || result.includes('mode="extension">'));
        assert.ok(!result.match(/position="attributes"\s*\n\s*>/) && !result.match(/mode="extension"\s*\n\s*>/));
    });

    test('Opening tags (not self-closing) with closeTagOnNewLine=true should have > on new line', () => {
        const xml = `<?xml version="1.0"?>
<root>
    <xpath expr="//button[@name='action_view_delivery_and_picking_operations']" position="attributes" mode="extension">
        <attribute name="invisible">1</attribute>
    </xpath>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(xml);

        // Should have multiline format with > on new line
        // After sorting: expr, mode, position (position is last)
        assert.ok(result.includes('mode="extension"') || result.includes('position="attributes"'));
        assert.ok(result.match(/position="attributes"\s*\n\s*>/) || result.match(/mode="extension"\s*\n\s*>/));

        // Check indentation of >
        const lines = result.split('\n');
        const xpathLine = lines.findIndex(line => line.includes('<xpath'));
        const closeLine = lines.findIndex(line => line.trim() === '>');

        if (xpathLine >= 0 && closeLine >= 0) {
            const xpathIndent = lines[xpathLine].match(/^\s*/)?.[0].length || 0;
            const closeIndent = lines[closeLine].match(/^\s*/)?.[0].length || 0;
            assert.strictEqual(xpathIndent, closeIndent, 'Closing > should have same indentation as opening tag');
        }
    });
});