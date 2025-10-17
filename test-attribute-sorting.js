const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test attribute sorting
const unsortedXml = '<record id="test_record" model="test.model" active="true" name="Test Name" context="test_context" priority="high">content</record>';

console.log('=== Testing Attribute Sorting Feature ===\n');

// Test 1: Without sorting
console.log('--- Test 1: Sorting disabled ---');
const formatterNoSort = new XmlFormatter({
    formatAttributes: true,
    sortAttributes: false,
    maxLineLength: 50,
    indentSize: 2,
    indentType: 'spaces'
});

console.log('Input:', unsortedXml);
console.log('\nOutput (should preserve original order: id, model, active, name, context, priority):');
const resultNoSort = formatterNoSort.formatXml(unsortedXml);
console.log(resultNoSort);

// Test 2: With sorting
console.log('\n--- Test 2: Sorting enabled ---');
const formatterWithSort = new XmlFormatter({
    formatAttributes: true,
    sortAttributes: true,
    maxLineLength: 50,
    indentSize: 2,
    indentType: 'spaces'
});

console.log('Input:', unsortedXml);
console.log('\nOutput (should be alphabetical: active, context, id, model, name, priority):');
const resultWithSort = formatterWithSort.formatXml(unsortedXml);
console.log(resultWithSort);

// Test 3: Complex example
console.log('\n--- Test 3: Complex Odoo XML ---');
const odooXml = `<record id="view_partner_form" model="ir.ui.view">
    <field name="name">res.partner.form</field>
    <field name="model">res.partner</field>
    <field name="arch" type="xml">
        <form string="Partner" class="o_partner_form" create="true" edit="true" delete="false">
            <sheet>
                <field name="image" widget="image" class="oe_avatar"/>
                <div class="oe_title">
                    <field name="name" placeholder="Name" required="true"/>
                </div>
            </sheet>
        </form>
    </field>
</record>`;

const formatterOdoo = new XmlFormatter({
    formatAttributes: true,
    sortAttributes: true,
    maxLineLength: 80,
    indentSize: 4,
    indentType: 'spaces'
});

console.log('Odoo XML with sorted attributes:');
const resultOdoo = formatterOdoo.formatXml(odooXml);
console.log(resultOdoo);

console.log('\n=== Test Completed ===');