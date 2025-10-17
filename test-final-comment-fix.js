const { XmlFormatter } = require('./out/formatters/xmlFormatter');

console.log('=== FINAL COMPREHENSIVE COMMENT PRESERVATION TEST ===\n');

// Test case từ user với formatAttributes=true (case bị lỗi trước đây)
const userTestXml = `<?xml version="1.0" encoding="utf-8"?>
<odoo>

    <!-- <menuitem id="menu_return" name="Return" web_icon="farmnet_return,static/description/icon.png" groups="farmnet_account.read">
        <menuitem id="menu_return_item" name="Return" action="stock_picking_return_action" />
        <menuitem id="menu_bill_item" name="Accountant" action="farmnet_fulfillment.account_move_pair_action" />
    </menuitem> -->

</odoo>`;

// Formatter với formatAttributes=true (đây là option gây ra bug)
const formatter = new XmlFormatter({
    preserveComments: true,
    formatAttributes: true,
    sortAttributes: true,
    maxLineLength: 80,
    maximumBlankLines: 1,
    indentSize: 4,
    indentType: 'spaces'
});

console.log('Formatter Options:');
console.log('  - formatAttributes: true (would modify comments if bug exists)');
console.log('  - sortAttributes: true');
console.log('  - maxLineLength: 80');
console.log('  - preserveComments: true\n');

console.log('Original XML:');
console.log(userTestXml);
console.log('\n' + '='.repeat(70) + '\n');

try {
    const formatted = formatter.formatXml(userTestXml);
    
    console.log('Formatted XML:');
    console.log(formatted);
    console.log('\n' + '='.repeat(70) + '\n');
    
    // Extract và so sánh comment
    const originalComment = userTestXml.match(/<!--[\s\S]*?-->/);
    const formattedComment = formatted.match(/<!--[\s\S]*?-->/);
    
    if (!originalComment || !formattedComment) {
        console.log('❌ CRITICAL FAILURE: Comment missing!');
        process.exit(1);
    }
    
    const origTrimmed = originalComment[0].trim();
    const fmtTrimmed = formattedComment[0].trim();
    
    console.log('✅ VERIFICATION RESULTS:\n');
    
    // Check 1: Exact match
    if (origTrimmed === fmtTrimmed) {
        console.log('✅ Comment content is EXACTLY identical');
    } else {
        console.log('❌ FAIL: Comment was modified!');
        console.log('\n--- DIFF START ---');
        console.log('ORIGINAL:');
        console.log(origTrimmed);
        console.log('\nFORMATTED:');
        console.log(fmtTrimmed);
        console.log('--- DIFF END ---\n');
        process.exit(1);
    }
    
    // Check 2: No attribute formatting inside comment
    if (fmtTrimmed.includes('\n            action=') || fmtTrimmed.includes('\n            id=')) {
        console.log('❌ FAIL: Attributes inside comment were formatted!');
        process.exit(1);
    } else {
        console.log('✅ Attributes inside comment NOT formatted (correct!)');
    }
    
    // Check 3: No attribute sorting inside comment
    const origFirstMenuitem = origTrimmed.match(/<menuitem[^>]*\/>/);
    const fmtFirstMenuitem = fmtTrimmed.match(/<menuitem[^>]*\/>/);
    
    if (origFirstMenuitem && fmtFirstMenuitem) {
        if (origFirstMenuitem[0] === fmtFirstMenuitem[0]) {
            console.log('✅ Menuitem tags inside comment NOT sorted (correct!)');
        } else {
            console.log('❌ FAIL: Menuitem inside comment was modified!');
            process.exit(1);
        }
    }
    
    // Check 4: All attributes preserved
    const origAttrs = (origTrimmed.match(/\w+="[^"]*"/g) || []);
    const fmtAttrs = (fmtTrimmed.match(/\w+="[^"]*"/g) || []);
    
    if (origAttrs.length === fmtAttrs.length && origAttrs.every((attr, i) => attr === fmtAttrs[i])) {
        console.log(`✅ All ${origAttrs.length} attributes preserved in exact order`);
    } else {
        console.log('❌ FAIL: Attributes changed!');
        process.exit(1);
    }
    
    // Check 5: No placeholder comments
    if (formatted.includes('__BLANK_LINES_')) {
        console.log('❌ FAIL: Placeholder comments leaked to output!');
        process.exit(1);
    } else {
        console.log('✅ No placeholder comments in output');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅✅✅ ALL CHECKS PASSED! ✅✅✅');
    console.log('\n🎉 Comment preservation works correctly even with:');
    console.log('   - formatAttributes = true');
    console.log('   - sortAttributes = true');
    console.log('   - Long lines that would trigger formatting');
    console.log('\n💯 Bug fix confirmed successful!');
    
} catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
}
