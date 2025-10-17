import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export interface XmlFormatterOptions {
    indentSize: number;
    indentType: 'spaces' | 'tabs';
    maxLineLength: number;
    preserveAttributes: boolean;
    formatAttributes: boolean;
    selfClosingTags: boolean;
}

export class XmlFormatter {
    private options: XmlFormatterOptions;

    constructor(options: Partial<XmlFormatterOptions> = {}) {
        this.options = {
            indentSize: 2,
            indentType: 'spaces',
            maxLineLength: 120,
            preserveAttributes: true,
            formatAttributes: false,
            selfClosingTags: true,
            ...options
        };
    }

    /**
     * Format XML string with proper indentation and structure
     */
    public formatXml(xmlContent: string): string {
        try {
            // Parser options for fast-xml-parser
            const parserOptions = {
                ignoreAttributes: false,
                preserveOrder: true,
                trimValues: false,
                parseTagValue: false,
                parseAttributeValue: false,
                parseTrueNumberOnly: false,
                arrayMode: false,
                allowBooleanAttributes: true,
                unpairedTags: ['br', 'hr', 'img', 'input', 'meta', 'link']
            };

            // Parse XML
            const parser = new XMLParser(parserOptions);
            const parsed = parser.parse(xmlContent);

            // Builder options for formatting
            const builderOptions = {
                ignoreAttributes: false,
                format: true,
                indentBy: this.getIndentString(),
                suppressEmptyNode: this.options.selfClosingTags,
                preserveOrder: true,
                suppressBooleanAttributes: false,
                suppressUnpairedNode: false,
                textNodeName: '#text',
                attributeNamePrefix: '@_'
            };

            // Build formatted XML
            const builder = new XMLBuilder(builderOptions);
            const formattedXml = builder.build(parsed);

            return this.postProcessFormatting(formattedXml);

        } catch (error) {
            throw new Error(`XML formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get indent string based on options
     */
    private getIndentString(): string {
        if (this.options.indentType === 'tabs') {
            return '\t';
        }
        return ' '.repeat(this.options.indentSize);
    }

    /**
     * Post-process the formatted XML for better formatting
     */
    private postProcessFormatting(xml: string): string {
        let result = xml;

        // Ensure proper XML declaration formatting
        result = result.replace(/^<\?xml([^>]*)\?>/, (match, attrs) => {
            return `<?xml${attrs.trim()}>`;
        });

        // Fix empty lines and ensure consistent line endings
        result = result.replace(/\n\s*\n/g, '\n');

        // Trim trailing whitespace from each line
        result = result.split('\n').map(line => line.trimEnd()).join('\n');

        // Ensure file ends with newline
        if (!result.endsWith('\n')) {
            result += '\n';
        }

        return result;
    }

    /**
     * Validate XML syntax before formatting
     */
    public validateXml(xmlContent: string): { isValid: boolean; error?: string } {
        try {
            const parser = new XMLParser({
                ignoreAttributes: false,
                stopNodes: ['*.#text']
            });
            parser.parse(xmlContent);
            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Unknown validation error'
            };
        }
    }

    /**
     * Check if content appears to be XML
     */
    public static isXmlContent(content: string): boolean {
        const trimmed = content.trim();
        return trimmed.startsWith('<') && (
            trimmed.includes('<?xml') ||
            trimmed.match(/<[a-zA-Z][^>]*>/) !== null
        );
    }

    /**
     * Get default formatting options
     */
    public static getDefaultOptions(): XmlFormatterOptions {
        return {
            indentSize: 2,
            indentType: 'spaces',
            maxLineLength: 120,
            preserveAttributes: true,
            formatAttributes: false,
            selfClosingTags: true
        };
    }
}

/**
 * Quick format function for simple use cases
 */
export function formatXml(xmlContent: string, options?: Partial<XmlFormatterOptions>): string {
    const formatter = new XmlFormatter(options);
    return formatter.formatXml(xmlContent);
}

/**
 * Validate XML content
 */
export function validateXml(xmlContent: string): { isValid: boolean; error?: string } {
    const formatter = new XmlFormatter();
    return formatter.validateXml(xmlContent);
}