const { XmlFormatter } = require('./out/formatters/xmlFormatter');

const formatter = new XmlFormatter();
const input = `<xpath expr='//field[@name="partner_id"]' position="after"/>`;
const result = formatter.formatXml(input);

console.log('Input:');
console.log(input);
console.log('\nOutput:');
console.log(result);
console.log('\nContains &quot;:', result.includes('&quot;'));
console.log('Contains &apos;:', result.includes('&apos;'));
