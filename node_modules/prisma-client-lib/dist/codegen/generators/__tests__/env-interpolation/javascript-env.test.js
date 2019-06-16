"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var javascript_client_1 = require("../../javascript-client");
var ava_1 = require("ava");
ava_1.test('javascript env interpolation - plain', function (t) {
    var result = javascript_client_1.JavascriptGenerator.replaceEnv("http://localhost:4466/test/dev");
    t.snapshot(result);
});
ava_1.test('javascript env interpolation - environment one', function (t) {
    var result = javascript_client_1.JavascriptGenerator.replaceEnv('${env:PRISMA_ENDPOINT}');
    t.snapshot(result);
});
ava_1.test('javascript env interpolation - environment multiple', function (t) {
    var result = javascript_client_1.JavascriptGenerator.replaceEnv('http://localhost:4466/${env:PRISMA_SERVICE}/${env:PRISMA_STAGE}');
    t.snapshot(result);
});
//# sourceMappingURL=javascript-env.test.js.map