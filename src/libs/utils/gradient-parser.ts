/**
 * Parses CSS linear-gradient strings from the database into React Native LinearGradient format
 * Input: "linear-gradient(to bottom right, #ef4444, #7f1d1d)"
 * Output: ["#ef4444", "#7f1d1d"]
 */
export function parseGradientColors(cssGradient: string | null): string[] {
  if (!cssGradient) {
    return ['#ef4444', '#7f1d1d']; // Default red gradient
  }

  // Extract all hex color codes from the gradient string
  const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g;
  const colors = cssGradient.match(colorRegex);

  if (!colors || colors.length === 0) {
    return ['#ef4444', '#7f1d1d']; // Fallback to default
  }

  return colors;
}

/**
 * Gets gradient start and end coordinates based on direction
 * Supports: "to bottom right", "to right", "to bottom", etc.
 */
export function parseGradientDirection(cssGradient: string | null): {
  start: { x: number; y: number };
  end: { x: number; y: number };
} {
  if (!cssGradient) {
    return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }; // Default: top-left to bottom-right
  }

  // Extract direction (e.g., "to bottom right")
  const directionMatch = cssGradient.match(/to\s+([\w\s]+?),/);
  const direction = directionMatch ? directionMatch[1].trim() : 'bottom right';

  // Map common directions to coordinates
  const directionMap: Record<
    string,
    { start: { x: number; y: number }; end: { x: number; y: number } }
  > = {
    'bottom right': { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    right: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
    left: { start: { x: 1, y: 0.5 }, end: { x: 0, y: 0.5 } },
    bottom: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    top: { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
    'bottom left': { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    'top right': { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
    'top left': { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } },
  };

  return directionMap[direction] || directionMap['bottom right'];
}
