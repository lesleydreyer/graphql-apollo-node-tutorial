// GRAPHQL SCHEMA TYPES

// SCALAR TYPES 
// Int, Float, String, Boolean, ID

// OBJECT TYPES
// type User {
//     id: ID!
//     email: String!
//     age: BigIntegerisAdmin: Boolean!
//     address: Address
// }
// type Address {
//     street: String,
//     city: String,
//     state: String,
//     country: String
// }

// QUERY TYPES (root level gql types) 
// for fetching data and compares to the GET verb in REST based APIs (but every API req in graphql is http POST type)
// type Query {
//     users: [User]
//     task(id: ID!): Task
// }

// MUTATION TYPE (root level gql types)
// Mutations are operations sent to server to create, update, or 
// delete data. These are comparable to the PUT, PATCH, and DELETE 
// verbs on REST-based APIs
// type Mutation {
//     signup(email: String!, password: String!): User
//     addTask(name: String!, completed: Boolean!): Text
// }

// SUBSCRIPTION TYPE
// Graphql operations that watch events emitted from Server
// type Subscription {
//     userCreated: User
// }

// query executed simultaneously
// mutation are executed sequentially

// INPUT TYPE
// special type in gql which allows an object to be passed as an arg to both queries and mutations
// can share among multiple mutations and queries, but be careful because in the below example you probably don't want to share the id on the update task
// without input type
// type Mutation {
//     createTask(name: String!, completed: Boolean!, userId: ID!): Task
// }
// with input type
// type Mutation {
//     createTask(task: TaskInput): task
//     updateTask(task: TaskInput): task
// }
// input taskInput {
//     name: String!
//     comleted: Boolean!
//     userId: ID!
// }

// CUSTOM SCALAR TYPE
// scalar MyCustomScalar

// const resolverFUnctions = [
//     MyCustomScalar: myCustomScalar
// ];

// INTERFACE TYPE
// Interfaces are powerful way to build and use gql schemas through the use of abstract types. Abstract types can't be used directly in schema, but ccan be used as building blocks for creating explicit types
// interface Book {
//     title: String
//     author: Author
// }
// type Textbook implements Book {
//     title: String
//     author: Author
//     classes: [Class]
// }

// UNION TYPE
// Union type indicates that a field can return more than one object type, but doesn't define specific fields itself. Unions are useful for returning disjoint data types from a single field.
// union Result = Book | AuthenticatorAssertionResponse
// type Book {
//     title: String
// }
// type Author {
//     name: String
// }
// type Query {
//     search: [Result]
// }

// ENUM TYPE
// Enum is similar to scalar type but ccan only be one of several values defined in schema
// enum AllowedColor {
//     RED
//     GREEN
//     BLUE
// }
// type Query {
//     favoriteColor: AlowedColor # As a return value
//     avatar(borderColor: AllowedColor): String # As an argument
// }