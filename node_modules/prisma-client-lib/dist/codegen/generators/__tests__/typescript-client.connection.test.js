"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var graphql_1 = require("graphql");
var typescript_client_1 = require("../typescript-client");
var ava_1 = require("ava");
var fixtures_1 = require("./fixtures");
var prisma_generate_schema_1 = require("prisma-generate-schema");
var prisma_datamodel_1 = require("prisma-datamodel");
var datamodel = fs.readFileSync(path.join(fixtures_1.fixturesPath, 'connection.prisma'), 'utf-8');
ava_1.test('typescript generator - connection', function (t) {
    var schema = graphql_1.buildSchema(prisma_generate_schema_1.default(datamodel, prisma_datamodel_1.DatabaseType.postgres));
    var generator = new typescript_client_1.TypescriptGenerator({
        schema: schema,
        internalTypes: prisma_generate_schema_1.parseInternalTypes(datamodel, prisma_datamodel_1.DatabaseType.postgres).types,
    });
    var result = generator.render();
    t.snapshot(result);
});
//# sourceMappingURL=typescript-client.connection.test.js.map