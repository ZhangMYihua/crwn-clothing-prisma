export declare type TypeIdentifier = 'String' | 'Int' | 'Float' | 'Boolean' | 'Long' | 'DateTime' | 'ID' | 'UUID' | 'Json';
export declare abstract class TypeIdentifiers {
    static string: TypeIdentifier;
    static integer: TypeIdentifier;
    static float: TypeIdentifier;
    static boolean: TypeIdentifier;
    static long: TypeIdentifier;
    static dateTime: TypeIdentifier;
    static id: TypeIdentifier;
    static uuid: TypeIdentifier;
    static json: TypeIdentifier;
}
export declare const TypeIdentifierTable: {
    String: boolean;
    Int: boolean;
    Float: boolean;
    Boolean: boolean;
    Long: boolean;
    DateTime: boolean;
    ID: boolean;
    UUID: boolean;
    Json: boolean;
};
export declare function isTypeIdentifier(str: string): any;
