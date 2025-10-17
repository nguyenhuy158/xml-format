import * as assert from 'assert';
import { XmlFormatter } from '../formatters/xmlFormatter';

suite('Odoo Tag Spacing Test Suite', () => {
    test('Should add blank lines between record tags', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <record id="model_2" model="ir.model">
            <field name="name">Model 2</field>
        </record>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: true,
            odooSpacingTags: ['record']
        });

        const result = formatter.formatXml(input);

        // Should have blank line between </record> and <record>
        assert.ok(result.includes('</record>\n\n    <record'), 'Should have blank line between record tags');
    });

    test('Should add blank lines between menuitem tags', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <menuitem id="menu_1" name="Menu 1"/>
        <menuitem id="menu_2" name="Menu 2"/>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: true,
            odooSpacingTags: ['menuitem']
        });

        const result = formatter.formatXml(input);

        // Should have blank line between menuitem tags
        assert.ok(result.includes('/>\n\n    <menuitem'), 'Should have blank line between menuitem tags');
    });

    test('Should not add blank lines when odooTagSpacing is disabled', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <record id="model_2" model="ir.model">
            <field name="name">Model 2</field>
        </record>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: false
        });

        const result = formatter.formatXml(input);

        // Should NOT have blank line between record tags
        assert.ok(!result.includes('</record>\n\n    <record'), 'Should not have blank line when disabled');
        assert.ok(result.includes('</record>\n    <record'), 'Should have single newline between record tags');
    });

    test('Should only add blank lines for tags in odooSpacingTags list', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <menuitem id="menu_1" name="Menu 1"/>
        <template id="template_1">
            <div>Content</div>
        </template>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: true,
            odooSpacingTags: ['record', 'menuitem']  // template is NOT in the list
        });

        const result = formatter.formatXml(input);

        // Should have blank line between record and menuitem
        assert.ok(result.includes('</record>\n\n    <menuitem'), 'Should have blank line after record');

        // Should have blank line between menuitem and template
        assert.ok(result.includes('/>\n\n    <template'), 'Should have blank line after menuitem');

        // Template should NOT have blank line after it (no more tags in list after it)
    });

    test('Should handle mixed Odoo tags correctly', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <template id="template_1">
            <div>Content</div>
        </template>
        <function model="res.partner" name="test_func">
            <value>code</value>
        </function>
        <delete model="ir.model" id="old_model"/>
        <report id="report_1" model="sale.order" string="Report"/>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: true,
            odooSpacingTags: ['record', 'template', 'function', 'delete', 'report']
        });

        const result = formatter.formatXml(input);

        // All tags in the list should have blank lines between them
        assert.ok(result.includes('</record>\n\n    <template'), 'Should have blank line after record');
        assert.ok(result.includes('</template>\n\n    <function'), 'Should have blank line after template');
        assert.ok(result.includes('</function>\n\n    <delete'), 'Should have blank line after function');
        assert.ok(result.includes('/>\n\n    <report'), 'Should have blank line after delete');
    });

    test('Should preserve existing blank lines and comments', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <!-- This is a comment -->
        <record id="model_2" model="ir.model">
            <field name="name">Model 2</field>
        </record>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: true,
            odooSpacingTags: ['record'],
            preserveComments: true
        });

        const result = formatter.formatXml(input);

        // Should preserve comment
        assert.ok(result.includes('<!-- This is a comment -->'), 'Should preserve comments');
    });

    test('Should work with default Odoo spacing tags', () => {
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <menuitem id="menu_1" name="Menu 1"/>
    </data>
</odoo>`;

        const formatter = new XmlFormatter({
            odooTagSpacing: true
            // Using default odooSpacingTags
        });

        const result = formatter.formatXml(input);

        // Should add blank lines with default tags
        assert.ok(result.includes('</record>\n\n    <menuitem'), 'Should work with default tags');
    });
});
