// A little hand-built pixel-art flower bed for the garden page header. Purely decorative
// (aria-hidden) — every "pixel" is a 1x1 SVG rect on a fixed grid, colored via the
// --pixel-* tokens in globals.css. Not photographic, not a library icon: just five flowers
// and a few grass tufts, deliberately not-too-detailed.

const FLOWER_PIXELS: { dx: number; dy: number; part: "bloom" | "stem" }[] = [
  { dx: 1, dy: 0, part: "bloom" },
  { dx: 3, dy: 0, part: "bloom" },
  { dx: 0, dy: 1, part: "bloom" },
  { dx: 1, dy: 1, part: "bloom" },
  { dx: 2, dy: 1, part: "bloom" },
  { dx: 3, dy: 1, part: "bloom" },
  { dx: 4, dy: 1, part: "bloom" },
  { dx: 1, dy: 2, part: "bloom" },
  { dx: 2, dy: 2, part: "bloom" },
  { dx: 3, dy: 2, part: "bloom" },
  { dx: 2, dy: 3, part: "stem" },
  { dx: 1, dy: 4, part: "stem" },
  { dx: 2, dy: 4, part: "stem" },
  { dx: 3, dy: 4, part: "stem" },
  { dx: 2, dy: 5, part: "stem" },
  { dx: 2, dy: 6, part: "stem" },
];

const TUFT_PIXELS: { dx: number; dy: number }[] = [
  { dx: 0, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
];

const FLOWERS: { x: number; y: number; color: string }[] = [
  { x: 0, y: 1, color: "var(--pixel-purple)" },
  { x: 8, y: 0, color: "var(--pixel-pink)" },
  { x: 16, y: 2, color: "var(--pixel-green)" },
  { x: 24, y: 0, color: "var(--pixel-orange)" },
  { x: 32, y: 1, color: "var(--pixel-yellow)" },
];

const TUFTS: { x: number; y: number }[] = [
  { x: 6, y: 7 },
  { x: 22, y: 8 },
  { x: 39, y: 6 },
];

export default function PixelGarden() {
  return (
    <svg
      className="pixel-garden"
      viewBox="0 0 42 9"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {FLOWERS.map((flower, i) => (
        <g key={i}>
          {FLOWER_PIXELS.map((p, j) => (
            <rect
              key={j}
              x={flower.x + p.dx}
              y={flower.y + p.dy}
              width={1}
              height={1}
              fill={p.part === "bloom" ? flower.color : "var(--pixel-green)"}
            />
          ))}
        </g>
      ))}
      {TUFTS.map((tuft, i) => (
        <g key={`tuft-${i}`}>
          {TUFT_PIXELS.map((p, j) => (
            <rect
              key={j}
              x={tuft.x + p.dx}
              y={tuft.y + p.dy}
              width={1}
              height={1}
              fill="var(--pixel-green)"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
