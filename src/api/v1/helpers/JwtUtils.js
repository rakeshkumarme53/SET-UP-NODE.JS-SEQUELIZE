require('dotenv').config();
const jwt = require('jsonwebtoken');
const ApiError = require('../middlewares/apiError');

const secert = process.env.ACCESS_TOKEN_SECRET;
class JwtUtils {
    static getToken(user) {
        const days = 30;
        const token = jwt.sign(user, String(secert), {
            algorithm: 'HS256',
            expiresIn: (60 * 60) * (24 * days)
        })

        return token;
    }

    static verifyToken(token) {
        var result = null;
        jwt.verify(token, secert, {
            algorithms: ['HS256']
        }, function (err, user) {
            if (err)
                throw ApiError.notAuthorized();
            result = user;
        })
        return result;
    }

    static destroyToken(token) {
        jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
            if (err)
                return false;
        });

        return true;
    }
}

module.exports = JwtUtils;