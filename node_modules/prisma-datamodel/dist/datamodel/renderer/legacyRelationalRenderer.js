"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("./renderer");
var legacyFields_1 = require("../legacyFields");
var model_1 = require("../model");
var gqlAssert_1 = require("../../util/gqlAssert");
var scalar_1 = require("../scalar");
var directives_1 = require("../directives");
/**
 * Renderer implementation for relational models.
 */
var RelationalRenderer = /** @class */ (function (_super) {
    __extends(RelationalRenderer, _super);
    function RelationalRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // The legacy renderer changes field names on rendering,
    // so we force it to operate on a copy.
    RelationalRenderer.prototype.render = function (input, sortBeforeRendering) {
        if (sortBeforeRendering === void 0) { sortBeforeRendering = false; }
        return _super.prototype.render.call(this, model_1.cloneSchema(input), sortBeforeRendering);
    };
    // Special case for postgres. We never render id, createdAt, isCreatedAt directive.
    RelationalRenderer.prototype.shouldCreateIsIdFieldDirective = function (field) {
        return false;
    };
    RelationalRenderer.prototype.shouldCreateCreatedAtFieldDirective = function (field) {
        return false;
    };
    RelationalRenderer.prototype.shouldCreateUpdatedAtFieldDirective = function (field) {
        return false;
    };
    RelationalRenderer.prototype.shouldCreateSequenceFieldDirective = function (field) {
        return false;
    };
    RelationalRenderer.prototype.shouldCreateScalarListDirective = function (field) {
        return false;
    };
    RelationalRenderer.prototype.shouldCreateIsUniqueFieldDirective = function (field) {
        return field.isUnique || field.isId;
    };
    // Avoid embedded types
    RelationalRenderer.prototype.renderType = function (type) {
        if (type.isEmbedded) {
            gqlAssert_1.default.raise('Embedded types are not supported in relational models.');
        }
        return _super.prototype.renderType.call(this, type);
    };
    // Use PG specific table/column refs
    RelationalRenderer.prototype.createDatabaseNameTypeDirective = function (type) {
        return {
            name: 'pgTable',
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, type.databaseName),
            },
        };
    };
    RelationalRenderer.prototype.createDatabaseNameFieldDirective = function (field) {
        return {
            name: 'pgColumn',
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, field.databaseName),
            },
        };
    };
    // Assert some basic rules
    RelationalRenderer.prototype.renderField = function (field) {
        if (field.isId &&
            field.name !== legacyFields_1.LegacyRelationalReservedFields.idFieldName) {
            field.databaseName = field.databaseName || field.name;
            field.name = legacyFields_1.LegacyRelationalReservedFields.idFieldName;
        }
        if (field.isCreatedAt &&
            field.name !== legacyFields_1.LegacyRelationalReservedFields.createdAtFieldName) {
            field.databaseName = field.databaseName || field.name;
            field.name = legacyFields_1.LegacyRelationalReservedFields.createdAtFieldName;
        }
        if (field.isUpdatedAt &&
            field.name !== legacyFields_1.LegacyRelationalReservedFields.updatedAtFieldName) {
            field.databaseName = field.databaseName || field.name;
            field.name = legacyFields_1.LegacyRelationalReservedFields.updatedAtFieldName;
        }
        return _super.prototype.renderField.call(this, field);
    };
    // Remove @relation(link: TABLE) directive.
    RelationalRenderer.prototype.renderDirectives = function (directives) {
        return _super.prototype.renderDirectives.call(this, directives.filter(function (dir) {
            return dir.name !== directives_1.DirectiveKeys.relation || dir.arguments.link !== 'TABLE';
        }));
    };
    return RelationalRenderer;
}(renderer_1.default));
exports.default = RelationalRenderer;
//# sourceMappingURL=legacyRelationalRenderer.js.map