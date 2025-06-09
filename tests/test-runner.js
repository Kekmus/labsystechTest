const { serialize, deserialize } = require("../serializer");
const { calculateCompressionRatio } = require("./test-utils");

function runTest(testName, numbers, encoderType = "runLength") {
  console.log(`\n=== ${testName} ===`);
  console.log(
    `Исходные числа (${numbers.length}):`,
    numbers.slice(0, 10).join(", ") + (numbers.length > 10 ? "..." : "")
  );

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

  console.log(`Сжатая строка: "${serialized}"`);
  console.log(`Корректность: ${isCorrect ? "✓" : "✗"}`);
  if (!isCorrect) {
    console.log(`  ⚠️  Множества не совпадают:`);
    console.log(
      `     Исходное: {${[...originalSet].sort((a, b) => a - b).join(", ")}}`
    );
    console.log(
      `     Получено: {${[...deserializedSet]
        .sort((a, b) => a - b)
        .join(", ")}}`
    );
  }
  console.log(
    `Размер исходных данных: ${JSON.stringify(numbers).length} символов`
  );
  console.log(`Размер сжатых данных: ${serialized.length} символов`);
  console.log(`Коэффициент сжатия: ${compressionRatio}%`);

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
  const avgCompression = (
    results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length
  ).toFixed(1);
  const minCompression = Math.min(
    ...results.map((r) => r.compressionRatio)
  ).toFixed(1);
  const maxCompression = Math.max(
    ...results.map((r) => r.compressionRatio)
  ).toFixed(1);

  console.log(`Всего тестов: ${results.length}`);
  console.log(
    `Прошло успешно: ${correctTests}/${results.length} (${(
      (correctTests / results.length) *
      100
    ).toFixed(1)}%)`
  );
  console.log(`Среднее сжатие: ${avgCompression}%`);
  console.log(`Минимальное сжатие: ${minCompression}%`);
  console.log(`Максимальное сжатие: ${maxCompression}%`);

  // Лучшие результаты сжатия
  const bestCompression = results
    .filter((r) => r.isCorrect)
    .sort((a, b) => b.compressionRatio - a.compressionRatio)
    .slice(0, 5);

  console.log("\n🏆 ТОП-5 ЛУЧШИХ РЕЗУЛЬТАТОВ СЖАТИЯ:");
  bestCompression.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.testName}: ${result.compressionRatio}% (${
        result.encoderType
      })`
    );
  });
}

module.exports = {
  runTest,
  printStatistics,
};
