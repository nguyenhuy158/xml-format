# Comment Preservation Feature

## Bug Fixed
Comments trong XML không còn bị tự động xóa khi format.

## New Configuration Option

### `xml-formater.preserveComments`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Preserve XML comments during formatting

#### When `true` (default):
Comments are kept and properly formatted with correct indentation.

#### When `false`:
Comments are automatically removed during formatting (useful for production builds).

## Examples

### Example 1: Preserve Comments (default)

**Input:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- This is a comment about the record -->
    <record id="test_record" model="test.model">
        <!-- Field comment -->
        <field name="name">Test Name</field>
    </record>
</odoo>
```

**Output (preserveComments: true):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
  <!-- This is a comment about the record -->
  <record id="test_record" model="test.model">
    <!-- Field comment -->
    <field name="name">Test Name</field>
  </record>
</odoo>
```

### Example 2: Remove Comments

**Input:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- This comment will be removed -->
    <record id="test_record" model="test.model">
        <!-- This one too -->
        <field name="name">Test Name</field>
    </record>
</odoo>
```

**Output (preserveComments: false):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
  <record id="test_record" model="test.model">
    <field name="name">Test Name</field>
  </record>
</odoo>
```

## How to Configure

### Via VS Code Settings UI
1. Open Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "xml-formater"
3. Toggle "Preserve Comments" option

### Via settings.json
```json
{
  "xml-formater.preserveComments": true  // or false
}
```

## Use Cases

### Development (preserveComments: true)
- Keep documentation and notes in XML files
- Maintain context for complex configurations
- Preserve TODO comments and explanations

### Production (preserveComments: false)
- Remove unnecessary comments for cleaner output
- Reduce file size slightly
- Clean up commented-out code automatically
