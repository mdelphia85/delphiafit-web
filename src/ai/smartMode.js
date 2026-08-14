export function smartAdjust(block, elapsed, planned) {
  const ratio = elapsed / (planned * 60);

  if (ratio > 1.2) {
    return "shorten";
  }

  if (ratio < 0.6) {
    return "extend";
  }

  return "keep";
}
