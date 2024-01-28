import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";


//schema for every api take data only
export const jobSchema = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required(),
    workingTime: joi.string().valid('part-time', 'full-time').required(),
    seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).required(),
    softSkills: joi.array().items(joi.string()).required(),
    companyId: joi.custom(isObjectID)
  }
  ).required()


export const jobUpdateSchema = joi
  .object({
    jobTitle: joi.string(),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'),
    workingTime: joi.string().valid('part-time', 'full-time'),
    seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    companyId: joi.custom(isObjectID),
    jobId: joi.custom(isObjectID)
  }
  ).or('jobTitle', 'jobLocation', 'workingTime', 'seniorityLevel', 'jobDescription', 'technicalSkills', 'softSkills', 'companyId').required()