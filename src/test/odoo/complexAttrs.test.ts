import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';

/**
 * Test Suite: Complex Odoo Attrs
 *
 * Tests formatting of Odoo XML files with complex `attrs` attribute values containing:
 * - Nested quotes (single and double)
 * - Square brackets and parentheses
 * - Domain expressions with OR operators (|)
 * - Boolean values (True, False)
 * - List values in domain filters
 *
 * Critical Fix: formatAttributes option should not break tags that have content on the same line.
 * Previously, tags like <attribute name="attrs">{'invisible': ...}</attribute> would be
 * incorrectly split into multiline format and lose their content.
 */
suite('Complex Odoo Attrs Test Suite', () => {
    let formatter: XmlFormatter;

    setup(() => {
        formatter = new XmlFormatter({
            indentSize: 4,
            formatAttributes: false,
            sortAttributes: false,
            selfClosingTags: true,
            maximumBlankLines: 1
        });
    });

    test('Should preserve attrs content when formatAttributes is enabled', () => {
        const formatterWithFormatAttrs = new XmlFormatter({
            indentSize: 4,
            formatAttributes: true
        });

        const input = `<odoo>
    <xpath position="attributes">
        <attribute name="attrs">{'invisible': ['|', '|', '|', '|', ('is_return', '=', True), ('is_hide_related', '=', True), ('bill_state', 'not in', ['replacement', 'adjustment']), ('state', '!=', 'invoice'), ('invoice_id', '=', True)]}</attribute>
    </xpath>
</odoo>`;

        const result = formatterWithFormatAttrs.formatXml(input);

        // Verify content is preserved even with formatAttributes: true
        assert.ok(result.includes("'invisible'"), 'Should preserve invisible key');
        assert.ok(result.includes("'is_return'"), 'Should preserve is_return field');
        assert.ok(result.includes("'invoice_id'"), 'Should preserve invoice_id field');
        assert.ok(result.includes("'is_hide_related'"), 'Should preserve is_hide_related field');

        // Verify attribute tag is not split when it has content on same line
        assert.ok(!result.includes('<attribute\n'), 'Attribute tag with content should not be split across lines');
    });

    test('Should preserve complex attrs with nested quotes and brackets', () => {
        const input = `<?xml version="1.0" encoding="utf-8"?>
<odoo>

    <record id="account_move_pair_form" model="ir.ui.view">
        <field name="name">account.move.pair.form</field>
        <field name="model">account.move.pair</field>
        <field name="inherit_id" ref="farmnet_fulfillment.account_move_pair_form" />
        <field name="arch" type="xml">
            <xpath expr="//button[@name='action_close']" position="before">
                <field name="is_return" invisible="1" />
            </xpath>
            <xpath expr="//button[@name='action_close']" position="attributes">
                <attribute name="attrs">{'invisible': ['|', '|', '|', '|', ('is_return', '=', True), ('is_hide_related', '=', True), ('bill_state', 'not in', ['replacement', 'adjustment']), ('state', '!=', 'invoice'), ('invoice_id', '=', True)]}</attribute>
            </xpath>
            <xpath expr="//button[@name='push_sale_order_to_netsuite']" position="attributes">
                <attribute name="attrs">{'invisible': ['|', '|', ('is_return', '=', True), ('sale_netsuite_ref', '!=', False), ('state', '!=', 'invoice_process')]}</attribute>
            </xpath>
            <xpath expr="//button[@name='action_get_invoice_ref']" position="attributes">
                <attribute name="attrs">{'invisible': ['|', '|', '|', '|', ('is_return', '=', True), ('state', '!=', 'invoice_process'), ('invoice_id', '=', False), ('invoice_ref', '!=', False), ('invoice_ref_date', '!=', False)]}</attribute>
            </xpath>
        </field>
    </record>

</odoo>`;

        const result = formatter.formatXml(input);

        // Verify XML is valid
        assert.ok(result.length > 0, 'Result should not be empty');
        assert.ok(result.includes('<?xml version="1.0" encoding="utf-8"?>'), 'Should preserve XML declaration');

        // Verify structure is preserved
        assert.ok(result.includes('<odoo>'), 'Should have odoo tag');
        assert.ok(result.includes('</odoo>'), 'Should close odoo tag');
        assert.ok(result.includes('<record'), 'Should have record tag');
        assert.ok(result.includes('id="account_move_pair_form"'), 'Should preserve record id');

        // Verify all xpath expressions are preserved
        assert.ok(result.includes('expr="//button[@name=\'action_close\']"'), 'Should preserve first xpath expr');
        assert.ok(result.includes('expr="//button[@name=\'push_sale_order_to_netsuite\']"'), 'Should preserve second xpath expr');
        assert.ok(result.includes('expr="//button[@name=\'action_get_invoice_ref\']"'), 'Should preserve third xpath expr');

        // Verify complex attrs attributes are preserved
        assert.ok(result.includes("name=\"attrs\""), 'Should have attrs attribute name');

        // Check for key parts of the complex domain expressions
        assert.ok(result.includes("'invisible'"), 'Should preserve invisible key');
        assert.ok(result.includes("'is_return'"), 'Should preserve is_return field');
        assert.ok(result.includes("'is_hide_related'"), 'Should preserve is_hide_related field');
        assert.ok(result.includes("'bill_state'"), 'Should preserve bill_state field');
        assert.ok(result.includes("'not in'"), 'Should preserve not in operator');
        assert.ok(result.includes("'replacement'"), 'Should preserve replacement value');
        assert.ok(result.includes("'adjustment'"), 'Should preserve adjustment value');
        assert.ok(result.includes("'sale_netsuite_ref'"), 'Should preserve sale_netsuite_ref field');
        assert.ok(result.includes("'invoice_process'"), 'Should preserve invoice_process value');

        // Verify no HTML entities for quotes
        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(!result.includes('&quot;'), 'Should not contain &quot; entities in content');

        // Verify proper indentation (should have proper nesting)
        const lines = result.split('\n');
        const recordLine = lines.find(l => l.includes('<record'));
        const fieldLines = lines.filter(l => l.includes('<field') && !l.includes('</field>'));

        if (recordLine && fieldLines.length > 0) {
            const recordIndent = recordLine.search(/\S/);
            const fieldIndent = fieldLines[0].search(/\S/);
            assert.ok(fieldIndent > recordIndent, 'Field tags should be indented more than record tag');
        }
    });

    test('Should handle attrs with OR operators and True/False values', () => {
        const input = `<odoo>
    <xpath expr="//button[@name='test']" position="attributes">
        <attribute name="attrs">{'invisible': ['|', '|', ('field1', '=', True), ('field2', '=', False), ('field3', '!=', 'value')]}</attribute>
    </xpath>
</odoo>`;

        const result = formatter.formatXml(input);

        // Verify the complex logic is preserved
        assert.ok(result.includes("'|'"), 'Should preserve OR operators');
        assert.ok(result.includes('True'), 'Should preserve True value');
        assert.ok(result.includes('False'), 'Should preserve False value');
        assert.ok(result.includes("('field1', '=', True)"), 'Should preserve tuple with True');
        assert.ok(result.includes("('field2', '=', False)"), 'Should preserve tuple with False');
        assert.ok(result.includes("('field3', '!=', 'value')"), 'Should preserve tuple with string value');
    });

    test('Should handle attrs with list values in domain', () => {
        const input = `<odoo>
    <field name="arch" type="xml">
        <xpath expr="//field[@name='test']" position="attributes">
            <attribute name="attrs">{'invisible': [('state', 'in', ['draft', 'done', 'cancel'])]}</attribute>
        </xpath>
    </field>
</odoo>`;

        const result = formatter.formatXml(input);

        // Verify list values in domain are preserved
        assert.ok(result.includes("'in'"), 'Should preserve in operator');
        assert.ok(result.includes("['draft', 'done', 'cancel']"), 'Should preserve list of values');
        assert.ok(result.includes("'draft'"), 'Should preserve draft value');
        assert.ok(result.includes("'done'"), 'Should preserve done value');
        assert.ok(result.includes("'cancel'"), 'Should preserve cancel value');
    });

    test('Should handle multiple attribute tags in same xpath', () => {
        const input = `<odoo>
    <xpath expr="//button[@name='action']" position="attributes">
        <attribute name="attrs">{'invisible': [('state', '!=', 'draft')]}</attribute>
        <attribute name="class">btn-primary</attribute>
        <attribute name="string">Submit</attribute>
    </xpath>
</odoo>`;

        const result = formatter.formatXml(input);

        // Verify all attributes are preserved
        assert.ok(result.includes('name="attrs"'), 'Should have attrs attribute');
        assert.ok(result.includes('name="class"'), 'Should have class attribute');
        assert.ok(result.includes('name="string"'), 'Should have string attribute');
        assert.ok(result.includes("'invisible'"), 'Should preserve invisible in attrs');
        assert.ok(result.includes('btn-primary'), 'Should preserve class value');
        assert.ok(result.includes('Submit'), 'Should preserve string value');
    });
});
