const multer = require("multer");
const path = require("path");
const UtilController = require("../services/UtilController");
const { returnCode } = require("../config/responseCode");

module.exports = {
  uploadResume: (req, res, next) => {

    const file = req.files[0];
    if (!file)
      return UtilController.sendSuccess(req, res, next, {
        responseCode: returnCode.invalidSession,
        message: "No file to upload",
      });

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      file.filename
    }`;

    UtilController.sendSuccess(req, res, next, {
      message: "Resume uploaded successfully",
      url: fileUrl,
      fileName: file.filename,
    });
  },
};
