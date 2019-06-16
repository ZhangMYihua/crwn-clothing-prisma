"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var graphql_1 = require("graphql");
var go_client_1 = require("../go-client");
var ava_1 = require("ava");
var fixtures_1 = require("./fixtures");
var prisma_generate_schema_1 = require("prisma-generate-schema");
var prisma_datamodel_1 = require("prisma-datamodel");
var datamodel = fs.readFileSync(path.join(fixtures_1.fixturesPath, 'datamodel.prisma'), 'utf-8');
ava_1.test('go generator', function (t) {
    var schema = graphql_1.buildSchema(prisma_generate_schema_1.default(datamodel, prisma_datamodel_1.DatabaseType.postgres));
    var generator = new go_client_1.GoGenerator({
        schema: schema,
        internalTypes: prisma_generate_schema_1.parseInternalTypes(datamodel, prisma_datamodel_1.DatabaseType.postgres).types,
    });
    var result = generator.render({
        endpoint: 'http://localhost:4466/test/test',
    });
    t.snapshot(result);
});
//# sourceMappingURL=go-client.test.js.map