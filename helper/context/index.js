const jwt = require('jsonwebtoken');
const User = require('../../database/models/user');

module.exports.verifyUser = async (req) => {
    try {
        req.email = null;
        req.loggedInUserId = null;
        const bearerHeader = req.headers.authorization;
        if (bearerHeader) {
            // will give 'Bearer longtokeninfo' so split w/whitespace and take the token and skip 'Bearer'
            const token = bearerHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey');
            req.email = payload.email;
            const user = await User.findOne({ email: payload.email });
            req.loggedInUserId = user.id;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}