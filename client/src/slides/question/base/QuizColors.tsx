export function getColor(index: number): string {
  const colors = [
    'rgb(255, 105, 180)', // Pink
    'rgb(123, 211, 234)', // Soft Light Blue
    'rgba(255, 220, 80, 1)', // Soft Bright Yellow
    'rgba(160, 80, 255, 1)', // Soft Purple

    'rgb(255,120,0)', // Orange
    'rgb(0,0,255)', // Blue
    'rgb(255,0,0)', // Red
    'rgb(0,255,0)', // Green
  ];
  return colors[index % colors.length]; // Loop through colors if there are more options
}

export function yesNoColors(isCorrect: boolean): string {
  // Return 'green' if correct, 'red' if incorrect
  return isCorrect ? 'rgb(154, 191, 128)' : 'rgb(255, 69, 69)';
}

export function rankColors() {
  return 'rgb(128, 128, 128)'; // No color for other ranks
}
