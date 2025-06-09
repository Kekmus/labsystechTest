const hex = {
  encode: function (bitMask) {
    if (!bitMask || bitMask.length === 0) {
      return "";
    }

    const binaryString = bitMask.map((bit) => (bit ? "1" : "0")).join("");
    const paddedBinary = binaryString.padEnd(
      Math.ceil(binaryString.length / 4) * 4,
      "0"
    );

    let hexString = "";
    for (let i = 0; i < paddedBinary.length; i += 4) {
      const nibble = paddedBinary.substr(i, 4);
      hexString += parseInt(nibble, 2).toString(16);
    }

    console.log("hex encoded:", hexString);
    return hexString;
  },

  decode: function (encoded, maxNumber = 300) {
    if (!encoded) {
      return new Array(maxNumber).fill(false);
    }

    let binaryString = "";
    for (const hexChar of encoded) {
      const nibble = parseInt(hexChar, 16).toString(2).padStart(4, "0");
      binaryString += nibble;
    }

    const bitMask = new Array(maxNumber).fill(false);
    for (let i = 0; i < Math.min(binaryString.length, maxNumber); i++) {
      bitMask[i] = binaryString[i] === "1";
    }

    return bitMask;
  },
};

module.exports = hex;
