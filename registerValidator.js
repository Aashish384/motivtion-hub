import validator from "validator";

const registerValidator = (data) => {
  const errors = {};

  if (data.email && !validator.isEmail(validator.trim(data.email))) {
    errors.email = "Email is invalid";
  }
  if (data.username && !validator.isLength(validator.trim(data.username), { min: 4 })) {
    errors.username = "Username must be at least 4 characters";
  }
  if (data.password && !validator.isLength(validator.trim(data.password), { min: 8 })) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};

export default registerValidator;
