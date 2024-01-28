import joi from "joi";


//schema for every api take data only
export const companySchema = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    companyEmail: joi.string().email().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.string().required(),
    industry: joi.string().required(),
  }
  ).required()


export const companyUpdateSchema = joi
  .object({
    companyName: joi.string(),
    description: joi.string(),
    companyEmail: joi.string().email(),
    address: joi.string(),
    numberOfEmployees: joi.string(),
    industry: joi.string(),
    companyId: joi.string()
  }
  ).or('companyName', 'description', 'companyEmail', 'address', 'numberOfEmployees', 'industry').required()