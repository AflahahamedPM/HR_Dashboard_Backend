const { returnCode } = require("../config/responseCode");
const User = require("../models/User");
const UtilController = require("../services/UtilController");

module.exports = {
  createCandidate: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      let createObj = req.body;
      createObj.userType = "candidate";
      createObj.department = createObj.position;
      createObj.status = "New";
      createObj.createdBy = userId;
      delete createObj.position;

      await User.create(createObj);
      UtilController.sendSuccess(req, res, next, {
        message: "Successfully created candidate",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "error");
      UtilController.sendError(req, res, next, error);
    }
  },

  listCandidates: async (req, res, next) => {
    try {
      const { userId } = req.user;

      if (!userId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User not found",
          responseCode: returnCode.invalidSession,
        });
      }

      const userIdObj = await UtilController.convertToMongoose(userId);
      const { position: department, status, keyword } = req.body;

      let matchObj = {
        createdBy: userIdObj,
        active: true,
        userType: "candidate",
      };

      if (department) {
        matchObj.department = department;
      }

      if (status) {
        matchObj.status = status;
      }

      const pipeline = [{ $match: matchObj }];

      if (keyword && keyword.trim() !== "") {
        pipeline.push({
          $match: {
            $or: [
              { fullName: { $regex: keyword, $options: "i" } },
              { email: { $regex: keyword, $options: "i" } },
              { phoneNo: { $regex: keyword, $options: "i" } },
              { department: { $regex: keyword, $options: "i" } },
              { experience: { $regex: keyword, $options: "i" } },
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

  updateCandidate: async (req, res, next) => {
    try {
      const { recordId, status } = req.body;

      if (!recordId) {
        return UtilController.sendSuccess(req, res, next, {
          message: "User id is required",
          responseCode: returnCode.recordNotFound,
        });
      }

      let updateObj = {
        status: status,
      };

      if (status === "Selected") {
        updateObj.userType = "employee";
        updateObj.position = "Intern";
        updateObj.dateOfJoin = Number(Math.floor(Date.now() / 1000));
      }

      await User.findByIdAndUpdate(
        recordId,
        { $set: updateObj },
        { new: true }
      );

      UtilController.sendSuccess(req, res, next, {
        message: "Successfully updated candidate",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log("error", error);
      UtilController.sendError(req, res, next, error);
    }
  },
};
