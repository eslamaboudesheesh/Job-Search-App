import { Router } from "express";
import * as userController from "./user.controller.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  loginSchema,
  signupSchema,
} from "./user.schema.js";

const router = Router();

router.post("/", validation(signupSchema), asyncHandler(userController.signup));
router.get("/", validation(loginSchema), asyncHandler(userController.login));


router.put(
  "/changePassword",
  isAuth,
  asyncHandler(userController.changePassword)
);

router.get("/allUser", isAuth, asyncHandler(userController.getAllUsers));


export default router;
