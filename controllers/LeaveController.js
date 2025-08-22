const { returnCode } = require("../config/responseCode");
const Leave = require("../models/Leave");
const User = require("../models/User");
const UtilController = require("../services/UtilController");

module.exports = {
  getEmployees: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      const userIdObj = await UtilController.convertToMongoose(userId);
      const matchObj = {
        createdBy: userIdObj,
        attendanceStatus: "Present",
        active: true,
        userType: "employee",
      };

      let result = await User.aggregate([{ $match: matchObj }]);

      UtilController.sendSuccess(req, res, next, {
        message: "Success",
        result,
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },

  applyLeave: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      let createObj = req?.body;
      const userIdObj = await UtilController.convertToMongoose(
        createObj?.userId
      );

      createObj.createdBy = await UtilController.convertToMongoose(userId);

      let checkLeaveExist = await Leave.findOne({
        appliedDate: createObj?.appliedDate,
        userId: userIdObj,
      });

      if (checkLeaveExist) {
        return UtilController.sendSuccess(req, res, next, {
          message: "Already leave exist",
          responseCode: returnCode.duplicate,
        });
      }

      await Leave.create(createObj);

      UtilController.sendSuccess(req, res, next, {
        message: "Leave applied successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },

  listLeaves: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      const userIdObj = await UtilController.convertToMongoose(userId);
      const { status, keyword } = req?.body;

      let matchObj = {
        createdBy: userIdObj,
      };

      if (status) {
        matchObj.status = status;
      }

      const pipeline = [
        { $match: matchObj },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            appliedDate: 1,
            reason: 1,
            status: 1,
            docsUrl: 1,
            name: "$userDetails.fullName",
            department:"$userDetails.department"
          },
        },
      ];

      if (keyword && keyword.trim() !== "") {
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { reason: { $regex: keyword, $options: "i" } },
              { status: { $regex: keyword, $options: "i" } },
            ],
          },
        });
      }

      const result = await Leave.aggregate(pipeline);

      UtilController.sendSuccess(req, res, next, {
        message: "Success",
        responseCode: returnCode.validSession,
        result,
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },

  updateLeaveStatus: async (req, res, next) => {
    try {
      const { status, recordId } = req?.body;

      if (!recordId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      await Leave.findByIdAndUpdate(
        recordId,
        { $set: { status } },
        { new: true }
      );

      UtilController.sendSuccess(req, res, next, {
        message: "Leave status updated successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },
};
