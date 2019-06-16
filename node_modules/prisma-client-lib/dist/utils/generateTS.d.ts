import { TypescriptGenerator } from '../codegen/generators/typescript-client';
export declare class TestTypescriptGenerator extends TypescriptGenerator {
    renderImports(): string;
}
export declare function generateTypescript(schemaString: string): Promise<void>;
