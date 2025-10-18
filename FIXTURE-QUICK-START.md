# 🎯 Test Fixtures Pattern - Quick Start

## Vấn đề cũ

Trước đây khi muốn xem/sửa một test case:

```typescript
test('Should preserve apostrophes', () => {
    const input = `<odoo>
    <xpath expr="//field[@name='partner_id']" position="before">
        <field name="test"/>
    </xpath>
</odoo>`;  // ❌ Khó đọc, phải scroll, không thấy expected

    const result = formatter.formatXml(input);
    assert.ok(!result.includes('&apos;'));
    // ❌ Không biết expected output là gì?
});
```

**Problems:**
- ❌ Input/expected lẫn trong code → khó coi
- ❌ Phải scroll nhiều để xem XML
- ❌ Không thấy expected output
- ❌ Khó so sánh input vs expected

## Giải pháp mới

### 1. Test data tách ra file riêng

```
src/test/fixtures/formatting/
├── apostrophe-xpath-input.xml      ← Input XML
└── apostrophe-xpath-expected.xml   ← Expected output
```

### 2. Test code ngắn gọn

```typescript
import { loadFixture } from '../utils/fixtureLoader';

test('Should preserve apostrophes', () => {
    const fixture = loadFixture('formatting', 'apostrophe-xpath');
    const result = formatter.formatXml(fixture.input);

    assert.strictEqual(result, fixture.expected); // ✅ So sánh exact
});
```

### 3. Xem input/expected dễ dàng

**Trong VS Code:**
- Mở 2 files side-by-side
- So sánh diff rõ ràng
- Edit trực tiếp, không escape

**Trong terminal:**
```bash
# Xem all fixtures
ls src/test/fixtures/formatting/

# Xem diff
diff src/test/fixtures/formatting/apostrophe-xpath-{input,expected}.xml
```

## Usage

### Load 1 fixture

```typescript
const fixture = loadFixture('formatting', 'apostrophe-xpath');
// { input: "...", expected: "...", description: "apostrophe-xpath" }
```

### Load nhiều fixtures

```typescript
const fixtures = loadFixtures('formatting', [
    'apostrophe-xpath',
    'apostrophe-domain'
]);
```

### List fixtures có sẵn

```typescript
const names = getAvailableFixtures('formatting');
// ['apostrophe-xpath', 'apostrophe-domain', ...]
```

## Tạo fixture mới

### Cách 1: Manual (Recommended)

1. Tạo 2 files:
```bash
src/test/fixtures/formatting/my-test-input.xml
src/test/fixtures/formatting/my-test-expected.xml
```

2. Paste XML (không cần escape):
```xml
<!-- my-test-input.xml -->
<odoo>
  <record id="test">
    <field name="name">Test</field>
  </record>
</odoo>
```

3. Run formatter để get expected:
```typescript
const formatter = new XmlFormatter(config);
const expected = formatter.formatXml(input);
// Copy expected → my-test-expected.xml
```

4. Use trong test:
```typescript
const fixture = loadFixture('formatting', 'my-test');
```

## Khi nào dùng?

### ✅ USE fixtures

- XML dài (>5 lines)
- Cần compare exact expected output
- Muốn review input vs expected dễ
- Test data có thể reuse

### ❌ DON'T use fixtures

- XML quá ngắn (1-2 lines)
- Chỉ check vài assertion
- Logic phức tạp với nhiều variations

## Examples

**See:**
- `src/test/formatting/apostrophe.test.ts` - Refactored test
- `src/test/other/demo-fixtures.test.ts` - Usage examples
- `src/test/fixtures/formatting/` - Fixture files

## Docs

- `FIXTURE-GUIDE.md` - Chi tiết đầy đủ
- `FIXTURE-REFACTOR-DONE.md` - Summary refactoring
- `src/test/fixtures/README.md` - Structure guide

---

**Tóm lại:** Thay vì hardcode XML trong test, tách ra file riêng để dễ đọc/edit/review hơn!
