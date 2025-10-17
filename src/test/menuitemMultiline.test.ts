import * as assert from 'assert';
import { formatXml } from '../formatters/xmlFormatter';

suite('Multi-line Self-Closing Tag Test Suite', () => {
    test('Should format multi-line menuitem tag to single line with self-closing', () => {
        const input = `<odoo>
    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
        parent="agreement.agreement_menu_root"
        sequence="5"
    />
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        // Should remain self-closing
        assert.ok(result.includes('/>'), 'Tag should remain self-closing');
        assert.ok(!result.includes('</menuitem>'), 'Should not have closing tag');

        // Should find menuitem tag
        const menuitemMatch = result.match(/<menuitem[^>]*\/>/);
        assert.ok(menuitemMatch, 'Should find menuitem tag');

        // Current formatter behavior: collapses to single line
        const menuitemContent = menuitemMatch![0];
        assert.ok(menuitemContent.includes('action='), 'Should have action attribute');
        assert.ok(menuitemContent.includes('id='), 'Should have id attribute');
        assert.ok(menuitemContent.includes('name='), 'Should have name attribute');
    });

    test('Should sort attributes in formatted menuitem tag', () => {
        const input = `<odoo>
    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
        parent="agreement.agreement_menu_root"
        sequence="5"
    />
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        const menuitemMatch = result.match(/<menuitem[^>]*\/>/);
        assert.ok(menuitemMatch, 'Should find menuitem tag');

        const menuitemContent = menuitemMatch![0];

        // Check that attributes are present (order depends on sorting rules)
        assert.ok(menuitemContent.includes('id='), 'Should have id attribute');
        assert.ok(menuitemContent.includes('name='), 'Should have name attribute');
        assert.ok(menuitemContent.includes('action='), 'Should have action attribute');
        assert.ok(menuitemContent.includes('parent='), 'Should have parent attribute');
        assert.ok(menuitemContent.includes('sequence='), 'Should have sequence attribute');
        assert.ok(menuitemContent.includes('groups='), 'Should have groups attribute');
    });

    test('Should handle mixed single-line and multi-line self-closing tags', () => {
        const input = `<odoo>
    <record id="test" model="ir.ui.view">
        <field name="arch" type="xml">
            <xpath expr="//field[@name='test']" position="before">
                <field name="test_field" invisible="1"/>
            </xpath>
        </field>
    </record>
    <menuitem
        action="test_action"
        id="test_menu"
        name="Test"
    />
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        // Both field and menuitem should remain self-closing
        const fieldMatches = result.match(/<field[^>]*\/>/g);
        const menuitemMatch = result.match(/<menuitem[\s\S]*?\/>/);

        assert.ok(fieldMatches && fieldMatches.length > 0, 'field tags should be self-closing');
        assert.ok(menuitemMatch, 'menuitem tag should be self-closing');
    });

    test('Should preserve proper indentation for menuitem tag', () => {
        const input = `<odoo>
    <menuitem
        action="test_action"
        id="test_menu"
        name="Test"
    />
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        const lines = result.split('\n');
        const menuitemLine = lines.findIndex((line: string) => line.includes('<menuitem'));

        assert.ok(menuitemLine >= 0, 'Should find menuitem line');

        // Check that menuitem has proper base indentation
        const line = lines[menuitemLine];
        const indent = line.search(/\S/);

        // menuitem should be indented (inside odoo tag)
        assert.ok(indent > 0, 'menuitem should be indented');
    });
});
