import { Router } from "express";
import * as jobController from "./job.controller.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";

import { authorizeCompanyHR } from "../../middleware/companyHrRole.middleware.js";
import { jobSchema, jobUpdateSchema } from "./job.schema.js";
import { fileValidation, multerUploadCloud } from "../../utils/multerUploadCloud.js";

const router = Router();

router.post("/", isAuth, authorizeCompanyHR, validation(jobSchema), asyncHandler(jobController.addJob));
router.patch("/:jobId", isAuth, authorizeCompanyHR, validation(jobUpdateSchema), asyncHandler(jobController.updateJob));
router.delete("/:jobId", isAuth, authorizeCompanyHR, asyncHandler(jobController.deleteJob));
router.get("/", isAuth, asyncHandler(jobController.getWithCompanyInfo));
router.get("/getByName", isAuth, asyncHandler(jobController.getAllJobsForCompany));
router.get("/getJobsWithFilters", isAuth, asyncHandler(jobController.getJobsWithFilters));

router.post("/apply", isAuth, multerUploadCloud({ filter: fileValidation.files }).single("pp"), asyncHandler(jobController.applyToJob))




export default router;
