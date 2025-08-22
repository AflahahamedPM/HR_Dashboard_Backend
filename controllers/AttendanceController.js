const { returnCode } = require("../config/responseCode");
const User = require("../models/User");
const UtilController = require("../services/UtilController");

module.exports = {
  updateAttendanceStatus: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      const { recordId, status } = req.body;
      if (!recordId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User id is required",
          responseCode: returnCode.recordNotFound,
        });
      }

      await User.findByIdAndUpdate(
        recordId,
        { $set: { attendanceStatus: status } },
        { new: true }
      );


      UtilController.sendSuccess(req, res, next, {
        message: "Attendance updated successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },
};
