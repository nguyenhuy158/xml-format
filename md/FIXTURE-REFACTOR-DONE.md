# Test Fixtures Refactoring Summary

## ✅ Đã hoàn thành

### 1. Cấu trúc Fixtures
Tạo directory structure cho test fixtures:
```
src/test/fixtures/
├── README.md              # Hướng dẫn sử dụng fixtures
├── formatting/            # apostrophe-* fixtures (5 test cases)
├── attributes/
├── comments/
├── odoo/
├── config/
└── validation/
```

### 2. Fixture Loader Utility
Tạo `src/test/utils/fixtureLoader.ts` với 3 functions:
- `loadFixture(category, testName)` - Load 1 fixture
- `loadFixtures(category, testNames[])` - Load nhiều fixtures
- `getAvailableFixtures(category)` - List fixtures có sẵn

### 3. Build System Update
Cập nhật `package.json`:
```json
"compile": "tsc -p ./ && npm run copy:fixtures",
"copy:fixtures": "mkdir -p out/test/fixtures && cp -r src/test/fixtures/* out/test/fixtures/"
```

### 4. Example Migration
Refactor `apostrophe.test.ts` thành công:
- **Before**: 93 lines với hardcoded XML strings
- **After**: 67 lines sử dụng fixtures
- **Fixtures created**: 10 files (5 input + 5 expected)
- **All tests pass**: ✅

### 5. Documentation
Tạo 2 docs:
- `FIXTURE-GUIDE.md` - Chi tiết hướng dẫn sử dụng pattern
- `src/test/fixtures/README.md` - Quick reference

## 📊 Benefits

### Before (Old Pattern)
```typescript
test('Should preserve apostrophes in XPath expressions', () => {
    const input = `<odoo>
    <xpath expr="//field[@name='partner_id']" position="before">
        <field name="test"/>
    </xpath>
</odoo>`;
    const result = formatter.formatXml(input);
    // ... assertions
});
```

**Problems:**
- ❌ XML hardcoded trong test file → khó đọc
- ❌ Phải escape characters → khó edit
- ❌ Không thấy expected output
- ❌ Không thể review side-by-side

### After (New Pattern)
```typescript
test('Should preserve apostrophes in XPath expressions', () => {
    const fixture = loadFixture('formatting', 'apostrophe-xpath');
    const result = formatter.formatXml(fixture.input);
    // ... assertions
});
```

**Benefits:**
- ✅ Code ngắn, dễ đọc
- ✅ View input/expected ở file riêng
- ✅ Edit XML trực tiếp, không escape
- ✅ Review side-by-side trong VS Code
- ✅ Dễ debug khi test fail

## 🎯 Cách sử dụng

### Tạo fixture mới

1. Tạo 2 files trong `src/test/fixtures/{category}/`:
```
{test-name}-input.xml
{test-name}-expected.xml
```

2. Paste XML content (không cần escape)

3. Use trong test:
```typescript
import { loadFixture } from '../utils/fixtureLoader';

test('My test', () => {
    const fixture = loadFixture('category', 'test-name');
    const result = formatter.formatXml(fixture.input);
    assert.strictEqual(result, fixture.expected);
});
```

### View fixtures dễ dàng

**VS Code:**
- Mở `*-input.xml` và `*-expected.xml` side-by-side
- So sánh diff nếu sửa expected

**Command line:**
```bash
# List all fixtures
ls src/test/fixtures/formatting/

# Find specific fixture
ls src/test/fixtures/formatting/ | grep apostrophe

# View diff
diff src/test/fixtures/formatting/apostrophe-xpath-{input,expected}.xml
```

## 📝 Naming Convention

Pattern: `{feature}-{case}-{type}.xml`

Examples:
- `apostrophe-xpath-input.xml`
- `apostrophe-xpath-expected.xml`
- `sorting-alphabetical-input.xml`
- `sorting-alphabetical-expected.xml`

## 🔄 Migration Status

| Category | Status | Notes |
|----------|--------|-------|
| ✅ formatting/apostrophe | Done | 5 test cases migrated |
| ⏳ formatting/closeTag | Pending | Complex logic, keep inline |
| ⏳ formatting/maximumBlankLines | Pending | Could benefit from fixtures |
| ⏳ attributes/* | Pending | Good candidates |
| ⏳ comments/* | Pending | Good candidates |
| ⏳ odoo/* | Pending | Good candidates |

## 🚀 Next Steps

### Khi nào nên migrate sang fixtures?

**✅ Good candidates:**
- Tests có nhiều dòng XML (>5 lines)
- Cần so sánh exact expected output
- Test data có thể tái sử dụng
- Muốn review input vs expected dễ dàng

**❌ Keep inline:**
- Test quá đơn giản (1-2 dòng)
- Chỉ check vài assertion, không cần full expected
- Logic test phức tạp với nhiều variations

### Migration workflow:

1. Identify test file cần migrate
2. Extract XML strings → tạo fixture files
3. Update test file: import `loadFixture`, replace strings
4. Run `npm test` để verify
5. Review fixtures side-by-side
6. Commit changes

## 📚 References

- `FIXTURE-GUIDE.md` - Detailed guide with examples
- `src/test/fixtures/README.md` - Quick reference
- `src/test/utils/fixtureLoader.ts` - Loader implementation
- `src/test/formatting/apostrophe.test.ts` - Example refactored test

## 💡 Tips

1. **Dùng VS Code Split Editor** để xem input và expected cùng lúc
2. **Run tests thường xuyên** khi edit fixtures
3. **Git diff fixtures** rất clear, dễ review trong PR
4. **Đặt tên descriptive** để dễ tìm fixture cần thiết
5. **Không cần fixtures cho mọi test** - chỉ dùng khi có benefit rõ ràng
