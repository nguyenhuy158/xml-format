# Test Fixtures Pattern Guide

## Overview

Test data được tách ra thành các file XML riêng trong `src/test/fixtures/` thay vì hardcode trong test files. Điều này giúp:

- ✅ **Dễ đọc**: Xem input/expected rõ ràng mà không phải scroll code
- ✅ **Dễ edit**: Sửa XML trực tiếp, không bị escape characters
- ✅ **Dễ review**: So sánh diff giữa input và expected dễ dàng
- ✅ **Tái sử dụng**: Dùng chung fixtures cho nhiều tests

## Structure

```
src/test/
  fixtures/
    formatting/
      apostrophe-xpath-input.xml
      apostrophe-xpath-expected.xml
      apostrophe-domain-input.xml
      apostrophe-domain-expected.xml
    attributes/
      simple-sorting-input.xml
      simple-sorting-expected.xml
    comments/
      preserve-comments-input.xml
      preserve-comments-expected.xml
    odoo/
      ...
    config/
      ...
    validation/
      ...
```

## Naming Convention

Fixtures follow pattern: `{feature-name}-{case-name}-{type}.xml`

- `feature-name`: Tên feature (apostrophe, sorting, comments...)
- `case-name`: Tên test case cụ thể (xpath, domain, complex...)
- `type`: `input` hoặc `expected`

**Examples:**
- `apostrophe-xpath-input.xml` → Input cho test preserve apostrophes trong xpath
- `apostrophe-xpath-expected.xml` → Expected output
- `sorting-alphabetical-input.xml` → Input cho test sắp xếp attributes theo ABC
- `sorting-alphabetical-expected.xml` → Expected output

## Usage in Tests

### Before (Old Pattern - Hardcoded)

```typescript
test('Should preserve apostrophes in XPath expressions', () => {
    const input = `<odoo>
    <xpath expr="//field[@name='partner_id']" position="before">
        <field name="test"/>
    </xpath>
</odoo>`;

    const result = formatter.formatXml(input);

    assert.ok(!result.includes('&apos;'));
    assert.ok(result.includes("[@name='partner_id']"));
});
```

**Problems:**
- ❌ Input và expected lẫn trong code → khó đọc
- ❌ XML có escape characters → khó edit
- ❌ Không thấy expected output rõ ràng
- ❌ Phải scroll nhiều để xem full test case

### After (New Pattern - Fixtures)

```typescript
import { loadFixture } from '../utils/fixtureLoader';

test('Should preserve apostrophes in XPath expressions', () => {
    const fixture = loadFixture('formatting', 'apostrophe-xpath');
    const result = formatter.formatXml(fixture.input);

    assert.ok(!result.includes('&apos;'));
    assert.ok(result.includes("[@name='partner_id']"));
    // Optional: assert.strictEqual(result, fixture.expected);
});
```

**Benefits:**
- ✅ Code ngắn gọn, dễ đọc
- ✅ Xem input/expected ở file riêng → dễ so sánh
- ✅ Edit XML trực tiếp không cần escape
- ✅ Có thể mở cả 2 files side-by-side để review

## Fixture Loader API

### `loadFixture(category, testName)`

Load 1 test fixture:

```typescript
const fixture = loadFixture('formatting', 'apostrophe-xpath');
// Returns: { input: string, expected: string, description: string }
```

### `loadFixtures(category, testNames[])`

Load nhiều fixtures cùng lúc:

```typescript
const fixtures = loadFixtures('formatting', [
    'apostrophe-xpath',
    'apostrophe-domain',
    'apostrophe-mixed'
]);
// Returns: TestFixture[]
```

### `getAvailableFixtures(category)`

List tất cả fixtures có sẵn:

```typescript
const available = getAvailableFixtures('formatting');
// Returns: ['apostrophe-xpath', 'apostrophe-domain', ...]
```

## Creating New Fixtures

### Manual Method

1. Tạo 2 files trong `src/test/fixtures/{category}/`:
   - `{test-name}-input.xml`
   - `{test-name}-expected.xml`

2. Paste XML content (không cần escape)

3. Use trong test:
```typescript
const fixture = loadFixture('category', 'test-name');
```

### Auto-Extract Method (TODO)

```bash
# Extract fixtures from existing test file
node extract-fixtures.js src/test/formatting/apostrophe.test.ts
```

## Tips

### Khi nào dùng fixtures?

**✅ USE fixtures when:**
- Test có nhiều dòng XML (> 5 lines)
- Cần so sánh exact output
- Muốn review dễ input vs expected
- Test case có thể tái sử dụng

**❌ DON'T use fixtures when:**
- Test quá đơn giản (1-2 dòng XML)
- Chỉ check một vài assertion, không cần full expected
- Test logic phức tạp với nhiều variations

### Làm sao review fixtures dễ dàng?

1. **VS Code Side-by-Side**: Mở `*-input.xml` và `*-expected.xml` cùng lúc
2. **Git Diff**: Khi sửa fixtures, diff rõ ràng changes
3. **Search**: Dùng grep để tìm test case cụ thể:
   ```bash
   ls src/test/fixtures/formatting/ | grep apostrophe
   ```

### Fixtures vs Inline?

```typescript
// BAD: Hardcoded long XML in test
test('Complex case', () => {
    const input = `<very>
        <long>
            <xml>
                <with>many</with>
                <nested>elements</nested>
            </xml>
        </long>
    </very>`;
    // ... 20 more lines
});

// GOOD: Use fixture
test('Complex case', () => {
    const fixture = loadFixture('category', 'complex-case');
    const result = formatter.formatXml(fixture.input);
    assert.strictEqual(result, fixture.expected);
});
```

## Migration Checklist

Khi migrate existing tests sang fixtures:

- [ ] Identify test category (formatting, attributes, comments, odoo, etc.)
- [ ] Extract input XML → `*-input.xml`
- [ ] Run formatter manually để get expected → `*-expected.xml`
- [ ] Update test file: import `loadFixture`, replace hardcoded strings
- [ ] Run tests để verify: `npm test`
- [ ] Review side-by-side input vs expected
- [ ] Commit changes

## Examples

See refactored tests:
- `src/test/formatting/apostrophe.test.ts` - Uses fixtures
- `src/test/fixtures/formatting/apostrophe-*.xml` - Fixture files
