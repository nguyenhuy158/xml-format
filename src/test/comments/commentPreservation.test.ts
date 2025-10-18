import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('Comment Preservation Test Suite', () => {
    test('Should preserve comments when preserveComments is true', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- This is a comment -->
    <record id="test_record" model="test.model">
        <!-- Field comment -->
        <field name="name">Test</field>
    </record>
</odoo>`;

        const formatter = new XmlFormatter(getTestConfig({ preserveComments: true }));
        const result = formatter.formatXml(xml);

        assert.ok(result.includes('<!-- This is a comment -->'), 'Should preserve first comment');
        assert.ok(result.includes('<!-- Field comment -->'), 'Should preserve second comment');
    });

    test('Should remove comments when preserveComments is false', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- This is a comment -->
    <record id="test_record" model="test.model">
        <!-- Field comment -->
        <field name="name">Test</field>
    </record>
</odoo>`;

        const formatter = new XmlFormatter(getTestConfig({ preserveComments: false }));
        const result = formatter.formatXml(xml);

        assert.ok(!result.includes('<!-- This is a comment -->'), 'Should remove first comment');
        assert.ok(!result.includes('<!-- Field comment -->'), 'Should remove second comment');
        assert.ok(result.includes('<record'), 'Should preserve record element');
        assert.ok(result.includes('<field'), 'Should preserve field element');
    });

    test('Should preserve multi-line comments', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- Multi-line comment
         This spans multiple lines
         And continues here -->
    <record id="test" model="test.model">
        <field name="name">Test</field>
    </record>
</odoo>`;

        const formatter = new XmlFormatter(getTestConfig({ preserveComments: true }));
        const result = formatter.formatXml(xml);

        assert.ok(result.includes('Multi-line comment'), 'Should preserve multi-line comment content');
    });

    test('Should preserve comments at different positions', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Top-level comment -->
<odoo>
    <record id="test" model="test.model">
        <field name="name">Test</field> <!-- Inline comment -->
    </record>
    <!-- Bottom comment -->
</odoo>`;

        const formatter = new XmlFormatter(getTestConfig({ preserveComments: true }));
        const result = formatter.formatXml(xml);

        assert.ok(result.includes('Top-level comment'), 'Should preserve top-level comment');
        assert.ok(result.includes('Inline comment'), 'Should preserve inline comment');
        assert.ok(result.includes('Bottom comment'), 'Should preserve bottom comment');
    });

    test('Default should preserve comments', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- Comment -->
    <record id="test" model="test.model"/>
</odoo>`;

        const formatter = new XmlFormatter(getTestConfig()); // Use default config
        const result = formatter.formatXml(xml);

        assert.ok(result.includes('<!-- Comment -->'), 'Default behavior should preserve comments');
    });
});
