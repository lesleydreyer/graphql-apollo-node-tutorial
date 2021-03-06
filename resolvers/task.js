const { combineResolvers } = require('graphql-resolvers');

const Task = require('../database/models/task');
const User = require('../database/models/user');
const { isAuthenticated, isTaskOwner } = require('./middleware');
const { stringToBase64, base64ToString } = require('../helper');

module.exports = {
    Query: {
        // offset limit pagination w skip & limit - cons are duplicate records and performance
        tasks: combineResolvers(isAuthenticated, async (_, { cursor, limit = 10 }, { loggedInUserId }) => {
            try {
                const query = { user: loggedInUserId };
                if (cursor) {
                    query['_id'] = {// $lt is less than
                        '$lt': base64ToString(cursor)
                    }
                }
                let tasks = await Task.find(query).sort({ _id: -1 }).limit(limit + 1);//other option is .populate(path:'user') will be discussed in data loaders section
                let hasNextPage = tasks.length > limit;
                tasks = hasNextPage ? tasks.slice(0, 1) : tasks;
                return {
                    taskFeed: tasks,
                    pageInfo: {
                        nextPageCursor: hasNextPage ? stringToBase64(tasks[tasks.length - 1].id) : null,
                        hasNextPage
                    }
                };
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
        user: async (parent, _, { loaders }) => { // destructuring userId from parent.userId
            try {
                // const user = User.findById(parent.user);
                const user = await loaders.user.load(parent.user.toString());
                return user;
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    }
}