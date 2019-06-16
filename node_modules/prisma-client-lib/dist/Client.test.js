"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var Client_1 = require("./Client");
var graphql_1 = require("graphql");
ava_1.test('unpacking extract payload - nested array', function (t) {
    var typeDefs = "\n    type Query {\n      user(where: UserWhereInput): User\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type User {\n      id: ID!\n      name: String!\n      houses: [House!]!\n    }\n\n    type House {\n      id: ID!\n      name: String!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    // Instruction length and fragment key are used,
    // unless testing for fragment, an empty object is
    // enough to test for now.
    var payload = client.extractPayload({
        user: {
            houses: [
                {
                    id: '1',
                    name: 'My House',
                },
                {
                    id: '2',
                    name: 'Summer House',
                },
            ],
        },
    }, [{}, {}]);
    t.snapshot(JSON.stringify(payload));
});
ava_1.test('unpacking extract payload - nested object', function (t) {
    var typeDefs = "\n    type Query {\n      user(where: UserWhereInput): User\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type User {\n      id: ID!\n      name: String!\n      house: House\n    }\n\n    type House {\n      id: ID!\n      name: String!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    // Instruction length and fragment key are used,
    // unless testing for fragment, an empty object is
    // enough to test for now.
    var payload = client.extractPayload({
        user: {
            house: {
                id: '1',
                name: 'My House',
            },
        },
    }, [{}, {}]);
    t.snapshot(JSON.stringify(payload));
});
ava_1.test('unpacking extract payload - array', function (t) {
    var typeDefs = "\n    type Query {\n      users(where: UserWhereInput): [User]\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type User {\n      id: ID!\n      name: String!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    // Instruction length and fragment key are used,
    // unless testing for fragment, an empty object is
    // enough to test for now.
    var payload = client.extractPayload({ users: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }] }, [{}]);
    t.snapshot(JSON.stringify(payload));
});
ava_1.test('unpacking extract payload - null from server', function (t) {
    var typeDefs = "\n    type Query {\n      user(where: UserWhereUniqueInput!): User\n    }\n\n    input UserWhereUniqueInput {\n      id: ID!\n    }\n\n    type User {\n      id: ID!\n      name: String!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    // Instruction length and fragment key are used,
    // unless testing for fragment, an empty object is
    // enough to test for now.
    var payload = client.extractPayload({ user: null }, [{}]);
    t.snapshot(JSON.stringify(payload));
});
ava_1.test('automatic non-scalar sub selection for a connection without scalars', function (t) {
    var typeDefs = "\n    type Query {\n      usersConnection(where: UserWhereInput): UserConnection\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type UserConnection {\n      pageInfo: PageInfo!\n      edges: [UserEdge]!\n      aggregate: AggregateUser!\n    }\n\n    type PageInfo {\n      hasNextPage: Boolean!\n      hasPreviousPage: Boolean!\n      startCursor: String\n      endCursor: String\n    }\n\n    type UserEdge {\n      node: User!\n      cursor: String!\n    }\n\n    type AggregateUser {\n      count: Int!\n    }\n    \n    type House {\n      id: ID!\n      name: String!\n      user: User!\n    }\n\n    type User {\n      house: House!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.usersConnection();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('automatic non-scalar sub selection for a connection with scalars', function (t) {
    var typeDefs = "\n    type Query {\n      housesConnection(where: HouseWhereInput): HouseConnection\n    }\n\n    input HouseWhereInput {\n      id: ID!\n    }\n\n    type HouseConnection {\n      pageInfo: PageInfo!\n      edges: [HouseEdge]!\n      aggregate: AggregateHouse!\n    }\n\n    type PageInfo {\n      hasNextPage: Boolean!\n      hasPreviousPage: Boolean!\n      startCursor: String\n      endCursor: String\n    }\n\n    type HouseEdge {\n      node: House!\n      cursor: String!\n    }\n\n    type AggregateHouse {\n      count: Int!\n    }\n    \n    type House {\n      id: ID!\n      name: String!\n      user: User!\n    }\n\n    type User {\n      house: House!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.housesConnection();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('automatic non-scalar sub selection for relation', function (t) {
    var typeDefs = "\n    type Query {\n      house(where: HouseWhereInput): House\n    }\n\n    input HouseWhereInput {\n      id: ID!\n    }\n\n    type User {\n      house: House!\n    }\n    \n    type House {\n      id: ID!\n      name: String!\n      user: User!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client
        .house({
        id: 'id',
    })
        .user();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('automatic non-scalar sub selection and enums', function (t) {
    var typeDefs = "\n    type Query {\n      user(where: UserWhereInput): User\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type User {\n      id: ID!\n      name: String!\n      type: UserType!\n    }\n\n    enum UserType {\n      NORMAL\n      ADMIN\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.user().type();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('automatic non-scalar sub selection and scalars', function (t) {
    var typeDefs = "\n    type Query {\n      user(where: UserWhereInput): User\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type User {\n      id: ID!\n      name: String!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.user().name();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('automatic non-scalar sub selection', function (t) {
    var typeDefs = "\n    type Query {\n      users(where: UserWhereInput): [User]\n    }\n\n    input UserWhereInput {\n      id: ID!\n    }\n\n    type User {\n      house: House!\n    }\n    \n    type House {\n      id: ID!\n      name: String!\n    }\n  ";
    var models = [];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.users();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('related type', function (t) {
    var typeDefs = "\n    type Query {\n      user: User\n    }\n\n    type User {\n      id: ID!\n      posts: [Post!]!\n    }\n\n    type Post {\n      content: String!\n    }\n  ";
    var models = [
        {
            embedded: false,
            name: 'User',
        },
        {
            embedded: false,
            name: 'Post',
        },
    ];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.user();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('deep related type', function (t) {
    var typeDefs = "\n    type Query {\n      user: User\n    }\n\n    type User {\n      id: ID!\n      posts: [Post!]!\n    }\n\n    type Post {\n      content: String!\n    }\n  ";
    var models = [
        {
            embedded: false,
            name: 'User',
        },
        {
            embedded: false,
            name: 'Post',
        },
    ];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.user().posts();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('embedded type', function (t) {
    var typeDefs = "\n    type Query {\n      user: User\n    }\n\n    type User {\n      id: ID!\n      posts: [Post!]!\n    }\n\n    type Post {\n      content: String!\n    }\n  ";
    var models = [
        {
            embedded: false,
            name: 'User',
        },
        {
            embedded: true,
            name: 'Post',
        },
    ];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.user();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('nested mbedded type', function (t) {
    var typeDefs = "\n    type Query {\n      user: User\n    }\n\n    type User {\n      id: ID!\n      posts: [Post!]!\n    }\n\n    type Post {\n      content: String!\n      meta: PostMeta\n    }\n\n    type PostMeta {\n      meta: String!\n    }\n  ";
    var models = [
        {
            embedded: false,
            name: 'User',
        },
        {
            embedded: true,
            name: 'Post',
        },
        {
            embedded: true,
            name: 'PostMeta',
        },
    ];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.user();
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('top level args', function (t) {
    var typeDefs = "\n    type Query {\n      post(where: PostInput!): Post\n    }\n\n    input PostInput {\n      id: ID!\n    }\n\n    type Post {\n      id: ID!\n      title: String!\n      content: String!\n    }\n  ";
    var models = [
        {
            embedded: false,
            name: 'Post',
        },
    ];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.post({ id: 'test' });
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
ava_1.test('nested args', function (t) {
    var typeDefs = "\n    type Query {\n      user: User\n      post(where: PostInput!): Post\n    }\n\n    input PostInput {\n      author: AuthorInput!\n    }\n\n    input AuthorInput {\n      firstName: String!\n      lastName: String!\n    }\n\n    type User {\n      id: ID!\n      post: Post\n    }\n\n    type Post {\n      id: ID!\n      title: String!\n      content: String!\n      user: User\n    }\n  ";
    var models = [
        {
            embedded: false,
            name: 'User',
        },
        {
            embedded: false,
            name: 'Post',
        },
    ];
    var endpoint = 'http://localhost:4466';
    var client = new Client_1.Client({
        typeDefs: typeDefs,
        endpoint: endpoint,
        models: models,
    });
    client.post({
        author: {
            firstName: 'Lydia',
            lastName: 'Hallie',
        },
    });
    var document = getQueryDocument(client);
    t.snapshot(graphql_1.print(document));
});
function getQueryDocument(client) {
    return client.getDocumentForInstructions(Object.keys(client._currentInstructions)[0]);
}
//# sourceMappingURL=Client.test.js.map