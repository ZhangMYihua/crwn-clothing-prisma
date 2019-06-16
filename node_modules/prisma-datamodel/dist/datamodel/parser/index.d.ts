import { DatabaseType } from '../../databaseType';
import Parser from './parser';
export default abstract class Parsers {
    static create(databaseType: DatabaseType): Parser;
}
