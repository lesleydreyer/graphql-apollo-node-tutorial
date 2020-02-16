const jwt = require('jsonwebtoken');

module.exports.verifyUser = async (req) => {
    try {
        req.email = null;
        const bearerHeader = req.headers.authorization;
        if (bearerHeader) {
            // will give 'Bearer longtokeninfo' so split w/whitespace and take the token and skip 'Bearer'
            const token = bearerHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey');
            req.email = payload.email;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}