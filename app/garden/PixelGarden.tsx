"use client";
import { useEffect, useRef } from "react";
import { mount } from "./pixelGardenEngine";

// The animated pixel-art header for /garden: a Japanese cherry tree with a cardinal perched on a bush,
// bushes and scattered flower clusters, swaying grass and butterflies that land on flowers.
// Clicking a flower, bush or the tree waters it; clicking the cardinal makes it chirp. All drawing
// lives in pixelGardenEngine.js (a fixed 300×80 art-pixel scene; CSS scales it to the column
// width); this component only mounts it and wires the "Pause animations" setting (data-motion on
// <html>, see AccessibilityMenu.tsx).

const SCENE = {
  width: 1200,
  height: 320,
  pixel: 4,
  seed: 23,
  groundRows: 3,
  grassMax: 7,
  grassBack: 1.3,
  grassFront: 1.1,
  daisies: 8,
  twinkle: false,
  gusts: false,
  smallFlowers: true,
  cardinal: "bush",
  butterflies: 4,
  bfPalettes: [1, 0],
  tree: { style: "bonsai", seed: 8, right: 1, top: 3, maxW: 180 },
  plants: [
    { k: "bush", x: 0.03, w: 24, h: 12, blooms: 3, back: true },
    { k: "bush", x: 0.075, w: 16, h: 9, blooms: 2 },
    { k: "cosmos", x: 0.12, h: 13, R: 3, pal: "pink" },
    { k: "cosmos", x: 0.135, h: 10, R: 2, pal: "blush" },
    { k: "daisy", x: 0.15, h: 7, R: 2 },
    { k: "bluebell", x: 0.22, h: 14, dir: 1, bells: 4, aw: 5 },
    { k: "daisy", x: 0.245, h: 6, R: 2 },
    { k: "bush", x: 0.3, w: 20, h: 11, blooms: 2, back: true },
    { k: "bush", x: 0.335, w: 14, h: 8, blooms: 2 },
    { k: "tulip", x: 0.38, h: 10, pal: "rose" },
    { k: "tulip", x: 0.395, h: 8, pal: "coral" },
    { k: "sprig", x: 0.415, h: 13, R: 2 },
    { k: "daffodil", x: 0.48, h: 14, R: 3, dir: -1 },
    { k: "daffodil", x: 0.5, h: 11, R: 3, dir: 1 },
    { k: "bush", x: 0.575, w: 28, h: 13, blooms: 4, back: true },
    { k: "bush", x: 0.545, w: 12, h: 7, blooms: 1 },
    { k: "bush", x: 0.605, w: 18, h: 10, blooms: 3 },
    { k: "cosmos", x: 0.655, h: 12, R: 3, pal: "rose" },
    { k: "daisy", x: 0.672, h: 8, R: 2 },
    { k: "bluebell", x: 0.73, h: 12, dir: -1, bells: 4, aw: 5 },
    { k: "daisy", x: 0.79, h: 6, R: 2 },
    { k: "bush", x: 0.865, w: 22, h: 11, blooms: 2, back: true },
    { k: "bush", x: 0.9, w: 14, h: 8, blooms: 2 },
    { k: "tulip", x: 0.955, h: 9, pal: "pink" },
  ],
};

function motionPaused() {
  return document.documentElement.getAttribute("data-motion") === "reduced";
}

export default function PixelGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const garden = mount(canvas, { ...SCENE, paused: motionPaused() });

    const motion = new MutationObserver(() => garden.set({ paused: motionPaused() }));
    motion.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    return () => {
      motion.disconnect();
      garden.destroy();
    };
  }, []);

  return (
    <div className="pixel-garden">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Pixel-art garden: a pink Japanese cherry tree with a red cardinal perched on a bush, bushes and small clusters of flowers, with butterflies drifting between them"
      />
    </div>
  );
}
