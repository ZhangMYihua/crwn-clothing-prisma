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
var parser_1 = require("./parser");
var legacyFields_1 = require("../legacyFields");
var directives_1 = require("../directives");
/**
 * Parser implementation for related models.
 */
var RelationalParser = /** @class */ (function (_super) {
    __extends(RelationalParser, _super);
    function RelationalParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Postgres fallback for reserved field names.
     */
    RelationalParser.prototype.isIdField = function (field) {
        return (this.hasDirective(field, directives_1.DirectiveKeys.isId) ||
            field.name.value === legacyFields_1.LegacyRelationalReservedFields.idFieldName);
    };
    RelationalParser.prototype.isCreatedAtField = function (field) {
        return (this.hasDirective(field, directives_1.DirectiveKeys.isCreatedAt) ||
            field.name.value === legacyFields_1.LegacyRelationalReservedFields.createdAtFieldName);
    };
    RelationalParser.prototype.isUpdatedAtField = function (field) {
        return (this.hasDirective(field, directives_1.DirectiveKeys.isUpdatedAt) ||
            field.name.value === legacyFields_1.LegacyRelationalReservedFields.updatedAtFieldName);
    };
    RelationalParser.prototype.isEmbedded = function (type) {
        // Related models are never embedded
        return false;
    };
    /**
     * Postgres fallback for db directive, which is not known in postgres.
     */
    RelationalParser.prototype.getDatabaseFieldName = function (field) {
        return _super.prototype.getDatabaseFieldName.call(this, field) || this.getPgColumnName(field);
    };
    RelationalParser.prototype.getDatabaseTypeName = function (type) {
        return _super.prototype.getDatabaseTypeName.call(this, type) || this.getPgTableName(type);
    };
    RelationalParser.prototype.getPgColumnName = function (field) {
        var directive = this.getDirectiveByName(field, 'pgColumn');
        return this.getDirectiveArgument(directive, 'name');
    };
    RelationalParser.prototype.getPgTableName = function (type) {
        var directive = this.getDirectiveByName(type, 'pgTable');
        return this.getDirectiveArgument(directive, 'name');
    };
    return RelationalParser;
}(parser_1.default));
exports.default = RelationalParser;
//# sourceMappingURL=relationalParser.js.map