/**
 * Color cycling utility for jazzy text rendering
 * Cycles through vibrant colors every 4-7 words
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

export function colorCycleText(text: string): ColorSegment[] {
  const words = text.split(' ');
  const segments: ColorSegment[] = [];
  let colorIndex = 0;
  let wordsInCurrentSegment = Math.floor(Math.random() * 4) + 4; // 4-7 words

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
      wordsInCurrentSegment = Math.floor(Math.random() * 4) + 4;
    }
  });

  return segments;
}
