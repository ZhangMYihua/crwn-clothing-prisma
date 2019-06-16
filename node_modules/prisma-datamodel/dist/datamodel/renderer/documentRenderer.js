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
/**
 * Renderer implementation for document models.
 */
var DocumentRenderer = /** @class */ (function (_super) {
    __extends(DocumentRenderer, _super);
    function DocumentRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // No explicit database name direcitve for mongo _id fields
    DocumentRenderer.prototype.shouldCreateDatabaseNameFieldDirective = function (field) {
        return (_super.prototype.shouldCreateDatabaseNameFieldDirective.call(this, field) &&
            !(field.isId && field.databaseName === '_id'));
    };
    return DocumentRenderer;
}(renderer_1.default));
exports.default = DocumentRenderer;
//# sourceMappingURL=documentRenderer.js.map