import joi from "joi";


//schema for every api take data only
export const signupSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    recoveryEmail: joi.string().email().required(),
    DOB: joi.date().iso().required(),
    mobileNumber: joi.string().pattern(new RegExp('^01[0-5]{1}[0-9]{8}$')).required(),
    role: joi.string().valid('User', 'Company_HR').required(),
    status: joi.string().valid('online', 'offline').required(),
    userName: joi.string().required()
  }
  ).required()

export const loginSchema = joi
  .object({
    emailOrMobileNumber: joi.string().required().custom((value, helpers) => {
      const isEmail = joi.string().email().validate(value);
      const isMobileNumber = joi.string().pattern(new RegExp('^01[0-5]{1}[0-9]{8}$')).validate(value);

      if (isEmail.error && isMobileNumber.error) {
        return helpers.message('Invalid email or mobile number.');
      }

      return value;
    }),
    password: joi.string().required(),
  })
  .required();


export const updateSchema = joi.object({
  email: joi.string().email(),
  mobileNumber: joi.string().pattern(new RegExp('^01[0-5]{1}[0-9]{8}$')),
  recoveryEmail: joi.string().email(),
  DOB: joi.date().iso(),
  lastName: joi.string(),
  firstName: joi.string()
}).or('email', 'mobileNumber', 'recoveryEmail', 'DOB', 'lastName', 'firstName').required()


export const confirmEmail = joi
  .object({
    email: joi.string().required().email(),
  })
  .required();


export const resetPass = joi
  .object({
    email: joi.string().required().email(),
    code: joi.string().length(5).required(),
    password: joi.string().required(),

  })
  .required();

