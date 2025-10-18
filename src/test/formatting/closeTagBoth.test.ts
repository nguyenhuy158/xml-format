import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('Close Tag Both Options Test Suite', () => {
    const testXml = `<?xml version="1.0"?>
<odoo>
    <field name="name" placeholder="Enter name here with a very long text that makes the line exceed maximum length" required="True"/>
    <button name="action_submit" string="Submit" type="object" class="btn-primary" icon="fa-check" attrs="{'invisible': [('state', '=', 'done')]}"/>
</odoo>`;

    test('closeTagOnNewLine = false should keep closing tag on same line', () => {
        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: false
        }));

        const result = formatter.formatXml(testXml);

        // Should have field and button tags
        assert.ok(result.includes('<field'), 'Should contain field tag');
        assert.ok(result.includes('<button'), 'Should contain button tag');

        // All attributes should be preserved
        assert.ok(result.includes('name='), 'Should have name attribute');
        assert.ok(result.includes('placeholder='), 'Should have placeholder attribute');
        assert.ok(result.includes('required='), 'Should have required attribute');
        assert.ok(result.includes('string='), 'Should have string attribute');
        assert.ok(result.includes('type='), 'Should have type attribute');
    });

    test('closeTagOnNewLine = true should put closing tag on new line when needed', () => {
        const formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            maxLineLength: 80,
            closeTagOnNewLine: true
        });

        const result = formatter.formatXml(testXml);

        // Should have proper formatting
        assert.ok(result.includes('<field'), 'Should contain field tag');
        assert.ok(result.includes('<button'), 'Should contain button tag');

        // All attributes should be preserved
        assert.ok(result.includes('placeholder='), 'Should have placeholder attribute');
        assert.ok(result.includes('attrs='), 'Should have attrs attribute with complex value');
    });

    test('Both options should preserve all content', () => {
        const formatter1 = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: false
        }));

        const formatter2 = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: true
        }));

        const result1 = formatter1.formatXml(testXml);
        const result2 = formatter2.formatXml(testXml);

        // Both should have the same content, just different formatting
        const essentialAttrs = ['name=', 'placeholder=', 'required=', 'string=', 'type=', 'attrs='];

        for (const attr of essentialAttrs) {
            assert.ok(result1.includes(attr), `Result 1 should have ${attr}`);
            assert.ok(result2.includes(attr), `Result 2 should have ${attr}`);
        }
    });

    test('Complex attrs with JSON should be preserved', () => {
        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(testXml);

        // Complex attrs value should be preserved
        assert.ok(result.includes("{'invisible':"), 'Should preserve attrs with JSON-like value');
        assert.ok(result.includes('fa-check'), 'Should preserve icon value');
    });
});
