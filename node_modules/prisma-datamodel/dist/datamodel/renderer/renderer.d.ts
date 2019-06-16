import { ISDL, IGQLType, IDirectiveInfo, IGQLField, IIndexInfo } from '../model';
export default abstract class Renderer {
    private sortBeforeRendering;
    render(input: ISDL, sortBeforeRendering?: boolean): string;
    protected createIsEmbeddedTypeDirective(type: IGQLType): {
        name: string;
        arguments: {};
    };
    protected createIsRelationTableTypeDirective(type: IGQLType): {
        name: string;
        arguments: {};
    };
    protected createDatabaseNameTypeDirective(type: IGQLType): {
        name: string;
        arguments: {
            name: any;
        };
    };
    protected getValidIndices(type: IGQLType): IIndexInfo[];
    protected createIndexDirectives(type: IGQLType, typeDirectives: IDirectiveInfo[]): void;
    protected createIndexDirective(index: IIndexInfo): string;
    protected shouldCreateIsEmbeddedTypeDirective(type: IGQLType): boolean;
    protected shouldCreateIsRelationTableTypeDirective(type: IGQLType): boolean;
    protected shouldCreateDatabaseNameTypeDirective(type: IGQLType): boolean | "" | null;
    protected shouldRenderIndexDirectives(type: IGQLType): boolean;
    protected createReservedTypeDirectives(type: IGQLType, typeDirectives: IDirectiveInfo[]): void;
    protected renderType(type: IGQLType): string;
    protected renderComments(type: IGQLType | IGQLField, spacing: string): {
        renderedComments: string;
        hasError: boolean;
    };
    protected createDefaultValueFieldDirective(field: IGQLField): {
        name: string;
        arguments: {
            value: any;
        };
    };
    protected createIsUniqueFieldDirective(field: IGQLField): {
        name: string;
        arguments: {};
    };
    protected createRelationNameFieldDirective(field: IGQLField): {
        name: string;
        arguments: {
            name: any;
        };
    };
    protected createIsIdFieldDirective(field: IGQLField): {
        name: string;
        arguments: any;
    };
    protected createSequenceFieldDirective(field: IGQLField): IDirectiveInfo;
    protected createIsCreatedAtFieldDirective(field: IGQLField): {
        name: string;
        arguments: {};
    };
    protected createIsUpdatedAtFieldDirctive(field: IGQLField): {
        name: string;
        arguments: {};
    };
    protected createDatabaseNameFieldDirective(field: IGQLField): {
        name: string;
        arguments: {
            name: any;
        };
    };
    protected createScalarListFieldDirective(field: IGQLField): {
        name: string;
        arguments: {
            strategy: string;
        };
    };
    protected shouldCreateDefaultValueFieldDirective(field: IGQLField): boolean;
    protected shouldCreateIsUniqueFieldDirective(field: IGQLField): boolean;
    protected shouldCreateRelationNameFieldDirective(field: IGQLField): boolean;
    protected shouldCreateIsIdFieldDirective(field: IGQLField): boolean;
    protected shouldCreateSequenceFieldDirective(field: IGQLField): boolean;
    protected shouldCreateCreatedAtFieldDirective(field: IGQLField): boolean;
    protected shouldCreateUpdatedAtFieldDirective(field: IGQLField): boolean;
    protected shouldCreateDatabaseNameFieldDirective(field: IGQLField): boolean;
    protected shouldCreateScalarListDirective(field: IGQLField): any;
    protected createReservedFieldDirectives(field: IGQLField, fieldDirectives: IDirectiveInfo[]): void;
    protected renderField(field: IGQLField): string;
    protected renderEnum(type: IGQLType): string;
    protected renderDirectives(directives: IDirectiveInfo[]): string;
    protected renderDirective(directive: IDirectiveInfo): string;
    /**
     * Merges directives by summarizing arguments of
     * directives with equal name. That saves work when adding directives.
     */
    protected mergeDirectives(directives: IDirectiveInfo[]): IDirectiveInfo[];
    protected extractTypeIdentifier(type: string | IGQLType): string;
    protected renderValue(type: string | IGQLType, value: any): any;
    protected sortTypes(types: IGQLType[]): IGQLType[];
    protected sortFields(fields: IGQLField[]): IGQLField[];
    protected getTypeName(type: IGQLType | string): string;
}
