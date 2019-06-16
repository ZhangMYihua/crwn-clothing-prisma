import Renderer from './renderer';
import { ISDL, IGQLType, IDirectiveInfo, IGQLField } from '../model';
/**
 * Renderer implementation for relational models.
 */
export default class RelationalRenderer extends Renderer {
    render(input: ISDL, sortBeforeRendering?: boolean): string;
    protected shouldCreateIsIdFieldDirective(field: IGQLField): boolean;
    protected shouldCreateCreatedAtFieldDirective(field: IGQLField): boolean;
    protected shouldCreateUpdatedAtFieldDirective(field: IGQLField): boolean;
    protected shouldCreateSequenceFieldDirective(field: IGQLField): boolean;
    protected shouldCreateScalarListDirective(field: IGQLField): boolean;
    protected shouldCreateIsUniqueFieldDirective(field: IGQLField): boolean;
    protected renderType(type: IGQLType): string;
    protected createDatabaseNameTypeDirective(type: IGQLType): {
        name: string;
        arguments: {
            name: any;
        };
    };
    protected createDatabaseNameFieldDirective(field: IGQLField): {
        name: string;
        arguments: {
            name: any;
        };
    };
    protected renderField(field: IGQLField): string;
    protected renderDirectives(directives: IDirectiveInfo[]): string;
}
