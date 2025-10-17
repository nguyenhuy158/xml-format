const { XmlFormatter } = require('./out/formatters/xmlFormatter');

console.log('=== Comprehensive Attribute Sorting & Formatting Test ===\n');

// Test case 1: Basic sorting
console.log('TEST 1: Basic attribute sorting');
console.log('================================================');
const test1 = '<field name="test" type="char" required="true" default="value"/>';
const formatter1 = new XmlFormatter({
    sortAttributes: true,
    formatAttributes: false,
    maxLineLength: 120
});
console.log('Input :', test1);
console.log('Output:', formatter1.formatXml(test1).trim());
console.log('Expected: Attributes sorted alphabetically (default, name, required, type)\n');

// Test case 2: Sorting with line breaking
console.log('TEST 2: Sorting + line breaking (long line)');
console.log('================================================');
const test2 = '<record id="very_long_id_here" model="some.model.name" active="true" priority="high" context="ctx" state="draft">';
const formatter2 = new XmlFormatter({
    sortAttributes: true,
    formatAttributes: true,
    maxLineLength: 60,
    indentSize: 2
});
console.log('Input :', test2);
console.log('Output:');
console.log(formatter2.formatXml(test2));
console.log('Expected: Sorted alphabetically AND on separate lines\n');

// Test case 3: No sorting, preserve order
console.log('TEST 3: No sorting (preserve original order)');
console.log('================================================');
const test3 = '<field name="z_field" type="char" attr_a="1" attr_b="2"/>';
const formatter3 = new XmlFormatter({
    sortAttributes: false,
    formatAttributes: true,
    maxLineLength: 40,
    indentSize: 2
});
console.log('Input :', test3);
console.log('Output:');
console.log(formatter3.formatXml(test3));
console.log('Expected: Original order preserved (name, type, attr_a, attr_b)\n');

// Test case 4: Short line, no breaking even with formatAttributes=true
console.log('TEST 4: Short line (no breaking)');
console.log('================================================');
const test4 = '<field name="x" type="char"/>';
const formatter4 = new XmlFormatter({
    sortAttributes: true,
    formatAttributes: true,
    maxLineLength: 80
});
console.log('Input :', test4);
console.log('Output:', formatter4.formatXml(test4).trim());
console.log('Expected: Stays on one line (sorted: name, type)\n');

// Test case 5: Odoo form example
console.log('TEST 5: Real Odoo XML example');
console.log('================================================');
const test5 = `<form string="Partner Form" class="o_partner_form" create="true" edit="true">
    <field name="name" string="Name" required="true" placeholder="Enter name"/>
    <field name="email" widget="email" string="Email Address"/>
</form>`;
const formatter5 = new XmlFormatter({
    sortAttributes: true,
    formatAttributes: true,
    maxLineLength: 80,
    indentSize: 4
});
console.log('Input:');
console.log(test5);
console.log('\nOutput:');
console.log(formatter5.formatXml(test5));
console.log('Expected: All attributes sorted alphabetically, long lines broken\n');

console.log('=== All Tests Completed ===');