# Configuration Change Logging Test

## How to test configuration change logging:

### Step 1: Launch Extension Development Host
- Press **F5** (or Run → Start Debugging)

### Step 2: Test Output Channel Creation
**First, verify output channel works:**
1. Open Command Palette (Ctrl+Shift+P)
2. Run command: **"xml-formater: Debug Output Channel"**
3. Check if output panel opens automatically
4. If not, manually open: **View → Output** → Select **"XML-Formater Settings"**
5. You should see debug information

### Step 3: Test Configuration Change Logging
1. **Open VS Code Settings**: Ctrl/Cmd + ,
2. **Search**: "xml-formater"
3. **Change any setting**, for example:
   - Change "Indent Size" from 2 to 4
   - Change "Indent Type" from "spaces" to "tabs"
   - Toggle "Format On Save"
4. **Check Output Panel**: Should automatically show with new log entry
5. **Check Notifications**: Should see "XML-Formater configuration updated"

## Troubleshooting:

### If "XML-Formater Settings" not found in Output dropdown:
1. Run **"xml-formater: Debug Output Channel"** command first
2. This will force create the output channel
3. Then try changing settings again

### Alternative test method:
1. Open Developer Tools (Help → Toggle Developer Tools)
2. Check Console tab for log messages
3. All configuration changes are logged to console as well

## Expected Log Format:

```
=== XML-Formater Settings Log ===
Trigger: Configuration changed by user
Timestamp: 10/17/2025, 3:45:22 PM

Current Configuration:
• Indent Size: 4
• Indent Type: spaces
• Max Line Length: 120
• Preserve Attributes: true
• Format Attributes: false
• Self-Closing Tags: true
• Format On Save: false
• Odoo Specific: true

Raw config object: {
  "indentSize": 4,
  "indentType": "spaces",
  "maxLineLength": 120,
  "preserveAttributes": true,
  "formatAttributes": false,
  "selfClosingTags": true,
  "formatOnSave": false,
  "odooSpecific": true
}
================================
```

## Features:

- ✅ **Real-time logging**: Logs immediately when settings change
- ✅ **Complete settings snapshot**: Shows all 8 configuration values
- ✅ **Multiple outputs**: Console + Output panel
- ✅ **Timestamp tracking**: Know when changes occurred
- ✅ **User notifications**: Alerts when configuration changes
- ✅ **JSON format**: Raw config object for debugging

## Use Cases:

1. **Debugging**: Track configuration changes during development
2. **User Support**: See what settings user has when reporting issues
3. **Extension Development**: Monitor how configuration affects behavior
4. **Team Settings**: Share configuration snapshots with team members