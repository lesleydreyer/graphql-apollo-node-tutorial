const { gql } = require('apollo-server-express');
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
        tasks(cursor: String, limit: Int): TaskFeed!
        task(id: ID!): Task
    }
    type TaskFeed {
        taskFeed: [Task!]
        pageInfo: PageInfo!
    }
    type PageInfo {
        nextPageCursor: String
        hasNextPage: Boolean
    }
    input createTaskInput {
        name: String!
        completed: Boolean!
    }
    extend type Mutation {
        createTask(input: createTaskInput!): Task
        updateTask(id: ID!, input: updateTaskInput!): Task
        deleteTask(id: ID!): Task
    }
    input updateTaskInput {
        name: String
        completed: Boolean
    }
    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
        createdAt: Date!
        updatedAt: Date!
    }
`;