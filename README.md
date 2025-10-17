# xml-formater

A VS Code extension for formatting XML files, specifically designed for Odoo development workflows.

## Features

- **Smart XML Formatting**: Automatically format XML with proper indentation and structure
- **Format on Save**: Optionally format XML files automatically when saving
- **Attribute Management**:
  - Break long lines with many attributes into separate lines
  - Sort attributes alphabetically for consistent code style
  - Preserve or reorganize attribute order based on your preferences
- **Intelligent Quote Handling**: Preserves single and double quotes in XPath expressions and Odoo domains without converting to HTML entities
- **Odoo-Specific Formatting**: Special formatting rules for Odoo XML files
- **Customizable Settings**: Flexible configuration options for indentation, line length, and more

## Extension Settings

This extension contributes the following settings:

### Indentation Settings
* `xml-formater.indentSize`: Number of spaces or tabs for indentation (default: `2`, range: 1-8)
* `xml-formater.indentType`: Type of indentation to use - `spaces` or `tabs` (default: `spaces`)

### Line Length & Attributes
* `xml-formater.maxLineLength`: Maximum line length before wrapping (default: `120`, range: 80-200)
* `xml-formater.formatAttributes`: Format attributes on separate lines when line exceeds maxLineLength (default: `false`)
* `xml-formater.sortAttributes`: Sort attributes alphabetically by name (default: `false`)
* `xml-formater.preserveAttributes`: Preserve attribute order and formatting (default: `true`)

### General Settings
* `xml-formater.selfClosingTags`: Use self-closing tags for empty elements (default: `true`)
* `xml-formater.formatOnSave`: Automatically format XML files when saving (default: `false`)
* `xml-formater.odooSpecific`: Enable Odoo-specific XML formatting rules (default: `true`)
* `xml-formater.preserveComments`: Preserve XML comments during formatting (default: `true`)
  - When `true`: Comments are kept and properly formatted
  - When `false`: Comments are removed during formatting

### Odoo Tag Spacing (New!)
* `xml-formater.odooTagSpacing`: Add blank lines between important Odoo tags (default: `true`)
* `xml-formater.odooSpacingTags`: List of Odoo XML tags that should have blank lines between them (default: `['record', 'menuitem', 'template', 'function', 'delete', 'report']`)
  - When enabled, tags in this list will automatically have at least one blank line after them
  - Improves readability for large Odoo XML files
  - Customize the list to include only the tags important to your workflow

## Usage

### Commands

Access these commands via Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`):

- `xml-formater: Format Document` - Format the current XML document
- `xml-formater: Test Formatter` - Run formatter tests
- `xml-formater: Show Configuration` - Display current configuration
- `xml-formater: Debug Output Channel` - Open debug output panel
- `xml-formater: Test Format On Save` - Test format on save functionality

### Example: Attribute Sorting

**Before (with `sortAttributes: true`):**
```xml
<record id="test_record" model="test.model" active="true" name="Test" priority="high">
```

**After:**
```xml
<record
  active="true"
  id="test_record"
  model="test.model"
  name="Test"
  priority="high">
```

### Example: Quote Preservation in XPath and Odoo Domains

The formatter intelligently handles quotes in XPath expressions and Odoo domains, avoiding unnecessary HTML entity conversion:

**Before formatting:**
```xml
<xpath expr="//field[@name='partner_id']" position="before">
    <field name="domain">[('name', '=', 'test')]</field>
</xpath>
```

**After formatting** (quotes are preserved, not converted to `&apos;`):
```xml
<xpath expr="//field[@name='partner_id']" position="before">
    <field name="domain">[('name', '=', 'test')]</field>
</xpath>
```

The formatter automatically:
- Preserves `'` in double-quoted attributes (doesn't convert to `&apos;`)
- Uses single quotes for attributes containing double quotes for better readability
- Decodes unnecessary entities in text content

### Example: Odoo Tag Spacing

The Odoo Tag Spacing feature automatically adds blank lines between important Odoo tags for better readability:

**Before formatting:**
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

**After formatting** (with `odooTagSpacing: true`):
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

You can customize which tags should have spacing by modifying the `xml-formater.odooSpacingTags` setting.

## Requirements

- VS Code version 1.102.0 or higher

## Known Issues

- Complex nested JSON in attributes may need special handling
- Very large XML files (>10MB) may have performance impacts

## Release Notes

### 0.0.4

- Added attribute sorting feature (`sortAttributes`)
- Improved attribute formatting based on line length
- Enhanced debug logging and output channel
- Better format on save support

### 0.0.3

- Added format on save functionality
- Improved configuration management
- Added test commands

### 0.0.1

- Initial release
- Basic XML formatting support

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
