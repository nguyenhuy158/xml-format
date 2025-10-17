# Change Log

All notable changes to the "xml-formater" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.4] - 2025-10-17

### Added
- **Attribute Sorting**: New `sortAttributes` option to sort attributes alphabetically
- **Smart Attribute Formatting**: Attributes are only broken into separate lines when line exceeds `maxLineLength`
- **Enhanced Logging**: Detailed output channel logging for debugging format on save issues
- **Test Commands**: New command `xml-formater: Test Format On Save` for debugging
- **Auto-activation**: Extension now activates automatically when opening XML files

### Fixed
- Fixed format on save not working issue
- Improved attribute parsing for complex attribute values
- Better handling of nested quotes in attributes

### Changed
- Updated activation events to include `onLanguage:xml`
- Improved error messages and user feedback

## [0.0.3] - 2025-10-16

### Added
- Format on save functionality
- Configuration change logging
- Debug output commands

## [0.0.2] - 2025-10-15

### Added
- Configuration management system
- Multiple formatting options

## [0.0.1] - 2025-10-14

### Added
- Initial release
- Basic XML formatting support
- Odoo-specific formatting rules