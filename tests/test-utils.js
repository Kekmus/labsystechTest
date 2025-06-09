// Утилитарные функции для тестирования
function calculateCompressionRatio(original, compressed) {
  const originalSize = JSON.stringify(original).length;
  const compressedSize = compressed.length;
  return (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
}

function generateRandomNumbers(count, min = 1, max = 300) {
  const maxPossible = max - min + 1;
  const actualCount = Math.min(count, maxPossible);

  const numbers = new Set();
  while (numbers.size < actualCount) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  const result = Array.from(numbers);
  while (result.length < count) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return result;
}

module.exports = {
  calculateCompressionRatio,
  generateRandomNumbers,
};
