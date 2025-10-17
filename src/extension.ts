// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { testXmlFormatter } from "./test/xmlFormatterTest";
import { XmlFormatter } from "./formatters/xmlFormatter";
import { ConfigManager } from "./utils/config";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "xml-formater" is now active!');

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
        () => {
            const testResult = testXmlFormatter();

            if (testResult) {
                vscode.window.showInformationMessage(
                    "XML Formatter test completed successfully! Check console for details."
                );
            } else {
                vscode.window.showErrorMessage(
                    "XML Formatter test failed! Check console for errors."
                );
            }
        }
    );

    context.subscriptions.push(formatCommand, testCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
