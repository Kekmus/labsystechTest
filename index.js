const { serialize, deserialize } = require("./serializer");

module.exports = {
  serialize,
  deserialize,
};

const numbers = [55, 4, 5, 6, 7, 8, 9, 211, 300];
const serialized = serialize(numbers);
const deserialized = deserialize(serialized);
console.log("serialized", serialized);
console.log("deserialized", deserialized);
console.log("numbers", numbers);

const sortedOriginal = numbers.sort((a, b) => a - b);
const sortedDeserialized = deserialized.sort((a, b) => a - b);
console.log("isEqual", JSON.stringify(sortedOriginal) === JSON.stringify(sortedDeserialized));