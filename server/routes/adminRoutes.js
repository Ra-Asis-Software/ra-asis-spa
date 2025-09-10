import express from "express";
import { hasRole } from "../middleware/checkUserRole.js";
import { validateCreateUser } from "../validators/adminCreateUserValidator.js";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  toggleUserActivation,
} from "../controllers/adminController.js";

const router = express.Router();

router
  .route("/")
  .get(hasRole("administrator"), getUsers)
  .post(hasRole("administrator"), validateCreateUser, createUser);

router
  .route("/updateuser/:id")
  .put(hasRole("administrator"), validateCreateUser, updateUser)
  .patch(hasRole("administrator"), validateCreateUser, updateUser);

router
  .route("/toggle-activation/:id")
  .patch(hasRole("administrator"), toggleUserActivation);

router.route("/deleteuser/:id").delete(hasRole("administrator"), deleteUser);

export default router;
