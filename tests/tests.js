const {
  runTest,
  printStatistics,
  printComparativeStatistics,
} = require("./test-runner");
const {
  getSimpleTests,
  getRandomTests,
  getBoundaryTests,
  getSpecialTests,
} = require("./test-cases");

const ENCODERS = ["runLength", "ascii85", "hex"];

function runTestWithAllEncoders(testName, numbers) {
  const results = [];

  console.log(`\n🔬 === ${testName} ===`);
  console.log(
    `Исходные числа (${numbers.length}):`,
    numbers.slice(0, 10).join(", ") + (numbers.length > 10 ? "..." : "")
  );

  ENCODERS.forEach((encoder) => {
    console.log(`\n  📊 Алгоритм: ${encoder.toUpperCase()}`);
    const result = runTest(`${testName} (${encoder})`, numbers, encoder);
    results.push(result);
  });

  console.log(`\n  📈 Сравнение алгоритмов для "${testName}":`);
  const sortedResults = results
    .filter((r) => r.isCorrect)
    .sort((a, b) => b.compressionRatio - a.compressionRatio);

  sortedResults.forEach((result, index) => {
    const medal =
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
    console.log(
      `    ${medal} ${result.encoderType}: ${result.compressionRatio}%`
    );
  });

  return results;
}

// Запуск всех тестов
function runAllTests() {
  const allResults = [];

  console.log("🚀 ЗАПУСК КОМПЛЕКСНОГО ТЕСТИРОВАНИЯ");
  console.log("Каждый тест будет проверен всеми доступными алгоритмами:\n");
  ENCODERS.forEach((encoder) => console.log(`  • ${encoder.toUpperCase()}`));

  console.log("\n" + "=".repeat(60));
  console.log("1️⃣  ПРОСТЕЙШИЕ КОРОТКИЕ ТЕСТЫ");
  console.log("=".repeat(60));
  const simpleTests = getSimpleTests();
  simpleTests.forEach((test) => {
    const results = runTestWithAllEncoders(test.name, test.numbers);
    allResults.push(...results);
  });

  console.log("\n" + "=".repeat(60));
  console.log("2️⃣  ГРАНИЧНЫЕ ТЕСТЫ");
  console.log("=".repeat(60));
  const boundaryTests = getBoundaryTests();
  boundaryTests.forEach((test) => {
    const results = runTestWithAllEncoders(test.name, test.numbers);
    allResults.push(...results);
  });

  console.log("\n" + "=".repeat(60));
  console.log("3️⃣  СПЕЦИАЛЬНЫЕ СЛУЧАИ");
  console.log("=".repeat(60));
  const specialTests = getSpecialTests();
  specialTests.forEach((test) => {
    const results = runTestWithAllEncoders(test.name, test.numbers);
    allResults.push(...results);
  });

  console.log("\n" + "=".repeat(60));
  console.log("4️⃣  СЛУЧАЙНЫЕ ТЕСТЫ");
  console.log("=".repeat(60));
  const randomTests = getRandomTests();
  randomTests.forEach((test) => {
    const results = runTestWithAllEncoders(test.name, test.numbers);
    allResults.push(...results);
  });

  printStatistics(allResults);

  printComparativeStatistics(allResults, ENCODERS);

  return allResults;
}

if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  runTestWithAllEncoders,
  ENCODERS,
};
