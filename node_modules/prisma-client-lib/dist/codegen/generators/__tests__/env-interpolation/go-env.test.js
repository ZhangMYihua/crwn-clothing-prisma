"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var go_client_1 = require("../../go-client");
var ava_1 = require("ava");
ava_1.test('go env interpolation - empty', function (t) {
    var result = go_client_1.GoGenerator.replaceEnv("");
    t.snapshot(result);
});
ava_1.test('go env interpolation - null', function (t) {
    var result = go_client_1.GoGenerator.replaceEnv(null);
    t.snapshot(result);
});
ava_1.test('go env interpolation - plain', function (t) {
    var result = go_client_1.GoGenerator.replaceEnv("http://localhost:4466/test/dev");
    t.snapshot(result);
});
ava_1.test('go env interpolation - environment one', function (t) {
    var result = go_client_1.GoGenerator.replaceEnv('${env:PRISMA_ENDPOINT}');
    t.snapshot(result);
});
ava_1.test('go env interpolation - environment multiple', function (t) {
    var result = go_client_1.GoGenerator.replaceEnv('http://localhost:4466/${env:PRISMA_SERVICE}/${env:PRISMA_STAGE}');
    t.snapshot(result);
});
//# sourceMappingURL=go-env.test.js.map