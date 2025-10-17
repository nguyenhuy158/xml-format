const { formatXml } = require('./out/formatters/xmlFormatter');

console.log('=== Debug: Check if menuitem is in odooSpacingTags ===\n');

const input = `<odoo>

    <record id="test" model="ir.actions.act_window">
        <field name="domain">test</field>
    </record>

    <menuitem action="test_action"/>

    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
    />
</odoo>`;

const result = formatXml(input, {
    indentSize: 4,
    sortAttributes: true,
    odooTagSpacing: true,
    odooSpacingTags: ['record', 'menuitem']  // Explicit setting
});

console.log('Output:');
console.log(result);

const lines = result.split('\n');
console.log('\n=== Line by line ===');
lines.forEach((line, i) => {
    console.log(`${i}: "${line}"`);
});

const odooCloseIndex = lines.findIndex(line => line.trim() === '</odoo>');
console.log('\n</odoo> at line:', odooCloseIndex);
console.log('Previous line:', JSON.stringify(lines[odooCloseIndex - 1]));
console.log('Has blank line before?', lines[odooCloseIndex - 1]?.trim() === '');
