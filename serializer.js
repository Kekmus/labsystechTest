const MAX_NUMBER = 300;

function serialize(numbers, maxNumber = MAX_NUMBER) {
  if (!numbers || numbers.length === 0) {
    return "";
  }

  const bitMask = new Array(maxNumber).fill(false);
  for (const n of numbers) {
    if (n >= 1 && n <= maxNumber) {
      bitMask[n - 1] = true;
    }
  }

  const runs = [];
  let currentRun = { value: bitMask[0], length: 1 };

  for (let i = 1; i < maxNumber; i++) {
    if (bitMask[i] === currentRun.value) {
      currentRun.length++;
    } else {
      runs.push(currentRun);
      currentRun = { value: bitMask[i], length: 1 };
    }
  }
  runs.push(currentRun);

  console.log(runs);


  let encoded = "";


  encoded += bitMask[0] ? "1" : "0";


  for (let i = 0; i < runs.length; i++) {
    encoded += encodeNumber(runs[i].length);
    if (i < runs.length - 1) {
      encoded += ",";
    }
  }

  console.log(encoded);

  return encoded;
}

function deserialize(encoded) {
  if (!encoded) {
    return [];
  }

  const numbers = [];
  const parts = encoded.split(",");

  if (parts.length === 0) {
    return [];
  }

  let currentValue = parts[0][0] === "1";
  let currentPos = 0;

  const firstLength = decodeNumber(parts[0].substring(1));
  if (currentValue) {
    for (let i = 0; i < firstLength; i++) {
      numbers.push(currentPos + i + 1);
    }
  }
  currentPos += firstLength;

  for (let i = 1; i < parts.length; i++) {
    currentValue = !currentValue;
    const length = decodeNumber(parts[i]);

    if (currentValue) {
      for (let j = 0; j < length; j++) {
        numbers.push(currentPos + j + 1);
      }
    }
    currentPos += length;
  }

  return numbers.sort((a, b) => a - b);
}

function encodeNumber(num) {
  return num.toString(36);
}

function decodeNumber(str) {
  return parseInt(str, 36);
}

module.exports = {
  serialize,
  deserialize,
  MAX_NUMBER,
};
