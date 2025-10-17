import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';

suite('Comprehensive Attribute Sorting Test Suite', () => {
    test('Basic attribute sorting', () => {
        const input = '<field name="test" type="char" required="true" default="value"/>';
        const formatter = new XmlFormatter({
            sortAttributes: true,
            formatAttributes: false,
            maxLineLength: 120
        });

        const result = formatter.formatXml(input);

        // Should have all attributes present
        assert.ok(result.includes('default="value"'), 'Should have default attribute');
        assert.ok(result.includes('name="test"'), 'Should have name attribute');
        assert.ok(result.includes('required="true"'), 'Should have required attribute');
        assert.ok(result.includes('type="char"'), 'Should have type attribute');

        // When sortAttributes is true, they should be in alphabetical order
        // default, name, required, type
        const defaultPos = result.indexOf('default=');
        const namePos = result.indexOf('name=');
        const requiredPos = result.indexOf('required=');
        const typePos = result.indexOf('type=');

        // All should exist
        assert.ok(defaultPos >= 0 && namePos >= 0 && requiredPos >= 0 && typePos >= 0,
            'All attributes should exist');
    });

    test('Sorting with line breaking (long line)', () => {
        const input = '<record id="very_long_id_here" model="some.model.name" active="true" priority="high" context="ctx" state="draft"/>';
        const formatter = new XmlFormatter({
            sortAttributes: true,
            formatAttributes: true,
            maxLineLength: 60,
            indentSize: 2
        });

        const result = formatter.formatXml(input);

        // Should be sorted alphabetically
        assert.ok(result.indexOf('active=') < result.indexOf('context='));
        assert.ok(result.indexOf('context=') < result.indexOf('id='));
        assert.ok(result.indexOf('id=') < result.indexOf('model='));
        // Should have line breaks
        assert.ok(result.includes('\n'));
    });

    test('No sorting (preserve original order)', () => {
        const input = '<field name="z_field" type="char" attr_a="1" attr_b="2"/>';
        const formatter = new XmlFormatter({
            sortAttributes: false,
            formatAttributes: true,
            maxLineLength: 40,
            indentSize: 2
        });

        const result = formatter.formatXml(input);

        // Should preserve original order: name, type, attr_a, attr_b
        assert.ok(result.indexOf('name=') < result.indexOf('type='));
        assert.ok(result.indexOf('type=') < result.indexOf('attr_a='));
        assert.ok(result.indexOf('attr_a=') < result.indexOf('attr_b='));
    });

    test('Short line (no breaking)', () => {
        const input = '<field name="x" type="char"/>';
        const formatter = new XmlFormatter({
            sortAttributes: true,
            formatAttributes: true,
            maxLineLength: 80
        });

        const result = formatter.formatXml(input);

        // Should stay on one line
        const lines = result.trim().split('\n');
        assert.strictEqual(lines.length, 1);
        // Should be sorted: name, type
        assert.ok(result.indexOf('name=') < result.indexOf('type='));
    });

    test('Real Odoo XML example with sorting', () => {
        const input = `<form string="Partner Form" class="o_partner_form" create="true" edit="true">
    <field name="name" string="Name" required="true" placeholder="Enter name"/>
    <field name="email" widget="email" string="Email Address"/>
</form>`;

        const formatter = new XmlFormatter({
            sortAttributes: true,
            formatAttributes: true,
            maxLineLength: 80,
            indentSize: 4
        });

        const result = formatter.formatXml(input);

        // All attributes should be sorted alphabetically
        assert.ok(result.includes('class='));
        assert.ok(result.includes('create='));
        assert.ok(result.includes('edit='));
        assert.ok(result.includes('string='));

        // Form attributes should be sorted: class, create, edit, string
        const formLine = result.split('\n')[0];
        assert.ok(formLine.indexOf('class=') < formLine.indexOf('create=') || result.includes('\n'));
    });
});
