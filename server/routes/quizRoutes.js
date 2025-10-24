import { Router } from "express";
import { upload } from "../config/multerConfig.js";
import { hasPermission } from "../middleware/checkUserRole.js";
import {
  createQuiz,
  editQuiz,
  getQuizDetails,
  getQuizzes,
  getQuizzesForTeacher,
  getSubmission,
  getSubmissions,
  gradeQuizSubmission,
  startQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const router = Router();

router.post(
  "/",
  hasPermission("create:quiz"),
  (req, res, next) => {
    // Accepts a max of 5 files and catches Multer errors
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createQuiz
);

router.patch(
  "/:quizId/edit",
  hasPermission("edit:quiz"),
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  editQuiz
);

router.post("/start", hasPermission("upload:quiz-submission"), startQuiz);

router.post(
  "/:quizId/submit",
  hasPermission("upload:quiz-submission"),
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  submitQuiz
);

router.get("/:unitId/quizzes", hasPermission("view:quiz"), getQuizzes);

router.get(
  "/get-quizzes-for-teacher",
  hasPermission("view:quiz"),
  getQuizzesForTeacher
);

//get quiz details
router.get("/:id/details", hasPermission("view:quiz"), getQuizDetails);

//get single quiz submission
router.get(
  "/:quizId/submissions/:submissionId",
  hasPermission("manage:quiz"),
  getSubmission
);

router.get(
  "/:quizId/submissions",
  hasPermission("manage:quiz"),
  getSubmissions
);

//grade quiz
router.patch(
  "/:quizId/submissions/:submissionId/grade",
  hasPermission("grade:quiz"),
  gradeQuizSubmission
);

export default router;
