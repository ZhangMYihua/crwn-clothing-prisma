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
var directives_1 = require("../directives");
/**
 * Parser implementation for document models.
 */
var DocumentParser = /** @class */ (function (_super) {
    __extends(DocumentParser, _super);
    function DocumentParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DocumentParser.prototype.isIdField = function (field) {
        return this.hasDirective(field, directives_1.DirectiveKeys.isId);
    };
    DocumentParser.prototype.isEmbedded = function (type) {
        return this.hasDirective(type, directives_1.DirectiveKeys.isEmbedded);
    };
    DocumentParser.prototype.isCreatedAtField = function (field) {
        return this.hasDirective(field, directives_1.DirectiveKeys.isCreatedAt);
    };
    DocumentParser.prototype.isUpdatedAtField = function (field) {
        return this.hasDirective(field, directives_1.DirectiveKeys.isUpdatedAt);
    };
    return DocumentParser;
}(parser_1.default));
exports.default = DocumentParser;
//# sourceMappingURL=documentParser.js.map