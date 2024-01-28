import { Router } from "express";
import * as companyController from "./company.controller.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  companySchema, companyUpdateSchema,

} from "./company.schema.js";
import { authorizeCompanyHR } from "../../middleware/companyHrRole.middleware.js";

const router = Router();

router.post("/", isAuth, authorizeCompanyHR, validation(companySchema), asyncHandler(companyController.addCompany));
router.patch("/:companyId", isAuth, authorizeCompanyHR, validation(companyUpdateSchema), asyncHandler(companyController.updateCompany));
router.delete("/:companyId", isAuth, authorizeCompanyHR, asyncHandler(companyController.deleteCompany));
router.get("/getData/:id", isAuth, authorizeCompanyHR, asyncHandler(companyController.getData));
router.get("/filterByName", isAuth, asyncHandler(companyController.getDataByName));




export default router;
