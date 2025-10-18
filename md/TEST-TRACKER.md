# Test Tracker - XML Formatter Extension

## Test Overview

| Feature Group | Test Count | Description |
|---------------|------------|-------------|
| Core | 2 | Extension activation and core formatter |
| Attributes | 4 | Attribute handling and sorting |
| Comments | 3 | Comment preservation and handling |
| Formatting | 5 | General formatting features |
| Configuration | 3 | Extension configuration and settings |
| Validation | 1 | Smart validation features |
| Odoo-Specific | 5 | Odoo menuitem and xpath attribute formatting |
| Other | 0 | Tests that don't fit existing groups |
| **TOTAL** | **23** | **Across 8 feature groups** |

---

## Detailed Test List

### Core Tests (2)
| Test File | Description |
|-----------|-------------|
| `core/extension.test.ts` | Extension activation and command registration |
| `core/xmlFormatterTest.ts` | Core XML formatter functionality |

### Attributes Tests (4)
| Test File | Description |
|-----------|-------------|
| `attributes/attributeTest.ts` | Basic attribute handling |
| `attributes/attributeSortingTest.ts` | Attribute sorting functionality |
| `attributes/simpleAttributes.test.ts` | Simple attribute formatting |
| `attributes/comprehensiveSorting.test.ts` | Comprehensive attribute sorting scenarios |

### Comments Tests (3)
| Test File | Description |
|-----------|-------------|
| `comments/commentPreservation.test.ts` | Comment preservation during formatting |
| `comments/specialComments.test.ts` | Special comment handling |
| `comments/blankLinesAndComments.test.ts` | Blank lines and comments interaction |

### Formatting Tests (5)
| Test File | Description |
|-----------|-------------|
| `formatting/apostrophe.test.ts` | Apostrophe handling in XML |
| `formatting/closeTagBoth.test.ts` | Close tag both styles |
| `formatting/closeTagOnNewLine.test.ts` | Close tag on new line |
| `formatting/maximumBlankLines.test.ts` | Maximum blank lines enforcement |
| `formatting/xpathClosing.test.ts` | XPath expression closing tags |

### Configuration Tests (3)
| Test File | Description |
|-----------|-------------|
| `config/configTest.ts` | Extension configuration handling |
| `config/rcConfig.test.ts` | .xmlformatterrc configuration file |
| `config/formatOnSaveTest.ts` | Format on save functionality |

### Validation Tests (1)
| Test File | Description |
|-----------|-------------|
| `validation/smartValidation.test.ts` | Smart validation features |

### Odoo-Specific Tests (5)
| Test File | Description |
|-----------|-------------|
| `odoo/menuitemMultiline.test.ts` | Odoo menuitem multiline formatting |
| `odoo/menuitemSpacing.test.ts` | Odoo menuitem spacing rules |
| `odoo/attributeXpath.test.ts` | Odoo xpath attribute tag with long attrs values |
| `odoo/complexAttrs.test.ts` | Complex Odoo attrs with nested quotes, brackets, and domain expressions |
| `odoo/complexXpathWithComments.test.ts` | Complex xpath with multiple records, comments, and blank line preservation |

---

**Last Updated**: October 18, 2025
