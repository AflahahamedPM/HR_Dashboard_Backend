const { returnCode } = require("../config/responseCode");
const User = require("../models/User");
const TokenController = require("../services/TokenController");
const UtilController = require("../services/UtilController");

module.exports = {
  accountLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const checkUser = await User.findOne({ email: email })
        .select("userType password email fullName _id")
        .lean();
      if (!checkUser) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: returnCode.recordNotFound,
          message: "Email not found",
        });
      }

      let passwordMatched = await UtilController.comparePassword(
        checkUser.password,
        password,
        process.env.passwordSecretKey
      );

      if (passwordMatched !== returnCode.passwordMatched) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: returnCode.passwordMismatch,
          message: "Wrong Password",
        });
      }

      const token = await TokenController.createToken(checkUser._id);

      UtilController.sendSuccess(req, res, next, {
        responseCode: returnCode.validSession,
        user: checkUser,
        token,
        message: "Successfully logged in",
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },

  registerUser: async (req, res, next) => {
    try {
      let createObj = req?.body;

      const userExists = await User.findOne({ email: createObj.email });
      if (userExists) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: returnCode.duplicate,
          message: "Email already exist",
        });
      }

      createObj.userType = "HR";

      const hashedPassword = await UtilController.encryptData(
        createObj.password,
        process.env.passwordSecretKey
      );
      if (!hashedPassword) {
        return UtilController.sendError(req, res, next, {
          responseCode: returnCode.validationError,
          message: "Error while encrypting password",
        });
      }

      createObj.password = hashedPassword;

      await User.create(createObj);

      UtilController.sendSuccess(req, res, next, {
        responseCode: returnCode.validSession,
        message: "Succesfully created user",
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },
};
