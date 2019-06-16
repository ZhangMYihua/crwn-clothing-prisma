"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var _1 = require(".");
function isScalar(field) {
    var fieldType = _1.getDeepType(field.type);
    return (fieldType instanceof graphql_1.GraphQLScalarType ||
        fieldType instanceof graphql_1.GraphQLEnumType);
}
function connectionNodeHasScalars(_a) {
    var type = _a.type;
    var edgesField = Object.values(type.getFields()).filter(function (subField) {
        return subField.name === 'edges';
    });
    if (edgesField.length === 0) {
        return false;
    }
    var edgesFieldType = _1.getDeepType(edgesField[0].type);
    var nodeField = Object.values(edgesFieldType.getFields()).filter(function (subField) {
        return subField.name === 'node';
    });
    if (nodeField.length === 0) {
        return false;
    }
    var nodeFieldType = _1.getDeepType(nodeField[0].type);
    var nodeFieldScalars = Object.values(nodeFieldType.getFields()).filter(function (subField) {
        return isScalar(subField);
    });
    return nodeFieldScalars.length > 0;
}
exports.connectionNodeHasScalars = connectionNodeHasScalars;
//# sourceMappingURL=connectionNodeHasScalars.js.map