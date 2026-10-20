import React from 'react';
import { BADGES } from '../data/curriculum';
import { X, Award, CheckCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

interface BadgeModalProps {
  stars: number;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ stars, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border-3 border-[#F0E2C0] shadow-2xl relative">
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F4EFEA] hover:bg-[#E8E1D5] flex items-center justify-center text-[#6B655C] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-full bg-[#FFF9EC] text-[#FFB800] mb-2 border border-[#EADBB8]">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-[#2D2A26]">เข็มกลัดคนเก่ง ป.1</h3>
          <p className="text-sm font-semibold text-[#8B8378]">
            สะสมดาวจากการทำแบบฝึกหัดเพื่อปลดล็อกรางวัล
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3D6] text-[#A66E00] font-black text-sm">
            ⭐ มีดาวสะสม {stars} ดวง
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {BADGES.map((b) => {
            const isUnlocked = stars >= b.requiredStars;
            return (
              <div
                key={b.id}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border-2 transition-all ${
                  isUnlocked
                    ? 'bg-[#FFFDF7] border-[#F2C94C] shadow-xs'
                    : 'bg-[#F9F7F4] border-[#E8E2D7] opacity-60'
                }`}
              >
                <div
                  className={`text-3xl w-12 h-12 flex items-center justify-center rounded-2xl ${
                    isUnlocked ? 'bg-[#FFF3D6]' : 'bg-[#EAE4D9] grayscale'
                  }`}
                >
                  {b.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#2D2A26] text-base truncate">{b.name}</h4>
                    {isUnlocked && (
                      <CheckCircle className="w-4 h-4 text-[#2E9E5B] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#8B8378]">{b.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-[#EAF7EF] text-[#2E9E5B]'
                        : 'bg-[#EDE7DC] text-[#7C7467]'
                    }`}
                  >
                    {isUnlocked ? 'ปลดล็อกแล้ว' : `ต้องการ ${b.requiredStars} ⭐`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-[#FF7A59] hover:bg-[#E86746] text-white font-bold text-base shadow-md transition-all active:scale-95"
          >
            ไปเรียนรู้ต่อเลย!
          </button>
        </div>
      </div>
    </div>
  );
};
