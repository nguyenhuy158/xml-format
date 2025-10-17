# Highlight Error Range Feature Guide

## Giới thiệu
Tính năng Highlight Error Range tự động làm nổi bật (highlight) dòng lỗi trong editor khi XML validation thất bại, giúp bạn dễ dàng xác định và sửa lỗi.

## Cách hoạt động

### 1. Khi có lỗi XML
Khi bạn format một file XML không hợp lệ, extension sẽ:

1. **Hiển thị popup cảnh báo** với thông tin chi tiết
2. **Highlight dòng lỗi** với:
   - Màu nền đỏ nhạt (rgba(255, 0, 0, 0.15))
   - Border màu đỏ 3px bên trái
   - Marker màu đỏ trên overview ruler (thanh cuộn)
3. **Tự động scroll** editor đến dòng lỗi
4. **Tự động clear highlight** sau 5 giây (có thể tùy chỉnh)

### 2. Visual Indicators

#### Dòng được highlight
```
Normal line
Normal line
│ Error line with red background and left border  <-- Highlighted
Normal line
Normal line
```

#### Overview Ruler
Thanh cuộn bên phải sẽ có marker màu đỏ chỉ vị trí lỗi, giúp bạn dễ dàng nhìn thấy lỗi ngay cả trong file dài.

## Sử dụng

### Trigger Highlight
Có 2 cách để trigger error highlighting:

#### 1. Format Document Command
```
Cmd+Shift+P (hoặc Ctrl+Shift+P)
→ Gõ: "xml-formater: Format Document"
→ Enter
```

#### 2. Format on Save
Nếu bạn đã bật `xml-formater.formatOnSave`:
```
Cmd+S (hoặc Ctrl+S)
→ Auto validation và highlight nếu có lỗi
```

### Clear Highlight

Highlight sẽ tự động clear trong các trường hợp:

1. **Auto-clear sau duration** (default: 5 giây)
2. **Khi edit document** (gõ bất kỳ thay đổi nào)
3. **Khi chuyển sang file khác**

## Tùy chỉnh

### Thay đổi Highlight Duration

Mở Settings và tìm `xml-formater.highlightErrorDuration`:

**VS Code Settings UI:**
```
Settings → Extensions → XML Formater → Highlight Error Duration
```

**settings.json:**
```json
{
  "xml-formater.highlightErrorDuration": 10000  // 10 giây
}
```

**Range hợp lệ:**
- Minimum: 1000ms (1 giây)
- Maximum: 30000ms (30 giây)
- Default: 5000ms (5 giây)

### Ví dụ cấu hình

```json
{
  // Highlight error trong 3 giây
  "xml-formater.highlightErrorDuration": 3000,

  // Bật format on save để highlight auto khi lưu
  "xml-formater.formatOnSave": true,

  // Các settings khác
  "xml-formater.indentSize": 4,
  "xml-formater.formatAttributes": true
}
```

## Demo Examples

### Example 1: Missing Closing Tag
**File XML:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="name">Test
    </record>
</odoo>
```

**Kết quả:**
- Line 4 được highlight màu đỏ
- Popup: "Expected closing tag 'field' (cột 5)"
- Editor scroll đến line 4

### Example 2: Malformed Attribute
**File XML:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <record id="test" model="ir.ui.view">
        <field name="email"
    </record>
</odoo>
```

**Kết quả:**
- Line 4 được highlight
- Popup: "Attribute '</record' is an invalid name"
- Auto-scroll đến error

### Example 3: Long Line Content
**File XML:**
```xml
<record id="test_very_long_record_id_with_many_characters" model="ir.ui.view">
    <field name="name">Test</field
</record>
```

**Popup hiển thị:**
```
📍 Dòng 2:
"<field name="name">T..."
```
(Nội dung bị truncate ở 20 chars)

## Tips & Tricks

### 1. Quick Navigation
- Nhìn vào overview ruler để thấy vị trí lỗi trong file lớn
- Click vào marker màu đỏ để jump đến lỗi

### 2. Multiple Errors
- Extension chỉ highlight error đầu tiên
- Sau khi sửa lỗi đầu, format lại để tìm lỗi tiếp theo

### 3. Customize Duration
- **Đọc chậm?** → Tăng duration lên 10-15 giây
- **Đọc nhanh?** → Giảm xuống 2-3 giây
- **File lớn?** → Tăng duration để có thời gian scroll

### 4. Workflow Suggestions
```
1. Save file (Cmd+S)
2. Nếu có lỗi:
   - Đọc popup message
   - Nhìn highlight để xác định dòng
   - Sửa lỗi
3. Save lại để format thành công
```

## Troubleshooting

### Highlight không hiển thị?
- ✅ Kiểm tra file có phải XML không
- ✅ Đảm bảo đang ở đúng editor khi format
- ✅ Thử format lại (Cmd+Shift+P → Format Document)

### Highlight không tự clear?
- ✅ Kiểm tra setting `highlightErrorDuration`
- ✅ Thử edit document hoặc chuyển file
- ✅ Reload VS Code nếu vẫn còn

### Không scroll đến lỗi?
- ✅ Đảm bảo line number trong range file
- ✅ Thử close/reopen file
- ✅ Check output channel để xem log

## Technical Details

### Decoration Type
```typescript
const errorLineDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    border: '1px solid rgba(255, 0, 0, 0.8)',
    borderWidth: '0 0 0 3px',
    isWholeLine: true,
    overviewRulerColor: 'rgba(255, 0, 0, 0.8)',
    overviewRulerLane: vscode.OverviewRulerLane.Left
});
```

### Highlight Logic
```typescript
1. Validate XML → get error line number
2. Convert to 0-based line index
3. Get line range from document
4. Apply decoration
5. Reveal range (scroll to center)
6. Set timeout to clear after duration
```

### Auto-clear Events
```typescript
- onDidChangeTextDocument → clear highlights
- onDidChangeActiveTextEditor → clear highlights
- setTimeout(duration) → clear highlights
```

## See Also
- [SMART-VALIDATION.md](SMART-VALIDATION.md) - Chi tiết về validation
- [README.md](README.md) - Hướng dẫn tổng quan
- [CHANGELOG.md](CHANGELOG.md) - Lịch sử thay đổi
