# Test Configuration Update Guide

## Mục tiêu
Tất cả các test case đều sử dụng config global từ file `src/test/testConfig.ts` và `.xmlformatterrc`.

## Config Global

### File: `src/test/testConfig.ts`
```typescript
export const DEFAULT_TEST_CONFIG: Partial<XmlFormatterOptions> = {
    indentSize: 2,
    indentType: 'spaces',
    maxLineLength: 120,
    preserveAttributes: false,
    formatAttributes: true,
    sortAttributes: true,
    selfClosingTags: true,
    closeTagOnNewLine: false,
    preserveComments: true,
    maximumBlankLines: 1
};
```

### File: `.xmlformatterrc`
```json
{
    "tabSize": 2,
    "useTabs": false,
    "alignAttributes": true,
    "sortAttributes": true,
    "emptyElementHandling": "selfClosing",
    "maxLineLength": 120,
    "closeTagOnNewLine": false,
    "preserveComments": true,
    "odooTagSpacing": true
}
```

## Pattern cập nhật

### 1. Thêm import
```typescript
// TRƯỚC:
import { XmlFormatter } from '../../formatters/xmlFormatter';

// SAU:
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig'; // hoặc '../../testConfig' tùy vào folder depth
```

### 2. Test case với config mặc định
```typescript
// TRƯỚC:
const formatter = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    sortAttributes: true,
    selfClosingTags: true
});

// SAU:
const formatter = new XmlFormatter(getTestConfig());
```

### 3. Test case với override config
```typescript
// TRƯỚC:
const formatter = new XmlFormatter({
    indentSize: 4,
    formatAttributes: true,
    maxLineLength: 80,
    closeTagOnNewLine: true
});

// SAU:
const formatter = new XmlFormatter(getTestConfig({
    closeTagOnNewLine: true
}));
```

### 4. Setup function
```typescript
// TRƯỚC:
setup(() => {
    formatter = new XmlFormatter({
        indentSize: 4,
        formatAttributes: true,
        sortAttributes: true
    });
});

// SAU:
setup(() => {
    formatter = new XmlFormatter(getTestConfig());
});
```

## Files đã cập nhật
- ✓ src/test/testConfig.ts (created)
- ✓ src/test/formatting/apostrophe.test.ts
- ✓ src/test/formatting/closeTagOnNewLine.test.ts
- ✓ src/test/formatting/closeTagBoth.test.ts
- ✓ src/test/formatting/xpathClosing.test.ts
- ✓ src/test/formatting/maximumBlankLines.test.ts
- ✓ src/test/attributes/simpleAttributes.test.ts

## Files cần cập nhật
- src/test/attributes/comprehensiveSorting.test.ts
- src/test/attributes/attributeSortingTest.ts
- src/test/attributes/attributeTest.ts
- src/test/odoo/*.test.ts
- src/test/comments/*.test.ts
- src/test/config/*.test.ts
- src/test/core/*.test.ts
- src/test/validation/*.test.ts

## Lợi ích
1. **Consistency**: Tất cả test đều dùng cùng 1 config mặc định
2. **Maintainability**: Chỉ cần sửa 1 chỗ khi thay đổi config global
3. **Clarity**: Test case chỉ override config khi thực sự cần thiết
4. **Flexibility**: Vẫn cho phép override config cho từng test case đặc biệt
