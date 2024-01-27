import joi from "joi";

//schema for every api take data only
export const signupSchema = joi
  .object({
    email: joi.string().required().email(),
    userName: joi.string().min(5).max(10).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    //reset password
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().required().email(),
    password: joi.string().required(),
  })
  .required();


