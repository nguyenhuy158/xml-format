const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test XML với comment nhiều dòng chứa menuitem structure
const testXml = `<?xml version="1.0" encoding="utf-8"?>
<odoo>

    <!-- <menuitem id="menu_return" name="Return" web_icon="farmnet_return,static/description/icon.png" groups="farmnet_account.read">
        <menuitem id="menu_return_item" name="Return" action="stock_picking_return_action" />
        <menuitem id="menu_bill_item" name="Accountant" action="farmnet_fulfillment.account_move_pair_action" />
    </menuitem> -->

</odoo>`;

console.log('=== Testing Comment Modification Bug ===\n');
console.log('Original XML:');
console.log(testXml);
console.log('\n' + '='.repeat(70) + '\n');

// Test với các options khác nhau
const testConfigs = [
    {
        name: 'Default (no formatting)',
        options: {
            preserveComments: true,
            formatAttributes: false,
            sortAttributes: false,
            indentSize: 4
        }
    },
    {
        name: 'With formatAttributes=true',
        options: {
            preserveComments: true,
            formatAttributes: true,
            sortAttributes: false,
            maxLineLength: 80,
            indentSize: 4
        }
    },
    {
        name: 'With sortAttributes=true',
        options: {
            preserveComments: true,
            formatAttributes: false,
            sortAttributes: true,
            indentSize: 4
        }
    },
    {
        name: 'With both formatAttributes + sortAttributes',
        options: {
            preserveComments: true,
            formatAttributes: true,
            sortAttributes: true,
            maxLineLength: 80,
            indentSize: 4
        }
    }
];

testConfigs.forEach((config, index) => {
    console.log(`\nTest ${index + 1}: ${config.name}`);
    console.log('='.repeat(70));
    
    const formatter = new XmlFormatter(config.options);
    
    try {
        const formatted = formatter.formatXml(testXml);
        
        // Extract comments
        const originalComment = testXml.match(/<!--[\s\S]*?-->/);
        const formattedComment = formatted.match(/<!--[\s\S]*?-->/);
        
        if (originalComment && formattedComment) {
            const origTrimmed = originalComment[0].trim();
            const fmtTrimmed = formattedComment[0].trim();
            
            if (origTrimmed === fmtTrimmed) {
                console.log('✅ PASS: Comment unchanged');
            } else {
                console.log('❌ FAIL: Comment was modified!');
                console.log('\nOriginal comment:');
                console.log(origTrimmed);
                console.log('\nFormatted comment:');
                console.log(fmtTrimmed);
                
                // Show what changed
                console.log('\n🔍 Changes detected:');
                if (fmtTrimmed.includes('\n            action=')) {
                    console.log('   - Attributes were formatted (split to multiple lines)');
                }
                if (fmtTrimmed.includes('action="stock_picking') && !origTrimmed.startsWith('<!-- <menuitem id="menu_return"')) {
                    console.log('   - Attributes were sorted alphabetically');
                }
            }
        } else {
            console.log('❌ ERROR: Comment not found');
        }
        
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }
});

console.log('\n' + '='.repeat(70));
console.log('\n💡 Expected: Comments should NEVER be modified, regardless of formatter options');
console.log('💡 Reality: If attributes formatting/sorting is enabled, comments get modified too!');
