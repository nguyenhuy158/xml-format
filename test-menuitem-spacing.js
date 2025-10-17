const { formatXml } = require('./out/formatters/xmlFormatter');

console.log('=== Test Case 1: Multi-line menuitem at the end (SHOULD BE OK) ===');
const input1 = `<odoo>

    <record id="agreement.agreement_action" model="ir.actions.act_window">
        <field name="domain">[('domain', 'in', ['sale', 'purchase', None])]</field>
    </record>

    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
        parent="agreement.agreement_menu_root"
        sequence="5"
    />

    <menuitem action="transfer_agreement_action"/>

</odoo>`;

const result1 = formatXml(input1, {
    indentSize: 4,
    sortAttributes: true
});

console.log(result1);
console.log('\n' + '='.repeat(60) + '\n');

console.log('=== Test Case 2: Single-line menuitem at the end (NOT OK - Missing blank line) ===');
const input2 = `<odoo>

    <record id="agreement.agreement_action" model="ir.actions.act_window">
        <field name="domain">[('domain', 'in', ['sale', 'purchase', None])]</field>
    </record>

    <menuitem action="transfer_agreement_action"/>

    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
        parent="agreement.agreement_menu_root"
        sequence="5"
    />
</odoo>`;

const result2 = formatXml(input2, {
    indentSize: 4,
    sortAttributes: true
});

console.log(result2);

// Check if there's a blank line before </odoo>
const lines2 = result2.split('\n');
const odooCloseIndex = lines2.findIndex(line => line.trim() === '</odoo>');
const prevLine = lines2[odooCloseIndex - 1];
const hasBankLineBefore = prevLine && prevLine.trim() === '';

console.log('\n=== Analysis ===');
console.log('Has blank line before </odoo>?', hasBankLineBefore);
console.log('Previous line:', JSON.stringify(prevLine));
