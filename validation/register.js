const Validator = require("validator");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be in between 2 to 30 Characters";
  }
  return {
    errors,
    isValid: errors
  };
};
