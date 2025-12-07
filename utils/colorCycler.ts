/**
 * Color cycling utility for jazzy text rendering
 * Cycles through vibrant colors every 4-7 words using deterministic hashing
 */

export const VIBRANT_COLORS = [
  '#00FF41', // Neon green
  '#00D9FF', // Cyan
  '#FF006E', // Hot pink
  '#FFB700', // Gold
  '#B537F2', // Purple
  '#00F5FF', // Electric blue
  '#FF3D00', // Deep orange
  '#76FF03', // Lime
];

interface ColorSegment {
  text: string;
  color: string;
}

// Deterministic hash function to replace Math.random()
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function colorCycleText(text: string): ColorSegment[] {
  const words = text.split(' ');
  const segments: ColorSegment[] = [];
  let colorIndex = 0;
  
  // Use hash of text to determine starting word count deterministically
  const hash = hashCode(text);
  let wordsInCurrentSegment = (hash % 4) + 4; // 4-7 words, deterministic based on text

  let currentText = '';

  words.forEach((word, index) => {
    currentText += (currentText ? ' ' : '') + word;
    wordsInCurrentSegment--;

    if (wordsInCurrentSegment === 0 || index === words.length - 1) {
      segments.push({
        text: currentText,
        color: VIBRANT_COLORS[colorIndex % VIBRANT_COLORS.length],
      });
      colorIndex++;
      currentText = '';
      // Re-hash based on position to keep deterministic but vary
      const posHash = hashCode(text + index);
      wordsInCurrentSegment = (posHash % 4) + 4;
    }
  });

  return segments;
}
