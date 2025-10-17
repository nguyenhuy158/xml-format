import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

export interface XmlFormatterOptions {
    indentSize: number;
    indentType: 'spaces' | 'tabs';
    maxLineLength: number;
    preserveAttributes: boolean;
    formatAttributes: boolean;
    sortAttributes: boolean;
    selfClosingTags: boolean;
    closeTagOnNewLine: boolean;
    preserveComments: boolean;
    odooTagSpacing: boolean;
    odooSpacingTags: string[];
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
            sortAttributes: false,
            selfClosingTags: true,
            closeTagOnNewLine: false,
            preserveComments: true,
            odooTagSpacing: true,
            odooSpacingTags: ['record', 'menuitem'],
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
                unpairedTags: ['br', 'hr', 'img', 'input', 'meta', 'link'],
                commentPropName: this.options.preserveComments ? '#comment' : undefined
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
                attributeNamePrefix: '@_',
                commentPropName: this.options.preserveComments ? '#comment' : undefined
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
        result = result.replace(/^<\?xml([^>]*)\?>/m, (match, attrs) => {
            const trimmedAttrs = attrs.trim();
            return trimmedAttrs ? `<?xml ${trimmedAttrs}?>` : '<?xml?>';
        });

        // Decode unnecessary XML entities in attribute values
        // We want to keep &apos; as ' and &quot; as " when they're inside the opposite quote type
        result = this.decodeAttributeEntities(result);

        // Apply custom attribute formatting based on line length after initial formatting
        if (this.options.formatAttributes) {
            result = this.formatAttributesBasedOnLineLength(result);
        }

        // Fix empty lines and ensure consistent line endings
        result = result.replace(/\n\s*\n/g, '\n');

        // Apply Odoo tag spacing if enabled
        if (this.options.odooTagSpacing && this.options.odooSpacingTags.length > 0) {
            result = this.applyOdooTagSpacing(result);
        }

        // Trim trailing whitespace from each line
        result = result.split('\n').map(line => line.trimEnd()).join('\n');

        // Ensure file ends with newline
        if (!result.endsWith('\n')) {
            result += '\n';
        }

        return result;
    }

    /**
     * Decode unnecessary XML entities in attribute values
     * Keep the original quote style and decode entities that don't need to be escaped
     *
     * Note: In XML spec, quotes inside attribute values MUST be escaped if they match
     * the wrapping quote. However, for Odoo XML files (especially XPath expressions),
     * we prefer readability and use the opposite quote style to avoid escaping.
     */
    private decodeAttributeEntities(xml: string): string {
        // Match attributes with double quotes
        let result = xml.replace(/(\w+)="([^"]*?)"/g, (match, attrName, attrValue) => {
            // In double-quoted attributes, &apos; doesn't need to be escaped
            let decodedValue = attrValue.replace(/&apos;/g, "'");

            // If the value contains &quot;, it means there were double quotes in the original
            // We should convert to single-quote wrapping for better readability in Odoo/XPath
            if (attrValue.includes('&quot;')) {
                decodedValue = decodedValue.replace(/&quot;/g, '"');
                // Re-wrap with single quotes if value contains double quotes
                return `${attrName}='${decodedValue}'`;
            }

            return `${attrName}="${decodedValue}"`;
        });

        // Match attributes with single quotes (less common but possible)
        result = result.replace(/(\w+)='([^']*?)'/g, (match, attrName, attrValue) => {
            // In single-quoted attributes, &quot; doesn't need to be escaped
            let decodedValue = attrValue.replace(/&quot;/g, '"');
            return `${attrName}='${decodedValue}'`;
        });

        // Also decode entities in text content between tags
        // This handles cases like <field>text with &apos; entity</field>
        result = result.replace(/>([^<]+)</g, (match, textContent) => {
            let decoded = textContent;
            // Decode &apos; in text content (it doesn't need to be escaped)
            decoded = decoded.replace(/&apos;/g, "'");
            // Decode &quot; in text content (it doesn't need to be escaped)
            decoded = decoded.replace(/&quot;/g, '"');
            return `>${decoded}<`;
        });

        return result;
    }

    /**
     * Format attributes based on line length - only break when line exceeds maxLineLength
     */
    private formatAttributesBasedOnLineLength(xml: string): string {
        const lines = xml.split('\n');
        const result: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip empty lines, comments, and text content
            if (!line.trim() || line.trim().startsWith('<!--') || !line.includes('<')) {
                result.push(line);
                continue;
            }

            // Check if line contains XML opening tag with attributes
            const tagMatch = line.match(/^(\s*)(<[^!?\/][^>]*>)/);
            if (tagMatch && tagMatch[2].includes(' ')) {
                const indent = tagMatch[1];
                const tag = tagMatch[2];

                // Parse tag to extract tag name
                const tagNameMatch = tag.match(/^<([^\s>\/]+)/);
                const tagName = tagNameMatch ? tagNameMatch[1] : '';

                // Check if current line exceeds maxLineLength
                if (line.length > this.options.maxLineLength) {
                    // Parse tag to extract tag name and attributes
                    const tagParts = tag.match(/^<([^\s>\/]+)(.+?)(\s*\/?)>$/);
                    if (tagParts) {
                        const tagName = tagParts[1];
                        const attributesStr = tagParts[2];
                        const selfClosing = tagParts[3];

                        // Parse attributes
                        const attributes = this.parseAttributes(attributesStr);

                        if (attributes.length > 0) {
                            // Format with attributes on separate lines
                            const formattedTag = this.formatTagWithSeparateAttributes(
                                tagName,
                                attributes,
                                indent,
                                selfClosing
                            );
                            result.push(formattedTag);
                        } else {
                            result.push(line);
                        }
                    } else {
                        result.push(line);
                    }
                } else {
                    // Line is within length limit, keep as is
                    result.push(line);
                }
            } else {
                result.push(line);
            }
        }

        return result.join('\n');
    }

    /**
     * Parse attributes from attribute string
     */
    private parseAttributes(attributesStr: string): Array<{ name: string; value: string }> {
        const attributes: Array<{ name: string; value: string }> = [];

        // Handle attributes with proper quote matching, including nested quotes
        let i = 0;
        while (i < attributesStr.length) {
            // Skip whitespace
            while (i < attributesStr.length && /\s/.test(attributesStr[i])) {
                i++;
            }

            if (i >= attributesStr.length) {
                break;
            }

            // Parse attribute name
            let nameStart = i;
            while (i < attributesStr.length && /[\w:-]/.test(attributesStr[i])) {
                i++;
            }

            if (i === nameStart) {
                break; // No valid attribute name found
            }

            const name = attributesStr.substring(nameStart, i);

            // Skip whitespace and '='
            while (i < attributesStr.length && /[\s=]/.test(attributesStr[i])) {
                i++;
            }

            if (i >= attributesStr.length) {
                break;
            }

            // Parse attribute value
            const quote = attributesStr[i];
            if (quote !== '"' && quote !== "'") {
                break; // No valid quote found
            }

            i++; // Skip opening quote
            let value = '';
            while (i < attributesStr.length && attributesStr[i] !== quote) {
                value += attributesStr[i];
                i++;
            }

            if (i < attributesStr.length) {
                i++; // Skip closing quote
                attributes.push({ name, value });
            }
        }

        return attributes;
    }

    /**
     * Format tag with attributes on separate lines
     */
    private formatTagWithSeparateAttributes(
        tagName: string,
        attributes: Array<{ name: string; value: string }>,
        baseIndent: string,
        selfClosing: string
    ): string {
        const attrIndent = baseIndent + this.getIndentString();
        let result = `${baseIndent}<${tagName}`;

        // Sort attributes alphabetically if option is enabled
        const attributesToFormat = this.options.sortAttributes
            ? [...attributes].sort((a, b) => a.name.localeCompare(b.name))
            : attributes;

        for (const attr of attributesToFormat) {
            result += `\n${attrIndent}${attr.name}="${attr.value}"`;
        }

        // Put closing tag on new line if option is enabled
        if (this.options.closeTagOnNewLine) {
            result += `\n${baseIndent}${selfClosing}>`;
        } else {
            result += `${selfClosing}>`;
        }

        return result;
    }

    /**
     * Apply Odoo tag spacing - add blank lines between important tags
     */
    private applyOdooTagSpacing(xml: string): string {
        const lines = xml.split('\n');
        const result: string[] = [];
        const tagStack: Array<{ tag: string; startLine: number; isSelfClosing: boolean }> = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty lines and comments
            if (trimmed === '' || trimmed.startsWith('<!--')) {
                result.push(line);
                continue;
            }

            // Check for single-line self-closing tag: <tag ... />
            const singleLineSelfClosingMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9_-]*)\s[^>]*\/>$/);

            // Check for opening tag: <tag or <tag attr="value">
            const openingTagMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9_-]*)[\s>]/);

            // Check for closing tag: </tag>
            const closingTagMatch = trimmed.match(/^<\/([a-zA-Z][a-zA-Z0-9_-]*)>$/);

            // Check if line ends with /> (multi-line self-closing tag end)
            const endsWithSelfClosing = trimmed.endsWith('/>');

            // Check if line ends with > (opening tag complete on this line)
            const endsWithClosingBracket = trimmed.endsWith('>') && !endsWithSelfClosing && !closingTagMatch;

            const currentSingleLineSelfClosingTag = singleLineSelfClosingMatch ? singleLineSelfClosingMatch[1] : null;
            const currentOpeningTag = openingTagMatch && !singleLineSelfClosingMatch && !closingTagMatch ? openingTagMatch[1] : null;
            const currentClosingTag = closingTagMatch ? closingTagMatch[1] : null;

            // Add blank line BEFORE opening tag or self-closing tag of specified tags
            if (currentOpeningTag && this.options.odooSpacingTags.includes(currentOpeningTag)) {
                const lastLine = result[result.length - 1];
                if (lastLine !== undefined && lastLine.trim() !== '') {
                    result.push('');
                }

                // Track if this is a self-closing multi-line tag
                const isSelfClosing = endsWithSelfClosing;
                tagStack.push({ tag: currentOpeningTag, startLine: result.length, isSelfClosing });
            } else if (currentSingleLineSelfClosingTag && this.options.odooSpacingTags.includes(currentSingleLineSelfClosingTag)) {
                const lastLine = result[result.length - 1];
                if (lastLine !== undefined && lastLine.trim() !== '') {
                    result.push('');
                }
            }

            result.push(line);

            // Check if current line completes a multi-line tag (either /> or > without being start of tag)
            if (endsWithSelfClosing && tagStack.length > 0 && !currentOpeningTag) {
                // This is the end of a multi-line self-closing tag
                const lastTag = tagStack[tagStack.length - 1];
                if (this.options.odooSpacingTags.includes(lastTag.tag)) {
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1].trim();
                        if (nextLine !== '') {
                            result.push('');
                        }
                    }
                }
                tagStack.pop();
            } else if (endsWithClosingBracket && tagStack.length > 0 && !currentOpeningTag) {
                // This is the end of a multi-line opening tag (not self-closing)
                const lastTag = tagStack[tagStack.length - 1];
                lastTag.isSelfClosing = false; // Confirm it's not self-closing
            }

            // Add blank line AFTER closing tag </tag> of specified tags
            if (currentClosingTag && this.options.odooSpacingTags.includes(currentClosingTag)) {
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine !== '') {
                        result.push('');
                    }
                }
                // Remove from stack
                for (let j = tagStack.length - 1; j >= 0; j--) {
                    if (tagStack[j].tag === currentClosingTag) {
                        tagStack.splice(j, 1);
                        break;
                    }
                }
            }

            // Add blank line AFTER single-line self-closing tag
            if (currentSingleLineSelfClosingTag && this.options.odooSpacingTags.includes(currentSingleLineSelfClosingTag)) {
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine !== '') {
                        result.push('');
                    }
                }
            }

            // Add blank line AFTER self-closing tag that was opened and closed in same line (handled by currentOpeningTag)
            if (currentOpeningTag && this.options.odooSpacingTags.includes(currentOpeningTag) && endsWithSelfClosing) {
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine !== '') {
                        result.push('');
                    }
                }
                tagStack.pop(); // Remove since it's complete
            }
        }

        return result.join('\n');
    }    /**
     * Validate XML syntax before formatting
     */
    public validateXml(xmlContent: string): { isValid: boolean; error?: string; line?: number; lineContent?: string } {
        try {
            // Use XMLValidator for strict validation
            const validationResult = XMLValidator.validate(xmlContent, {
                allowBooleanAttributes: true
            });

            if (validationResult !== true) {
                // validationResult is an error object when validation fails
                const error = validationResult as any;
                const errorMessage = error.err?.msg || 'Unknown validation error';
                const lineNumber = error.err?.line;
                const columnNumber = error.err?.col;

                let lineContent: string | undefined;
                if (lineNumber !== undefined) {
                    const lines = xmlContent.split('\n');
                    if (lineNumber > 0 && lineNumber <= lines.length) {
                        const fullLineContent = lines[lineNumber - 1].trim();
                        // Truncate to 20 characters and add ellipsis if longer
                        lineContent = fullLineContent.length > 20
                            ? fullLineContent.substring(0, 20) + '...'
                            : fullLineContent;
                    }
                }

                // Build detailed error message
                let detailedError = errorMessage;
                if (columnNumber !== undefined) {
                    detailedError += ` (cột ${columnNumber})`;
                }

                return {
                    isValid: false,
                    error: detailedError,
                    line: lineNumber,
                    lineContent
                };
            }

            // Double-check by trying to parse
            const parser = new XMLParser({
                ignoreAttributes: false,
                stopNodes: ['*.#text'],
                commentPropName: this.options.preserveComments ? '#comment' : undefined
            });
            parser.parse(xmlContent);

            return { isValid: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';

            // Try to extract line number from error message
            const lineMatch = errorMessage.match(/(?:line|Line)\s*(\d+)/i);
            const lineNumber = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

            let lineContent: string | undefined;
            if (lineNumber !== undefined) {
                const lines = xmlContent.split('\n');
                if (lineNumber > 0 && lineNumber <= lines.length) {
                    const fullLineContent = lines[lineNumber - 1].trim();
                    lineContent = fullLineContent.length > 20
                        ? fullLineContent.substring(0, 20) + '...'
                        : fullLineContent;
                }
            }

            return {
                isValid: false,
                error: errorMessage,
                line: lineNumber,
                lineContent
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
            sortAttributes: false,
            selfClosingTags: true,
            closeTagOnNewLine: false,
            preserveComments: true,
            odooTagSpacing: true,
            odooSpacingTags: ['record', 'menuitem']
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
export function validateXml(xmlContent: string): { isValid: boolean; error?: string; line?: number; lineContent?: string } {
    const formatter = new XmlFormatter();
    return formatter.validateXml(xmlContent);
}