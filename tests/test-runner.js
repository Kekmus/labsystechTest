const { serialize, deserialize } = require("../serializer");
const { calculateCompressionRatio } = require("./test-utils");

function runTest(testName, numbers, encoderType = "runLength") {
  const serialized = serialize(numbers, encoderType);
  const deserialized = deserialize(serialized, encoderType);

  // Проверяем корректность для множеств (дубликаты в исходных данных игнорируются)
  const originalSet = new Set(numbers);
  const deserializedSet = new Set(deserialized);

  // Проверяем, что множества идентичны
  const isCorrect =
    originalSet.size === deserializedSet.size &&
    [...originalSet].every((num) => deserializedSet.has(num));

  const compressionRatio = calculateCompressionRatio(numbers, serialized);

  const status = isCorrect ? "✓" : "✗";
  console.log(
    `    ${status} ${compressionRatio}% | Размер: ${
      JSON.stringify(numbers).length
    } → ${serialized.length} символов`
  );

  if (!isCorrect) {
    console.log(`    ⚠️  Ошибка: Множества не совпадают`);
    console.log(
      `       Исходное: {${[...originalSet]
        .sort((a, b) => a - b)
        .slice(0, 10)
        .join(", ")}${originalSet.size > 10 ? "..." : ""}}`
    );
    console.log(
      `       Получено: {${[...deserializedSet]
        .sort((a, b) => a - b)
        .slice(0, 10)
        .join(", ")}${deserializedSet.size > 10 ? "..." : ""}}`
    );
  }

  return {
    testName,
    original: numbers,
    serialized,
    compressionRatio: parseFloat(compressionRatio),
    isCorrect,
    encoderType,
  };
}

function printStatistics(results) {
  console.log("\n📊 ИТОГОВАЯ СТАТИСТИКА");
  const correctTests = results.filter((r) => r.isCorrect).length;

  console.log(`Всего тестов: ${results.length}`);
  console.log(
    `Прошло успешно: ${correctTests}/${results.length} (${(
      (correctTests / results.length) *
      100
    ).toFixed(1)}%)`
  );
}

function printComparativeStatistics(results, encoders) {
  console.log("\n" + "=".repeat(60));
  console.log("🏆 СРАВНИТЕЛЬНАЯ СТАТИСТИКА ПО АЛГОРИТМАМ");
  console.log("=".repeat(60));

  const algorithmStats = {};

  encoders.forEach((encoder) => {
    const encoderResults = results.filter(
      (r) => r.encoderType === encoder && r.isCorrect
    );
    if (encoderResults.length > 0) {
      const compressionRatios = encoderResults.map((r) => r.compressionRatio);
      algorithmStats[encoder] = {
        name: encoder.toUpperCase(),
        totalTests: encoderResults.length,
        successRate: (
          (encoderResults.length /
            results.filter((r) => r.encoderType === encoder).length) *
          100
        ).toFixed(1),
        avgCompression: (
          compressionRatios.reduce((sum, ratio) => sum + ratio, 0) /
          compressionRatios.length
        ).toFixed(1),
        minCompression: Math.min(...compressionRatios).toFixed(1),
        maxCompression: Math.max(...compressionRatios).toFixed(1),
        results: encoderResults,
      };
    }
  });

  const sortedAlgorithms = Object.entries(algorithmStats).sort(
    ([, a], [, b]) =>
      parseFloat(b.avgCompression) - parseFloat(a.avgCompression)
  );

  console.log("\n📊 Общая производительность алгоритмов:");
  sortedAlgorithms.forEach(([key, stats], index) => {
    const medal =
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
    console.log(`${medal} ${stats.name}:`);
    console.log(
      `   • Успешных тестов: ${stats.totalTests} (${stats.successRate}%)`
    );
    console.log(`   • Среднее сжатие: ${stats.avgCompression}%`);
    console.log(
      `   • Диапазон: ${stats.minCompression}% - ${stats.maxCompression}%`
    );
  });

  console.log("\n🎯 Лучшие результаты каждого алгоритма:");
  sortedAlgorithms.forEach(([key, stats]) => {
    const bestResult = stats.results.sort(
      (a, b) => b.compressionRatio - a.compressionRatio
    )[0];
    console.log(
      `${stats.name}: ${
        bestResult.compressionRatio
      }% (${bestResult.testName.replace(` (${key})`, "")})`
    );
  });

  console.log("\n🔍 Анализ эффективности по типам тестов:");
  const testTypes = [
    "Одно число",
    "Два числа",
    "Три числа",
    "Все однозначные",
    "Все двузначные",
    "Все трёхзначные",
    "Последовательные",
    "Случайные",
  ];

  testTypes.forEach((testType) => {
    const typeResults = results.filter(
      (r) =>
        r.isCorrect &&
        (r.testName.includes(testType) ||
          (testType === "Случайные" && r.testName.includes("Случайные")) ||
          (testType === "Последовательные" &&
            r.testName.includes("Последовательные")))
    );

    if (typeResults.length > 0) {
      const byAlgorithm = {};
      typeResults.forEach((result) => {
        if (!byAlgorithm[result.encoderType]) {
          byAlgorithm[result.encoderType] = [];
        }
        byAlgorithm[result.encoderType].push(result.compressionRatio);
      });

      const avgByAlgorithm = Object.entries(byAlgorithm)
        .map(([algo, ratios]) => ({
          algo: algo.toUpperCase(),
          avg: (ratios.reduce((sum, r) => sum + r, 0) / ratios.length).toFixed(
            1
          ),
        }))
        .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg));

      if (avgByAlgorithm.length > 0) {
        console.log(
          `  ${testType}: ${avgByAlgorithm
            .map((a) => `${a.algo}(${a.avg}%)`)
            .join(", ")}`
        );
      }
    }
  });
}

module.exports = {
  runTest,
  printStatistics,
  printComparativeStatistics,
};
