import React, { useState } from 'react';
import { StepProcedure } from '../types';
import { playSound, speakText } from '../utils/audio';
import { Volume2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface StepProcedureViewerProps {
  procedures: StepProcedure[];
  lang?: string;
}

export const StepProcedureViewer: React.FC<StepProcedureViewerProps> = ({
  procedures,
  lang = 'th-TH',
}) => {
  const [selectedProcIndex, setSelectedProcIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const currentProc = procedures[selectedProcIndex];
  if (!currentProc) return null;

  const currentStep = currentProc.steps[activeStepIndex];

  const handleSpeakStep = (title: string, desc: string) => {
    playSound('pop');
    speakText(`${title}. ${desc}`, lang);
  };

  const handleSelectProcedure = (idx: number) => {
    playSound('pop');
    setSelectedProcIndex(idx);
    setActiveStepIndex(0);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#F0E2C0] shadow-sm mb-6">
      {/* Procedure Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-[#F0E2C0]">
        {procedures.map((proc, idx) => {
          const isSelected = idx === selectedProcIndex;
          return (
            <button
              key={proc.id}
              type="button"
              onClick={() => handleSelectProcedure(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-2 ${
                isSelected
                  ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow-sm'
                  : 'bg-[#FFFDF9] text-[#6B655C] border-[#EADBB8] hover:bg-[#F8F3E8]'
              }`}
            >
              <span>{proc.emoji}</span>
              <span>{proc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#2D2A26] flex items-center gap-2">
            <span>{currentProc.emoji}</span>
            <span>{currentProc.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#7C7467] font-medium mt-1">
            {currentProc.desc}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSpeakStep(currentStep.title, currentStep.desc)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF4FC] text-[#2563EB] hover:bg-[#DBEAFE] font-bold text-xs transition-all shrink-0 active:scale-95 shadow-xs"
        >
          <Volume2 className="w-4 h-4 animate-bounce-slow" />
          <span>ฟังเสียงอธิบาย</span>
        </button>
      </div>

      {/* Step Numbers Indicator */}
      <div className="flex items-center justify-between gap-1 mb-5 bg-[#FAF6EE] p-2 rounded-2xl border border-[#EFE5D0]">
        {currentProc.steps.map((s, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = idx < activeStepIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                playSound('pop');
                setActiveStepIndex(idx);
              }}
              className={`flex-1 py-1.5 sm:py-2 rounded-xl text-center font-black text-xs sm:text-sm transition-all ${
                isActive
                  ? 'bg-[#FF7A59] text-white shadow-sm scale-102'
                  : isDone
                  ? 'bg-[#EAF7EF] text-[#2E9E5B]'
                  : 'text-[#8B8378] hover:bg-white/80'
              }`}
            >
              <div className="truncate">ขั้นที่ {s.step}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Large Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border-2 border-[#EADBB8] shadow-xs relative">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Big Illustration / Visual Emoji */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFF6E5] border-2 border-[#F2C94C] flex items-center justify-center text-5xl sm:text-6xl shadow-inner shrink-0">
            {currentStep.emoji}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFEAEB] text-[#D9483B] text-xs font-bold mb-2">
              ขั้นตอนที่ {currentStep.step} จาก {currentProc.steps.length}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-[#2D2A26] mb-2 leading-snug">
              {currentStep.title}
            </h4>
            <p className="text-sm sm:text-base text-[#554F45] leading-relaxed font-medium">
              {currentStep.desc}
            </p>

            {currentStep.tip && (
              <div className="mt-3 p-3 rounded-2xl bg-[#EAF7EF] border border-[#A7E8BD] flex items-start gap-2 text-xs text-[#1E7E44] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>คำแนะนำ: {currentStep.tip}</span>
              </div>
            )}
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F0E2C0]">
          <button
            type="button"
            disabled={activeStepIndex === 0}
            onClick={() => {
              playSound('pop');
              setActiveStepIndex((prev) => Math.max(0, prev - 1));
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all ${
              activeStepIndex === 0
                ? 'opacity-40 cursor-not-allowed border-[#EAE4D9] text-[#A8A196]'
                : 'border-[#EADBB8] bg-white hover:bg-[#FDF9F0] text-[#554F45] active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ขั้นก่อนหน้า</span>
          </button>

          <span className="text-xs font-bold text-[#8B8378]">
            {activeStepIndex + 1} / {currentProc.steps.length}
          </span>

          <button
            type="button"
            disabled={activeStepIndex === currentProc.steps.length - 1}
            onClick={() => {
              playSound('pop');
              setActiveStepIndex((prev) => Math.min(currentProc.steps.length - 1, prev + 1));
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all ${
              activeStepIndex === currentProc.steps.length - 1
                ? 'opacity-40 cursor-not-allowed border-[#EAE4D9] text-[#A8A196]'
                : 'border-[#FF7A59] bg-[#FF7A59] text-white hover:bg-[#E86746] shadow-sm active:scale-95'
            }`}
          >
            <span>ขั้นต่อไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
