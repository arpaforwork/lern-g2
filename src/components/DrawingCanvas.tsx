import React, { useRef, useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import { RotateCcw, Download, Eraser, Palette } from 'lucide-react';

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#E8505B');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const colors = [
    { color: '#E8505B', name: 'แดง' },
    { color: '#F4B400', name: 'เหลือง' },
    { color: '#2E6FD1', name: 'น้ำเงิน' },
    { color: '#E0762B', name: 'ส้ม' },
    { color: '#2E9E5B', name: 'เขียว' },
    { color: '#A855C8', name: 'ม่วง' },
    { color: '#8D5B4C', name: 'น้ำตาล' },
    { color: '#222222', name: 'ดำ' },
  ];

  // Initialize Canvas resolution and background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 360 * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, rect.width, 360);
    }
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const pos = getPos(e);
    lastPosRef.current = pos;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = pos;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, 360);
    playSound('pop');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playSound('fanfare');
    const link = document.createElement('a');
    link.download = `ภาพวาดศิลปะ-ป1-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#F0E2C0] shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-[#2D2A26] flex items-center gap-2">
          <Palette className="w-6 h-6 text-[#A855C8]" />
          ผืนผ้าใบวาดภาพระบายสี
        </h3>
        <span className="text-sm font-semibold text-[#8B8378] bg-[#F5ECF9] px-3 py-1 rounded-full">
          แตะแล้วลากเพื่อวาดรูป
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-[#EADBB8] shadow-inner bg-white mb-4">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-[360px] cursor-crosshair touch-none block"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Color Palette */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-[#6B655C]">สี:</span>
          {colors.map((c) => {
            const isSelected = !isEraser && currentColor === c.color;
            return (
              <button
                key={c.color}
                type="button"
                onClick={() => {
                  setIsEraser(false);
                  setCurrentColor(c.color);
                  playSound('pop');
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all transform active:scale-90 border-3 ${
                  isSelected ? 'border-[#2D2A26] scale-110 shadow-md ring-2 ring-white' : 'border-white/60 hover:scale-105'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            );
          })}

          <button
            type="button"
            onClick={() => {
              setIsEraser(true);
              playSound('pop');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-sm border-2 transition-all ${
              isEraser
                ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow'
                : 'bg-[#F4EFEA] text-[#554F45] border-[#D9D0C3] hover:bg-[#EFE8DD]'
            }`}
          >
            <Eraser className="w-4 h-4" />
            ยางลบ
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#6B655C]">ขนาด:</span>
          {[6, 12, 20].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                setBrushSize(sz);
                playSound('pop');
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border-2 transition-all ${
                brushSize === sz
                  ? 'bg-[#A855C8] text-white border-[#A855C8]'
                  : 'bg-[#F4EFEA] text-[#6B655C] border-[#D9D0C3]'
              }`}
            >
              <span
                className="rounded-full bg-current"
                style={{ width: `${Math.min(sz, 14)}px`, height: `${Math.min(sz, 14)}px` }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F0E2C0]">
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FFF1F0] hover:bg-[#FFE0DF] text-[#D9483B] font-bold text-sm border border-[#FFCCC7] transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          ล้างกระดาน
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#2E9E5B] hover:bg-[#25824A] text-white font-bold text-sm shadow-md transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          บันทึกรูปภาพ
        </button>
      </div>
    </div>
  );
};
