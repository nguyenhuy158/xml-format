import * as vscode from 'vscode';
import { XmlFormatterOptions } from '../formatters/xmlFormatter';

export class ConfigManager {
    private static readonly EXTENSION_ID = 'xml-formater';

    /**
     * Get XML formatter options from VS Code configuration
     */
    public static getFormatterOptions(): XmlFormatterOptions {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);

        return {
            indentSize: config.get<number>('indentSize', 2),
            indentType: config.get<'spaces' | 'tabs'>('indentType', 'spaces'),
            maxLineLength: config.get<number>('maxLineLength', 120),
            preserveAttributes: config.get<boolean>('preserveAttributes', true),
            formatAttributes: config.get<boolean>('formatAttributes', false),
            sortAttributes: config.get<boolean>('sortAttributes', false),
            selfClosingTags: config.get<boolean>('selfClosingTags', true),
            closeTagOnNewLine: config.get<boolean>('closeTagOnNewLine', false)
        };
    }

    /**
     * Get format on save setting
     */
    public static getFormatOnSave(): boolean {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return config.get<boolean>('formatOnSave', false);
    }

    /**
     * Get Odoo-specific formatting setting
     */
    public static getOdooSpecific(): boolean {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return config.get<boolean>('odooSpecific', true);
    }

    /**
     * Update configuration value
     */
    public static async updateConfig(key: string, value: any, target?: vscode.ConfigurationTarget): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        await config.update(key, value, target || vscode.ConfigurationTarget.Workspace);
    }

    /**
     * Get all configuration as object
     */
    public static getAllConfig(): { [key: string]: any } {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return {
            indentSize: config.get('indentSize'),
            indentType: config.get('indentType'),
            maxLineLength: config.get('maxLineLength'),
            preserveAttributes: config.get('preserveAttributes'),
            formatAttributes: config.get('formatAttributes'),
            sortAttributes: config.get('sortAttributes'),
            selfClosingTags: config.get('selfClosingTags'),
            formatOnSave: config.get('formatOnSave'),
            odooSpecific: config.get('odooSpecific')
        };
    }
}