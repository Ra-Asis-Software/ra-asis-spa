import express from "express";
import { hasRole } from "../middleware/checkUserRole.js";
import { validateCreateUser } from "../validators/adminCreateUserValidator.js";
import {
  createUser,
  getUsers,
  deactivateUser,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router
  .route("/")
  .get(hasRole("administrator"), getUsers)
  .post(hasRole("administrator"), validateCreateUser, createUser);

router
  .route("/deactivateuser/:id")
  .patch(hasRole("administrator"), deactivateUser);

router.route("/deleteuser/:id").delete(hasRole("administrator"), deleteUser);

export default router;
