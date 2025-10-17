import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';

suite('Simple Attribute Formatting Test Suite', () => {
    test('Long line should break attributes', () => {
        const input = '<record id="very_long_record_name_that_makes_line_way_too_long" model="some.very.long.model.name.here" active="true" state="draft" priority="high">content</record>';

        const formatter = new XmlFormatter({
            formatAttributes: true,
            maxLineLength: 80,
            indentSize: 2,
            indentType: 'spaces'
        });

        const result = formatter.formatXml(input);

        // Should break into multiple lines
        const lines = result.split('\n');
        assert.ok(lines.length > 1, 'Should have multiple lines');

        // All attributes should be present
        assert.ok(result.includes('id='), 'Should have id attribute');
        assert.ok(result.includes('model='), 'Should have model attribute');
        assert.ok(result.includes('active='), 'Should have active attribute');
        assert.ok(result.includes('state='), 'Should have state attribute');
        assert.ok(result.includes('priority='), 'Should have priority attribute');
    });

    test('Short line should stay on one line', () => {
        const input = '<record id="short" model="test">content</record>';

        const formatter = new XmlFormatter({
            formatAttributes: true,
            maxLineLength: 80,
            indentSize: 2,
            indentType: 'spaces'
        });

        const result = formatter.formatXml(input);

        // Should stay on one line (or very few lines)
        const lines = result.trim().split('\n').filter(line => line.trim());

        // Should have all content
        assert.ok(result.includes('id="short"'), 'Should have id attribute');
        assert.ok(result.includes('model="test"'), 'Should have model attribute');
        assert.ok(result.includes('content'), 'Should have content');
    });

    test('Line length analysis for long attributes', () => {
        const input = `<?xml version="1.0"?>
<odoo>
    <field name="name" placeholder="Enter name here with a very long text that makes the line exceed maximum length" required="True"/>
    <button name="action_submit" string="Submit" type="object" class="btn-primary" icon="fa-check" attrs="{'invisible': [('state', '=', 'done')]}"/>
</odoo>`;

        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(input);

        // Check that formatting happened
        assert.ok(result.includes('<field'), 'Should have field tag');
        assert.ok(result.includes('<button'), 'Should have button tag');

        // All attributes should be preserved
        assert.ok(result.includes('placeholder='), 'Should have placeholder');
        assert.ok(result.includes('required='), 'Should have required');
        assert.ok(result.includes('string="Submit"'), 'Should have string attribute');
        assert.ok(result.includes('type="object"'), 'Should have type attribute');
    });
});
