const { users, tasks } = require('../constants');

module.exports = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id)
    },
    Mutation: {
    },
    User: {
        tasks: ({ id }) => tasks.filter(task => task.userId === id)// expected iterable but not find one so change from find to filter because find returns an obj and filter returns array of obj
    }
}

// how you get the data for particular schema
// resolver args 
// 1) root/parent - result returned from the resolver on parent field
// 2) args - an obj w args passed into the field
// 3) context - shared by all resolvers, contain per-request state (auth, loaders, etc)
// 4) resolverInfo - contains query field-specific info like field name, path to field from root, etc 