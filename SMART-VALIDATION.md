# Smart Validation Feature

## Tổng quan
Tính năng Smart Validation giúp kiểm tra tính hợp lệ của file XML trước khi format, cảnh báo người dùng khi có lỗi và không thực hiện format nếu XML không hợp lệ.

## Tính năng chính

### 1. Kiểm tra nội dung file
- Kiểm tra xem file có phải là XML hợp lệ không
- Cảnh báo nếu file không chứa nội dung XML

### 2. Validation chi tiết
- Sử dụng `XMLValidator` từ `fast-xml-parser` để kiểm tra syntax
- Phát hiện các lỗi XML phổ biến:
  - Thiếu closing tag
  - Tag không đúng định dạng
  - Attribute không hợp lệ
  - Cấu trúc XML sai

### 3. Thông báo lỗi chi tiết
Khi phát hiện lỗi, popup cảnh báo hiển thị:
- ⚠️ Tiêu đề cảnh báo rõ ràng
- 📍 Số dòng xảy ra lỗi
- Nội dung dòng bị lỗi (giới hạn 20 ký tự + "...")
- ❌ Mô tả chi tiết lỗi (bao gồm cột nếu có)

### 4. Không format khi có lỗi
- File không bị thay đổi khi validation thất bại
- Giữ nguyên nội dung để người dùng sửa lỗi

## Ví dụ

### Lỗi thiếu closing tag
```xml
<field name="email"
<!-- Thiếu /> hoặc </field> -->
```

Popup hiển thị:
```
⚠️ XML không hợp lệ - Không thể format

📍 Dòng 10:
"<field name="email..."

❌ Lỗi: Expected closing tag 'field' (cột 5)
```

### File không phải XML
```
This is just plain text
```

Popup hiển thị:
```
⚠️ File này không phải là XML hợp lệ - Không thể format
```

## Cách sử dụng

### Format Document Command
1. Mở file XML
2. Chạy command: `xml-formater: Format Document`
3. Nếu XML không hợp lệ, popup cảnh báo hiển thị phía dưới bên phải
4. Nếu hợp lệ, file được format tự động

### Format on Save
1. Bật `xml-formater.formatOnSave` trong settings
2. Lưu file XML
3. Validation tự động chạy
4. Chỉ format nếu XML hợp lệ

## Implementation Details

### Validation Flow
```typescript
1. Kiểm tra file có phải XML không (XmlFormatter.isXmlContent())
2. Validate syntax với XMLValidator.validate()
3. Nếu lỗi:
   - Trích xuất line number, column number
   - Lấy nội dung dòng lỗi (max 20 chars)
   - Hiển thị popup warning
   - Return [] (không format)
4. Nếu hợp lệ:
   - Tiếp tục format
   - Return formatted content
```

### Error Information Structure
```typescript
interface ValidationResult {
    isValid: boolean;
    error?: string;      // Chi tiết lỗi
    line?: number;       // Số dòng
    lineContent?: string; // Nội dung dòng (max 20 chars)
}
```

## Testing

Run test script:
```bash
node test-smart-validation.js
```

Test cases:
- ✅ Valid XML
- ✅ Missing closing tag
- ✅ Malformed tag
- ✅ Not XML content
- ✅ Read from file with errors

## Benefits

1. **Ngăn chặn lỗi**: Không làm hỏng file khi XML sai cú pháp
2. **Thông báo rõ ràng**: Người dùng biết chính xác lỗi ở đâu
3. **Tiết kiệm thời gian**: Không cần tự tìm lỗi trong file lớn
4. **UX tốt hơn**: Popup thân thiện, dễ hiểu

## Notes

- XMLValidator phát hiện hầu hết lỗi syntax phổ biến
- Nội dung dòng lỗi được truncate ở 20 ký tự để popup gọn gàng
- Popup xuất hiện ở góc dưới bên phải (VS Code default)
- Lỗi cũng được log vào Output Channel để debug
