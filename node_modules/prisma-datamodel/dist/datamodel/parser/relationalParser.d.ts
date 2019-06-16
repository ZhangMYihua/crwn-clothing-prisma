import Parser from './parser';
import { IGQLField, IGQLType } from '../model';
/**
 * Parser implementation for related models.
 */
export default class RelationalParser extends Parser {
    /**
     * Postgres fallback for reserved field names.
     */
    protected isIdField(field: any): boolean;
    protected isCreatedAtField(field: any): boolean;
    protected isUpdatedAtField(field: any): boolean;
    protected isEmbedded(type: any): boolean;
    /**
     * Postgres fallback for db directive, which is not known in postgres.
     */
    protected getDatabaseFieldName(field: IGQLField): string | null;
    protected getDatabaseTypeName(type: IGQLType): string | null;
    protected getPgColumnName(field: IGQLField): string | null;
    protected getPgTableName(type: IGQLType): string | null;
}
