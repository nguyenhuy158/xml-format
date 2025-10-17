const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

const xml = fs.readFileSync('test-maximum-blank-lines.xml', 'utf-8');

console.log('========== ORIGINAL XML ==========');
console.log(xml);

console.log('\n========== TEST 1: maximumBlankLines: 0 ==========');
const formatter1 = new XmlFormatter({
    indentSize: 4,
    maximumBlankLines: 0
});

const result1 = formatter1.formatXml(xml);
console.log(result1);

console.log('\n========== TEST 2: maximumBlankLines: 1 ==========');
const formatter = new XmlFormatter({
    indentSize: 4,
    maximumBlankLines: 1
});

const result = formatter.formatXml(xml);

console.log('\n========== FORMATTED XML (maximumBlankLines: 1) ==========');
console.log(result);

// Count consecutive blank lines
const lines = result.split('\n');
let consecutiveBlankLines = 0;
let maxConsecutive = 0;
let blankLinePositions = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') {
        consecutiveBlankLines++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveBlankLines);
        if (consecutiveBlankLines === 1) {
            blankLinePositions.push(i + 1); // Line numbers are 1-indexed
        }
    } else {
        consecutiveBlankLines = 0;
    }
}

console.log('\n========== STATISTICS ==========');
console.log(`Maximum consecutive blank lines: ${maxConsecutive}`);
console.log(`Blank line positions (1-indexed): ${blankLinePositions.join(', ')}`);
