"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flow_client_1 = require("../../flow-client");
var ava_1 = require("ava");
ava_1.test('flow env interpolation - plain', function (t) {
    var result = flow_client_1.FlowGenerator.replaceEnv("http://localhost:4466/test/dev");
    t.snapshot(result);
});
ava_1.test('flow env interpolation - environment one', function (t) {
    var result = flow_client_1.FlowGenerator.replaceEnv('${env:PRISMA_ENDPOINT}');
    t.snapshot(result);
});
ava_1.test('flow env interpolation - environment multiple', function (t) {
    var result = flow_client_1.FlowGenerator.replaceEnv('http://localhost:4466/${env:PRISMA_SERVICE}/${env:PRISMA_STAGE}');
    t.snapshot(result);
});
//# sourceMappingURL=flow-env.test.js.map