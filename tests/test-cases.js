const { generateRandomNumbers } = require("./test-utils");

const testCases = {
  simple: [
    { name: "Одно число", numbers: [1] },
    { name: "Два числа", numbers: [1, 300] },
    { name: "Три числа", numbers: [1, 150, 300] },
    { name: "Пять чисел подряд", numbers: [1, 2, 3, 4, 5] },
    { name: "Пять разрозненных чисел", numbers: [1, 50, 100, 200, 300] },
  ],

  random: [
    { name: "Случайные 50 чисел", numbers: () => generateRandomNumbers(50) },
    { name: "Случайные 100 чисел", numbers: () => generateRandomNumbers(100) },
  ],

  boundary: [
    {
      name: "Все однозначные числа (1-9)",
      numbers: Array.from({ length: 9 }, (_, i) => i + 1),
    },
    {
      name: "Все двузначные числа (10-99)",
      numbers: Array.from({ length: 90 }, (_, i) => i + 10),
    },
    {
      name: "Все трёхзначные числа (100-300)",
      numbers: Array.from({ length: 201 }, (_, i) => i + 100),
    },
    {
      name: "Каждое число по 3 раза (900 чисел)",
      numbers: (() => {
        const tripleNumbers = [];
        for (let i = 1; i <= 300; i++) {
          tripleNumbers.push(i, i, i);
        }
        return tripleNumbers;
      })(),
    },
  ],

  special: [
    { name: "Только минимальное число", numbers: [1] },
    { name: "Только максимальное число", numbers: [300] },
    { name: "Крайние числа", numbers: [1, 300] },
    {
      name: "Последовательные числа 1-100",
      numbers: Array.from({ length: 100 }, (_, i) => i + 1),
    },
    {
      name: "Четные числа 2-300",
      numbers: Array.from({ length: 150 }, (_, i) => (i + 1) * 2),
    },
    {
      name: "Нечетные числа 1-299",
      numbers: Array.from({ length: 150 }, (_, i) => i * 2 + 1),
    },
  ],

  encoders: [
    {
      name: "100 чисел - ASCII85",
      numbers: () => generateRandomNumbers(100),
      encoder: "ascii85",
    },
    {
      name: "100 чисел - RunLength",
      numbers: () => generateRandomNumbers(100),
      encoder: "runLength",
    },
    {
      name: "100 чисел - Hex",
      numbers: () => generateRandomNumbers(100),
      encoder: "hex",
    },
  ],
};

function getSimpleTests() {
  return testCases.simple;
}

function getRandomTests() {
  return testCases.random.map((test) => ({
    ...test,
    numbers: typeof test.numbers === "function" ? test.numbers() : test.numbers,
  }));
}

function getBoundaryTests() {
  return testCases.boundary;
}

function getSpecialTests() {
  return testCases.special;
}

function getEncoderTests() {
  return testCases.encoders.map((test) => ({
    ...test,
    numbers: typeof test.numbers === "function" ? test.numbers() : test.numbers,
  }));
}

function getAllTestCases() {
  return {
    simple: getSimpleTests(),
    random: getRandomTests(),
    boundary: getBoundaryTests(),
    special: getSpecialTests(),
    encoders: getEncoderTests(),
  };
}

module.exports = {
  testCases,
  getSimpleTests,
  getRandomTests,
  getBoundaryTests,
  getSpecialTests,
  getEncoderTests,
  getAllTestCases,
};
