import { Router } from "express";
import { upload } from "../config/multerConfig.js";
import { hasPermission } from "../middleware/checkUserRole.js";
import {
  createQuiz,
  editQuiz,
  getQuizzes,
  getSubmissions,
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
  "/:quizId/submissions",
  hasPermission("manage:quiz"),
  getSubmissions
);

export default router;
