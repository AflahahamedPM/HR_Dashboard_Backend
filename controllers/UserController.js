const { returnCode } = require("../config/responseCode");
const User = require("../models/User");
const UtilController = require("../services/UtilController");

module.exports = {
  deleteUser: async (req, res, next) => {
    const { recordId } = req.body;

    await User.findByIdAndUpdate(
      recordId,
      {
        $set: { active: false },
      },
      { new: true }
    );

    UtilController.sendSuccess(req, res, next, {
      responseCode: returnCode.validSession,
      message: "Successfully deleted user",
    });
  },
};
