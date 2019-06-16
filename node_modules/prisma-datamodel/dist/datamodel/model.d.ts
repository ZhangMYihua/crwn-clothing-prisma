/**
 * Represents a list of name, value pairs
 * to represent arguments.
 */
export interface IArguments {
    readonly [name: string]: string;
}
/**
 * Represents a directive
 */
export interface IDirectiveInfo {
    name: string;
    arguments: IArguments;
}
/**
 * Represents a comment.
 * If the error flag is set, the comment indicates an error
 * and should be trated accordingly.
 */
export interface IComment {
    text: string;
    isError: boolean;
}
export interface IIndexInfo {
    name: string;
    fields: IGQLField[];
    unique: boolean;
}
export declare enum IdStrategy {
    Auto = "AUTO",
    None = "NONE",
    Sequence = "SEQUENCE"
}
export interface ISequenceInfo {
    name: string;
    initialValue: number;
    allocationSize: number;
}
/**
 * Represents a field in the datamodel.
 */
export interface IGQLField {
    /**
     * The name of this sfield.
     */
    name: string;
    /**
     * The type of this field. A value of
     * type string indicates a scalar type.
     */
    type: string | IGQLType;
    /**
     * Indicates if this field is required.
     */
    isRequired: boolean;
    /**
     * Inidicates if this field holds
     * a list of values. Can be set for
     * scalars or relations.
     */
    isList: boolean;
    /**
     * The default value of a given field,
     * if any.
     */
    defaultValue: string | number | null;
    /**
     * This is set for double-sided relations.
     */
    relatedField: IGQLField | null;
    /**
     * This is only set for relations with a name given via
     * an directive.
     */
    relationName: string | null;
    /**
     * Indicates if this field is uniqe across the model.
     */
    isUnique: boolean;
    /**
     * Indicates if this field is the unique identifyer.
     */
    isId: boolean;
    /**
     * Indicates the id strategy to use. Null defaults to Auto.
     */
    idStrategy: IdStrategy | null;
    /**
     * Indicates if a sequence is associated with this field.
     * Only valid if the field is an ID field with idType set to Sequence.
     */
    associatedSequence: ISequenceInfo | null;
    /**
     * Indicates if this field is the created at timestamp.
     */
    isCreatedAt: boolean;
    /**
     * Indicates if this field is the updated at timestamp.
     */
    isUpdatedAt: boolean;
    /**
     * Indicates if this field is read-only.
     */
    isReadOnly: boolean;
    /**
     * Indicates how this field is called in the database. If this value is not set,
     * the name in the database is equal to the field name.
     */
    databaseName: string | null;
    /**
     * Indicates this fields extra directives,
     * which can not expressed using this
     * interface's other members.
     */
    directives: IDirectiveInfo[];
    /**
     * Comments for this field.
     */
    comments: IComment[];
}
/**
 * Represents a type in the datamodel.
 */
export interface IGQLType {
    /**
     * Indicates if this is an embedded type.
     */
    isEmbedded: boolean;
    /**
     * Indicates if this is an enum type.
     */
    isEnum: boolean;
    /**
     * Indicates if this type is a link table.
     * This implies a compound primary key over
     * the two foreign key fields. The indices are hidden
     * when introspecting.
     */
    isRelationTable: boolean;
    /**
     * The name of this type.
     */
    name: string;
    /**
     * A list of all fields of this type.
     *
     * If this is an enum type, only the name properties of each
     * field are relevant.
     */
    fields: IGQLField[];
    /**
     * Indicates how this type is called in the database. If this value is not set,
     * the name in the database is equal to the type name.
     *
     * This field is ignored for embedded types, which never have a database name.
     */
    databaseName: string | null;
    /**
     * Indicates this types extra directives,
     * which can not expressed using this
     * interface's other members.
     */
    directives: IDirectiveInfo[];
    /**
     * Comments for this type.
     */
    comments: IComment[];
    /**
     * Indices for this type.
     *
     * Will be parsed and rendered to the corresponding directive.
     */
    indices: IIndexInfo[];
}
export interface ISDL {
    /**
     * All types in this datamodel.
     */
    types: IGQLType[];
    /**
     * Comments for this datamodel.
     */
    comments?: IComment[];
}
/**
 * Internal manifestations of the interfaces declared above.
 */
export declare class GQLFieldBase implements IGQLField {
    name: string;
    type: string | IGQLType;
    isRequired: boolean;
    isList: boolean;
    relatedField: IGQLField | null;
    relationName: string | null;
    isUnique: boolean;
    defaultValue: any;
    isCreatedAt: boolean;
    isUpdatedAt: boolean;
    isId: boolean;
    idStrategy: IdStrategy | null;
    associatedSequence: ISequenceInfo | null;
    isReadOnly: boolean;
    databaseName: string | null;
    directives: IDirectiveInfo[];
    comments: IComment[];
    constructor(name: string, type: IGQLType | string, isRequired?: boolean);
}
export declare class GQLScalarField extends GQLFieldBase {
    constructor(name: string, type: string | IGQLType, isRequired?: boolean);
}
export declare class GQLOneRelationField extends GQLFieldBase {
    constructor(name: string, type: IGQLType, isRequired?: boolean);
}
export declare class GQLMultiRelationField extends GQLFieldBase {
    constructor(name: string, type: IGQLType, isRequired?: boolean);
}
export declare function cloneField(field: IGQLField): IGQLField;
export declare function cloneType(type: IGQLType): IGQLType;
export declare function cloneIndices(copy: IGQLType, obj: IGQLType): void;
/**
 * Deep-copies a datamodel and re-connects all types correctly.
 * @param schema The datamodel to clone.
 */
export declare function cloneSchema(schema: ISDL): ISDL;
