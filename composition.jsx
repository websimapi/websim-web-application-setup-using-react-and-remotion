import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useEffect, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate
} from "remotion";
const COLORS = {
  bg: "#fffef8",
  gridStroke: "#2b2b2b",
  headerText: "#1b1b1b",
  numberText: "#111",
  freeBg: "#efefef",
  highlight: "#ffd54f",
  circleFill: "#ff6b6b"
};
const CELL = 150;
const GAP = 8;
const HEADER_BORDER = 4;
const CELL_BORDER = 3;
const BORDER_RADIUS = 12;
const Header = () => {
  const letters = ["B", "I", "N", "G", "O"];
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        display: "flex",
        gap: GAP,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12
      },
      children: letters.map((L) => /* @__PURE__ */ jsxDEV(
        "div",
        {
          style: {
            width: CELL,
            height: CELL,
            borderRadius: BORDER_RADIUS,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            border: `${HEADER_BORDER}px solid ${COLORS.gridStroke}`,
            fontSize: 84,
            fontWeight: 800,
            color: COLORS.headerText,
            fontFamily: "Arial, Helvetica, sans-serif"
          },
          children: L
        },
        L,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 45,
          columnNumber: 9
        }
      ))
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 35,
      columnNumber: 5
    }
  );
};
const Cell = ({ value, highlighted, circleProgress, isHeader }) => {
  const isFree = typeof value === "string" && value.toLowerCase().includes("free");
  const borderWidth = isHeader ? HEADER_BORDER : CELL_BORDER;
  const fontSize = isHeader ? 84 : 56;
  const fontWeight = isHeader ? 900 : 700;
  const borderRadius = BORDER_RADIUS;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        width: CELL,
        height: CELL,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `${borderWidth}px solid ${COLORS.gridStroke}`,
        background: isHeader ? "#ffffff" : isFree ? COLORS.freeBg : "#fff",
        fontSize,
        fontWeight,
        color: isHeader ? COLORS.headerText : COLORS.numberText,
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
        overflow: "hidden",
        borderRadius,
        boxShadow: isHeader ? "0 4px 10px rgba(0,0,0,0.06)" : "none"
      },
      children: [
        typeof circleProgress === "number" && circleProgress > 0 && !isHeader && /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              position: "absolute",
              width: Math.round(CELL * 0.7),
              height: Math.round(CELL * 0.7),
              borderRadius: 999,
              background: COLORS.circleFill,
              opacity: 0.95,
              transform: `scale(${circleProgress})`,
              transition: "none",
              zIndex: 0
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 103,
            columnNumber: 9
          }
        ),
        highlighted && !isFree && !isHeader && /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              position: "absolute",
              inset: 6,
              borderRadius: 8,
              background: COLORS.highlight,
              opacity: 0.9,
              zIndex: 0
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 119,
            columnNumber: 9
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { style: { zIndex: 1 }, children: isFree ? "FREE" : value }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 7
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 82,
      columnNumber: 5
    }
  );
};
const BingoCage = ({ width = 420, height = 240 }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const stateRef = useRef({
    balls: [],
    angle: 0,
    angularVelocity: 0,
    last: 0,
    chuteOpen: false
  });
  useEffect(() => {
    const state = stateRef.current;
    state.balls = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 8;
      state.balls.push({
        x: (Math.random() * 0.6 + 0.2) * width,
        y: (Math.random() * 0.6 + 0.2) * height * 0.8,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        r,
        n: Math.floor(Math.random() * 75) + 1,
        released: false
      });
    }
  }, [width, height]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const state = stateRef.current;
    state.last = performance.now();
    function step(now) {
      const dt = Math.min(40, now - state.last) / 1e3;
      state.last = now;
      state.angularVelocity *= 0.995;
      state.angle += state.angularVelocity * dt;
      const g = 800;
      const gx = Math.sin(state.angle) * g;
      const gy = Math.cos(state.angle) * g;
      const cx = width / 2;
      const cy = height / 2 - 8;
      const radius = Math.min(width, height) * 0.42;
      for (let b of state.balls) {
        if (b.released) {
          b.vy += 900 * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          continue;
        }
        b.vx += gx * dt;
        b.vy += gy * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const dx = b.x - cx;
        const dy = b.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = radius - b.r - 2;
        if (dist > maxDist) {
          const nx = dx / dist;
          const ny = dy / dist;
          b.x = cx + nx * maxDist;
          b.y = cy + ny * maxDist;
          const vn = b.vx * nx + b.vy * ny;
          b.vx = b.vx - 1.8 * vn * nx;
          b.vy = b.vy - 1.8 * vn * ny;
          b.vx *= 0.9;
          b.vy *= 0.9;
        }
        const gapAngle = Math.PI / 8;
        const angleToBall = Math.atan2(dy, dx) - Math.atan2(0, 1);
        const a = Math.atan2(dy, dx);
        const bottomAngle = Math.PI / 2;
        const angleDiff = Math.abs((a - bottomAngle + Math.PI) % (2 * Math.PI) - Math.PI);
        if (!state.chuteOpen && angleDiff < gapAngle && dist > radius - 20 && state.angularVelocity > 0.6) {
          state.chuteOpen = true;
          let cand = null;
          let best = 999;
          for (let bb of state.balls) {
            if (bb.released) continue;
            const dx2 = bb.x - cx;
            const dy2 = bb.y - cy;
            const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            const a2 = Math.atan2(dy2, dx2);
            const ad = Math.abs((a2 - bottomAngle + Math.PI) % (2 * Math.PI) - Math.PI);
            if (ad < best) {
              best = ad;
              cand = bb;
            }
          }
          if (cand) cand.released = true;
        }
        if (state.chuteOpen && state.angularVelocity < 0.3) state.chuteOpen = false;
      }
      state.balls = state.balls.filter((b) => !(b.released && b.y > height + 50));
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(0, 0);
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height - 6, radius * 0.9, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.fillRect(width / 2 - 6, height - 6, 12, 12);
      ctx.fillStyle = "#444";
      ctx.fillRect(width / 2 - 48, height - 6 - 8, 96, 8);
      ctx.restore();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(state.angle * 0.06);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#2b2b2b";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "rgba(40,40,40,0.85)";
      for (let i = -2; i <= 2; i++) {
        const lat = i / 4 * Math.PI * 0.9;
        ctx.beginPath();
        const rlat = Math.cos(lat) * radius;
        ctx.ellipse(0, Math.sin(lat) * (radius * 0.25), rlat, Math.abs(rlat * 0.5), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const a = i / 8 * Math.PI * 2;
        ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius * 0.5);
        ctx.lineTo(Math.cos(a) * -radius, Math.sin(a) * -radius * 0.5);
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(cx, cy);
      const doorW = radius * 0.36;
      const doorH = 12;
      const doorY = radius + 2;
      ctx.fillStyle = stateRef.current.chuteOpen ? "#ff6b6b" : "#e6e6e6";
      ctx.beginPath();
      ctx.roundRect(-doorW / 2, doorY - doorH / 2, doorW, doorH, 6);
      ctx.fill();
      ctx.restore();
      const drawBalls = [...state.balls].sort((a, b) => a.y - b.y);
      for (let b of drawBalls) {
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#222";
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#111";
        ctx.font = `${Math.max(10, b.r * 0.8)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(b.n), b.x, b.y);
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);
  const onSpin = () => {
    const state = stateRef.current;
    state.angularVelocity += 2.6 + Math.random() * 1.2;
    for (let b of state.balls) {
      b.vx += (Math.random() - 0.5) * 220;
      b.vy += -100 - Math.random() * 180;
    }
    setSpinning(true);
    setTimeout(() => setSpinning(false), 1200);
  };
  return /* @__PURE__ */ jsxDEV("div", { style: { width, height, userSelect: "none", display: "flex", flexDirection: "column", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxDEV(
      "canvas",
      {
        ref: canvasRef,
        width,
        height,
        style: {
          borderRadius: 12,
          background: "linear-gradient(180deg,#fafafa,#fff)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
          touchAction: "manipulation"
        },
        onClick: onSpin
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 374,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        onClick: onSpin,
        style: {
          marginTop: 8,
          width: 86,
          height: 28,
          borderRadius: 20,
          background: spinning ? "#ff6b6b" : "#1b9fff",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
        },
        children: "CRANK"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 386,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 373,
    columnNumber: 5
  });
};
const BingoCardClip = ({ match = {} }) => {
  const frame = useCurrentFrame();
  const card = match.card && (match.card.length === 6 || match.card.length === 5) ? match.card : defaultCard();
  const highlights = match.highlights || [];
  const replayActions = Array.isArray(match.replayActions) ? match.replayActions : [];
  const cellProgress = {};
  const needsRowShift = card.length === 5;
  replayActions.forEach((a) => {
    const r = needsRowShift ? a.r + 1 : a.r;
    const key = `${r}-${a.c}`;
    const start = a.frame;
    const end = a.frame + 14;
    const p = interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
    cellProgress[key] = p;
  });
  const scale = interpolate(frame, [0, 12, 30], [0.86, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const lettersRow = ["B", "I", "N", "G", "O"];
  const gridRows = card.length === 5 ? [lettersRow, ...card] : card;
  const boardWidth = CELL * 5 + GAP * 4;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { background: COLORS.bg, justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        width: boardWidth + 40,
        // slightly reduced extra padding so board appears larger
        padding: 20,
        borderRadius: 20,
        background: "#ffffff",
        boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
        transform: `scale(${scale})`,
        opacity
      },
      children: /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: `repeat(5, ${CELL}px)`, gap: GAP }, children: gridRows.map(
        (row, rIdx) => row.map((cell, cIdx) => {
          const highlighted = Array.isArray(highlights) && highlights[rIdx] && highlights[rIdx][cIdx];
          const progress = cellProgress[`${rIdx}-${cIdx}`] ?? 0;
          const isHeader = rIdx === 0 && Array.isArray(gridRows[0]) && String(gridRows[0][0]).length === 1 && gridRows[0].length === 5;
          return /* @__PURE__ */ jsxDEV(
            Cell,
            {
              value: cell,
              highlighted,
              circleProgress: progress,
              isHeader
            },
            `${rIdx}-${cIdx}`,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 484,
              columnNumber: 19
            }
          );
        })
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 470,
        columnNumber: 11
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 468,
        columnNumber: 9
      })
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 457,
      columnNumber: 7
    }
  ) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 456,
    columnNumber: 5
  });
};
function defaultCard() {
  return [
    ["3", "18", "31", "47", "61"],
    ["9", "16", "29", "52", "66"],
    ["2", "20", "FREE", "57", "71"],
    ["12", "24", "39", "50", "69"],
    ["7", "23", "33", "48", "75"]
  ];
}
export {
  BingoCage,
  BingoCardClip
};
