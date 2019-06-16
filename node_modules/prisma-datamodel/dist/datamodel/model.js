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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var IdStrategy;
(function (IdStrategy) {
    IdStrategy["Auto"] = "AUTO";
    IdStrategy["None"] = "NONE";
    IdStrategy["Sequence"] = "SEQUENCE";
})(IdStrategy = exports.IdStrategy || (exports.IdStrategy = {}));
/**
 * Internal manifestations of the interfaces declared above.
 */
var GQLFieldBase = /** @class */ (function () {
    function GQLFieldBase(name, type, isRequired) {
        this.name = name;
        this.type = type;
        this.isRequired = isRequired || false;
        this.isList = false;
        this.relatedField = null;
        this.relationName = null;
        this.isUnique = false;
        this.defaultValue = null;
        this.isCreatedAt = false;
        this.isUpdatedAt = false;
        this.isId = false;
        this.idStrategy = null;
        this.associatedSequence = null;
        this.isReadOnly = false;
        this.databaseName = null;
        this.directives = [];
        this.comments = [];
    }
    return GQLFieldBase;
}());
exports.GQLFieldBase = GQLFieldBase;
var GQLScalarField = /** @class */ (function (_super) {
    __extends(GQLScalarField, _super);
    function GQLScalarField(name, type, isRequired) {
        return _super.call(this, name, type, isRequired) || this;
    }
    return GQLScalarField;
}(GQLFieldBase));
exports.GQLScalarField = GQLScalarField;
var GQLOneRelationField = /** @class */ (function (_super) {
    __extends(GQLOneRelationField, _super);
    function GQLOneRelationField(name, type, isRequired) {
        return _super.call(this, name, type, isRequired) || this;
    }
    return GQLOneRelationField;
}(GQLFieldBase));
exports.GQLOneRelationField = GQLOneRelationField;
// TODO: Create abstract base class for testing.
var GQLMultiRelationField = /** @class */ (function (_super) {
    __extends(GQLMultiRelationField, _super);
    function GQLMultiRelationField(name, type, isRequired) {
        var _this = _super.call(this, name, type, isRequired) || this;
        _this.isList = true;
        return _this;
    }
    return GQLMultiRelationField;
}(GQLFieldBase));
exports.GQLMultiRelationField = GQLMultiRelationField;
function cloneComments(copy, obj) {
    if (obj.comments !== undefined) {
        copy.comments = [];
        for (var _i = 0, _a = obj.comments; _i < _a.length; _i++) {
            var comment = _a[_i];
            copy.comments.push(__assign({}, comment));
        }
    }
}
function cloneSequence(copy, obj) {
    if (obj.associatedSequence !== null) {
        copy.associatedSequence = __assign({}, obj.associatedSequence);
    }
}
function cloneCommentsAndDirectives(copy, obj) {
    if (obj.directives !== undefined) {
        copy.directives = [];
        for (var _i = 0, _a = obj.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            copy.directives.push(__assign({}, directive));
        }
    }
    cloneComments(copy, obj);
}
// 21st of Dec: Start: 8:00 - end: 9:45
function cloneField(field) {
    var copy = __assign({}, field);
    cloneCommentsAndDirectives(copy, field);
    cloneSequence(copy, field);
    return copy;
}
exports.cloneField = cloneField;
function cloneType(type) {
    var copy = __assign({}, type);
    cloneCommentsAndDirectives(copy, type);
    cloneIndices(copy, type);
    copy.fields = [];
    for (var _i = 0, _a = type.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        copy.fields.push(cloneField(field));
    }
    return copy;
}
exports.cloneType = cloneType;
function cloneIndices(copy, obj) {
    if (obj.indices !== undefined) {
        copy.indices = [];
        for (var _i = 0, _a = obj.indices; _i < _a.length; _i++) {
            var index = _a[_i];
            copy.indices.push({
                name: index.name,
                unique: index.unique,
                fields: index.fields.slice(),
            });
        }
    }
}
exports.cloneIndices = cloneIndices;
/**
 * Deep-copies a datamodel and re-connects all types correctly.
 * @param schema The datamodel to clone.
 */
function cloneSchema(schema) {
    // TODO(ejoebstl): It would be better to have a concrete implementation for
    // each SDL object and require a clone method on interface level.
    var copy = __assign({}, schema);
    cloneComments(copy, schema);
    copy.types = [];
    for (var _i = 0, _a = schema.types; _i < _a.length; _i++) {
        var type = _a[_i];
        copy.types.push(cloneType(type));
    }
    // Re-Assign type pointer for relations
    for (var _b = 0, _c = copy.types; _b < _c.length; _b++) {
        var type = _c[_b];
        var _loop_1 = function (field) {
            if (typeof field.type !== 'string') {
                var typeName_1 = field.type.name;
                var fieldType = copy.types.filter(function (x) { return x.name === typeName_1; })[0];
                console.assert(fieldType !== undefined); // This case should never happen
                field.type = fieldType;
            }
        };
        for (var _d = 0, _e = type.fields; _d < _e.length; _d++) {
            var field = _e[_d];
            _loop_1(field);
        }
    }
    // Re-Assign field pointer for indices
    for (var _f = 0, _g = copy.types; _f < _g.length; _f++) {
        var type = _g[_f];
        if (type.indices !== undefined) {
            for (var _h = 0, _j = type.indices; _h < _j.length; _h++) {
                var index = _j[_h];
                var _loop_2 = function (i) {
                    var fieldName = index.fields[i].name;
                    var field = type.fields.filter(function (x) { return x.name === fieldName; })[0];
                    console.assert(field !== undefined); // This case should never happen
                    index.fields[i] = field;
                };
                // We need an index for setting the element
                // tslint:disable-next-line:prefer-for-of
                for (var i = 0; i < index.fields.length; i++) {
                    _loop_2(i);
                }
            }
        }
    }
    return copy;
}
exports.cloneSchema = cloneSchema;
//# sourceMappingURL=model.js.map