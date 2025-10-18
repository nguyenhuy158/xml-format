import { XmlFormatterOptions } from '../formatters/types';

/**
 * Global test configuration for XML Formatter
 * This configuration is used as default for all test cases.
 * Individual test cases can override these settings if needed.
 *
 * Based on .xmlformatterrc file in project root
 */
export const DEFAULT_TEST_CONFIG: Partial<XmlFormatterOptions> = {
    indentSize: 2,
    indentType: 'spaces',
    maxLineLength: 120,
    preserveAttributes: false,
    formatAttributes: true,
    sortAttributes: true,
    selfClosingTags: true,
    closeTagOnNewLine: false,
    preserveComments: true,
    maximumBlankLines: 1
};

/**
 * Helper function to merge custom config with default test config
 * @param customConfig Custom configuration to override defaults
 * @returns Merged configuration
 */
export function getTestConfig(customConfig?: Partial<XmlFormatterOptions>): Partial<XmlFormatterOptions> {
    return {
        ...DEFAULT_TEST_CONFIG,
        ...customConfig
    };
}
