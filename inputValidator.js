import validator from "validator";

import isEmpty from "../utils/isEmpty.js";
import registerValidator from "./registerValidator.js";

const inputValidator = (data, type) => {
  // If the user doesn't send any data
  if (isEmpty(data)) {
    return {
      errors: {
        message: "Data validation failed",
      },
      isValid: false,
    };
  }

  let errors = {};

  // Change undefined values to string
  for (const key in data) {
    data[key] = !isEmpty(data[key]) ? data[key] : "";
  }

  // Register user validation
  if (type === "register-user") {
    errors = registerValidator(data);
  }

  // Check for empty string
  for (const key in data) {
    if (validator.isEmpty(String(data[key]))) {
      let keyText = key.replace(/([a-z])([A-Z])/g, "$1 $2");
      keyText = keyText.charAt(0).toUpperCase() + keyText.slice(1);
      errors[key] = `${keyText} is required`;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default inputValidator;
