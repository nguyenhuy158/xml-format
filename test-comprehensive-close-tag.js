#!/usr/bin/env node

const { XmlFormatter } = require('./out/formatters/xmlFormatter');

const testCases = [
    {
        name: 'Single line tag (short)',
        xml: '<field name="name"/>'
    },
    {
        name: 'Single line tag with multiple attributes (short)',
        xml: '<field name="name" required="1" readonly="0"/>'
    },
    {
        name: 'Single line tag with long attributes',
        xml: '<field name="name" placeholder="Enter your full name with title and all information here that makes it very long" required="True" readonly="False"/>'
    },
    {
        name: 'Tag with closing tag',
        xml: '<field name="name">Content here</field>'
    },
    {
        name: 'Complex Odoo record',
        xml: `<record id="view_partner_form_custom" model="ir.ui.view">
    <field name="name">res.partner.form.custom</field>
    <field name="model">res.partner</field>
    <field name="arch" type="xml">
        <xpath expr="//field[@name='phone']" position="after">
            <field name="mobile" widget="phone" options="{'enable_sms': true, 'country_code': 'VN'}" placeholder="Enter mobile number" required="True"/>
        </xpath>
    </field>
</record>`
    }
];

console.log('=== TESTING closeTagOnNewLine with various cases ===\n');

testCases.forEach((testCase, idx) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test ${idx + 1}: ${testCase.name}`);
    console.log('='.repeat(60));

    console.log('\nOriginal:');
    console.log(testCase.xml);

    console.log('\n--- closeTagOnNewLine = FALSE ---');
    const formatter1 = new XmlFormatter({
        indentSize: 4,
        formatAttributes: true,
        maxLineLength: 80,
        closeTagOnNewLine: false
    });
    console.log(formatter1.formatXml(`<?xml version="1.0"?>\n<root>\n${testCase.xml}\n</root>`));

    console.log('\n--- closeTagOnNewLine = TRUE ---');
    const formatter2 = new XmlFormatter({
        indentSize: 4,
        formatAttributes: true,
        maxLineLength: 80,
        closeTagOnNewLine: true
    });
    console.log(formatter2.formatXml(`<?xml version="1.0"?>\n<root>\n${testCase.xml}\n</root>`));
});
