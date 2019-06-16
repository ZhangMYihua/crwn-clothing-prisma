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
var gqlAssert_1 = require("../../util/gqlAssert");
/**
 * Renderer implementation for relational models, model version 2
 * https://www.notion.so/Migrate-current-datamodel-to-v2-485aad4b77814af2831411a8d5f5abc1
 */
var RelationalRendererV2 = /** @class */ (function (_super) {
    __extends(RelationalRendererV2, _super);
    function RelationalRendererV2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // The default behavior already equals to v2 for all directives.
    RelationalRendererV2.prototype.renderType = function (type) {
        if (type.isEmbedded) {
            gqlAssert_1.default.raise('Embedded types are not supported in relational models.');
        }
        return _super.prototype.renderType.call(this, type);
    };
    return RelationalRendererV2;
}(renderer_1.default));
exports.default = RelationalRendererV2;
//# sourceMappingURL=relationalRenderer.js.map