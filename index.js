const { serialize, deserialize } = require("./serializer");

// Измените этот массив для тестирования ваших данных
const numbers = [1, 5, 10, 50, 100, 200, 300];

console.log("🔍 Демонстрация сжатия чисел");
console.log("📋 Исходные данные:", numbers);

// Сериализация с разными кодировщиками
const encoders = ["ascii85", "runLength", "hex"];

encoders.forEach((encoder) => {
  const compressed = serialize(numbers, encoder);
  const restored = deserialize(compressed, encoder);

  console.log(`\n📦 ${encoder.toUpperCase()}:`);
  console.log(`   Сжатая строка: ${compressed}`);
  console.log(`   Восстановлено: ${restored}`);
});

module.exports = { serialize, deserialize };
