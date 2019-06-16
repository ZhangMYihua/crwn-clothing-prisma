"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var documentRenderer_1 = require("./documentRenderer");
var legacyRelationalRenderer_1 = require("./legacyRelationalRenderer");
var relationalRenderer_1 = require("./relationalRenderer");
var databaseType_1 = require("../../databaseType");
var gqlAssert_1 = require("../../util/gqlAssert");
var DefaultRenderer = /** @class */ (function () {
    function DefaultRenderer() {
    }
    DefaultRenderer.create = function (databaseType, enableV2) {
        if (enableV2 === void 0) { enableV2 = false; }
        if (enableV2) {
            switch (databaseType) {
                case databaseType_1.DatabaseType.mongo:
                    return new documentRenderer_1.default();
                case databaseType_1.DatabaseType.mysql:
                    return new relationalRenderer_1.default();
                case databaseType_1.DatabaseType.postgres:
                    return new relationalRenderer_1.default();
                case databaseType_1.DatabaseType.sqlite:
                    return new relationalRenderer_1.default();
            }
        }
        else {
            switch (databaseType) {
                case databaseType_1.DatabaseType.mongo:
                    return new documentRenderer_1.default();
                case databaseType_1.DatabaseType.mysql:
                    return new legacyRelationalRenderer_1.default();
                case databaseType_1.DatabaseType.postgres:
                    return new legacyRelationalRenderer_1.default();
                case databaseType_1.DatabaseType.sqlite:
                    return new legacyRelationalRenderer_1.default();
            }
        }
        gqlAssert_1.default.raise("Attempting to create renderer for unknown database type: " + databaseType);
        return new documentRenderer_1.default(); // Make TS happy.
    };
    return DefaultRenderer;
}());
exports.default = DefaultRenderer;
//# sourceMappingURL=index.js.map