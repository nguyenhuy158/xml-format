// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { testXmlFormatter } from "./test/xmlFormatterTest";
import { testConfiguration, testConfigurationChangeLogging } from "./test/configTest";
import { XmlFormatter } from "./formatters/xmlFormatter";
import { ConfigManager } from "./utils/config";

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
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "xml-formater" is now active!');

    // Log initial configuration
    logAllSettings("Extension activated");

    // Register configuration change listener
    const configurationChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        // Check if xml-formater configuration was changed
        if (event.affectsConfiguration('xml-formater')) {
            logAllSettings("Configuration changed by user");
        }
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

                // Get formatting options from configuration
                const options = ConfigManager.getFormatterOptions();

                // Create formatter and format XML
                const formatter = new XmlFormatter(options);

                // Validate XML first
                const validation = formatter.validateXml(xmlContent);
                if (!validation.isValid) {
                    vscode.window.showErrorMessage(`Invalid XML: ${validation.error}`);
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

            if (xmlTestResult && configTestResult && changeLoggingResult) {
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

    context.subscriptions.push(formatCommand, testCommand, showConfigCommand, debugOutputCommand, configurationChangeListener);
}

// This method is called when your extension is deactivated
export function deactivate() {}
