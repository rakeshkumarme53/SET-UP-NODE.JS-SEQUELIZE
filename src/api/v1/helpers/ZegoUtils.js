const crypto = require('crypto');
const ApiError = require('../middlewares/apiError');
//const ZegoExpressEngine = require('zego-express-engine-webrtc').ZegoExpressEngine;

require('dotenv').config();

const ZegoAppId = process.env.ZEGO_APP_ID;
const ZegoAppSecret = process.env.ZEGO_APP_SECRET;

class ZegoUtils {
    async getToken(userId) {
        if (!ZegoAppId)
            throw ApiError.badRequest('App id missing or invalid');

        if (!ZegoAppSecret)
            throw ApiError.badRequest('App Secret missing or invalid');

        if (!userId)
            throw ApiError.badRequest('User id is required');

        const payloadObject = {
            room_id: 'room1', 
            privilege: {
                1: 1,   // loginRoom: 1 pass , 0 not pass
                2: 0    // publishStream: 1 pass , 0 not pass
            },
            stream_id_list: null
        }; // 
        const payload = JSON.stringify(payloadObject);

        const effectiveTimeInSecond = 3600;

        const createTime = Math.floor(new Date().getTime() / 1000);
        const tokenInfo = {
            app_id: Number(ZegoAppId),
            user_id: "fasttrack-user-" + userId,
            nonce: this.makeNonce(),
            ctime: createTime,
            expire: createTime + effectiveTimeInSecond,
            payload: payload || ''
        };

        const plaintText = JSON.stringify(tokenInfo);

        const iv = this.makeRandomIv();

        const encryptBuf = this.aesEncrypt(plaintText, ZegoAppSecret, iv);

        var _a = [new Uint8Array(8), new Uint8Array(2), new Uint8Array(2)],
            b1 = _a[0],
            b2 = _a[1],
            b3 = _a[2];

        new DataView(b1.buffer).setBigInt64(0, BigInt(tokenInfo.expire), false);
        new DataView(b2.buffer).setUint16(0, iv.length, false);
        new DataView(b3.buffer).setUint16(0, encryptBuf.byteLength, false);

        const buf = Buffer.concat([
            Buffer.from(b1),
            Buffer.from(b2),
            Buffer.from(iv),
            Buffer.from(b3),
            Buffer.from(encryptBuf),
        ]);
        const dv = new DataView(Uint8Array.from(buf).buffer);
        // console.log('-----------------');
        // console.log('-------getBigInt64----------', dv.getBigInt64(0));
        // console.log('-----------------');
        // console.log('-------getUint16----------', dv.getUint16(8));
        // console.log('-----------------');
        const result = {
            token : '04' + Buffer.from(dv.buffer).toString('base64')
        };
        return result;
    }

    makeNonce() {
        return this.randomNumber(-2147483648, 2147483647);
    }

    randomNumber(a, b) {
        return Math.ceil((a + (b - a)) * Math.random());
    }

    makeRandomIv() {
        var str = '0123456789abcdefghijklmnopqrstuvwxyz';
        var result = [];
        for (var i = 0; i < 16; i++) {
            var r = Math.floor(Math.random() * str.length);
            result.push(str.charAt(r));
        }
        return result.join('');
    }

    getAlgorithm(keyBase64) {
        var key = Buffer.from(keyBase64);
        switch (key.length) {
            case 16:
                return 'aes-128-cbc';
            case 24:
                return 'aes-192-cbc';
            case 32:
                return 'aes-256-cbc';
        }
        throw new Error('Invalid key length: ' + key.length);
    }

    aesEncrypt(plainText, key, iv) {
        const algorithm = this.getAlgorithm(key);
        var cipher = crypto.createCipheriv(algorithm, key, iv);
        cipher.setAutoPadding(true);
        var encrypted = cipher.update(plainText);
        var final = cipher.final();
        var out = Buffer.concat([encrypted, final]);
        return Uint8Array.from(out).buffer;
    }

    createRoomId(length, chars) {
        let mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        let result = '';
        for (let i = length; i > 0; --i) 
            result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }

    async roomLogin(user, token){
        const zg = new ZegoExpressEngine(ZegoAppId, ZegoAppSecret);
        const userId = `fasttrack-user-${user.id}`;
        const userName = user.name;
        const roomId = this.createRoomId(8,'#Aa');
        const result = await zg.loginRoom(roomId, token, {userId, userName}, {userUpdate: true});

        return result;
    }
}

module.exports = new ZegoUtils();