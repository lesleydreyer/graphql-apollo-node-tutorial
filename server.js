const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const uuid = require('uuid');

// set up env variables (looks for .env in root dir)
dotEnv.config();

const { tasks, users } = require('./constants')

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

// how you get the data for particular schema
// resolver args 
// 1) root/parent - result returned from the resolver on parent field
// 2) args - an obj w args passed into the field
// 3) context - shared by all resolvers, contain per-request state (auth, loaders, etc)
// 4) resolverInfo - contains query field-specific info like field name, path to field from root, etc 
const resolvers = {
    Query: {
        greetings: () => null,
        tasks: () => {
            // console.log(tasks);
            return tasks;
        },
        task: (_, { id }) => { // _ means not using the first arg of the parent 
            // console.log(typeof (id)); // serialized as a string even if you send number in gql
            return tasks.find(task => task.id === id);
        }, // id destructured from args
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id)
    },
    Mutation: {
        createTask: (_, { input }) => {
            const task = { ...input, id: uuid.v4() };
            tasks.push(task);
            return task;
        }
    },
    Task: {
        // FIELD LEVEL RESOLVER - takes higher priority than query resolvers
        // but if you don't request the user on gql playground you'll just get regular info
        // name: () => "test-task" // this field resolver would change name of task in gql playground
        user: ({ userId }) => { // destructuring userId from parent.userId
            return users.find(user => {
                // console.log('ids', user.id, userId);
                return user.id === userId
            })
        }
    },
    User: {
        tasks: ({ id }) => tasks.filter(task => task.userId === id)// expected iterable but not find one so change from find to filter because find returns an obj and filter returns array of obj
    }
}

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