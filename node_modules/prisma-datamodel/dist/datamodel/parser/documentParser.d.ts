import Parser from './parser';
/**
 * Parser implementation for document models.
 */
export default class DocumentParser extends Parser {
    isIdField(field: any): boolean;
    isEmbedded(type: any): boolean;
    protected isCreatedAtField(field: any): boolean;
    protected isUpdatedAtField(field: any): boolean;
}
