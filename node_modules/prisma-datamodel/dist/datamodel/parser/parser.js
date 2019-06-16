"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../model");
var graphql_1 = require("graphql");
var directives_1 = require("../directives");
var gqlAssert_1 = require("../../util/gqlAssert");
// TODO(ejoebstl): It would be good to have this Parser fill the directive field for types and models as well.
// TODO(ejoebstl): Directive parsing should be cleaned up: Parse all directives first and then extract build-in directives.
/**
 * Parses a datamodel given as DSL
 * to an internal representation, convenient for
 * working with.
 */
var DefaultParser = /** @class */ (function () {
    function DefaultParser() {
    }
    /**
     * Shorthand to parse the datamodel, given an SDL string.
     * @param schemaString The datamodel as SDL string.
     * @returns A list of types found in the datamodel.
     */
    DefaultParser.prototype.parseFromSchemaString = function (schemaString) {
        var schema = graphql_1.parse(schemaString);
        return this.parseFromSchema(schema);
    };
    /**
     * Parses the datamodel from a graphql-js schema.
     * @param schema The graphql-js schema, representing the datamodel.
     * @returns A list of types found in the datamodel.
     */
    DefaultParser.prototype.parseFromSchema = function (schema) {
        var types = this.parseTypes(schema).slice();
        this.resolveRelations(types);
        // That's it.
        // We could check our model here, if we wanted to.
        // Possible checks:
        // * Check if we still use strings for identifying types for non-scalar types
        // * Check if all double-sided relations are connected correctly
        // * Check for duplicate type names
        // * Check for conflicting relations
        return {
            types: types,
        };
    };
    DefaultParser.prototype.parseIdType = function (field) {
        var idDirective = this.getDirectiveByName(field, directives_1.DirectiveKeys.isId);
        var idType = this.getDirectiveArgument(idDirective, 'strategy');
        if (!idDirective) {
            return null;
        }
        if (idType) {
            switch (idType) {
                case model_1.IdStrategy.Auto:
                    return model_1.IdStrategy.Auto;
                case model_1.IdStrategy.None:
                    return model_1.IdStrategy.None;
                case model_1.IdStrategy.Sequence:
                    return model_1.IdStrategy.Sequence;
                default:
                    gqlAssert_1.default.raise("Found invalid ID strategy while parsing: " + idType);
                    return null;
            }
        }
        else {
            return model_1.IdStrategy.Auto;
        }
    };
    DefaultParser.prototype.parseSequence = function (field) {
        var sequenceDirective = this.getDirectiveByName(field, directives_1.DirectiveKeys.sequence);
        if (sequenceDirective === null) {
            return null;
        }
        var name = this.getDirectiveArgument(sequenceDirective, 'name');
        var initialValue = this.getDirectiveArgument(sequenceDirective, 'initialValue');
        var allocationSize = this.getDirectiveArgument(sequenceDirective, 'allocationSize');
        gqlAssert_1.default.raiseIf(name === null, 'Name is required in sequence directive.');
        gqlAssert_1.default.raiseIf(initialValue === null, 'initialValue is required in sequence directive.');
        gqlAssert_1.default.raiseIf(allocationSize === null, 'allocationSize is required in sequence directive.');
        return {
            name: name,
            initialValue: parseInt(initialValue, 10),
            allocationSize: parseInt(allocationSize, 10),
        };
    };
    /**
     * Checks if the given field is reserved and read-only.
     * @param field
     */
    DefaultParser.prototype.isReservedReadOnlyField = function (field) {
        return (this.isIdField(field) ||
            this.isUpdatedAtField(field) ||
            this.isCreatedAtField(field));
    };
    /**
     * Finds a directives on a field or type by name.
     * @param fieldOrType
     * @param name
     */
    DefaultParser.prototype.getDirectivesByName = function (fieldOrType, name) {
        return fieldOrType.directives.filter(function (x) { return x.name.value === name; });
    };
    /**
     * Finds a directive on a field or type by name and returns the first occurance.
     * @param fieldOrType
     * @param name
     */
    DefaultParser.prototype.getDirectiveByName = function (fieldOrType, name) {
        var directives = this.getDirectivesByName(fieldOrType, name);
        return directives.length > 0 ? directives[0] : null;
    };
    /**
     * Checks if a directive on a given field or type ecists
     * @param fieldOrType
     * @param name
     */
    DefaultParser.prototype.hasDirective = function (fieldOrType, name) {
        return this.getDirectiveByName(fieldOrType, name) != null;
    };
    /**
     * Checks if the given field is unique.
     * @param field
     */
    DefaultParser.prototype.isUniqe = function (field) {
        return this.hasDirective(field, directives_1.DirectiveKeys.isUnique);
    };
    /**
     * Gets a fields default value. If no default
     * value is given, returns null.
     * @param field
     */
    DefaultParser.prototype.getDefaultValue = function (field) {
        var directive = this.getDirectiveByName(field, directives_1.DirectiveKeys.default);
        var args = directive === null
            ? []
            : directive.arguments.filter(function (x) { return x.name.value === 'value'; });
        return args.length !== 0 ? args[0].value.value : null;
    };
    /**
     * Gets a fields relation name. If no relation
     * exists, returns null.
     * @param field
     */
    DefaultParser.prototype.getRelationName = function (field) {
        var directive = this.getDirectiveByName(field, directives_1.DirectiveKeys.relation);
        return this.getDirectiveArgument(directive, 'name');
    };
    /**
     * Gets a fields or types relation name. If no directive
     * exists, returns null.
     * @param field
     */
    DefaultParser.prototype.getDatabaseName = function (fieldOrType) {
        var directive = this.getDirectiveByName(fieldOrType, directives_1.DirectiveKeys.db);
        return this.getDirectiveArgument(directive, 'name');
    };
    /**
     * Gets a fields relation name. If no directive
     * exists, returns null.
     * @param field
     */
    DefaultParser.prototype.getDatabaseFieldName = function (field) {
        return this.getDatabaseName(field);
    };
    /**
     * Gets a types relation name. If no directive
     * exists, returns null.
     * @param field
     */
    DefaultParser.prototype.getDatabaseTypeName = function (type) {
        return this.getDatabaseName(type);
    };
    /**
     * Returns the value of a directive argument.
     */
    DefaultParser.prototype.getDirectiveArgument = function (directive, name) {
        if (directive && directive.arguments) {
            var nameArgument = directive.arguments.find(function (a) { return a.name.value === name; });
            if (nameArgument) {
                // Fallback from single value to list value.
                return nameArgument.value.value !== undefined
                    ? nameArgument.value.value
                    : nameArgument.value.values;
            }
        }
        return null;
    };
    /**
     * Returns the value of an object field.
     */
    DefaultParser.prototype.getObjectFieldValue = function (obj, name) {
        if (obj && obj.fields) {
            var nameArgument = obj.fields.find(function (a) { return a.name.value === name; });
            if (nameArgument) {
                // Fallback from single value to list value.
                return nameArgument.value.value !== undefined
                    ? nameArgument.value.value
                    : nameArgument.value.values;
            }
        }
        return null;
    };
    /**
     * Parses a single index directive input object, resolves all field references.
     */
    DefaultParser.prototype.parseIndex = function (indexObject, fields) {
        var fieldsArgument = this.getObjectFieldValue(indexObject, 'fields');
        var nameArgument = this.getObjectFieldValue(indexObject, 'name');
        var uniqueArgument = this.getObjectFieldValue(indexObject, 'unique');
        var indexFields = fieldsArgument.map(function (fieldArgument) {
            var field = fields.filter(function (f) { return f.name === fieldArgument.value; })[0];
            if (field === undefined) {
                gqlAssert_1.default.raise("Error during index association. Field " + fieldArgument.value + " is missing on index " + nameArgument + ".");
            }
            return field;
        });
        return {
            fields: indexFields,
            name: nameArgument,
            // Unique default is true.
            unique: uniqueArgument === null ? true : uniqueArgument,
        };
    };
    /**
     * Parses all index directives on the given type.
     */
    DefaultParser.prototype.parseIndices = function (type, fields) {
        var _this = this;
        var indexDirective = this.getDirectiveByName(type, directives_1.DirectiveKeys.indexes);
        if (indexDirective === null) {
            return [];
        }
        var subIndexes = this.getDirectiveArgument(indexDirective, 'value');
        return subIndexes.map(function (directive) { return _this.parseIndex(directive, fields); });
    };
    /**
     * Gets all reserved directive keys.
     */
    DefaultParser.prototype.getReservedDirectiveNames = function () {
        return [
            directives_1.DirectiveKeys.default,
            directives_1.DirectiveKeys.isEmbedded,
            directives_1.DirectiveKeys.db,
            directives_1.DirectiveKeys.isCreatedAt,
            directives_1.DirectiveKeys.isUpdatedAt,
            directives_1.DirectiveKeys.isUnique,
            directives_1.DirectiveKeys.isId,
            directives_1.DirectiveKeys.index,
            directives_1.DirectiveKeys.relation,
            directives_1.DirectiveKeys.sequence,
        ];
    };
    /**
     * Parses all directives that are not reserved (build-in)
     * from a field or type
     */
    DefaultParser.prototype.parseDirectives = function (fieldOrType) {
        var res = [];
        var reservedDirectiveNames = this.getReservedDirectiveNames();
        for (var _i = 0, _a = fieldOrType.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            if (reservedDirectiveNames.includes(directive.name.value)) {
                continue;
            }
            var resArgs = {};
            for (var _b = 0, _c = directive.arguments; _b < _c.length; _b++) {
                var args = _c[_b];
                resArgs[args.name.value] = args.value.value;
            }
            res.push({
                name: directive.name.value,
                arguments: resArgs,
            });
        }
        if (res.length === 0) {
            return [];
        }
        else {
            return res;
        }
    };
    /**
     * Parses a model field, respects all
     * known directives.
     * @param field
     */
    DefaultParser.prototype.parseField = function (field) {
        var name = field.name.value;
        var kind = this.parseKind(field.type, null);
        var fieldType = this.parseType(field.type);
        var isId = this.isIdField(field);
        var isUnique = isId || this.isUniqe(field);
        var isReadOnly = this.isReservedReadOnlyField(field);
        var isUpdatedAt = this.isUpdatedAtField(field);
        var isCreatedAt = this.isCreatedAtField(field);
        var defaultValue = this.getDefaultValue(field);
        var relationName = this.getRelationName(field);
        var databaseName = this.getDatabaseFieldName(field);
        var directives = this.parseDirectives(field);
        var associatedSequence = this.parseSequence(field);
        var idStrategy = this.parseIdType(field);
        return {
            name: name,
            type: fieldType,
            relationName: relationName,
            defaultValue: defaultValue,
            isUnique: isUnique,
            isList: kind === 'ListType',
            isRequired: kind === 'NonNullType',
            relatedField: null,
            isId: isId,
            idStrategy: idStrategy,
            associatedSequence: associatedSequence,
            isUpdatedAt: isUpdatedAt,
            isCreatedAt: isCreatedAt,
            isReadOnly: isReadOnly,
            databaseName: databaseName,
            directives: directives,
            comments: [],
        };
    };
    /**
     * Checks if the given type is marked as link table.
     * @param type
     */
    DefaultParser.prototype.isRelationTable = function (type) {
        return this.hasDirective(type, directives_1.DirectiveKeys.relationTable);
    };
    /**
     * Parases an object type.
     * @param type
     */
    DefaultParser.prototype.parseObjectType = function (type) {
        var fields = [];
        for (var _i = 0, _a = type.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            if (field.kind === 'FieldDefinition') {
                // Check for type, kind, name and directives.
                fields.push(this.parseField(field));
            }
        }
        var databaseName = this.getDatabaseTypeName(type);
        var isEmbedded = this.isEmbedded(type);
        var isRelationTable = this.isRelationTable(type);
        var directives = this.parseDirectives(type);
        var indices = this.parseIndices(type, fields);
        return {
            name: type.name.value,
            fields: fields,
            isEnum: false,
            isRelationTable: isRelationTable,
            isEmbedded: isEmbedded,
            databaseName: databaseName,
            directives: directives,
            indices: indices,
            comments: [],
        };
    };
    /**
     * Parses all types in the schema.
     * @param schema
     */
    DefaultParser.prototype.parseTypes = function (schema) {
        var types = [];
        for (var _i = 0, _a = schema.definitions; _i < _a.length; _i++) {
            var type = _a[_i];
            if (type.kind === 'ObjectTypeDefinition') {
                types.push(this.parseObjectType(type));
            }
            else if (type.kind === 'EnumTypeDefinition') {
                types.push(this.parseEnumType(type));
            }
        }
        return types;
    };
    /**
     * Parses an enum type.
     * @param schema
     */
    DefaultParser.prototype.parseEnumType = function (type) {
        if (type.kind === 'EnumTypeDefinition') {
            var values = [];
            for (var _i = 0, _a = type.values; _i < _a.length; _i++) {
                var value = _a[_i];
                if (value.kind === 'EnumValueDefinition') {
                    var name_1 = value.name.value;
                    // All props except name are ignored for enum defs.
                    values.push(new model_1.GQLScalarField(name_1, 'String', false));
                }
            }
            var directives = this.parseDirectives(type);
            return {
                name: type.name.value,
                fields: values,
                isEnum: true,
                isRelationTable: false,
                isEmbedded: false,
                directives: directives,
                comments: [],
                databaseName: null,
                indices: [],
            };
        }
        else {
            throw gqlAssert_1.default.raise('Expected an enum type.');
        }
    };
    /**
     * Resolves and connects all realtion fields found
     * in the given type list.
     * @param types
     */
    DefaultParser.prototype.resolveRelations = function (types) {
        // Find all types that we know,
        // and assign a proper type object instead
        // of the string.
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var typeA = types_1[_i];
            for (var _a = 0, _b = typeA.fields; _a < _b.length; _a++) {
                var fieldA = _b[_a];
                for (var _c = 0, types_2 = types; _c < types_2.length; _c++) {
                    var typeB = types_2[_c];
                    // At this stage, every type is a string
                    if (fieldA.type === typeB.name) {
                        fieldA.type = typeB;
                    }
                }
            }
        }
        // Connect all relations that are named.
        for (var _d = 0, types_3 = types; _d < types_3.length; _d++) {
            var typeA = types_3[_d];
            for (var _e = 0, _f = typeA.fields; _e < _f.length; _e++) {
                var fieldA = _f[_e];
                if (typeof fieldA.type === 'string') {
                    continue; // Assume scalar
                }
                if (fieldA.relationName !== null && fieldA.relatedField === null) {
                    for (var _g = 0, _h = fieldA.type.fields; _g < _h.length; _g++) {
                        var fieldB = _h[_g];
                        if (fieldB.relationName === fieldA.relationName) {
                            if (fieldB.type !== typeA) {
                                gqlAssert_1.default.raise("Relation type mismatch for relation " + fieldA.relationName);
                            }
                            fieldA.relatedField = fieldB;
                            fieldB.relatedField = fieldA;
                            break;
                        }
                    }
                }
            }
        }
        // Connect  obvious relations which are lacking the relatioName directive.
        // We explicitely DO NOT ignore fields with a given relationName, in accordance
        // to the prisma implementation.
        for (var _j = 0, types_4 = types; _j < types_4.length; _j++) {
            var typeA = types_4[_j];
            searchThroughAFields: for (var _k = 0, _l = typeA.fields; _k < _l.length; _k++) {
                var fieldA = _l[_k];
                if (typeof fieldA.type === 'string') {
                    continue; // Assume scalar.
                }
                if (fieldA.relatedField !== null) {
                    continue; // Nothing to do, already connected
                }
                for (var _m = 0, _o = typeA.fields; _m < _o.length; _m++) {
                    var fieldA2 = _o[_m];
                    if (fieldA2 !== fieldA && fieldA2.type === fieldA.type) {
                        // Skip, A has more than one fields of this relation type.
                        continue searchThroughAFields;
                    }
                }
                var relationPairs = [];
                // Look for the opposite field by type.
                for (var _p = 0, _q = fieldA.type.fields; _p < _q.length; _p++) {
                    var fieldB = _q[_p];
                    if (fieldB.type === typeA) {
                        if (fieldB !== fieldA) {
                            // Don't connect self-referencing fields
                            relationPairs.push({ a: fieldA, b: fieldB });
                        }
                    }
                }
                // Create relation iff we have found a single pair
                if (relationPairs.length === 1) {
                    var _r = relationPairs[0], a = _r.a, b = _r.b;
                    a.relatedField = b;
                    b.relatedField = a;
                }
            }
        }
    };
    /**
     * Traverses an AST branch and finds the next type.
     * This will skip modifiers like NonNullType or ListType.
     * @param type
     */
    DefaultParser.prototype.parseType = function (type) {
        if (type.type) {
            return this.parseType(type.type);
        }
        else if (type.kind !== 'NamedType') {
            throw new Error();
        }
        return type.name.value;
    };
    /**
     * Traverses an AST branch and returns the modifier
     * of the type: Either ListType or NonNullType.
     * @param type
     * @param acc
     */
    DefaultParser.prototype.parseKind = function (type, acc) {
        if (!acc) {
            acc = type.kind;
        }
        // If we find list, we always take list
        if (type.kind === 'ListType') {
            return type.kind;
        }
        // Non-null has higher prio than nullable
        if (type.kind === 'NonNullType') {
            acc = type.kind;
        }
        // When we reach the end, return whatever we have stored.
        if (type.type) {
            return this.parseKind(type.type, acc);
        }
        else {
            return acc;
        }
    };
    return DefaultParser;
}());
exports.default = DefaultParser;
//# sourceMappingURL=parser.js.map