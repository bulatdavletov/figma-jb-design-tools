import type { FoundColor, VariableCandidate, ColorMatchResult } from "./types"

const MAX_RGB_DISTANCE = Math.sqrt(255 * 255 + 255 * 255 + 255 * 255)

export function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  const dr = (c1.r - c2.r) * 255
  const dg = (c1.g - c2.g) * 255
  const db = (c1.b - c2.b) * 255
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

export function diffPercent(distance: number): number {
  return Math.round((distance / MAX_RGB_DISTANCE) * 1000) / 10
}

export function findBestMatches(
  foundColors: FoundColor[],
  candidates: VariableCandidate[],
  maxSuggestions: number = 10
): ColorMatchResult[] {
  return foundColors.map((found) => {
    const scored = candidates
      .map((candidate) => ({
        candidate,
        distance: colorDistance(found, candidate),
      }))
      .sort((a, b) => a.distance - b.distance)

    const allMatches = scored.slice(0, maxSuggestions).map((s) => ({
      candidate: s.candidate,
      diffPercent: diffPercent(s.distance),
    }))

    const best = scored[0]

    return {
      found,
      bestMatch: best?.candidate ?? null,
      diffPercent: best ? diffPercent(best.distance) : 100,
      allMatches,
    }
  })
}
