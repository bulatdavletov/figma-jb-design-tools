import type { FoundColor, VariableCandidate, ColorMatchResult } from "./types"

// ---------------------------------------------------------------------------
// CIE Lab color space conversion (RGB 0-1 → XYZ → Lab)
// ---------------------------------------------------------------------------

// sRGB linearization
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

// D65 illuminant reference white
const REF_X = 95.047
const REF_Y = 100.0
const REF_Z = 108.883

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r) * 100
  const lg = srgbToLinear(g) * 100
  const lb = srgbToLinear(b) * 100

  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750
  const z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041

  return [x, y, z]
}

function labF(t: number): number {
  const delta = 6 / 29
  return t > delta * delta * delta ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  const fx = labF(x / REF_X)
  const fy = labF(y / REF_Y)
  const fz = labF(z / REF_Z)

  const L = 116 * fy - 16
  const a = 500 * (fx - fy)
  const bVal = 200 * (fy - fz)

  return [L, a, bVal]
}

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b)
  return xyzToLab(x, y, z)
}

// ---------------------------------------------------------------------------
// CIE76 Delta E (Euclidean distance in Lab space)
// Perceptually uniform — grays won't match saturated colors.
// ---------------------------------------------------------------------------

export function deltaE(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
): number {
  const [L1, a1, b1] = rgbToLab(c1.r, c1.g, c1.b)
  const [L2, a2, b2] = rgbToLab(c2.r, c2.g, c2.b)

  const dL = L1 - L2
  const da = a1 - a2
  const db = b1 - b2

  return Math.sqrt(dL * dL + da * da + db * db)
}

// Max theoretical Delta E (black vs most saturated color) is ~150+.
// We use 100 as a practical reference for "100% different".
const MAX_PRACTICAL_DELTA_E = 100

export function diffPercent(distance: number): number {
  const pct = (distance / MAX_PRACTICAL_DELTA_E) * 100
  return Math.round(Math.min(pct, 100) * 10) / 10
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

export function findBestMatches(
  foundColors: FoundColor[],
  candidates: VariableCandidate[],
  maxSuggestions: number = 10
): ColorMatchResult[] {
  return foundColors.map((found) => {
    const scored = candidates
      .map((candidate) => ({
        candidate,
        distance: deltaE(found, candidate),
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
