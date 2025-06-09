const encoders = require("./encoders");

const MAX_NUMBER = 300;

function createBitMask(numbers, maxNumber = MAX_NUMBER) {
  const bitMask = new Array(maxNumber).fill(false);
  for (const n of numbers) {
    if (n >= 1 && n <= maxNumber) {
      bitMask[n - 1] = true;
    }
  }
  return bitMask;
}

function bitMaskToNumbers(bitMask) {
  const numbers = [];
  for (let i = 0; i < bitMask.length; i++) {
    if (bitMask[i]) {
      numbers.push(i + 1);
    }
  }
  return numbers;
}

function serialize(numbers, encoderType = "runLength", maxNumber = MAX_NUMBER) {
  if (!numbers || numbers.length === 0) {
    return "";
  }

  const bitMask = createBitMask(numbers, maxNumber);

  const encoder = encoders[encoderType];
  if (!encoder) {
    throw new Error(`Unknown encoder type: ${encoderType}`);
  }

  const encoded = encoder.encode(bitMask);
  return encoded;
}

function deserialize(
  encoded,
  encoderType = "runLength",
  maxNumber = MAX_NUMBER
) {
  const encoder = encoders[encoderType];
  if (!encoder) {
    throw new Error(`Unknown encoder type: ${encoderType}`);
  }

  const bitMask = encoder.decode(encoded, maxNumber);
  return bitMaskToNumbers(bitMask);
}

module.exports = {
  serialize,
  deserialize,
  createBitMask,
  bitMaskToNumbers,
  encoders,
  MAX_NUMBER,
};
