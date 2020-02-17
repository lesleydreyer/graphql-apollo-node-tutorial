const { skip } = require('graphql-resolvers');
const Task = require('../../database/models/task');
const { isValideObjectId } = require('../../database/util');

// _ ingore parent and args objects, get email from context object
module.exports.isAuthenticated = (_, __, { email }) => {
    if (!email) {
        throw new Error("Access denied. Please login to continue");
    }
    return skip;// if email is not null go to next resolver
}

module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
    try {
        if (!isValideObjectId(id)) {
            throw new Error('Invalid task id');
        }
        const task = await Task.findById(id);
        if (!task) {
            throw new Error('Task not found');
        } else if (task.user.toString() !== loggedInUserId) {
            throw new Error('Not authorized as task owner');
        }
        return skip;
    } catch (err) {
        console.log(err);
        throw err;
    }
}