/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SUBJECTS } from './data/curriculum';
import { Subject, CardItem } from './types';
import { playSound, speakText } from './utils/audio';
import { recordStudyVisit, loadUserStats } from './utils/stats';
import { QuizView } from './components/QuizView';
import { DrawingCanvas } from './components/DrawingCanvas';
import { BadgeModal } from './components/BadgeModal';
import { StatsDashboard } from './components/StatsDashboard';
import { StepProcedureViewer } from './components/StepProcedureViewer';
import { EnglishVocabExplorer } from './components/EnglishVocabExplorer';
import {
  ArrowLeft,
  Volume2,
  Award,
  Sparkles,
  BookOpen,
  PenTool,
  Palette,
  BarChart3,
  ListOrdered,
  Layers,
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'subjects' | 'dashboard'>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'procedures' | 'quiz' | 'draw'>('learn');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [playingCardIndex, setPlayingCardIndex] = useState<number | null>(null);

  // Load saved stars from stats/localStorage
  useEffect(() => {
    try {
      const stats = loadUserStats();
      const savedStars = localStorage.getItem('learn_p1_stars');
      const starCount = savedStars !== null ? parseInt(savedStars, 10) : stats.totalStars;
      setStars(starCount || 0);
    } catch {
      // ignore
    }
  }, []);

  const addStars = (count: number) => {
    setStars((prev) => {
      const next = prev + count;
      try {
        localStorage.setItem('learn_p1_stars', next.toString());
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSelectSubject = (subj: Subject) => {
    playSound('pop');
    recordStudyVisit(subj.id);
    setSelectedSubject(subj);
    setViewMode('subjects');

    // Default tab
    if (subj.procedures && (!subj.categories || subj.categories.length === 0)) {
      setActiveTab('procedures');
    } else {
      setActiveTab('learn');
    }

    setSelectedCategoryIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubjectById = (subjectId: string) => {
    const found = SUBJECTS.find((s) => s.id === subjectId);
    if (found) {
      handleSelectSubject(found);
    }
  };

  const handleBackHome = () => {
    playSound('pop');
    setSelectedSubject(null);
  };

  const handleCardClick = (card: CardItem, idx: number) => {
    playSound('pop');
    setPlayingCardIndex(idx);

    const soundText = card.soundText || card.title;
    const lang = selectedSubject?.lang || 'th-TH';
    speakText(soundText, lang);

    setTimeout(() => {
      setPlayingCardIndex(null);
    }, 1200);
  };

  // Get current active cards list based on categories or flat cards
  const getCurrentCards = (): CardItem[] => {
    if (!selectedSubject) return [];
    if (selectedSubject.categories && selectedSubject.categories.length > 0) {
      return selectedSubject.categories[selectedCategoryIndex]?.cards || [];
    }
    return selectedSubject.cards || [];
  };

  return (
    <div className="min-h-screen bg-[#FFF9EC] text-[#2D2A26] pb-12">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FFF9EC]/95 backdrop-blur-md border-b-2 border-[#F0E2C0] px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {selectedSubject ? (
            <button
              type="button"
              onClick={handleBackHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-[#EADBB8] font-bold text-xs sm:text-sm text-[#554F45] hover:bg-[#FDF6E8] active:scale-95 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>เลือกวิชา</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce-slow">🌈</span>
              <h1 className="text-lg sm:text-2xl font-black text-[#2D2A26] tracking-tight">
                เรียนสนุก ป.1
              </h1>
            </div>
          )}

          {/* Nav Center Switch: วิชาเรียน vs สรุปสถิติ */}
          <div className="flex items-center gap-1 bg-[#F3ECE0] p-1 rounded-2xl border border-[#E8DFC9]">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setViewMode('subjects');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                viewMode === 'subjects'
                  ? 'bg-white text-[#2D2A26] shadow-xs'
                  : 'text-[#6B655C] hover:text-[#2D2A26]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E8505B]" />
              <span className="hidden sm:inline">วิชาเรียน</span>
              <span className="sm:hidden">บทเรียน</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setSelectedSubject(null);
                setViewMode('dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-white text-[#2D2A26] shadow-xs'
                  : 'text-[#6B655C] hover:text-[#2D2A26]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#3B82C4]" />
              <span>สรุปสถิติ</span>
            </button>
          </div>

          {/* Star Counter & Badges Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playSound('star');
                setShowBadgeModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#FFD966] text-[#2D2A26] font-black text-xs sm:text-sm hover:bg-[#FFF4D6] shadow-xs active:scale-95 transition-all"
            >
              <span className="text-sm sm:text-base">⭐</span>
              <span>{stars}</span>
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {viewMode === 'dashboard' ? (
          /* ================= STATS DASHBOARD (RECHARTS) ================= */
          <StatsDashboard
            onBack={() => setViewMode('subjects')}
            onSelectSubject={handleSelectSubjectById}
          />
        ) : !selectedSubject ? (
          /* ================= HOME VIEW (SUBJECTS GRID) ================= */
          <div>
            {/* Hero Banner */}
            <div className="text-center mb-6 pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFEAEB] text-[#D9483B] text-xs sm:text-sm font-bold mb-2">
                หลักสูตร ป.1 ครบทุกกลุ่มสาระการเรียนรู้ (9 วิชาหลัก)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D2A26] leading-tight mb-2">
                สนุกกับการเรียนรู้ ทุกที่ ทุกเวลา!
              </h2>
              <p className="text-xs sm:text-base text-[#6B655C] max-w-lg mx-auto font-medium">
                พยัญชนะครบ 44 ตัว • สระและวรรณยุกต์ • รูปเรขาคณิต 2D/3D • อวัยวะใน-นอก • พืชและสัตว์ • ขั้นตอนมารยาทไทย • ดนตรีไทย • คำศัพท์ภาษาอังกฤษ 500 คำ!
              </p>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {SUBJECTS.map((subj) => {
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => handleSelectSubject(subj)}
                    className="group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl bg-white border-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer"
                    style={{ borderColor: subj.color }}
                  >
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-3 transition-transform group-hover:scale-110 shadow-xs"
                      style={{ backgroundColor: subj.bgLight }}
                    >
                      {subj.emoji}
                    </div>

                    <div className="w-full">
                      <h3 className="font-extrabold text-base sm:text-lg text-[#2D2A26] mb-1">
                        {subj.name}
                      </h3>
                      <p className="text-xs text-[#7C7467] line-clamp-2 leading-relaxed">
                        {subj.description}
                      </p>
                    </div>

                    <div className="mt-3 w-full pt-2 border-t border-[#F0E2C0]/60 flex items-center justify-between text-[11px] font-bold text-[#8B8378]">
                      <span>{subj.englishName}</span>
                      <span style={{ color: subj.color }}>เริ่มเรียน →</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Banner linking to stats dashboard */}
            <div className="mt-8 p-4 rounded-3xl bg-white border-2 border-[#EADBB8] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📊</div>
                <div>
                  <h4 className="font-bold text-[#2D2A26] text-sm sm:text-base">
                    ติดตามพัฒนาการของน้องได้ที่แดชบอร์ด
                  </h4>
                  <p className="text-xs text-[#7C7467]">
                    ดูกราฟแท่งและแผนภูมิวงกลมแสดงความคืบหน้าของเด็กในแต่ละวิชา
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setViewMode('dashboard');
                }}
                className="px-4 py-2 rounded-2xl bg-[#3B82C4] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all shrink-0"
              >
                ดูสถิติ →
              </button>
            </div>
          </div>
        ) : (
          /* ================= SUBJECT VIEW ================= */
          <div className="animate-fadeIn">
            {/* Subject Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#F0E2C0] shadow-xs mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0"
                  style={{ backgroundColor: selectedSubject.bgLight }}
                >
                  {selectedSubject.emoji}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#2D2A26]">
                    {selectedSubject.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7C7467] font-medium">
                    {selectedSubject.description}
                  </p>
                </div>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F5F0E4] rounded-2xl self-start sm:self-auto flex-wrap">
                {/* Learn Cards Tab (if has categories or not exclusively procedures) */}
                {(!selectedSubject.procedures ||
                  (selectedSubject.categories && selectedSubject.categories.length > 0)) && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setActiveTab('learn');
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'learn'
                        ? 'bg-white text-[#2D2A26] shadow-xs'
                        : 'text-[#6B655C] hover:text-[#2D2A26]'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#FF7A59]" />
                    <span>บทเรียน</span>
                  </button>
                )}

                {/* Procedure Steps Tab (if has step-by-step procedures) */}
                {selectedSubject.procedures && selectedSubject.procedures.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setActiveTab('procedures');
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'procedures'
                        ? 'bg-white text-[#2D2A26] shadow-xs'
                        : 'text-[#6B655C] hover:text-[#2D2A26]'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4 text-[#D49A1A]" />
                    <span>ขั้นตอนทำจริง</span>
                  </button>
                )}

                {/* Quiz Tab */}
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setActiveTab('quiz');
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-white text-[#2D2A26] shadow-xs'
                      : 'text-[#6B655C] hover:text-[#2D2A26]'
                  }`}
                >
                  <PenTool className="w-4 h-4 text-[#3B82C4]" />
                  <span>แบบฝึกหัด (5 ข้อ)</span>
                </button>

                {/* Draw Canvas Tab */}
                {selectedSubject.hasDraw && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setActiveTab('draw');
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'draw'
                        ? 'bg-white text-[#2D2A26] shadow-xs'
                        : 'text-[#6B655C] hover:text-[#2D2A26]'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-[#A855C8]" />
                    <span>วาดภาพ</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB: PROCEDURES (สังคมศึกษา, สุขศึกษา, การงานอาชีพ) */}
            {activeTab === 'procedures' && selectedSubject.procedures && (
              <StepProcedureViewer
                procedures={selectedSubject.procedures}
                lang={selectedSubject.lang}
              />
            )}

            {/* TAB: LEARN */}
            {activeTab === 'learn' && (
              <div>
                {/* Special English 500 Vocabulary Explorer */}
                {selectedSubject.isSpecialEnglish ? (
                  <EnglishVocabExplorer />
                ) : (
                  <div>
                    {/* Note Banner */}
                    <div className="p-3.5 mb-4 rounded-2xl bg-white border-2 border-dashed border-[#E0D2B4] flex items-center justify-between text-xs sm:text-sm text-[#6B655C]">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">📢</span>
                        {selectedSubject.note}
                      </span>
                      <span className="text-[11px] font-bold text-[#FF7A59] shrink-0 bg-[#FFF3F0] px-2 py-0.5 rounded-full ml-2">
                        แตะเพื่อฟังเสียง 🔊
                      </span>
                    </div>

                    {/* Sub-Category Pills */}
                    {selectedSubject.categories && selectedSubject.categories.length > 1 && (
                      <div className="space-y-2 mb-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                          {selectedSubject.categories.map((cat, idx) => {
                            const isCatActive = idx === selectedCategoryIndex;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  playSound('pop');
                                  setSelectedCategoryIndex(idx);
                                }}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-2 ${
                                  isCatActive
                                    ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow-xs'
                                    : 'bg-white text-[#6B655C] border-[#EADBB8] hover:bg-[#FDF9F0]'
                                }`}
                              >
                                {cat.emoji && <span>{cat.emoji}</span>}
                                <span>{cat.title}</span>
                                <span className="opacity-70 text-[11px]">
                                  ({cat.cards.length})
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Category Info Box (e.g. grammar note / concept explanation) */}
                        {selectedSubject.categories[selectedCategoryIndex]?.infoBox && (
                          <div className="bg-[#FFFDF9] border border-[#EADBB8] p-3 rounded-2xl text-xs sm:text-sm text-[#554F45] font-semibold flex items-center gap-2">
                            <span>💡</span>
                            <span>{selectedSubject.categories[selectedCategoryIndex].infoBox}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {getCurrentCards().map((card, idx) => {
                        const isPlaying = playingCardIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleCardClick(card, idx)}
                            className={`group relative flex flex-col items-center justify-between p-3.5 rounded-3xl bg-white border-2 transition-all duration-150 active:scale-95 text-center cursor-pointer shadow-xs ${
                              isPlaying
                                ? 'border-[#2E9E5B] ring-2 ring-[#2E9E5B]/20 bg-[#F4FCF6]'
                                : 'border-[#EADBB8] hover:border-[#D9C496]'
                            }`}
                          >
                            {/* Audio Wave Indicator */}
                            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#F5F0E4] flex items-center justify-center text-[#8B8378] group-hover:text-[#2563EB] group-hover:bg-[#EBF4FC] transition-colors">
                              <Volume2
                                className={`w-3.5 h-3.5 ${
                                  isPlaying ? 'text-[#2E9E5B] animate-pulse' : ''
                                }`}
                              />
                            </div>

                            <div className="text-4xl sm:text-5xl my-2 select-none transform group-hover:scale-110 transition-transform">
                              {card.emoji}
                            </div>

                            <div className="w-full mt-1">
                              <div className="font-black text-base sm:text-lg text-[#2D2A26] leading-tight">
                                {card.title}
                              </div>
                              {card.subtitle && (
                                <div className="text-[11px] text-[#7C7467] font-medium mt-0.5 line-clamp-2">
                                  {card.subtitle}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: QUIZ */}
            {activeTab === 'quiz' && (
              <QuizView
                subject={selectedSubject}
                onAddStar={addStars}
                onBackToLearn={() => setActiveTab('learn')}
                onBackHome={handleBackHome}
              />
            )}

            {/* TAB: DRAW */}
            {activeTab === 'draw' && (
              <div>
                <DrawingCanvas />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rewards / Badge Modal */}
      {showBadgeModal && (
        <BadgeModal stars={stars} onClose={() => setShowBadgeModal(false)} />
      )}
    </div>
  );
}
