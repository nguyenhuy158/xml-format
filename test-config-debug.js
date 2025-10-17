const { ConfigManager } = require('./out/utils/config');

// Simple test for config manager
console.log('=== Testing ConfigManager ===');

try {
    const formatOnSave = ConfigManager.getFormatOnSave();
    console.log('Format on save setting:', formatOnSave);

    const allConfig = ConfigManager.getAllConfig();
    console.log('All config:', JSON.stringify(allConfig, null, 2));

    const formatterOptions = ConfigManager.getFormatterOptions();
    console.log('Formatter options:', JSON.stringify(formatterOptions, null, 2));

} catch (error) {
    console.error('Error testing ConfigManager:', error);
}