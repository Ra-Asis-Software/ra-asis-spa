import { Router } from "express";
import { upload } from "../config/multerConfig.js";
import { hasPermission } from "../middleware/checkUserRole.js";
import {
  createQuiz,
  editQuiz,
  startQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const router = Router();

// Quiz routes
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

export default router;
