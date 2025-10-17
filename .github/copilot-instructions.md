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
- Tests in `src/test/extension.test.ts` using Mocha framework
- VS Code Test Runner configuration in `.vscode-test.mjs`
- Current tests are placeholder - need actual XML formatting test cases

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