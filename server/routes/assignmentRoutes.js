import { Router } from "express";
import { upload } from "../config/multerConfig.js";
import {
  createAssignment,
  getAssignments,
  deleteAssignment,
  getAssignmentDetails,
  editAssignment,
} from "../controllers/assignmentController.js";
import {
  submitAssignment,
  getSubmissions,
  deleteSubmission,
} from "../controllers/submissionController.js";
import { hasPermission } from "../middleware/checkUserRole.js";

const router = Router();

// Assignment routes
router.post(
  "/",
  hasPermission("create:assignment"),
  (req, res, next) => {
    // Accepts a max of 5 files and catches Multer errors
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createAssignment
);

router.patch(
  "/:assignmentId/edit",
  hasPermission("edit:assignment"),
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  editAssignment
);

router.get(
  "/:unitId/assignments",
  hasPermission("view:assignment"),
  getAssignments
);

router.get(
  "/:id/details",
  hasPermission("view:assignment"),
  getAssignmentDetails
);

router.delete("/:id", hasPermission("delete:assignment"), deleteAssignment);

// Submission routes
router.post(
  "/:assignmentId/submit",
  hasPermission("upload:assignment-submission"),
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  submitAssignment
);

router.get(
  "/:assignmentId/submissions",
  hasPermission("manage:assignments"),
  getSubmissions
);

router.delete(
  "/submissions/:submissionId",
  hasPermission("remove:assignment-submission"),
  deleteSubmission
);

export default router;
