const { returnCode } = require("../config/responseCode");
const User = require("../models/User");
const UtilController = require("../services/UtilController");

module.exports = {
  listEmployee: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      const userIdObj = await UtilController.convertToMongoose(userId);
      const { position, keyword, status } = req.body;

      let matchObj = {
        createdBy: userIdObj,
        active: true,
        userType: "employee",
      };

      if (position) {
        matchObj.position = position;
      }

      if (status) {
        matchObj.attendanceStatus = status;
      }

      const pipeline = [{ $match: matchObj }];

      if (keyword && keyword.trim() !== "") {
        pipeline.push({
          $match: {
            $or: [
              { fullName: { $regex: keyword, $options: "i" } },
              { email: { $regex: keyword, $options: "i" } },
              { phoneNo: { $regex: keyword, $options: "i" } },
              { position: { $regex: keyword, $options: "i" } },
              { department: { $regex: keyword, $options: "i" } },
            ],
          },
        });
      }

      const result = await User.aggregate(pipeline);
      return UtilController.sendSuccess(req, res, next, {
        message: "Candidates fetched successfully",
        responseCode: returnCode.validSession,
        result,
      });
    } catch (error) {
      console.log("error", error);
      UtilController.sendError(req, res, next, error);
    }
  },

  getDetails: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      const { recordId } = req?.body;
      if (!recordId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User id is required",
          responseCode: returnCode.recordNotFound,
        });
      }

      const result = await User.findById(recordId);

      UtilController.sendSuccess(req, res, next, {
        message: "successfully fetched details",
        responseCode: returnCode.validSession,
        result,
      });
    } catch (error) {
      console.log("error", error);
      UtilController.sendError(req, res, next, error);
    }
  },

  updateEmployee: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      let updateObj = req.body;

      if (!updateObj?.recordId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User id is required",
          responseCode: returnCode.recordNotFound,
        });
      }

      await User.findByIdAndUpdate(
        updateObj?.recordId,
        { $set: updateObj },
        { new: true }
      );

      UtilController.sendSuccess(req, res, next, {
        message: "Employee details updated successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log("error", error);
      UtilController.sendError(req, res, next, error);
    }
  },
};
