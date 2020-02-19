const User = require('../database/models/user');

module.exports.batchUsers = async (userIds) => {
    console.log('keys===', userIds);
    const users = await User.find({ _id: { $in: userIds } });
    // doesn't necessarily return in correct order so map to make it [1, 2, 3] => [user2, user1, user3]
    return userIds.map(userId => users.find(user => user.id === userId));
}