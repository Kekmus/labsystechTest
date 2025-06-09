function encodeNumber(num) {
  return num.toString(36);
}

function decodeNumber(str) {
  return parseInt(str, 36);
}

const runLength = {
  encode: function (bitMask) {
    if (!bitMask || bitMask.length === 0) {
      return "";
    }

    const runs = [];
    let currentRun = { value: bitMask[0], length: 1 };

    for (let i = 1; i < bitMask.length; i++) {
      if (bitMask[i] === currentRun.value) {
        currentRun.length++;
      } else {
        runs.push(currentRun);
        currentRun = { value: bitMask[i], length: 1 };
      }
    }
    runs.push(currentRun);

    let encoded = "";
    encoded += bitMask[0] ? "1" : "0";

    for (let i = 0; i < runs.length; i++) {
      encoded += encodeNumber(runs[i].length);
      if (i < runs.length - 1) {
        encoded += ",";
      }
    }

    return encoded;
  },

  decode: function (encoded, maxNumber = 300) {
    if (!encoded) {
      return new Array(maxNumber).fill(false);
    }

    const bitMask = new Array(maxNumber).fill(false);
    const parts = encoded.split(",");

    if (parts.length === 0) {
      return bitMask;
    }

    let currentValue = parts[0][0] === "1";
    let currentPos = 0;

    const firstLength = decodeNumber(parts[0].substring(1));
    if (currentValue) {
      for (let i = 0; i < firstLength && currentPos + i < maxNumber; i++) {
        bitMask[currentPos + i] = true;
      }
    }
    currentPos += firstLength;

    for (let i = 1; i < parts.length; i++) {
      currentValue = !currentValue;
      const length = decodeNumber(parts[i]);

      if (currentValue) {
        for (let j = 0; j < length && currentPos + j < maxNumber; j++) {
          bitMask[currentPos + j] = true;
        }
      }
      currentPos += length;
    }

    return bitMask;
  },
};

module.exports = runLength;
