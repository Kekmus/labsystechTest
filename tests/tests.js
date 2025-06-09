const { runTest, printStatistics } = require("./test-runner");
const {
  getSimpleTests,
  getRandomTests,
  getBoundaryTests,
  getSpecialTests,
  getEncoderTests,
} = require("./test-cases");

// Запуск всех тестов
function runAllTests() {
  const results = [];

  console.log("\n1. Простейшие короткие тесты");
  const simpleTests = getSimpleTests();
  simpleTests.forEach((test) => {
    results.push(runTest(test.name, test.numbers));
  });

  console.log("\n2. Граничные тесты");
  const boundaryTests = getBoundaryTests();
  boundaryTests.forEach((test) => {
    results.push(runTest(test.name, test.numbers));
  });

  console.log("\n3. Специальные случаи");
  const specialTests = getSpecialTests();
  specialTests.forEach((test) => {
    results.push(runTest(test.name, test.numbers));
  });

  console.log("\n4. Тесты с разными кодировщиками");
  const encoderTests = getEncoderTests();
  encoderTests.forEach((test) => {
    results.push(runTest(test.name, test.numbers, test.encoder));
  });

  console.log("\n5. Случайные тесты");
  const randomTests = getRandomTests();
  randomTests.forEach((test) => {
    results.push(runTest(test.name, test.numbers));
  });

  printStatistics(results);

  return results;
}

if (require.main === module) {
  runAllTests();
}
