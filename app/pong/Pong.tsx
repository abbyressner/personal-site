"use client";
import { useEffect, useRef } from "react";

// Port of github.com/abbyressner/pong (Processing) to canvas. Original bugs fixed: the computer
// paddle now moves at a capped speed so it can lose, the player paddle moves once per frame, the
// ball only bounces off a paddle it's moving toward (so it can't get stuck), and serves reset.
const WIDTH = 800;
const HEIGHT = 600;
const BALL_DIAMETER = 32;
const PADDLE_W = 16;
const PADDLE_H = 140;
const PADDLE_INSET = 24;
const PLAYER_SPEED = 7;
const CPU_SPEED = 4.5;
const SERVE_SPEED = 5;

type Paddle = { x: number; y: number; speedY: number };
type Ball = { x: number; y: number; speedX: number; speedY: number };
type Palette = { board: string; ink: string; muted: string; accent: string; mono: string };

// Reads the site's color tokens so the board follows the theme and contrast toggles.
function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    board: `color-mix(in oklch, ${v("--text-strong")} 4%, ${v("--page")})`,
    ink: v("--text-strong"),
    muted: v("--text-muted"),
    accent: v("--accent"),
    mono: v("--font-mono") || "monospace",
  };
}

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let palette = readPalette();
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    const ball: Ball = { x: WIDTH / 2, y: HEIGHT / 2, speedX: 0, speedY: 0 };
    const paddleLeft: Paddle = { x: PADDLE_INSET, y: HEIGHT / 2, speedY: 0 };
    const paddleRight: Paddle = { x: WIDTH - PADDLE_INSET, y: HEIGHT / 2, speedY: 0 };
    let scoreLeft = 0;
    let scoreRight = 0;
    let pointerY: number | null = null;
    let started = false;

    // reset the ball to the center, serving toward whoever just won the point
    const serve = (direction: number) => {
      ball.x = WIDTH / 2;
      ball.y = HEIGHT / 2;
      ball.speedX = SERVE_SPEED * direction;
      ball.speedY = Math.random() * 6 - 3;
    };
    const start = () => {
      if (started) return;
      started = true;
      serve(1);
    };

    const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
    const map = (v: number, a: number, b: number, c: number, d: number) =>
      c + ((v - a) * (d - c)) / (b - a);
    const keepOnScreen = (p: Paddle) => {
      p.y = clamp(p.y, PADDLE_H / 2, HEIGHT - PADDLE_H / 2);
    };
    const hits = (p: Paddle) =>
      ball.y + BALL_DIAMETER / 2 > p.y - PADDLE_H / 2 && ball.y - BALL_DIAMETER / 2 < p.y + PADDLE_H / 2;
    const bounceOff = (p: Paddle) => {
      ball.speedX = -ball.speedX;
      ball.speedY = map(ball.y - p.y, -PADDLE_H / 2, PADDLE_H / 2, -8, 8);
    };

    const update = () => {
      // player paddle: arrow keys / W-S, or follow the mouse/finger
      if (pointerY !== null) {
        paddleRight.y += clamp(pointerY - paddleRight.y, -PLAYER_SPEED * 2, PLAYER_SPEED * 2);
      } else {
        paddleRight.y += paddleRight.speedY;
      }
      keepOnScreen(paddleRight);
      if (!started) return;

      ball.x += ball.speedX;
      ball.y += ball.speedY;

      // border detection
      if (ball.x - BALL_DIAMETER / 2 > WIDTH) {
        scoreLeft++;
        serve(-1);
      }
      if (ball.x + BALL_DIAMETER / 2 < 0) {
        scoreRight++;
        serve(1);
      }
      if (ball.y + BALL_DIAMETER / 2 > HEIGHT && ball.speedY > 0) ball.speedY = -ball.speedY;
      if (ball.y - BALL_DIAMETER / 2 < 0 && ball.speedY < 0) ball.speedY = -ball.speedY;

      // computer paddle tracks the ball at a capped speed so it can be beaten
      paddleLeft.y += clamp(ball.y - paddleLeft.y, -CPU_SPEED, CPU_SPEED);
      keepOnScreen(paddleLeft);

      // only bounce when the ball is moving toward the paddle, so it can't get stuck
      if (ball.speedX < 0 && ball.x - BALL_DIAMETER / 2 < paddleLeft.x + PADDLE_W / 2 &&
          ball.x > paddleLeft.x && hits(paddleLeft)) {
        bounceOff(paddleLeft);
      }
      if (ball.speedX > 0 && ball.x + BALL_DIAMETER / 2 > paddleRight.x - PADDLE_W / 2 &&
          ball.x < paddleRight.x && hits(paddleRight)) {
        bounceOff(paddleRight);
      }
    };

    const draw = () => {
      ctx.fillStyle = palette.board;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // dashed center line (hidden before the first serve so it doesn't cross the prompt)
      ctx.fillStyle = palette.muted;
      if (started) for (let y = 12; y < HEIGHT; y += 36) ctx.fillRect(WIDTH / 2 - 1, y, 2, 18);

      ctx.font = `500 44px ${palette.mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(String(scoreLeft), WIDTH / 2 - 60, 28);
      ctx.fillText(String(scoreRight), WIDTH / 2 + 60, 28);

      ctx.fillStyle = palette.ink;
      ctx.fillRect(paddleLeft.x - PADDLE_W / 2, paddleLeft.y - PADDLE_H / 2, PADDLE_W, PADDLE_H);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(paddleRight.x - PADDLE_W / 2, paddleRight.y - PADDLE_H / 2, PADDLE_W, PADDLE_H);

      ctx.fillStyle = palette.ink;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_DIAMETER / 2, 0, Math.PI * 2);
      ctx.fill();

      if (!started) {
        ctx.fillStyle = palette.muted;
        ctx.font = `400 20px ${palette.mono}`;
        ctx.textBaseline = "middle";
        ctx.fillText("press ↑ / ↓ or tap the board to serve", WIDTH / 2, HEIGHT / 2 + 70);
      }
    };

    let frame = 0;
    const loop = () => {
      update();
      draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // key detection
    const UP = ["ArrowUp", "w", "W"];
    const DOWN = ["ArrowDown", "s", "S"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (UP.includes(e.key)) paddleRight.speedY = -PLAYER_SPEED;
      else if (DOWN.includes(e.key)) paddleRight.speedY = PLAYER_SPEED;
      else return;
      pointerY = null;
      start();
      if (e.key.startsWith("Arrow")) e.preventDefault(); // don't scroll the page
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if ((UP.includes(e.key) && paddleRight.speedY < 0) || (DOWN.includes(e.key) && paddleRight.speedY > 0)) {
        paddleRight.speedY = 0;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerY = ((e.clientY - rect.top) / rect.height) * HEIGHT;
    };
    const onPointerDown = (e: PointerEvent) => {
      onPointerMove(e);
      start();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pong-board"
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label="Pong. You control the right paddle with the arrow keys, W and S, or by moving over the board."
    />
  );
}
