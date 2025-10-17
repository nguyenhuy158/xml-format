// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { testXmlFormatter } from "./test/xmlFormatterTest";
import { testConfiguration, testConfigurationChangeLogging } from "./test/configTest";
import { testFormatOnSave, demonstrateFormatOnSaveSettings } from "./test/formatOnSaveTest";
import { testAttributeFormatting } from "./test/attributeTest";
import { testAttributeSorting } from "./test/attributeSortingTest";
import { XmlFormatter } from "./formatters/xmlFormatter";
import { ConfigManager } from "./utils/config";

/**
 * Format XML document content
 */
async function formatXmlDocument(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
    const outputChannel = getOutputChannel();

    try {
        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Starting format for: ${document.fileName}`);

        const xmlContent = document.getText();

        if (!xmlContent.trim()) {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Document is empty, skipping format`);
            return [];
        }

        // Check if content looks like XML
        if (!XmlFormatter.isXmlContent(xmlContent)) {
            const warningMsg = `⚠️ File này không phải là XML hợp lệ - Không thể format`;
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${warningMsg}`);
            vscode.window.showWarningMessage(warningMsg);
            return [];
        }

        // Get formatting options from configuration
        const options = ConfigManager.getFormatterOptions();
        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format options: ${JSON.stringify(options)}`);

        // Create formatter and format XML
        const formatter = new XmlFormatter(options);

        // Validate XML first
        const validation = formatter.validateXml(xmlContent);
        if (!validation.isValid) {
            const errorMsg = validation.error || 'Unknown validation error';
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format failed - Invalid XML: ${errorMsg}`);

            // Build detailed error message for popup
            let warningMessage = `⚠️ XML không hợp lệ - Không thể format`;
            if (validation.line !== undefined) {
                warningMessage += `\n\n📍 Dòng ${validation.line}`;
                if (validation.lineContent) {
                    warningMessage += `:\n"${validation.lineContent}"`;
                }
            }
            warningMessage += `\n\n❌ Lỗi: ${errorMsg}`;

            // Show warning popup at bottom right
            vscode.window.showWarningMessage(warningMessage);

            return [];
        }

        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] XML validation passed, formatting...`);

        // Format the XML
        const formattedXml = formatter.formatXml(xmlContent);

        // Return text edit for the entire document
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(xmlContent.length)
        );

        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format completed successfully`);
        return [vscode.TextEdit.replace(fullRange, formattedXml)];

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format on save failed: ${errorMessage}`);
        console.error(`Format on save failed: ${errorMessage}`);
        return [];
    }
}

/**
 * Log all XML-formater settings to console and output channel
 */
function logAllSettings(trigger: string) {
    const config = ConfigManager.getAllConfig();
    const timestamp = new Date().toLocaleString();

    const logMessage = `
=== XML-Formater Settings Log ===
Trigger: ${trigger}
Timestamp: ${timestamp}

Current Configuration:
• Indent Size: ${config.indentSize}
• Indent Type: ${config.indentType}
• Max Line Length: ${config.maxLineLength}
• Preserve Attributes: ${config.preserveAttributes}
• Format Attributes: ${config.formatAttributes}
• Self-Closing Tags: ${config.selfClosingTags}
• Format On Save: ${config.formatOnSave}
• Odoo Specific: ${config.odooSpecific}

Raw config object: ${JSON.stringify(config, null, 2)}
================================
    `.trim();

    // Log to console
    console.log(logMessage);

    // Also log to output channel for better user visibility
    const outputChannel = getOutputChannel();
    outputChannel.appendLine(logMessage);

    // Show output channel when configuration changes
    if (trigger.includes("changed")) {
        outputChannel.show(true); // true = preserveFocus
        vscode.window.showInformationMessage(
            "XML-Formater configuration updated. Check Output panel for details."
        );
    } else {
        // Just show without focus for initial activation
        outputChannel.show(false);
    }
}

/**
 * Get or create output channel for logging
 */
let outputChannel: vscode.OutputChannel | undefined;
function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("XML-Formater Settings");
    }
    return outputChannel;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('XML-Formater extension is now active!');

    // Get output channel and log activation
    const outputChannel = getOutputChannel();
    outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] === XML-Formater Extension Activated ===`);
    outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Extension version: 0.0.3`);

    // Log initial configuration
    logAllSettings("Extension activation");

    // Register all configuration change listener
    const configurationChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        // Check if xml-formater configuration was changed
        if (event.affectsConfiguration('xml-formater')) {
            // Clear RC config cache when VS Code settings change
            ConfigManager.clearRcCache();
            logAllSettings("Configuration changed by user");
        }
    });

    // Watch for .xmlformatterrc file changes
    const rcFileWatcher = vscode.workspace.createFileSystemWatcher('**/.xmlformatterrc');
    rcFileWatcher.onDidChange(() => {
        ConfigManager.clearRcCache();
        logAllSettings(".xmlformatterrc file changed");
    });
    rcFileWatcher.onDidCreate(() => {
        ConfigManager.clearRcCache();
        logAllSettings(".xmlformatterrc file created");
    });
    rcFileWatcher.onDidDelete(() => {
        ConfigManager.clearRcCache();
        logAllSettings(".xmlformatterrc file deleted");
    });

    // Register format on save listener
    const formatOnSaveListener = vscode.workspace.onWillSaveTextDocument(event => {
        // Get output channel for debugging
        const outputChannel = getOutputChannel();

        // Check if format on save is enabled
        const formatOnSave = ConfigManager.getFormatOnSave();
        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format on save check: ${formatOnSave}`);

        if (!formatOnSave) {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format on save is disabled, skipping`);
            return;
        }

        // Check if document is XML
        const document = event.document;
        const isXmlFile = document.languageId === 'xml' || document.fileName.endsWith('.xml');

        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] File: ${document.fileName}`);
        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Language ID: ${document.languageId}`);
        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Is XML file: ${isXmlFile}`);

        if (!isXmlFile) {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Not an XML file, skipping format on save`);
            return;
        }

        outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] Format on save triggered for: ${document.fileName}`);
        console.log(`Format on save triggered for: ${document.fileName}`);

        // Create a thenable to format the document
        const formatPromise = formatXmlDocument(document);
        event.waitUntil(formatPromise);
    });

    // Register XML Format Document command
    const formatCommand = vscode.commands.registerCommand(
        "xml-formater.formatDocument",
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage("No active editor found. Please open an XML file.");
                return;
            }

            const document = editor.document;

            // Check if the file is XML
            if (document.languageId !== 'xml' && !document.fileName.endsWith('.xml')) {
                vscode.window.showWarningMessage("This command only works with XML files.");
                return;
            }

            try {
                // Get the document content
                const xmlContent = document.getText();

                if (!xmlContent.trim()) {
                    vscode.window.showWarningMessage("Document is empty.");
                    return;
                }

                // Check if content looks like XML
                if (!XmlFormatter.isXmlContent(xmlContent)) {
                    vscode.window.showWarningMessage("⚠️ File này không phải là XML hợp lệ - Không thể format");
                    return;
                }

                // Get formatting options from configuration
                const options = ConfigManager.getFormatterOptions();

                // Create formatter and format XML
                const formatter = new XmlFormatter(options);

                // Validate XML first
                const validation = formatter.validateXml(xmlContent);
                if (!validation.isValid) {
                    const errorMsg = validation.error || 'Unknown validation error';

                    // Build detailed error message for popup
                    let warningMessage = `⚠️ XML không hợp lệ - Không thể format`;
                    if (validation.line !== undefined) {
                        warningMessage += `\n\n📍 Dòng ${validation.line}`;
                        if (validation.lineContent) {
                            warningMessage += `:\n"${validation.lineContent}"`;
                        }
                    }
                    warningMessage += `\n\n❌ Lỗi: ${errorMsg}`;

                    vscode.window.showWarningMessage(warningMessage);
                    return;
                }

                // Format the XML
                const formattedXml = formatter.formatXml(xmlContent);

                // Replace the entire document content
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(xmlContent.length)
                );

                await editor.edit(editBuilder => {
                    editBuilder.replace(fullRange, formattedXml);
                });

                vscode.window.showInformationMessage("XML document formatted successfully!");

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                vscode.window.showErrorMessage(`XML formatting failed: ${errorMessage}`);
                console.error('XML formatting error:', error);
            }
        }
    );

    // Register test command (keep for development/debugging)
    const testCommand = vscode.commands.registerCommand(
        "xml-formater.testFormatter",
        async () => {
            console.log('\n=== Running XML Formatter Tests ===');

            const xmlTestResult = testXmlFormatter();
            const configTestResult = testConfiguration();
            const changeLoggingResult = await testConfigurationChangeLogging();
            const formatOnSaveResult = testFormatOnSave();
            const attributeTestResult = testAttributeFormatting();
            const attributeSortingResult = testAttributeSorting();
            demonstrateFormatOnSaveSettings();

            if (xmlTestResult && configTestResult && changeLoggingResult && formatOnSaveResult && attributeTestResult && attributeSortingResult) {
                vscode.window.showInformationMessage(
                    "All tests completed successfully! Check console and Output panel for details."
                );
            } else {
                vscode.window.showErrorMessage(
                    "Some tests failed! Check console for errors."
                );
            }
        }
    );

    // Register show configuration command
    const showConfigCommand = vscode.commands.registerCommand(
        "xml-formater.showConfiguration",
        () => {
            const config = ConfigManager.getAllConfig();
            const options = ConfigManager.getFormatterOptions();

            const configInfo = `
XML Formater Configuration:

Formatting Options:
• Indent Size: ${options.indentSize}
• Indent Type: ${options.indentType}
• Max Line Length: ${options.maxLineLength}
• Preserve Attributes: ${options.preserveAttributes}
• Format Attributes: ${options.formatAttributes}
• Self-Closing Tags: ${options.selfClosingTags}

Additional Settings:
• Format On Save: ${ConfigManager.getFormatOnSave()}
• Odoo Specific: ${ConfigManager.getOdooSpecific()}

To change these settings:
1. Open VS Code Settings (Ctrl/Cmd + ,)
2. Search for "xml-formater"
3. Or use "Preferences: Open Settings (JSON)" for direct editing
            `.trim();

            vscode.window.showInformationMessage(
                "XML Formater configuration displayed in Output panel"
            );

            // Show in output channel
            const outputChannel = vscode.window.createOutputChannel("XML Formater Config");
            outputChannel.clear();
            outputChannel.appendLine(configInfo);
            outputChannel.show();
        }
    );

    // Register debug output command
    const debugOutputCommand = vscode.commands.registerCommand(
        "xml-formater.debugOutput",
        () => {
            console.log('=== Debug Output Channel ===');

            // Force create and show output channel
            const outputChannel = getOutputChannel();
            outputChannel.clear();
            outputChannel.appendLine('=== Debug Output Channel Test ===');
            outputChannel.appendLine(`Timestamp: ${new Date().toLocaleString()}`);
            outputChannel.appendLine('Output channel created successfully!');
            outputChannel.appendLine('');
            outputChannel.appendLine('Current configuration:');

            const config = ConfigManager.getAllConfig();
            outputChannel.appendLine(JSON.stringify(config, null, 2));

            // Force show the output channel
            outputChannel.show(true);

            vscode.window.showInformationMessage(
                'Output channel test completed! Check "XML-Formater Settings" in Output panel.'
            );

            console.log('Output channel should be visible now');
        }
    );

    // Register test format on save command
    const testFormatOnSaveCommand = vscode.commands.registerCommand(
        "xml-formater.testFormatOnSave",
        async () => {
            const editor = vscode.window.activeTextEditor;
            const outputChannel = getOutputChannel();

            outputChannel.clear();
            outputChannel.appendLine('=== Testing Format On Save ===');
            outputChannel.appendLine(`Timestamp: ${new Date().toLocaleString()}`);

            if (!editor) {
                outputChannel.appendLine('ERROR: No active editor found');
                vscode.window.showErrorMessage("No active editor found. Please open an XML file.");
                return;
            }

            const document = editor.document;
            outputChannel.appendLine(`File: ${document.fileName}`);
            outputChannel.appendLine(`Language ID: ${document.languageId}`);

            // Check format on save setting
            const formatOnSave = ConfigManager.getFormatOnSave();
            outputChannel.appendLine(`Format on save enabled: ${formatOnSave}`);

            // Check if XML file
            const isXmlFile = document.languageId === 'xml' || document.fileName.endsWith('.xml');
            outputChannel.appendLine(`Is XML file: ${isXmlFile}`);

            if (!isXmlFile) {
                outputChannel.appendLine('ERROR: Current file is not XML');
                vscode.window.showErrorMessage("Current file is not XML");
                return;
            }

            if (!formatOnSave) {
                outputChannel.appendLine('WARNING: Format on save is disabled');
                vscode.window.showWarningMessage("Format on save is disabled. Enable it in settings.");
                return;
            }

            // Test the formatting
            outputChannel.appendLine('Testing format function...');

            try {
                const edits = await formatXmlDocument(document);
                outputChannel.appendLine(`Format result: ${edits.length} edits to apply`);

                if (edits.length > 0) {
                    // Apply edits
                    await editor.edit(editBuilder => {
                        edits.forEach(edit => {
                            editBuilder.replace(edit.range, edit.newText);
                        });
                    });
                    outputChannel.appendLine('Format applied successfully!');
                    vscode.window.showInformationMessage("Format on save test completed successfully!");
                } else {
                    outputChannel.appendLine('No formatting changes needed');
                    vscode.window.showInformationMessage("No formatting changes needed");
                }
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                outputChannel.appendLine(`ERROR: ${errorMsg}`);
                vscode.window.showErrorMessage(`Format test failed: ${errorMsg}`);
            }

            outputChannel.show(true);
        }
    );

    context.subscriptions.push(
        formatCommand,
        testCommand,
        showConfigCommand,
        debugOutputCommand,
        testFormatOnSaveCommand,
        configurationChangeListener,
        formatOnSaveListener,
        rcFileWatcher
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
