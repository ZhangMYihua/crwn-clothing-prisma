import { ClientOptions, Model } from './types';
import { OperationTypeNode, GraphQLField, GraphQLSchema } from 'graphql';
import { BatchedGraphQLClient } from 'http-link-dataloader';
import { SubscriptionClient } from 'subscriptions-transport-ws';
export interface InstructionsMap {
    [key: string]: Array<Instruction>;
}
export interface InstructionPromiseMap {
    [key: string]: Promise<any>;
}
export interface Instruction {
    fieldName: string;
    args?: any;
    field?: GraphQLField<any, any>;
    typeName: string;
    fragment?: string;
}
export declare class Client {
    /**
     * These properties are exposed through the Client API
     */
    query: any;
    mutation: any;
    $subscribe: any;
    $graphql: any;
    $exists: any;
    /**
     * These are internal properties used by the Client implementation
     */
    _types: any;
    _debug: any;
    _endpoint: string;
    _secret?: string;
    _client: BatchedGraphQLClient;
    _subscriptionClient: SubscriptionClient;
    _schema: GraphQLSchema;
    _token: string;
    _currentInstructions: InstructionsMap;
    _models: Model[];
    _promises: InstructionPromiseMap;
    constructor({ typeDefs, endpoint, secret, debug, models }: ClientOptions);
    getOperation(instructions: any): any;
    getDocumentForInstructions(id: number): {
        kind: "Document";
        definitions: {
            kind: "OperationDefinition";
            operation: OperationTypeNode;
            directives: never[];
            variableDefinitions: any;
            selectionSet: {
                kind: "SelectionSet";
                selections: any[];
            };
        }[];
    };
    processInstructionsOnce: (id: number) => Promise<any>;
    processInstructions: (id: number) => Promise<any>;
    mapSubscriptionPayload(result: any, instructions: any): AsyncIterator<any>;
    extractPayload(result: any, instructions: any): any;
    execute(operation: any, document: any, variables: any): Promise<{}>;
    then: (id: any, resolve: any, reject: any) => Promise<any>;
    catch: (id: any, reject: any) => Promise<any>;
    _releaseMemory(id: any): void;
    generateSelections(instructions: any): {
        ast: any;
        variables: {};
    };
    isScalar(field: any): boolean;
    isEmbedded(field: any): boolean | undefined;
    isConnectionTypeName(typeName: string): boolean;
    getFieldAst({ field, fieldName, isRelayConnection, isSubscription, args }: {
        field: any;
        fieldName: any;
        isRelayConnection: any;
        isSubscription: any;
        args: any;
    }): any;
    buildMethods(): void;
    getTypes(): any;
    getTypeName(type: any): string;
    getDeepType(type: any): any;
    private buildGraphQL;
    private buildExists;
}
