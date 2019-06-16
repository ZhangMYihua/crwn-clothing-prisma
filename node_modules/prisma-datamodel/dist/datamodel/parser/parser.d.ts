import { IGQLType, IGQLField, ISDL, IDirectiveInfo, IIndexInfo, IdStrategy, ISequenceInfo } from '../model';
/**
 * Parses a datamodel given as DSL
 * to an internal representation, convenient for
 * working with.
 */
export default abstract class DefaultParser {
    /**
     * Shorthand to parse the datamodel, given an SDL string.
     * @param schemaString The datamodel as SDL string.
     * @returns A list of types found in the datamodel.
     */
    parseFromSchemaString(schemaString: string): ISDL;
    /**
     * Parses the datamodel from a graphql-js schema.
     * @param schema The graphql-js schema, representing the datamodel.
     * @returns A list of types found in the datamodel.
     */
    parseFromSchema(schema: any): ISDL;
    /**
     * Checks if the given field is an ID field
     * @param field
     */
    protected abstract isIdField(field: any): boolean;
    /**
     * Checks if the given field is an updatedAt field
     * @param field
     */
    protected abstract isUpdatedAtField(field: any): boolean;
    /**
     * Checks if the given field is a createdAt field
     * @param field
     */
    protected abstract isCreatedAtField(field: any): boolean;
    protected parseIdType(field: any): IdStrategy | null;
    protected parseSequence(field: any): ISequenceInfo | null;
    /**
     * Checks if the given field is reserved and read-only.
     * @param field
     */
    protected isReservedReadOnlyField(field: any): boolean;
    /**
     * Finds a directives on a field or type by name.
     * @param fieldOrType
     * @param name
     */
    protected getDirectivesByName(fieldOrType: any, name: string): any[];
    /**
     * Finds a directive on a field or type by name and returns the first occurance.
     * @param fieldOrType
     * @param name
     */
    protected getDirectiveByName(fieldOrType: any, name: string): any;
    /**
     * Checks if a directive on a given field or type ecists
     * @param fieldOrType
     * @param name
     */
    protected hasDirective(fieldOrType: any, name: string): boolean;
    /**
     * Checks if the given field is unique.
     * @param field
     */
    protected isUniqe(field: any): boolean;
    /**
     * Gets a fields default value. If no default
     * value is given, returns null.
     * @param field
     */
    protected getDefaultValue(field: any): any;
    /**
     * Gets a fields relation name. If no relation
     * exists, returns null.
     * @param field
     */
    protected getRelationName(field: any): string | null;
    /**
     * Gets a fields or types relation name. If no directive
     * exists, returns null.
     * @param field
     */
    protected getDatabaseName(fieldOrType: any): string | null;
    /**
     * Gets a fields relation name. If no directive
     * exists, returns null.
     * @param field
     */
    protected getDatabaseFieldName(field: IGQLField): string | null;
    /**
     * Gets a types relation name. If no directive
     * exists, returns null.
     * @param field
     */
    protected getDatabaseTypeName(type: IGQLType): string | null;
    /**
     * Returns the value of a directive argument.
     */
    protected getDirectiveArgument(directive: any, name: string): any;
    /**
     * Returns the value of an object field.
     */
    protected getObjectFieldValue(obj: any, name: string): any;
    /**
     * Parses a single index directive input object, resolves all field references.
     */
    protected parseIndex(indexObject: any, fields: IGQLField[]): IIndexInfo;
    /**
     * Parses all index directives on the given type.
     */
    protected parseIndices(type: any, fields: IGQLField[]): IIndexInfo[];
    /**
     * Gets all reserved directive keys.
     */
    protected getReservedDirectiveNames(): string[];
    /**
     * Parses all directives that are not reserved (build-in)
     * from a field or type
     */
    protected parseDirectives(fieldOrType: any): IDirectiveInfo[];
    /**
     * Parses a model field, respects all
     * known directives.
     * @param field
     */
    protected parseField(field: any): IGQLField;
    /**
     * Checks if the given type is an embedded type.
     * @param type
     */
    protected abstract isEmbedded(type: any): boolean;
    /**
     * Checks if the given type is marked as link table.
     * @param type
     */
    protected isRelationTable(type: any): boolean;
    /**
     * Parases an object type.
     * @param type
     */
    protected parseObjectType(type: any): IGQLType;
    /**
     * Parses all types in the schema.
     * @param schema
     */
    protected parseTypes(schema: any): IGQLType[];
    /**
     * Parses an enum type.
     * @param schema
     */
    protected parseEnumType(type: any): IGQLType;
    /**
     * Resolves and connects all realtion fields found
     * in the given type list.
     * @param types
     */
    protected resolveRelations(types: IGQLType[]): void;
    /**
     * Traverses an AST branch and finds the next type.
     * This will skip modifiers like NonNullType or ListType.
     * @param type
     */
    protected parseType(type: any): any;
    /**
     * Traverses an AST branch and returns the modifier
     * of the type: Either ListType or NonNullType.
     * @param type
     * @param acc
     */
    protected parseKind(type: any, acc: any): any;
}
