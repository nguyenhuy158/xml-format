# Odoo Tag Spacing Feature

## Mô tả
Feature tự động thêm dòng trống giữa các thẻ quan trọng trong Odoo XML để cải thiện khả năng đọc code.

## Cấu hình

### 1. Bật/tắt tính năng
```json
"xml-formater.odooTagSpacing": true  // true = bật, false = tắt
```

### 2. Danh sách các tag cần spacing
```json
"xml-formater.odooSpacingTags": [
    "record",      // Odoo record definitions
    "menuitem",    // Menu items
    "template",    // QWeb templates
    "function",    // Function calls
    "delete",      // Delete operations
    "report"       // Report definitions
]
```

## Cách hoạt động

### Quy tắc:
- Các thẻ **trong danh sách** `odooSpacingTags` sẽ **tự động có ít nhất 1 dòng trống** sau chúng
- Các thẻ **không trong danh sách** sẽ **không tự động thêm** dòng trống

### Ví dụ 1: Tất cả tags trong danh sách

**Input:**
```xml
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <record id="model_2" model="ir.model">
            <field name="name">Model 2</field>
        </record>
        <menuitem id="menu_1" name="Menu 1"/>
        <menuitem id="menu_2" name="Menu 2"/>
    </data>
</odoo>
```

**Output (với odooTagSpacing: true):**
```xml
<odoo>
  <data>
    <record id="model_1" model="ir.model">
      <field name="name">Model 1</field>
    </record>

    <record id="model_2" model="ir.model">
      <field name="name">Model 2</field>
    </record>

    <menuitem id="menu_1" name="Menu 1"/>

    <menuitem id="menu_2" name="Menu 2"/>
  </data>
</odoo>
```

### Ví dụ 2: Custom danh sách (chỉ record và menuitem)

**Config:**
```json
{
    "xml-formater.odooTagSpacing": true,
    "xml-formater.odooSpacingTags": ["record", "menuitem"]
}
```

**Input:**
```xml
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <menuitem id="menu_1" name="Menu 1"/>
        <template id="template_1">
            <div>Content</div>
        </template>
        <template id="template_2">
            <div>Content 2</div>
        </template>
    </data>
</odoo>
```

**Output:**
```xml
<odoo>
  <data>
    <record id="model_1" model="ir.model">
      <field name="name">Model 1</field>
    </record>

    <menuitem id="menu_1" name="Menu 1"/>

    <template id="template_1">
      <div>Content</div>
    </template>
    <template id="template_2">
      <div>Content 2</div>
    </template>
  </data>
</odoo>
```

**Chú ý:** `template` không trong danh sách nên không tự động thêm dòng trống giữa 2 template.

### Ví dụ 3: Tắt hoàn toàn

**Config:**
```json
{
    "xml-formater.odooTagSpacing": false
}
```

**Output:** Không có dòng trống nào được tự động thêm vào.

## Use Cases

### 1. File Odoo lớn với nhiều records
```json
"xml-formater.odooSpacingTags": ["record"]
```
→ Tự động thêm spacing giữa các record để dễ phân biệt

### 2. File chỉ có menus
```json
"xml-formater.odooSpacingTags": ["menuitem"]
```
→ Tự động spacing giữa các menu items

### 3. File mix (views, menus, data)
```json
"xml-formater.odooSpacingTags": [
    "record",
    "menuitem",
    "template",
    "data"
]
```
→ Spacing cho tất cả các element chính

### 4. Không muốn spacing
```json
"xml-formater.odooTagSpacing": false
```
→ Tắt hoàn toàn feature

## Lợi ích

✅ **Tăng khả năng đọc code**: Dễ dàng phân biệt các khối logic khác nhau
✅ **Tự động hóa**: Không cần thêm dòng trống thủ công
✅ **Linh hoạt**: Tùy chỉnh danh sách tags theo nhu cầu
✅ **Nhất quán**: Toàn bộ team có cùng format style

## Testing

Chạy test để verify:
```bash
npm test
```

Hoặc test bằng file standalone:
```bash
node test-odoo-spacing.js
```
