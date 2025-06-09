const BASE85_CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";

const ascii85 = {
  encode: function (bitMask) {
    if (!bitMask || bitMask.length === 0) {
      return "";
    }

    const binaryString = bitMask.map((bit) => (bit ? "1" : "0")).join("");
    const bytes = this._binaryToBytes(binaryString);
    const encoded = this._encodeBytes(bytes);

    const lengthEncoded = binaryString.length.toString(36);
    return lengthEncoded + ":" + encoded;
  },

  decode: function (encoded, maxNumber = 300) {
    if (!encoded) {
      return new Array(maxNumber).fill(false);
    }

    const { originalLength, dataEncoded } = this._parseEncoded(
      encoded,
      maxNumber
    );
    const bytes = this._decodeToBytes(dataEncoded);

    return this._bytesToBitMask(bytes, originalLength, maxNumber);
  },

  _binaryToBytes: function (binaryString) {
    const paddedBinary = binaryString.padEnd(
      Math.ceil(binaryString.length / 8) * 8,
      "0"
    );

    const bytes = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
      const byte = parseInt(paddedBinary.substr(i, 8), 2);
      bytes.push(byte);
    }

    while (bytes.length % 4 !== 0) {
      bytes.push(0);
    }

    return bytes;
  },

  _encodeBytes: function (bytes) {
    let encoded = "";

    for (let i = 0; i < bytes.length; i += 4) {
      let group = 0;
      for (let j = 0; j < 4; j++) {
        group = group * 256 + bytes[i + j];
      }

      const chars = [];
      for (let k = 0; k < 5; k++) {
        chars.unshift(BASE85_CHARS[group % 85]);
        group = Math.floor(group / 85);
      }
      encoded += chars.join("");
    }

    return encoded;
  },

  _parseEncoded: function (encoded, maxNumber) {
    const colonIndex = encoded.indexOf(":");

    if (colonIndex === -1) {
      return {
        originalLength: maxNumber,
        dataEncoded: encoded,
      };
    }

    return {
      originalLength: parseInt(encoded.substring(0, colonIndex), 36),
      dataEncoded: encoded.substring(colonIndex + 1),
    };
  },

  _decodeToBytes: function (dataEncoded) {
    const bytes = [];

    for (let i = 0; i < dataEncoded.length; i += 5) {
      let group = 0;
      for (let j = 0; j < 5 && i + j < dataEncoded.length; j++) {
        const charIndex = BASE85_CHARS.indexOf(dataEncoded[i + j]);
        group = group * 85 + charIndex;
      }

      for (let k = 3; k >= 0; k--) {
        bytes.push((group >> (k * 8)) & 0xff);
      }
    }

    return bytes;
  },

  _bytesToBitMask: function (bytes, originalLength, maxNumber) {
    let binaryString = "";
    for (const byte of bytes) {
      binaryString += byte.toString(2).padStart(8, "0");
    }

    binaryString = binaryString.substring(0, originalLength);
    const bitMask = new Array(maxNumber).fill(false);
    for (let i = 0; i < Math.min(binaryString.length, maxNumber); i++) {
      bitMask[i] = binaryString[i] === "1";
    }

    return bitMask;
  },
};

module.exports = ascii85;
