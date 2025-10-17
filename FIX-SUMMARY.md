# Fix Summary: Quote Entity Handling in XML Formatter

## Problem
When formatting XML files (especially Odoo XML with XPath expressions and domains), single quotes (`'`) were being converted to HTML entities (`&apos;`), making the code less readable.

### Example of the bug:
```xml
<!-- Original -->
<xpath expr="//field[@name='partner_id']" position="before"/>

<!-- After formatting (WRONG) -->
<xpath expr="//field[@name=&apos;partner_id&apos;]" position="before"/>
```

## Root Cause
The `fast-xml-parser` library's XMLBuilder automatically escapes special characters in attribute values according to XML spec:
- Single quotes to `&apos;` when inside double-quoted attributes
- Double quotes to `&quot;` when inside single-quoted attributes

While technically correct per XML spec, this reduces readability in Odoo development.

## Solution Implemented

### 1. Added `decodeAttributeEntities()` method
Located in `src/formatters/xmlFormatter.ts`, this method intelligently decodes XML entities:

```typescript
private decodeAttributeEntities(xml: string): string {
    // Decode &apos; in double-quoted attributes
    // Decode &quot; in single-quoted attributes
    // Re-wrap attributes with opposite quote style when needed for readability
    // Decode entities in text content
}
```

### 2. Smart Quote Selection
- If an attribute value contains `&quot;` (escaped double quotes), the formatter automatically switches to single-quote wrapping
- This avoids entity encoding while maintaining valid XML

### Examples:

**XPath expressions:**
```xml
<!-- Input -->
<xpath expr="//field[@name='partner_id']" position="before"/>
<!-- Output (quotes preserved) -->
<xpath expr="//field[@name='partner_id']" position="before"/>
```

**Odoo domains:**
```xml
<!-- Input -->
<field name="domain">[('name', '=', 'test')]</field>
<!-- Output (quotes preserved) -->
<field name="domain">[('name', '=', 'test')]</field>
```

**Mixed quotes:**
```xml
<!-- Input with double quotes inside -->
<xpath expr='//field[@name="partner_id"]' position="after"/>
<!-- Output (auto-switched to single quotes) -->
<xpath expr='//field[@name="partner_id"]' position="after"/>
```

## Files Modified

1. **src/formatters/xmlFormatter.ts**
   - Added `decodeAttributeEntities()` method
   - Integrated into `postProcessFormatting()` pipeline
   - Fixed ESLint curly brace warnings

2. **src/test/apostrophe.test.ts** (new file)
   - Comprehensive test suite for quote handling
   - Tests XPath, Odoo domains, mixed quotes, and edge cases
   - All 6 tests passing ✅

3. **CHANGELOG.md**
   - Documented the fix with examples
   - Added to [Unreleased] section

4. **README.md**
   - Added "Intelligent Quote Handling" feature
   - Added example section showing quote preservation

## Test Results

All tests passing (7 total):
- ✅ Sample test
- ✅ Should preserve apostrophes in XPath expressions
- ✅ Should preserve quotes in Odoo domain expressions
- ✅ Should handle mixed quotes in text content
- ✅ Should handle attributes with single quotes
- ✅ Should preserve special characters in complex Odoo XML
- ✅ Should handle both double and single quotes in different contexts

## Impact
- **Better readability**: Odoo developers see familiar XPath and domain syntax
- **No breaking changes**: Still produces valid XML
- **Improved DX**: Less cognitive load when reading formatted code
- **Backward compatible**: Works with existing XML files

## Additional Test Files Created
- `test-apostrophe.js` - Manual test for original bug report
- `test-quotes-edge-cases.js` - Edge case testing
- `test-single-quote-attr.js` - Single quote attribute handling
- `test-apostrophe.xml` - Sample Odoo XML
- `test-quotes-edge-cases.xml` - Complex quote scenarios

All manual tests pass with expected output! 🎉
