# Build Workflow Guide

## Development Mode

### Option 1: TypeScript Compiler (với source maps)
```bash
npm run compile    # Build một lần
npm run watch      # Auto-rebuild khi save
```
- Output: `out/extension.js` (~18KB không minified)
- Source maps: Có (`extension.js.map`)
- Dùng cho: Debug, development

### Option 2: esbuild Watch (nhanh hơn)
```bash
npm run build:watch
```
- Output: `out/extension.js` (~54KB bundled + minified)
- Source maps: Không có
- Dùng cho: Test production build

## Production Mode

### Build trước khi publish
```bash
npm run build:prod
```
- Output: `out/extension.js` (~54KB bundled + minified)
- Bundle tất cả dependencies (trừ vscode)
- Minified, tree-shaking

### Publish commands (tự động chạy build:prod)
```bash
npm run pub:patch   # 1.0.2 → 1.0.3
npm run pub:minor   # 1.0.2 → 1.1.0
npm run pub:major   # 1.0.2 → 2.0.0
```

## So sánh

| Mode | Command | Size | Source Map | Speed | Use Case |
|------|---------|------|------------|-------|----------|
| Dev (tsc) | `npm run watch` | 18KB | ✅ | Chậm | Debug |
| Prod (esbuild) | `npm run build:prod` | 54KB | ❌ | Nhanh | Release |

## Workflow khuyến nghị

1. **Khi develop**:
   - Dùng `npm run watch` (TypeScript)
   - F5 để test trong Extension Development Host

2. **Trước khi publish**:
   - Tự động chạy `build:prod` (hook trong package.json)
   - Test lại extension
   - `npm run pub:patch`
