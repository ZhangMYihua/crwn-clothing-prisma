"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeIdentifiers = /** @class */ (function () {
    function TypeIdentifiers() {
    }
    TypeIdentifiers.string = 'String';
    TypeIdentifiers.integer = 'Int';
    TypeIdentifiers.float = 'Float';
    TypeIdentifiers.boolean = 'Boolean';
    TypeIdentifiers.long = 'Long';
    TypeIdentifiers.dateTime = 'DateTime';
    TypeIdentifiers.id = 'ID';
    TypeIdentifiers.uuid = 'UUID';
    TypeIdentifiers.json = 'Json';
    return TypeIdentifiers;
}());
exports.TypeIdentifiers = TypeIdentifiers;
exports.TypeIdentifierTable = {
    String: true,
    Int: true,
    Float: true,
    Boolean: true,
    Long: true,
    DateTime: true,
    ID: true,
    UUID: true,
    Json: true,
};
function isTypeIdentifier(str) {
    return exports.TypeIdentifierTable[str] || false;
}
exports.isTypeIdentifier = isTypeIdentifier;
//# sourceMappingURL=scalar.js.map