import Renderer from './renderer';
import { IGQLField } from '../model';
/**
 * Renderer implementation for document models.
 */
export default class DocumentRenderer extends Renderer {
    protected shouldCreateDatabaseNameFieldDirective(field: IGQLField): boolean;
}
