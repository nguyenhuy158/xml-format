# Copilot Instructions for xml-formater

## Communication Style
- Keep responses SHORT and DIRECT - no lengthy summaries or explanations unless asked
- Just do the work, then report what was done in 1-2 sentences
- No emoji overload, no "Perfect! 🎉", no "Let's do this!"
- Skip phrases like "Tôi hiểu vấn đề rồi!", "Tuyệt vời!", "Hoàn thành!"
- Don't create summary files (FIX-SUMMARY.md, etc.) unless explicitly requested
- Don't repeat information the user already knows
- Answer in Vietnamese when user asks in Vietnamese, English when user asks in English

## Project Overview
This is a VS Code extension project for formatting XML files, specifically designed for Odoo development workflows. The extension is built using TypeScript and follows standard VS Code Extension API patterns.

## Architecture & Key Components

### Extension Entry Point
- **`src/extension.ts`**: Main extension file with `activate()` and `deactivate()` lifecycle methods
- Commands are registered in `activate()` using `vscode.commands.registerCommand()`
- Command IDs must match those defined in `package.json` contributes.commands section

### Package Configuration
- **`package.json`**: Defines extension metadata, commands, activation events, and build scripts
- Key sections: `contributes.commands`, `activationEvents`, `main` (points to compiled JS)
- Current commands:
  - `xml-formater.formatDocument`: Main XML formatting command
  - `xml-formater.testFormatter`: Test XML formatter functionality### Build System
- TypeScript compilation: `src/` → `out/` directory
- Build commands: `npm run compile` (one-time), `npm run watch` (continuous)
- The watch task is configured as the default build task in `.vscode/tasks.json`

## Development Workflows

### Command Naming Convention
Commands should follow these patterns:
- **Command ID**: `{extensionName}.{actionName}` (using dot separator)
- **Command Title**: `xml-formater: {Action Description}` (using colon prefix)
- **Extension Name**: `xml-formater` (matches package.json name)
- **Action Names**: Use camelCase for command IDs
  - Examples: `formatDocument`, `testFormatter`, `formatSelection`
- **Current Commands**:
  - Command: `xml-formater.formatDocument`, Title: `xml-formater: Format Document`
  - Command: `xml-formater.testFormatter`, Title: `xml-formater: Test Formatter`
- **Command Registration**: Must be registered in both:
  - `package.json` contributes.commands section (for UI/command palette)
  - `src/extension.ts` using `vscode.commands.registerCommand()`

### Building & Testing
```bash
npm run watch          # Start continuous build (recommended during development)
npm run compile        # One-time build
npm run test          # Run tests (requires prior compilation)
npm run lint          # ESLint validation
```

### Extension Development
- Use F5 or "Run Extension" launch configuration to test in new VS Code window
- Pre-launch task automatically compiles TypeScript
- Extension Development Host loads from `--extensionDevelopmentPath`

### Packaging & Publishing
```bash
npm run package       # Create .vsix file using vsce
npm run publish       # Publish to marketplace (requires vsce auth)
```

## Project-Specific Patterns

### Code Style
- ESLint config in `eslint.config.mjs` enforces TypeScript naming conventions
- Strict TypeScript settings enabled in `tsconfig.json`
- Target: ES2022, Module: Node16 for VS Code compatibility

### Testing Structure
- **ALL tests MUST be in `src/test/` directory** - no test files (.js, .xml) in project root
- **ABSOLUTELY NO .js test files** - only TypeScript (.ts) files allowed
- **NEVER create test files in root directory** - all tests go in `src/test/` only
- Tests use Mocha framework with VS Code Test Runner (`.vscode-test.mjs`)
- Test files follow pattern: `{feature}.test.ts` (e.g., `apostrophe.test.ts`, `commentPreservation.test.ts`)
- Test XML samples should be embedded as strings in test files, NOT separate .xml files
- Run tests via VS Code Test Runner (automatically compiles and runs)
- **Test Organization by Feature**: Tests are organized into feature-specific folders:
  - `src/test/core/` - Core extension and formatter tests
  - `src/test/attributes/` - Attribute handling and sorting tests
  - `src/test/comments/` - Comment preservation and handling tests
  - `src/test/formatting/` - General formatting features (tags, spacing, etc.)
  - `src/test/config/` - Configuration and settings tests
  - `src/test/validation/` - Validation feature tests
  - `src/test/odoo/` - Odoo-specific formatting tests
  - `src/test/other/` - Other tests that don't fit existing groups
- **Test Tracker**: See `TEST-TRACKER.md` for complete list of all tests grouped by feature
- **MANDATORY when creating new tests**:
  1. **Group Assignment**: MUST place test in appropriate feature group folder
     - If feature matches existing group → use that group
     - If new feature type → create new group folder and update TEST-TRACKER.md
     - If unclear → use `src/test/other/` folder
  2. **Update TEST-TRACKER.md**: MUST add new test entry to TEST-TRACKER.md immediately after creating test
     - Add to correct feature group table
     - Update test count in overview table
     - If creating new group, add new section with table
  3. **Test Verification**: All tests MUST pass before publishing
     - Run `npm test` to verify all tests pass
     - Publishing commands (`pub:patch`, `pub:minor`, `pub:major`) require passing tests
- **WRONG**:
  - Creating `test-*.js` files ANYWHERE (especially in root)
  - Creating `test-*.xml` files in root directory
  - Using JavaScript for tests
  - Placing tests directly in `src/test/` root without proper folder organization
  - Creating new test WITHOUT updating TEST-TRACKER.md
  - Publishing without running and passing all tests
- **RIGHT**:
  - Creating `src/test/{feature-group}/{feature}.test.ts` with embedded XML strings
  - Using TypeScript only for all test files
  - Organizing tests by feature group for better maintainability
  - ALWAYS updating TEST-TRACKER.md when adding new tests
  - Running `npm test` before any publish command

### Test File Template
```typescript
// For tests in feature-specific folders (e.g., src/test/formatting/)
import * as assert from 'assert';
import { formatXml } from '../../../formatters/xmlFormatter'; // Adjust path based on folder depth

suite('Feature Name Test Suite', () => {
    test('Test case description', () => {
        const input = `<xml>test content</xml>`;
        const expected = `<xml>\n    test content\n</xml>`;
        const result = formatXml(input);
        assert.strictEqual(result, expected);
    });
});
```

**Note**: Import paths must be adjusted based on test location:
- Tests in `src/test/core/` use `../../formatters/xmlFormatter`
- Tests in `src/test/{feature}/` use `../../../formatters/xmlFormatter`

### Missing Implementation
The extension has basic XML formatting implemented. For additional features:
1. Add more XML formatting options (indentation, attribute formatting, etc.)
2. Add new commands following the naming pattern: `xml-formater.{actionName}`
3. Add configuration options in `package.json` contributes.configuration
4. Consider adding keybindings for common formatting actions

## Command Implementation Pattern

### Adding New Commands
1. **Define in package.json**:
```json
{
  "command": "xml-formater.newCommand",
  "title": "xml-formater: New Command Title"
}
```

2. **Register in extension.ts**:
```typescript
const newCommand = vscode.commands.registerCommand(
    "xml-formater.newCommand",
    async () => {
        // Command implementation
    }
);
context.subscriptions.push(newCommand);
```

3. **Follow naming convention**: `xml-formater.{camelCaseActionName}`## Key Files for Changes
- **`src/extension.ts`**: Add XML formatting commands and logic
- **`package.json`**: Update commands, add configuration settings
- **`src/test/extension.test.ts`**: Add XML formatting test cases
- **`README.md`**: Update with actual features and usage instructions

## External Dependencies
- **vsce**: VS Code Extension packaging tool (in dependencies, not devDependencies)
- **@types/vscode**: VS Code API type definitions
- **TypeScript toolchain**: Compiler and ESLint integration