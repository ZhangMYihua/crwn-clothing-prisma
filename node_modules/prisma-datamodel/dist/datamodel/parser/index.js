"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var databaseType_1 = require("../../databaseType");
var documentParser_1 = require("./documentParser");
var relationalParser_1 = require("./relationalParser");
var Parsers = /** @class */ (function () {
    function Parsers() {
    }
    Parsers.create = function (databaseType) {
        switch (databaseType) {
            case databaseType_1.DatabaseType.mongo:
                return new documentParser_1.default();
            case databaseType_1.DatabaseType.mysql:
                return new relationalParser_1.default();
            case databaseType_1.DatabaseType.postgres:
                return new relationalParser_1.default();
            default:
                throw new Error('Parser for database type not implemented: ' + databaseType);
        }
    };
    return Parsers;
}());
exports.default = Parsers;
//# sourceMappingURL=index.js.map