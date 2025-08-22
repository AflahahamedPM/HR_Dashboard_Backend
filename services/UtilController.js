const responseCode = require("../config/responseCode").returnCode;
var CryptoJS = require("crypto-js");
const { default: mongoose } = require("mongoose");

module.exports = {
  sendSuccess: async (req, res, next, data, statusCode = 200) => {
    if (module.exports.isEmpty(data?.responseCode)) {
      data["responseCode"] = responseCode.validSession;
    }
    res.locals = data;
    res.status(statusCode).send({
      message: "success",
      code: responseCode.success,
      data: data,
    });
  },
  sendError: async (req, res, next, err) => {
    console.error(err);
    res.status(500).send({
      message: "failure",
      code: responseCode.errror,
      data: err?.message,
    });
  },
  isEmpty: (data) => {
    let returnObj = false;
    if (
      typeof data === "undefined" ||
      data === null ||
      data === "" ||
      data === "" ||
      data.length === 0
    ) {
      returnObj = true;
    }
    return returnObj;
  },
  comparePassword: (passwordHash, userPassword, secretKey) => {
    let returnObj = responseCode.passwordMismatch;
    try {
      // Decrypt
      let bytes = CryptoJS.AES.decrypt(passwordHash, secretKey);
      let decryptedPwd = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedPwd === userPassword) {
        returnObj = responseCode.passwordMatched;
      }
    } catch (err) {
      console.error(err);
      returnObj = responseCode.userException;
    } finally {
      return returnObj;
    }
  },
  encryptData: (data, secretKey) => {
    try {
      var ciphertext = CryptoJS.AES.encrypt(data, secretKey);
      encodedData = ciphertext.toString();
      return encodedData;
    } catch (error) {
      console.log("error in payload encryption---", error);
      return null;
    }
  },
  decryptData: (passwordHash, secretKey) => {
    try {
      let bytes = CryptoJS.AES.decrypt(passwordHash, secretKey);
      let decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.log("error in payload dencryption---", error);
      return null;
    }
  },

  convertToMongoose: (id) => {
    return new mongoose.Types.ObjectId(id);
  },
};
