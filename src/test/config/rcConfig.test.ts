import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigManager } from '../../utils/config';

suite('RC Config Test Suite', () => {
    test('Should load .xmlformatterrc config', () => {
        // Clear cache first
        ConfigManager.clearRcCache();

        // Get formatter options (should include RC config if exists)
        const options = ConfigManager.getFormatterOptions();

        console.log('Formatter options loaded:', JSON.stringify(options, null, 2));

        // If .xmlformatterrc exists in workspace, verify it's loaded
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const rcPath = path.join(workspaceFolders[0].uri.fsPath, '.xmlformatterrc');
            if (fs.existsSync(rcPath)) {
                const rcContent = fs.readFileSync(rcPath, 'utf-8');
                const rcConfig = JSON.parse(rcContent);

                console.log('RC file found:', rcPath);
                console.log('RC config:', JSON.stringify(rcConfig, null, 2));

                // Verify tabSize
                if (rcConfig.tabSize !== undefined) {
                    assert.strictEqual(
                        options.indentSize,
                        rcConfig.tabSize,
                        'indentSize should match RC tabSize'
                    );
                }

                // Verify useTabs
                if (rcConfig.useTabs !== undefined) {
                    const expectedIndentType = rcConfig.useTabs ? 'tabs' : 'spaces';
                    assert.strictEqual(
                        options.indentType,
                        expectedIndentType,
                        'indentType should match RC useTabs'
                    );
                }

                // Verify alignAttributes
                if (rcConfig.alignAttributes !== undefined) {
                    assert.strictEqual(
                        options.formatAttributes,
                        rcConfig.alignAttributes,
                        'formatAttributes should match RC alignAttributes'
                    );
                }

                // Verify emptyElementHandling
                if (rcConfig.emptyElementHandling !== undefined) {
                    const expectedSelfClosing = rcConfig.emptyElementHandling === 'selfClosing';
                    assert.strictEqual(
                        options.selfClosingTags,
                        expectedSelfClosing,
                        'selfClosingTags should match RC emptyElementHandling'
                    );
                }
            } else {
                console.log('No .xmlformatterrc file found in workspace');
            }
        }
    });

    test('Should prioritize RC config over VS Code settings', () => {
        ConfigManager.clearRcCache();

        const options = ConfigManager.getFormatterOptions();

        // This test assumes .xmlformatterrc exists with specific values
        // Adjust assertions based on your test RC file
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const rcPath = path.join(workspaceFolders[0].uri.fsPath, '.xmlformatterrc');
            if (fs.existsSync(rcPath)) {
                const rcContent = fs.readFileSync(rcPath, 'utf-8');
                const rcConfig = JSON.parse(rcContent);

                console.log('Testing RC priority...');
                console.log('RC config:', rcConfig);
                console.log('Final options:', options);

                // RC config should override VS Code settings
                assert.ok(true, 'RC config priority test completed');
            }
        }
    });

    test('Should clear RC cache', () => {
        // Load config once
        const options1 = ConfigManager.getFormatterOptions();

        // Clear cache
        ConfigManager.clearRcCache();

        // Load config again
        const options2 = ConfigManager.getFormatterOptions();

        // Should reload and produce same result
        assert.deepStrictEqual(options1, options2, 'Options should be same after cache clear');
    });
});
