import Renderer from './renderer';
import { IGQLType } from '../model';
/**
 * Renderer implementation for relational models, model version 2
 * https://www.notion.so/Migrate-current-datamodel-to-v2-485aad4b77814af2831411a8d5f5abc1
 */
export default class RelationalRendererV2 extends Renderer {
    protected renderType(type: IGQLType): string;
}
