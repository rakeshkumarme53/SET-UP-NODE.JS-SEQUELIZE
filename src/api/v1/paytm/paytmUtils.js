const Paytm = require("paytm-pg-node-sdk");
const PaytmChecksum = require("./PaytmChecksum");
const ApiError = require("../middlewares/apiError");
//For Staging
const environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;
//For Production
//const environment = Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT;

require("dotenv").config();

const mid = process.env.PAYTM_MID;
const key = process.env.PAYTM_KEY;
const website = process.env.PAYTM_WEBSITE;

//const callbackUrl = ``;
/* const callbackUrl = `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`;
Paytm.MerchantProperties.setCallbackUrl(callbackUrl); */

Paytm.MerchantProperties.initialize(environment, mid, key, website);

//If you want to add log file to your project, use below code
/* Paytm.Config.logName = "[PAYTM]";
Paytm.Config.logLevel = Paytm.LoggingUtil.LogLevel.INFO;
Paytm.Config.logfile = "/path/log/file.log"; */

class PayTMUtils {
  //Create Transaction Token
  async startPayment(user, orderId, amount, requestFrom) {
    const callbackUrl = `https://fasttrack.acolabz.com/#/payment-status/${orderId}`;
    const callbackUrlMobile = `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`;
    //const callbackUrl = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`;

    let channelId = Paytm.EChannelId.WEB;

    if (requestFrom === "WEB") {
      Paytm.MerchantProperties.setCallbackUrl(callbackUrl);
      channelId = Paytm.EChannelId.WEB;
    }
    if (requestFrom === "MOBILE") {
      Paytm.MerchantProperties.setCallbackUrl(callbackUrlMobile);
      channelId = Paytm.EChannelId.WAP;
    }

    const txtAmount = Paytm.Money.constructWithCurrencyAndValue(
      Paytm.EnumCurrency.INR,
      String(amount)
    );
    var userInfo = new Paytm.UserInfo(user.mobile);
    //userInfo.setEmail(user.email);
    if (!user.name) userInfo.setFirstName(user.name);
    userInfo.setMobile(user.mobile);

    const paymentDetailBuilder = new Paytm.PaymentDetailBuilder(
      channelId,
      orderId,
      txtAmount,
      userInfo
    );
    const paymentDetail = paymentDetailBuilder.build();
    const response = await Paytm.Payment.createTxnToken(paymentDetail);

    const responseBody = response.responseObject.body;

    const resultMsg = responseBody.resultInfo.resultMsg;
    const resultStatus = responseBody.resultInfo.resultStatus;

    var result = {
      transaction_token: responseBody.txnToken || null,
      order_id: orderId,
      message: resultMsg,
      success: resultStatus === "S",
    };

    if (!result.success) throw ApiError.badRequest(result.message);

    return result;
  }

  // Verify Payment Status
  async verifyPayment(orderId) {
    const body = {
      mid: mid,
      orderId: orderId,
    };
    let verificationStatus = false;
    const paytmChecksum = PaytmChecksum.generateSignature(body, mid);
    paytmChecksum
      .then(function (result) {
        const verifyChecksum = PaytmChecksum.verifySignature(body, result);
        verificationStatus = verifyChecksum;
      })
      .catch(function (error) {
        verificationStatus = false;
      });

    var readTimeout = 80000;
    var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(
      orderId
    );
    var paymentStatusDetail = paymentStatusDetailBuilder
      .setReadTimeout(readTimeout)
      .build();
    var response = await Paytm.Payment.getPaymentStatus(paymentStatusDetail);

    const responseBody = response.responseObject.body;

    const resultMsg = responseBody.resultInfo.resultMsg;
    const resultStatus = responseBody.resultInfo.resultStatus;

    var result = {
      transaction_id: responseBody.txnId || null,
      message: resultMsg,
      success: resultStatus === "TXN_SUCCESS" && verificationStatus === true,
    };

    const paytmTransaction = {
      amount: responseBody.txnAmount,
      transaction_date: responseBody.txnDate,
      bank_tran_id: responseBody.bankTxnId,
      tran_id: responseBody.txnId,
      bank_name: responseBody.bankName,
      gateway_name: responseBody.gatewayName,
      status: resultStatus,
      order_id: responseBody.orderId,
      m_id: responseBody.mid,
      payment_mode: responseBody.paymentMode,
      response_code: responseBody.resultInfo.resultCode,
      message: resultMsg,
      success: result.success,
    };
    //await PaytmService.create(user, paytmTransaction);

    return paytmTransaction;
  }
}

module.exports = new PayTMUtils();
