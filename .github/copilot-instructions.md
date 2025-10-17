# Copilot Instructions for xml-formater

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
- Current command: `xml-formater.helloWorld` (placeholder - needs XML formatting implementation)

### Build System
- TypeScript compilation: `src/` → `out/` directory
- Build commands: `npm run compile` (one-time), `npm run watch` (continuous)
- The watch task is configured as the default build task in `.vscode/tasks.json`

## Development Workflows

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
The extension currently only shows "Hello World" messages. To implement XML formatting:
1. Add XML parsing/formatting logic to `src/extension.ts`
2. Register proper command (replace or supplement `xml-formater.helloWorld`)
3. Add configuration options in `package.json` contributes.configuration
4. Consider adding keybindings for common formatting actions

## Key Files for Changes
- **`src/extension.ts`**: Add XML formatting commands and logic
- **`package.json`**: Update commands, add configuration settings
- **`src/test/extension.test.ts`**: Add XML formatting test cases
- **`README.md`**: Update with actual features and usage instructions

## External Dependencies
- **vsce**: VS Code Extension packaging tool (in dependencies, not devDependencies)
- **@types/vscode**: VS Code API type definitions
- **TypeScript toolchain**: Compiler and ESLint integration