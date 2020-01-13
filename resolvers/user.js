const uuid = require('uuid');
const { users, tasks } = require('../constants');

module.exports = {
    Query: {
        tasks: () => {
            // console.log(tasks);
            return tasks;
        },
        task: (_, { id }) => { // _ means not using the first arg of the parent 
            // console.log(typeof (id)); // serialized as a string even if you send number in gql
            return tasks.find(task => task.id === id);
        }, // id destructured from args
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
    }
}