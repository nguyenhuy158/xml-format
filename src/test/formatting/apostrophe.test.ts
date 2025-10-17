import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';

suite('Apostrophe and Quote Handling Test Suite', () => {
    let formatter: XmlFormatter;

    setup(() => {
        formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true,
            sortAttributes: true,
            selfClosingTags: true
        });
    });

    test('Should preserve apostrophes in XPath expressions', () => {
        const input = `<odoo>
    <xpath expr="//field[@name='partner_id']" position="before">
        <field name="test"/>
    </xpath>
</odoo>`;

        const result = formatter.formatXml(input);
        
        // Should NOT convert ' to &apos; in double-quoted attributes
        assert.ok(!result.includes('&apos;'), 'Result should not contain &apos; entities');
        assert.ok(result.includes("[@name='partner_id']"), 'Should preserve single quotes in XPath');
    });

    test('Should preserve quotes in Odoo domain expressions', () => {
        const input = `<odoo>
    <record id="test">
        <field name="domain">[('name', '=', 'test')]</field>
    </record>
</odoo>`;

        const result = formatter.formatXml(input);
        
        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(result.includes("('name'"), 'Should preserve single quotes in domain');
    });

    test('Should handle mixed quotes in text content', () => {
        const input = `<odoo>
    <field name="help">It's a "test" value</field>
</odoo>`;

        const result = formatter.formatXml(input);
        
        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(!result.includes('&quot;'), 'Should not contain &quot; entities');
        assert.ok(result.includes("It's a \"test\" value"), 'Should preserve mixed quotes');
    });

    test('Should handle attributes with single quotes', () => {
        const input = `<xpath expr='//field[@name="partner_id"]' position="after"/>`;
        
        const result = formatter.formatXml(input);
        
        // fast-xml-parser normalizes to double quotes, so this is expected
        assert.ok(!result.includes('&quot;'), 'Should not contain unnecessary &quot; entities in normalized output');
    });

    test('Should preserve special characters in complex Odoo XML', () => {
        const input = `<odoo>
    <record id="agreement_form" model="ir.ui.view">
        <field name="arch" type="xml">
            <xpath expr="//field[@name='partner_id']" position="before">
                <field name="domain_partner_id" invisible="1"/>
            </xpath>
        </field>
    </record>
</odoo>`;

        const result = formatter.formatXml(input);
        
        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(result.includes("[@name='partner_id']"), 'Should preserve XPath syntax');
        assert.ok(result.includes('invisible="1"'), 'Should preserve attribute format');
    });

    test('Should handle both double and single quotes in different contexts', () => {
        const input = `<record id="test">
    <field name="domain">[('state', '=', 'draft')]</field>
    <field name="domain2">[("type", "=", "sale")]</field>
</record>`;

        const result = formatter.formatXml(input);
        
        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(!result.includes('&quot;'), 'Should not contain &quot; entities');
        assert.ok(result.includes("('state'"), 'Should preserve single quotes in first domain');
        assert.ok(result.includes('("type"'), 'Should preserve double quotes in second domain');
    });
});
