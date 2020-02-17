const uuid = require('uuid');
const { combineResolvers } = require('graphql-resolvers');

const { users, tasks } = require('../constants');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const { isAuthenticated } = require('./middleware');

module.exports = {
    Query: {
        tasks: () => {
            return tasks;
        },
        task: (_, { id }) => { // _ means not using the first arg of the parent 
            // console.log(typeof (id)); // serialized as a string even if you send number in gql
            return tasks.find(task => task.id === id);
        }, // id destructured from args
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (_, { input }, { email }) => { // email context obj
            try {
                console.log('user===')
                const user = await User.findOne({ email });
                console.log('user===', user)
                const task = new Task({ ...input, user: user.id })
                console.log('task===', task)
                const result = await task.save();
                user.tasks.push(result.id);
                await user.save();
                return result;
            } catch (err) {
                console.log(err);
                throw err;
            }
        })
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
    }
}