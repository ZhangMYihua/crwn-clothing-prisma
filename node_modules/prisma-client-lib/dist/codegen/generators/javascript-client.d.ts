import { TypescriptGenerator, RenderOptions } from './typescript-client';
import * as prettier from 'prettier';
import { GeneratorType } from '../types';
export declare class JavascriptGenerator extends TypescriptGenerator {
    generator: GeneratorType;
    constructor(options: any);
    format(code: string, options?: prettier.Options): string;
    renderJavascript(options?: RenderOptions): string;
    renderModels(): string;
}
