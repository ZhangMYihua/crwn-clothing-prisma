"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_client_1 = require("../../typescript-client");
var ava_1 = require("ava");
ava_1.test('typescript env interpolation - plain', function (t) {
    var result = typescript_client_1.TypescriptGenerator.replaceEnv("http://localhost:4466/test/dev");
    t.snapshot(result);
});
ava_1.test('typescript env interpolation - environment one', function (t) {
    var result = typescript_client_1.TypescriptGenerator.replaceEnv('${env:PRISMA_ENDPOINT}');
    t.snapshot(result);
});
ava_1.test('typescript env interpolation - environment multiple', function (t) {
    var result = typescript_client_1.TypescriptGenerator.replaceEnv('http://localhost:4466/${env:PRISMA_SERVICE}/${env:PRISMA_STAGE}');
    t.snapshot(result);
});
//# sourceMappingURL=typescript-env.test.js.map