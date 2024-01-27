import { Router } from "express";
import * as userController from "./user.controller.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  confirmEmail,
  loginSchema,
  resetPass,
  signupSchema,
  updateSchema,
} from "./user.schema.js";

const router = Router();

router.post("/", validation(signupSchema), asyncHandler(userController.signup));
router.get("/", validation(loginSchema), asyncHandler(userController.login));

router.patch("/update-account", isAuth, validation(updateSchema), asyncHandler(userController.updateUser));
router.delete("/delete-account", isAuth, asyncHandler(userController.deleteUser));
router.get("/user-data", isAuth, asyncHandler(userController.getUserData));
router.get("/user-data/:id", isAuth, asyncHandler(userController.getUserDataById));


router.put(
  "/changePassword",
  isAuth,
  asyncHandler(userController.changePassword)
);
router.patch(
  "/forget_code",
  validation(confirmEmail),
  asyncHandler(userController.sendForgetCode)
);
// reset password
router.patch(
  "/reset_password",
  validation(resetPass),
  asyncHandler(userController.resetPassWord)
);
router.get("/allUser", isAuth, asyncHandler(userController.getAllUsers));



export default router;
