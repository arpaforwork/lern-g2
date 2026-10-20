import React, { useState, useMemo } from 'react';
import { CardItem } from '../types';
import { ALL_ENGLISH_WORDS, ENGLISH_VOCAB_500 } from '../data/curriculumEnglish';
import { playSound, speakText } from '../utils/audio';
import { Search, Volume2, Sparkles, Filter, X } from 'lucide-react';

export const EnglishVocabExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const filteredWords = useMemo(() => {
    let list: CardItem[] = [];
    if (selectedCategory === 'all') {
      list = ALL_ENGLISH_WORDS;
    } else {
      const found = ENGLISH_VOCAB_500.find((c) => c.category === selectedCategory);
      list = found ? found.items : ALL_ENGLISH_WORDS;
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter(
      (w) =>
        w.title.toLowerCase().includes(query) ||
        (w.subtitle && w.subtitle.toLowerCase().includes(query))
    );
  }, [searchQuery, selectedCategory]);

  const handlePlaySound = (word: CardItem) => {
    playSound('pop');
    setPlayingWord(word.title);
    speakText(word.soundText || word.title, 'en-US');
    setTimeout(() => {
      setPlayingWord(null);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Banner / Counter */}
      <div className="bg-white rounded-3xl p-5 border-3 border-[#F0E2C0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF0FB] text-[#3B46B5] text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            500+ Essential English Words
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#2D2A26]">
            คลังคำศัพท์ภาษาอังกฤษ 500 คำ
          </h3>
          <p className="text-xs text-[#7C7467] font-medium">
            รวมคำศัพท์จำเป็น ของใช้ในชีวิตประจำวัน สัตว์ อาหาร และกริยาพื้นฐาน
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F6F4EF] px-4 py-2 rounded-2xl border border-[#E8DFC9] shrink-0">
          <span className="text-sm font-bold text-[#8B8378]">แสดงผล:</span>
          <span className="text-lg font-black text-[#3B46B5]">{filteredWords.length}</span>
          <span className="text-xs font-bold text-[#8B8378]">/ {ALL_ENGLISH_WORDS.length} คำ</span>
        </div>
      </div>

      {/* Search Input & Category Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#F0E2C0] shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8378]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาคำศัพท์ เช่น toothbrush, แปรงสีฟัน, cat, แมว..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl border-2 border-[#EADBB8] focus:border-[#4F5BD5] focus:outline-none font-bold text-sm bg-[#FFFDF9] text-[#2D2A26] placeholder-[#A39B8E]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F4EFEA] hover:bg-[#EAE4DC] flex items-center justify-center text-[#6B655C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
              selectedCategory === 'all'
                ? 'bg-[#4F5BD5] text-white border-[#4F5BD5] shadow-xs'
                : 'bg-white text-[#6B655C] border-[#EADBB8] hover:bg-[#F8F5EE]'
            }`}
          >
            🌟 ทั้งหมด ({ALL_ENGLISH_WORDS.length})
          </button>

          {ENGLISH_VOCAB_500.map((cat) => {
            const isSelected = selectedCategory === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => {
                  playSound('pop');
                  setSelectedCategory(cat.category);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
                  isSelected
                    ? 'bg-[#4F5BD5] text-white border-[#4F5BD5] shadow-xs'
                    : 'bg-white text-[#6B655C] border-[#EADBB8] hover:bg-[#F8F5EE]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.category.split(' ')[0]}</span>
                <span className="opacity-70 text-[10px]">({cat.items.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-[#EADBB8]">
          <div className="text-4xl mb-2">🔍</div>
          <div className="font-bold text-lg text-[#2D2A26]">ไม่พบคำศัพท์ที่ตรงกับการค้นหา</div>
          <p className="text-xs text-[#8B8378] mt-1">ลองพิมพ์คำอื่น หรือกดล้างการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredWords.map((item, idx) => {
            const isPlaying = playingWord === item.title;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePlaySound(item)}
                className={`group relative flex flex-col items-center justify-between p-3.5 rounded-3xl bg-white border-2 transition-all duration-150 active:scale-95 text-center cursor-pointer shadow-xs ${
                  isPlaying
                    ? 'border-[#4F5BD5] ring-2 ring-[#4F5BD5]/20 bg-[#F4F6FF]'
                    : 'border-[#EADBB8] hover:border-[#4F5BD5]/60 hover:shadow-md'
                }`}
              >
                {/* Audio Icon */}
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#EEF0FB] flex items-center justify-center text-[#4F5BD5]">
                  <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                </div>

                <div className="text-4xl sm:text-5xl my-2 select-none transform group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>

                <div className="w-full mt-1">
                  <div className="font-black text-base sm:text-lg text-[#2D2A26] leading-tight">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-[#6B655C] font-semibold mt-0.5 truncate">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
