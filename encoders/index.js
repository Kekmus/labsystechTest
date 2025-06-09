const runLength = require("./runLength");
const ascii85 = require("./ascii85");
const hex = require("./hex");

const encoders = {
  runLength,
  ascii85,
  hex,
};

module.exports = encoders;
