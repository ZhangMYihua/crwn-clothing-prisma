"use strict";
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
var model_1 = require("../model");
var directives_1 = require("../directives");
var scalar_1 = require("../scalar");
var indent = '  ';
var comment = '#';
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.prototype.render = function (input, sortBeforeRendering) {
        var _this = this;
        if (sortBeforeRendering === void 0) { sortBeforeRendering = false; }
        this.sortBeforeRendering = sortBeforeRendering;
        // Sort alphabetically. Enums last.
        var sortedTypes = this.sortTypes(input.types);
        return sortedTypes
            .map(function (t) {
            if (t.isEnum) {
                return _this.renderEnum(t);
            }
            else {
                return _this.renderType(t);
            }
        })
            .join("\n\n");
    };
    Renderer.prototype.createIsEmbeddedTypeDirective = function (type) {
        return { name: directives_1.DirectiveKeys.isEmbedded, arguments: {} };
    };
    Renderer.prototype.createIsRelationTableTypeDirective = function (type) {
        return { name: directives_1.DirectiveKeys.relationTable, arguments: {} };
    };
    Renderer.prototype.createDatabaseNameTypeDirective = function (type) {
        return {
            name: directives_1.DirectiveKeys.db,
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, type.databaseName),
            },
        };
    };
    Renderer.prototype.getValidIndices = function (type) {
        return type.indices.filter(function (index) { return !index.fields.some(function (f) { return f.comments.some(function (c) { return c.isError; }); }); });
    };
    // TODO: Cleanup index rendering.
    Renderer.prototype.createIndexDirectives = function (type, typeDirectives) {
        /**
         * Prisma doesn't support indexes yet.
         * As soon as it does, the following line can be uncommented again
         */
        // const validIndices = this.getValidIndices(type)
        var validIndices = [];
        if (validIndices.length > 0) {
            var indexDescriptions = [];
            for (var _i = 0, _a = type.indices; _i < _a.length; _i++) {
                var index = _a[_i];
                indexDescriptions.push(this.createIndexDirective(index));
            }
            typeDirectives.push({
                name: directives_1.DirectiveKeys.indexes,
                arguments: {
                    value: "[\n" + indexDescriptions.join(',\n') + "\n]",
                },
            });
        }
    };
    Renderer.prototype.createIndexDirective = function (index) {
        var _this = this;
        var directive = {
            name: directives_1.DirectiveKeys.index,
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, index.name),
                // Special rendering: We escape manually here to render an array.
                fields: "[" + index.fields
                    .map(function (x) { return _this.renderValue(scalar_1.TypeIdentifiers.string, x.name); })
                    .join(', ') + "]",
            },
        };
        if (index.unique) {
            directive.arguments = __assign({}, directive.arguments, { unique: this.renderValue(scalar_1.TypeIdentifiers.boolean, index.unique) });
        }
        // If we switch back to single index declarations later, simply return the directive here.
        return indent + "{" + Object.keys(directive.arguments)
            .map(function (x) { return x + ": " + directive.arguments[x]; })
            .join(', ') + "}";
    };
    Renderer.prototype.shouldCreateIsEmbeddedTypeDirective = function (type) {
        return type.isEmbedded;
    };
    Renderer.prototype.shouldCreateIsRelationTableTypeDirective = function (type) {
        return type.isRelationTable;
    };
    Renderer.prototype.shouldCreateDatabaseNameTypeDirective = function (type) {
        return type.databaseName && !type.isEmbedded;
    };
    Renderer.prototype.shouldRenderIndexDirectives = function (type) {
        return type.indices.length > 0;
    };
    Renderer.prototype.createReservedTypeDirectives = function (type, typeDirectives) {
        if (this.shouldCreateIsEmbeddedTypeDirective(type)) {
            typeDirectives.push(this.createIsEmbeddedTypeDirective(type));
        }
        if (this.shouldCreateDatabaseNameTypeDirective(type)) {
            typeDirectives.push(this.createDatabaseNameTypeDirective(type));
        }
        if (this.shouldCreateIsRelationTableTypeDirective(type)) {
            typeDirectives.push(this.createIsRelationTableTypeDirective(type));
        }
        if (this.shouldRenderIndexDirectives(type)) {
            this.createIndexDirectives(type, typeDirectives);
        }
    };
    Renderer.prototype.renderType = function (type) {
        var _this = this;
        var typeDirectives = type.directives.slice();
        this.createReservedTypeDirectives(type, typeDirectives);
        var renderedDirectives = this.renderDirectives(typeDirectives);
        var sortedFields = this.sortFields(type.fields);
        var renderedFields = sortedFields.map(function (x) { return _this.renderField(x); });
        var renderedTypeName = renderedDirectives.length > 0
            ? "type " + type.name + " " + renderedDirectives
            : "type " + type.name;
        var _a = this.renderComments(type, ''), renderedComments = _a.renderedComments, hasError = _a.hasError;
        var allFieldsHaveError = type.fields.every(function (x) {
            return x.comments.some(function (c) { return c.isError; });
        });
        var commentPrefix = allFieldsHaveError ? comment + " " : '';
        if (renderedComments.length > 0) {
            return renderedComments + "\n" + commentPrefix + renderedTypeName + " {\n" + renderedFields.join('\n') + "\n" + commentPrefix + "}";
        }
        else {
            return "" + commentPrefix + renderedTypeName + " {\n" + renderedFields.join('\n') + "\n" + commentPrefix + "}";
        }
    };
    Renderer.prototype.renderComments = function (type, spacing) {
        var renderedComments = type.comments
            .map(function (x) { return "" + spacing + comment + " " + x.text; })
            .join('\n');
        var hasError = type.comments.some(function (x) { return x.isError; });
        return { renderedComments: renderedComments, hasError: hasError };
    };
    Renderer.prototype.createDefaultValueFieldDirective = function (field) {
        return {
            name: directives_1.DirectiveKeys.default,
            arguments: { value: this.renderValue(field.type, field.defaultValue) },
        };
    };
    Renderer.prototype.createIsUniqueFieldDirective = function (field) {
        return { name: directives_1.DirectiveKeys.isUnique, arguments: {} };
    };
    Renderer.prototype.createRelationNameFieldDirective = function (field) {
        return {
            name: directives_1.DirectiveKeys.relation,
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, field.relationName),
            },
        };
    };
    Renderer.prototype.createIsIdFieldDirective = function (field) {
        var args = {};
        if (field.idStrategy !== null && field.idStrategy !== model_1.IdStrategy.Auto) {
            args.strategy = field.idStrategy;
        }
        return { name: directives_1.DirectiveKeys.isId, arguments: args };
    };
    Renderer.prototype.createSequenceFieldDirective = function (field) {
        var sequence = field.associatedSequence;
        return {
            name: directives_1.DirectiveKeys.sequence,
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, sequence.name),
                initialValue: this.renderValue(scalar_1.TypeIdentifiers.integer, sequence.initialValue),
                allocationSize: this.renderValue(scalar_1.TypeIdentifiers.integer, sequence.allocationSize),
            },
        };
    };
    Renderer.prototype.createIsCreatedAtFieldDirective = function (field) {
        return { name: directives_1.DirectiveKeys.isCreatedAt, arguments: {} };
    };
    Renderer.prototype.createIsUpdatedAtFieldDirctive = function (field) {
        return { name: directives_1.DirectiveKeys.isUpdatedAt, arguments: {} };
    };
    Renderer.prototype.createDatabaseNameFieldDirective = function (field) {
        return {
            name: directives_1.DirectiveKeys.db,
            arguments: {
                name: this.renderValue(scalar_1.TypeIdentifiers.string, field.databaseName),
            },
        };
    };
    Renderer.prototype.createScalarListFieldDirective = function (field) {
        return {
            name: directives_1.DirectiveKeys.scalarList,
            arguments: {
                strategy: 'RELATION',
            },
        };
    };
    Renderer.prototype.shouldCreateDefaultValueFieldDirective = function (field) {
        return field.defaultValue !== null;
    };
    Renderer.prototype.shouldCreateIsUniqueFieldDirective = function (field) {
        return field.isUnique && !field.isId;
    };
    Renderer.prototype.shouldCreateRelationNameFieldDirective = function (field) {
        return field.relationName !== null;
    };
    Renderer.prototype.shouldCreateIsIdFieldDirective = function (field) {
        return field.isId;
    };
    Renderer.prototype.shouldCreateSequenceFieldDirective = function (field) {
        return field.associatedSequence !== null;
    };
    Renderer.prototype.shouldCreateCreatedAtFieldDirective = function (field) {
        return field.isCreatedAt;
    };
    Renderer.prototype.shouldCreateUpdatedAtFieldDirective = function (field) {
        return field.isUpdatedAt;
    };
    Renderer.prototype.shouldCreateDatabaseNameFieldDirective = function (field) {
        return field.databaseName !== null;
    };
    Renderer.prototype.shouldCreateScalarListDirective = function (field) {
        return (field.isList &&
            ((typeof field.type === 'string' && scalar_1.isTypeIdentifier(field.type)) ||
                (typeof field.type === 'object' && field.type.isEnum)));
    };
    Renderer.prototype.createReservedFieldDirectives = function (field, fieldDirectives) {
        if (this.shouldCreateDefaultValueFieldDirective(field)) {
            fieldDirectives.push(this.createDefaultValueFieldDirective(field));
        }
        if (this.shouldCreateIsUniqueFieldDirective(field)) {
            fieldDirectives.push(this.createIsUniqueFieldDirective(field));
        }
        if (this.shouldCreateRelationNameFieldDirective(field)) {
            fieldDirectives.push(this.createRelationNameFieldDirective(field));
        }
        if (this.shouldCreateIsIdFieldDirective(field)) {
            fieldDirectives.push(this.createIsIdFieldDirective(field));
        }
        if (this.shouldCreateSequenceFieldDirective(field)) {
            fieldDirectives.push(this.createSequenceFieldDirective(field));
        }
        if (this.shouldCreateCreatedAtFieldDirective(field)) {
            fieldDirectives.push(this.createIsCreatedAtFieldDirective(field));
        }
        if (this.shouldCreateUpdatedAtFieldDirective(field)) {
            fieldDirectives.push(this.createIsUpdatedAtFieldDirctive(field));
        }
        if (this.shouldCreateDatabaseNameFieldDirective(field)) {
            fieldDirectives.push(this.createDatabaseNameFieldDirective(field));
        }
        if (this.shouldCreateScalarListDirective(field)) {
            fieldDirectives.push(this.createScalarListFieldDirective(field));
        }
    };
    Renderer.prototype.renderField = function (field) {
        var fieldDirectives = field.directives.slice();
        this.createReservedFieldDirectives(field, fieldDirectives);
        var renderedDirectives = this.renderDirectives(fieldDirectives);
        var type = this.extractTypeIdentifier(field.type);
        if (field.isList) {
            // Lists are always required in Prisma
            type = "[" + type + "]";
        }
        else if (field.isRequired) {
            type = type + "!";
        }
        var renderedField = renderedDirectives.length > 0
            ? field.name + ": " + type + " " + renderedDirectives
            : field.name + ": " + type;
        var _a = this.renderComments(field, indent), renderedComments = _a.renderedComments, hasError = _a.hasError;
        if (renderedComments.length > 0) {
            if (hasError) {
                return renderedComments + "\n" + indent + comment + " " + renderedField;
            }
            else {
                return renderedComments + "\n" + indent + renderedField;
            }
        }
        else {
            return "" + indent + renderedField;
        }
    };
    Renderer.prototype.renderEnum = function (type) {
        var values = [];
        for (var _i = 0, _a = type.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            if (field.defaultValue !== null) {
                values.push("" + indent + field.name + " = " + this.renderValue(field.type, field.defaultValue));
            }
            else {
                values.push("" + indent + field.name);
            }
        }
        return "enum " + type.name + " {\n" + values.join('\n') + "\n}";
    };
    Renderer.prototype.renderDirectives = function (directives) {
        var _this = this;
        var sortedDirectives = directives.slice().sort(function (a, b) {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        });
        return this.mergeDirectives(sortedDirectives)
            .map(function (x) { return _this.renderDirective(x); })
            .join(" ");
    };
    Renderer.prototype.renderDirective = function (directive) {
        var args = [];
        for (var _i = 0, _a = Object.keys(directive.arguments); _i < _a.length; _i++) {
            var arg = _a[_i];
            // TODO: We don't know the type. Is this a problem?
            args.push(arg + ": " + this.renderValue('', directive.arguments[arg]));
        }
        if (args.length > 0) {
            return "@" + directive.name + "(" + args.join(', ') + ")";
        }
        else {
            return "@" + directive.name;
        }
    };
    /**
     * Merges directives by summarizing arguments of
     * directives with equal name. That saves work when adding directives.
     */
    Renderer.prototype.mergeDirectives = function (directives) {
        // Group by name
        var grouped = directives.reduce(function (r, a) {
            r[a.name] = r[a.name] || [];
            r[a.name].push(a);
            return r;
        }, {});
        var merged = [];
        // Merge with same name
        for (var _i = 0, _a = Object.keys(grouped); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (name_1 === directives_1.DirectiveKeys.index) {
                // Do not summarize index directives
                for (var _b = 0, _c = grouped[name_1]; _b < _c.length; _b++) {
                    var directive = _c[_b];
                    merged.push(directive);
                }
            }
            else {
                merged.push({
                    name: name_1,
                    arguments: grouped[name_1].reduce(function (r, a) {
                        return __assign({}, a.arguments, r.arguments);
                    }, {}),
                });
            }
        }
        return merged;
    };
    Renderer.prototype.extractTypeIdentifier = function (type) {
        if (typeof type === 'string') {
            return type;
        }
        else {
            return type.name;
        }
    };
    Renderer.prototype.renderValue = function (type, value) {
        var strType = this.extractTypeIdentifier(type);
        if (strType === scalar_1.TypeIdentifiers.string ||
            strType === scalar_1.TypeIdentifiers.json ||
            strType === scalar_1.TypeIdentifiers.id ||
            strType === scalar_1.TypeIdentifiers.dateTime) {
            return "\"" + value + "\"";
        }
        else {
            return value;
        }
    };
    Renderer.prototype.sortTypes = function (types) {
        if (!this.sortBeforeRendering) {
            return types;
        }
        else {
            return types.slice().sort(function (a, b) {
                if (a.isEnum === b.isEnum) {
                    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                }
                else if (b.isEnum) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    };
    Renderer.prototype.sortFields = function (fields) {
        var _this = this;
        if (!this.sortBeforeRendering) {
            return fields;
        }
        else {
            return fields.slice().sort(function (a, b) {
                if (a.name.toLowerCase() === b.name.toLowerCase()) {
                    return _this.getTypeName(a.type) > _this.getTypeName(b.type) ? 1 : -1;
                }
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
            });
        }
    };
    Renderer.prototype.getTypeName = function (type) {
        if (typeof type === 'string') {
            return type;
        }
        return type.name;
    };
    return Renderer;
}());
exports.default = Renderer;
//# sourceMappingURL=renderer.js.map