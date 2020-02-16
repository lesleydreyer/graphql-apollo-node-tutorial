const { skip } = require('graphql-resolvers');

// _ ingore parent and args objects, get email from context object
module.exports.isAuthenticated = (_, __, { email }) => {
    if (!email) {
        throw new Error("Access denied. Please login to continue");
    }
    return skip;// if email is not null go to next resolver
}