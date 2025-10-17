const { XmlFormatter } = require('./out/formatters/xmlFormatter');
const fs = require('fs');

const xml = fs.readFileSync('test-maximum-blank-lines.xml', 'utf-8');

console.log('========== ORIGINAL XML ==========');
console.log(xml);

// Create a test to see what the builder outputs before post-processing
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const parserOptions = {
    ignoreAttributes: false,
    preserveOrder: true,
    trimValues: false,
    parseTagValue: false,
    parseAttributeValue: false,
    parseTrueNumberOnly: false,
    arrayMode: false,
    allowBooleanAttributes: true,
    unpairedTags: ['br', 'hr', 'img', 'input', 'meta', 'link'],
    commentPropName: '#comment'
};

const parser = new XMLParser(parserOptions);
const parsed = parser.parse(xml);

const builderOptions = {
    ignoreAttributes: false,
    format: true,
    indentBy: '    ',
    suppressEmptyNode: true,
    preserveOrder: true,
    suppressBooleanAttributes: false,
    suppressUnpairedNode: false,
    textNodeName: '#text',
    attributeNamePrefix: '@_',
    commentPropName: '#comment'
};

const builder = new XMLBuilder(builderOptions);
const builderOutput = builder.build(parsed);

console.log('\n========== RAW BUILDER OUTPUT (before post-processing) ==========');
console.log(builderOutput);

console.log('\n========== BUILDER OUTPUT ANALYSIS ==========');
const lines = builderOutput.split('\n');
for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i];
    const display = line.length === 0 ? '(empty line)' : line;
    console.log(`Line ${i + 1}: ${display}`);
}
