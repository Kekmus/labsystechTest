const ascii85 = {
  encode: function (bitMask) {
    if (!bitMask || bitMask.length === 0) {
      return "";
    }

    const binaryString = bitMask.map((bit) => (bit ? "1" : "0")).join("");
    console.log("ascii85 binary:", binaryString);

    const paddedBinary = binaryString.padEnd(
      Math.ceil(binaryString.length / 8) * 8,
      "0"
    );

    const bytes = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
      bytes.push(parseInt(paddedBinary.substr(i, 8), 2));
    }

    const base85Chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";
    let encoded = "";

    for (let i = 0; i < bytes.length; i += 4) {
      let group = 0;
      for (let j = 0; j < 4 && i + j < bytes.length; j++) {
        group = group * 256 + (bytes[i + j] || 0);
      }

      for (let k = 0; k < 5; k++) {
        encoded = base85Chars[group % 85] + encoded;
        group = Math.floor(group / 85);
      }
    }

    return encoded;
  },

  decode: function (encoded, maxNumber = 300) {
    if (!encoded) {
      return new Array(maxNumber).fill(false);
    }

    const base85Chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";
    const bytes = [];

    for (let i = 0; i < encoded.length; i += 5) {
      let group = 0;
      for (let j = 0; j < 5 && i + j < encoded.length; j++) {
        const charIndex = base85Chars.indexOf(encoded[i + j]);
        group = group * 85 + charIndex;
      }

      for (let k = 3; k >= 0; k--) {
        bytes.push(group & 0xff);
        group >>= 8;
      }
    }

    let binaryString = "";
    for (const byte of bytes) {
      binaryString += byte.toString(2).padStart(8, "0");
    }

    const bitMask = new Array(maxNumber).fill(false);
    for (let i = 0; i < Math.min(binaryString.length, maxNumber); i++) {
      bitMask[i] = binaryString[i] === "1";
    }

    return bitMask;
  },
};

module.exports = ascii85;
