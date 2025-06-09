const { serialize, deserialize } = require("./serializer");

module.exports = {
  serialize,
  deserialize,
};

const numbers = [55, 4, 5, 6, 7, 8, 9, 211, 300];
const serialized = serialize(numbers);
console.log("serialized", serialized);
const deserialized = deserialize(serialized);
console.log("deserialized", deserialized);