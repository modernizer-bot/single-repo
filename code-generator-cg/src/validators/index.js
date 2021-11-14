const validateEntities = require("./entities");
const validateoptions = require("./options");

function mainValidator(data) {
  try {
    validateoptions(data);
    validateEntities(data);
  } catch (err) {
    console.log({ validatorErr: err.message });
    process.exit(1);
  }
}

module.exports = mainValidator;
