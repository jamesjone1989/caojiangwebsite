"use client";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useRef, useState } from "react";

export type FocusId =
  | "overview"
  | "books"
  | "village"
  | "wechat"
  | "xiaohongshu"
  | "echo";

type Tilt = {
  x: number;
  y: number;
};

type DragStart = {
  pointerId: number;
  x: number;
  y: number;
  tilt: Tilt;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function XiguaTeacher3D({ focus }: { focus: FocusId }) {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<DragStart | null>(null);

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStart.current = null;
    setIsDragging(false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      tilt,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    setTilt({
      x: clamp(start.tilt.x - (event.clientY - start.y) * 0.045, -7, 7),
      y: clamp(start.tilt.y + (event.clientX - start.x) * 0.065, -14, 14),
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyDirections: Partial<Record<string, Tilt>> = {
      ArrowLeft: { x: tilt.x, y: clamp(tilt.y - 2, -14, 14) },
      ArrowRight: { x: tilt.x, y: clamp(tilt.y + 2, -14, 14) },
      ArrowUp: { x: clamp(tilt.x + 2, -7, 7), y: tilt.y },
      ArrowDown: { x: clamp(tilt.x - 2, -7, 7), y: tilt.y },
      Escape: { x: 0, y: 0 },
    };
    const nextTilt = keyDirections[event.key];
    if (!nextTilt) return;
    event.preventDefault();
    setTilt(nextTilt);
  };

  const style = {
    "--tilt-x": `${tilt.x}deg`,
    "--tilt-y": `${tilt.y}deg`,
    "--shine-x": `${50 + tilt.y * 1.15}%`,
    "--shine-y": `${42 - tilt.x * 1.3}%`,
  } as CSSProperties;

  return (
    <div
      className={`portrait-tilt portrait-focus-${focus} ${isDragging ? "is-dragging" : ""}`}
      style={style}
      role="img"
      aria-label="西瓜老师原始 3D 形象，可拖动轻轻转动，双击复位"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onDoubleClick={() => setTilt({ x: 0, y: 0 })}
      onKeyDown={handleKeyDown}
    >
      <div className="portrait-shadow" aria-hidden="true" />
      <div className="portrait-plate">
        <Image
          className="portrait-image"
          src="/xigua-teacher-exact.png"
          alt=""
          width={1254}
          height={1254}
          priority
          unoptimized
          draggable={false}
          sizes="(max-width: 560px) 88vw, (max-width: 900px) 70vw, 48vw"
        />
        <div className="portrait-shine" aria-hidden="true" />
      </div>
    </div>
  );
}
