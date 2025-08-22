const express = require("express");
const AuthController = require("../controllers/AuthController");
const CandidateController = require("../controllers/CandidateController");
const adminAutherization = require("../middleware/adminAutherization");
const UploadController = require("../controllers/UploadController");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const UserController = require("../controllers/UserController");
const EmployeeController = require("../controllers/EmployeeController");
const AttendanceController = require("../controllers/AttendanceController");
const LeaveController = require("../controllers/LeaveController");

// delete user
router.route("/user/delete").post(UserController.deleteUser);

// upload
router.post("/upload", upload.any(), UploadController.uploadResume);

// auth related api
router.route("/account/login").post(AuthController.accountLogin);
router.route("/account/register").post(AuthController.registerUser);

// candidate related api
router
  .route("/candidate/create")
  .post(adminAutherization.adminAuth, CandidateController.createCandidate);

router
  .route("/candidate/list")
  .post(adminAutherization.adminAuth, CandidateController.listCandidates);

router.route("/candidate/update").post(CandidateController.updateCandidate);

// employee related api
router
  .route("/employee/list")
  .post(adminAutherization.adminAuth, EmployeeController.listEmployee);

router
  .route("/employee/details")
  .post(adminAutherization.adminAuth, EmployeeController.getDetails);

router
  .route("/employee/update")
  .post(adminAutherization.adminAuth, EmployeeController.updateEmployee);

// attendance api
router
  .route("/attendance/update")
  .post(
    adminAutherization.adminAuth,
    AttendanceController.updateAttendanceStatus
  );

// leave api

router
  .route("/employee/dropdown")
  .get(adminAutherization.adminAuth, LeaveController.getEmployees);

router
  .route("/leave/apply")
  .post(adminAutherization.adminAuth, LeaveController.applyLeave);

router
  .route("/leave/list")
  .post(adminAutherization.adminAuth, LeaveController.listLeaves);

router.route("/leave/update").post(LeaveController.updateLeaveStatus);
module.exports = router;
