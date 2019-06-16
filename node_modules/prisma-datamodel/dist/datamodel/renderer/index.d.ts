import Renderer from './renderer';
import { DatabaseType } from '../../databaseType';
export default abstract class DefaultRenderer {
    static create(databaseType: DatabaseType, enableV2?: boolean): Renderer;
}
