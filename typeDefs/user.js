const { gql } = require('apollo-server-express')
// defining schema
// ! means non nullable so will get a gql error if resolves to null results
// String! string variable cannot be null
// [String!]! list cannot be null, and every item in it cannot be null
// [String!] list can be null, but any items in it cannot be null
// user has one or more tasks
// user has 1 to many relationship w/ task
// task gets one user
// task has many to 1 relationship w/ user
// task(id: ID!) expects client to send an id as an argument so it can return a task
module.exports = gql`
    extend type Query {
        user: User
    }
    extend type Mutation {
        signup(input: signupInput): User
        login(input: loginInput): Token
    }
    input loginInput {
        email: String!
        password: String!
    }
    type Token {
        token: String!
    }
    input signupInput {
        name: String!
        email: String!
        password: String!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
        createdAt: Date!
        updatedAt: Date!
    }
`;