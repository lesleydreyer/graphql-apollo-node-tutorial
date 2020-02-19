const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const Dataloader = require('dataloader');

// set up env variables (looks for .env in root dir)
dotEnv.config();

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/util');
const { verifyUser } = require('./helper/context');
const loaders = require('./loaders');

// set up express app
const app = express();

// db connectivity
connection();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
    typeDefs, // defining schema
    resolvers, // how you get the data for particular schema
    context: async ({ req, connection }) => { //can also define as obj instead of function but then would run the same rand each time
        const contextObj = {};
        if (req) {
            await verifyUser(req);
            contextObj.email = req.email;
            loggedInUserId = req.loggedInUserId;
        }
        contextObj.loaders = {
            user: new Dataloader(keys => loaders.user.batchUsers(keys))
        }
        return contextObj;
    },
    formatError: (error) => {
        return {
            message: error.message
        };
    }
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

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql EndpoinT: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);