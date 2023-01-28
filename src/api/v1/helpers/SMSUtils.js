require('dotenv').config();
const request = require('request');

class SMSUtils {
    static send(mobile, msg) {
        const apiKey = process.env.TEXTLOCAL_APIKEY;

        const options = {
            url: `https://api.textlocal.in/send/?apikey=${apiKey}&message=${msg}&sender=NICEPR&numbers=${mobile}`,
            json: true
        };

         request.get(options, (err, res, body) => {
            if (err) {
                throw err
            }
            console.log(`Status: ${res.statusCode}`);
            console.log(body);

            return true;
        });
    }
}

module.exports = SMSUtils;