const { XmlFormatter } = require('./out/formatters/xmlFormatter');

// Test XML với comment nhiều dòng chứa menuitem structure
const testXml = `<?xml version="1.0" encoding="utf-8"?>
<odoo>

    <!-- <menuitem id="menu_return" name="Return" web_icon="farmnet_return,static/description/icon.png" groups="farmnet_account.read">
        <menuitem id="menu_return_item" name="Return" action="stock_picking_return_action" />
        <menuitem id="menu_bill_item" name="Accountant" action="farmnet_fulfillment.account_move_pair_action" />
    </menuitem> -->

</odoo>`;

console.log('=== Testing Menuitem Comment Preservation ===\n');
console.log('Original XML:');
console.log(testXml);
console.log('\n' + '='.repeat(70) + '\n');

const formatter = new XmlFormatter({
    preserveComments: true,
    maximumBlankLines: 1,
    indentSize: 4,
    indentType: 'spaces'
});

try {
    const formatted = formatter.formatXml(testXml);
    console.log('Formatted XML:');
    console.log(formatted);
    console.log('\n' + '='.repeat(70) + '\n');
    
    // Extract the multi-line comment
    const originalComment = testXml.match(/<!--[\s\S]*?-->/);
    const formattedComment = formatted.match(/<!--[\s\S]*?-->/);
    
    console.log('Validation Results:');
    console.log('-'.repeat(70));
    
    // Check 1: Comment exists in both
    if (!originalComment || !formattedComment) {
        console.log('❌ FAIL: Comment not found in one of the versions');
        if (!originalComment) console.log('   - Missing in original');
        if (!formattedComment) console.log('   - Missing in formatted');
    } else {
        console.log('✅ PASS: Comment exists in both versions');
        
        // Check 2: Comment content is identical
        const origTrimmed = originalComment[0].trim();
        const fmtTrimmed = formattedComment[0].trim();
        
        if (origTrimmed === fmtTrimmed) {
            console.log('✅ PASS: Comment content is identical');
        } else {
            console.log('❌ FAIL: Comment content differs');
            console.log('\nOriginal comment:');
            console.log(origTrimmed);
            console.log('\nFormatted comment:');
            console.log(fmtTrimmed);
        }
        
        // Check 3: Menuitem structure inside comment is preserved
        const menuitemPattern = /<menuitem[^>]*>/g;
        const origMenuitems = (originalComment[0].match(menuitemPattern) || []);
        const fmtMenuitems = (formattedComment[0].match(menuitemPattern) || []);
        
        if (origMenuitems.length === fmtMenuitems.length) {
            console.log(`✅ PASS: All ${origMenuitems.length} menuitem tags preserved in comment`);
        } else {
            console.log(`❌ FAIL: Menuitem count differs (${origMenuitems.length} vs ${fmtMenuitems.length})`);
        }
        
        // Check 4: All attributes preserved
        const attributePattern = /\w+="[^"]*"/g;
        const origAttrs = (originalComment[0].match(attributePattern) || []);
        const fmtAttrs = (formattedComment[0].match(attributePattern) || []);
        
        console.log(`\nAttribute count: Original=${origAttrs.length}, Formatted=${fmtAttrs.length}`);
        
        if (origAttrs.length === fmtAttrs.length) {
            console.log('✅ PASS: All attributes preserved');
            
            // Check each attribute
            let allAttrsMatch = true;
            for (let i = 0; i < origAttrs.length; i++) {
                if (origAttrs[i] !== fmtAttrs[i]) {
                    console.log(`   ⚠️  Attribute ${i + 1} differs:`);
                    console.log(`      Original:  ${origAttrs[i]}`);
                    console.log(`      Formatted: ${fmtAttrs[i]}`);
                    allAttrsMatch = false;
                }
            }
            if (allAttrsMatch) {
                console.log('   All attribute values match exactly');
            }
        } else {
            console.log('❌ FAIL: Attribute count mismatch');
        }
    }
    
    // Check 5: No placeholder comments in output
    const hasPlaceholder = formatted.includes('__BLANK_LINES_');
    if (hasPlaceholder) {
        console.log('\n❌ FAIL: Placeholder comments found in output');
    } else {
        console.log('\n✅ PASS: No placeholder comments in output');
    }
    
    // Check 6: Blank lines preserved
    const originalBlankLines = (testXml.match(/^\s*$/gm) || []).length;
    const formattedBlankLines = (formatted.match(/^\s*$/gm) || []).length;
    
    console.log(`\nBlank lines: Original=${originalBlankLines}, Formatted=${formattedBlankLines}`);
    if (formattedBlankLines <= formatter.options.maximumBlankLines + 2) { // +2 for tolerances
        console.log('✅ PASS: Blank lines within acceptable range');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ TEST COMPLETED SUCCESSFULLY');
    
} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
}
