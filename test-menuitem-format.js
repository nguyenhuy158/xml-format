const fs = require('fs');
const { formatXml } = require('./out/formatters/xmlFormatter');

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

console.log('=== Input ===');
console.log(input);
console.log('\n=== Formatted Output ===');

const result = formatXml(input, {
    indentSize: 4,
    sortAttributes: true
});

console.log(result);
console.log('\n=== Analysis ===');

// Check if multi-line
const menuitemMatch = result.match(/<menuitem[\s\S]*?\/>/);
if (menuitemMatch) {
    const menuitemContent = menuitemMatch[0];
    const lines = menuitemContent.split('\n');
    console.log('Number of lines:', lines.length);
    console.log('Is multi-line?', lines.length > 2);
    console.log('\nLines:');
    lines.forEach((line, i) => console.log(`  ${i}: "${line}"`));

    // Check attribute order
    console.log('\n=== Attribute Order ===');
    const idIndex = menuitemContent.indexOf('id=');
    const nameIndex = menuitemContent.indexOf('name=');
    const actionIndex = menuitemContent.indexOf('action=');
    console.log('id position:', idIndex);
    console.log('name position:', nameIndex);
    console.log('action position:', actionIndex);
    console.log('id < name?', idIndex < nameIndex);
    console.log('name < action?', nameIndex < actionIndex);
}
