const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

// set up env variables (looks for .env in root dir)
dotEnv.config();

const resolvers = require('./resolvers');

// set up express app
const app = express();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

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
const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
        task(id: ID!): Task
        users: [User!]
        user(id: ID!): User
    }
    input createTaskInput {
        name: String!
        completed: Boolean!
        userId: ID!
    }
    type Mutation {
        createTask(input: createTaskInput!): Task
    }
    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }
    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`;


const apolloServer = new ApolloServer({
    typeDefs, // defining schema
    resolvers // how you get the data for particular schema
})

apolloServer.applyMiddleware({ app, path: '/graphql' });

// declare port to use on app.listen method
const PORT = process.env.PORT || 3000;

// for testing - terminal node server.js, then internet localhost://3001
// OR do nodemon to auto pick up changes instead of having to restart server
// then do nodemon or npm run dev
app.use('/', (req, res, next) => {
    res.send({ message: 'Hello yousdf' });
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql EndpoinT: ${apolloServer.graphqlPath}`);
});