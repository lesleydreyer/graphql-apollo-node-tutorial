const uuid = require('uuid');
const { combineResolvers } = require('graphql-resolvers');

const { users, tasks } = require('../constants');
const Task = require('../database/models/task');
const User = require('../database/models/user');
const { isAuthenticated, isTaskOwner } = require('./middleware');

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated, async (_, __, { loggedInUserId }) => {
            try {
                const tasks = await Task.find({ user: loggedInUserId });//other option is .populate(path:'user') will be discussed in data loaders section
                return tasks;
            } catch (err) {
                console.log(err);
                throw err;
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
            try {
                const task = await Task.findById(id);
                return task;
            } catch (err) {
                console.log(err);
                throw err;
            }
        }),
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
        }),
        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id, input }) => {
            try {
                const task = await Task.findByIdAndUpdate(id, { ...input }, { new: true });//new updates so you don't have to refresh to update
                return task;
            } catch (err) {
                console.log(err);
                throw err;
            }
        }),
        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }, { loggedInUserId }) => {
            try {
                const task = await Task.findByIdAndDelete(id);
                await User.updateOne({ _id: loggedInUserId }, { $pull: { tasks: task.id } });
                return task;
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
        user: async (parent) => { // destructuring userId from parent.userId
            try {
                const user = User.findById(parent.user);
                return user;
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    }
}