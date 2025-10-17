/**
 * Unit Test for Smart Validation Feature
 */

import * as assert from 'assert';
import { XmlFormatter } from '../formatters/xmlFormatter';

suite('Smart Validation Test Suite', () => {
    test('Valid XML should pass validation', () => {
        const formatter = new XmlFormatter();
        const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test</field>
    </record>
</odoo>`;

        const result = formatter.validateXml(validXml);
        assert.strictEqual(result.isValid, true);
        assert.strictEqual(result.error, undefined);
    });

    test('Invalid XML - Missing closing tag', () => {
        const formatter = new XmlFormatter();
        const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test
    </record>
</odoo>`;

        const result = formatter.validateXml(invalidXml);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
        assert.ok(result.line);
        assert.ok(result.lineContent);
    });

    test('Invalid XML - Malformed tag', () => {
        const formatter = new XmlFormatter();
        const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test</field>
        <field name="email"
    </record>
</odoo>`;

        const result = formatter.validateXml(invalidXml);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
        assert.ok(result.line);
    });

    test('Not XML content', () => {
        const formatter = new XmlFormatter();
        const notXml = 'This is just plain text, not XML at all';

        const result = formatter.validateXml(notXml);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
    });

    test('Line content should be truncated to 20 chars', () => {
        const formatter = new XmlFormatter();
        const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test_very_long_record_id_that_exceeds_twenty_chars" model="ir.ui.view">
        <field name="name">Test
    </record>
</odoo>`;

        const result = formatter.validateXml(invalidXml);
        assert.strictEqual(result.isValid, false);
        if (result.lineContent) {
            assert.ok(result.lineContent.length <= 23); // 20 chars + "..."
            if (result.lineContent.endsWith('...')) {
                assert.ok(result.lineContent.length === 23);
            }
        }
    });

    test('isXmlContent - Valid XML', () => {
        const validXml = `<?xml version="1.0"?><root></root>`;
        assert.strictEqual(XmlFormatter.isXmlContent(validXml), true);
    });

    test('isXmlContent - Valid XML without declaration', () => {
        const validXml = `<root><child /></root>`;
        assert.strictEqual(XmlFormatter.isXmlContent(validXml), true);
    });

    test('isXmlContent - Not XML', () => {
        const notXml = 'This is just text';
        assert.strictEqual(XmlFormatter.isXmlContent(notXml), false);
    });

    test('isXmlContent - Empty string', () => {
        const empty = '';
        assert.strictEqual(XmlFormatter.isXmlContent(empty), false);
    });

    test('Format should fail for invalid XML', () => {
        const formatter = new XmlFormatter();
        const invalidXml = `<root><unclosed>`;

        assert.throws(() => {
            formatter.formatXml(invalidXml);
        }, /XML formatting failed/);
    });
});
