const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

const xmlContent = fs.readFileSync('test-quotes-edge-cases.xml', 'utf8');

console.log('Testing edge cases with quotes...\n');

const formatter = new XmlFormatter({
    indentSize: 4,
    formatAttributes: false,
    sortAttributes: false,
});

try {
    const formatted = formatter.formatXml(xmlContent);
    console.log('Formatted XML:');
    console.log(formatted);

    // Check for issues
    const issues = [];
    if (formatted.includes("&apos;")) {
        issues.push("❌ Found &apos; entity");
    }
    if (formatted.includes("&quot;") && !formatted.match(/&quot;.*&quot;/)) {
        // &quot; might be needed in some cases, but shouldn't appear unnecessarily
        issues.push("⚠️  Found &quot; entity");
    }

    if (issues.length === 0) {
        console.log('\n✅ All quotes handled correctly!');
    } else {
        console.log('\nIssues found:');
        issues.forEach(issue => console.log(issue));
    }

} catch (error) {
    console.error('Error:', error.message);
}
