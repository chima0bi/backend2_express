import Joi from "joi";

export const validateRegistration = (req, res, next) => { // validates if the values from req.body matches the conditions defined here, like name being between 2 and 50 chars and being compulsorily present ie required, email being in email format, the accepted format of phone numbers etc.
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    address: Joi.string().optional(),
    service: Joi.string().optional(),
    experienceYears: Joi.number().optional(),
    role: Joi.string()
      .valid("user", "provider", "admin", "owner")
      .default("user"),
  });

  const { error } = schema.validate(req.body); // where the compariosn is done. I figure it returns 0 or false when match and an error data on mismatch.
  if (error) {
    return res.status(400).json({
      message: "Validation error, input data missing or not matching expected patterns",
      details: error.details[0].message,
    });
  }
  next();
};
