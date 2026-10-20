import React, { useState, useEffect } from 'react';
import { Subject, Question } from '../types';
import { playSound, speakText } from '../utils/audio';
import { recordQuizAttempt } from '../utils/stats';
import confetti from 'canvas-confetti';
import { Volume2, Award, RotateCcw, CheckCircle2, XCircle, ArrowRight, Home } from 'lucide-react';

interface QuizViewProps {
  subject: Subject;
  onAddStar: (count: number) => void;
  onBackToLearn: () => void;
  onBackHome: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  subject,
  onAddStar,
  onBackToLearn,
  onBackHome,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Prepare questions on mount or restart
  useEffect(() => {
    startNewQuiz();
  }, [subject]);

  const startNewQuiz = () => {
    let pool: Question[] = [];

    if (subject.questions && subject.questions.length > 0) {
      pool = [...subject.questions];
    } else {
      // Dynamic fallback questions if needed
      pool = [
        {
          question: `นี่คือวิชา ${subject.name} ใช่หรือไม่?`,
          emoji: subject.emoji,
          options: ['ใช่', 'ไม่ใช่'],
          correctIndex: 0,
          explanation: `นี่คือวิชา ${subject.name}`,
        },
      ];
    }

    // Shuffle questions and take 5
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  const currentQ = questions[currentIndex];

  const handleSpeakQuestion = () => {
    if (!currentQ) return;
    playSound('pop');
    const textToSpeak = `${currentQ.question}`;
    speakText(textToSpeak, subject.lang);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 1);
      onAddStar(1);
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    playSound('pop');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished!
      setIsQuizComplete(true);
      playSound('fanfare');
      recordQuizAttempt(subject.id, questions.length, score, score);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  if (!currentQ && !isQuizComplete) {
    return (
      <div className="p-8 text-center text-[#6B655C]">
        กำลังโหลดคำถาม...
      </div>
    );
  }

  // Quiz Completion Screen
  if (isQuizComplete) {
    const total = questions.length;
    const percentage = (score / total) * 100;
    let badgeTitle = 'พยายามได้ดีมาก! สู้ๆ นะ';
    let badgeEmoji = '🥉';

    if (percentage === 100) {
      badgeTitle = 'ยอดเยี่ยมที่สุด! เต็ม 100%';
      badgeEmoji = '🏆';
    } else if (percentage >= 60) {
      badgeTitle = 'เก่งมากจ้าคนเก่ง!';
      badgeEmoji = '🥈';
    }

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-[#F0E2C0] shadow-sm text-center max-w-lg mx-auto animate-float">
        <div className="text-6xl mb-3">{badgeEmoji}</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2A26] mb-2">
          {badgeTitle}
        </h2>
        <p className="text-[#6B655C] text-lg mb-6">
          ทำแบบฝึกหัดวิชา <span className="font-bold text-[#2D2A26]">{subject.name}</span> ได้
        </p>

        {/* Score Pill */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#FFF9EC] border-2 border-[#EADBB8] mb-6">
          <Award className="w-8 h-8 text-[#FFB800]" />
          <span className="text-3xl font-black text-[#2D2A26]">
            {score} <span className="text-xl font-bold text-[#8B8378]">/ {total} ข้อ</span>
          </span>
          <span className="text-sm font-bold bg-[#EAF7EF] text-[#2E9E5B] px-3 py-1 rounded-full">
            + {score} ⭐
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={startNewQuiz}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FF7A59] hover:bg-[#E86746] text-white font-bold text-base shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            ทำอีกรอบ
          </button>
          <button
            type="button"
            onClick={onBackToLearn}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F0E2C0] hover:bg-[#E2D2AD] text-[#4A4235] font-bold text-base transition-all active:scale-95"
          >
            ทบทวนบทเรียน
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F4EFEA] hover:bg-[#EAE2D8] text-[#554F45] font-bold text-base transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // Active Question Card
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-[#F0E2C0] shadow-sm max-w-xl mx-auto">
      {/* Progress & Speaker Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0E2C0]">
        <span className="text-sm font-bold text-[#8B8378] bg-[#F7F2E7] px-3 py-1 rounded-full">
          ข้อที่ {currentIndex + 1} จาก {questions.length}
        </span>

        {/* Read aloud button */}
        <button
          type="button"
          onClick={handleSpeakQuestion}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF4FC] text-[#2563EB] hover:bg-[#DBEAFE] font-bold text-sm transition-all active:scale-95"
          title="กดเพื่อฟังโจทย์"
        >
          <Volume2 className="w-4 h-4 animate-bounce-slow" />
          ฟังโจทย์
        </button>
      </div>

      {/* Question Header */}
      <div className="text-center my-4">
        {currentQ.emoji && (
          <div className="text-5xl sm:text-6xl mb-3">{currentQ.emoji}</div>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] leading-snug">
          {currentQ.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="grid gap-3 my-5">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let btnStyle = 'bg-[#FFFDF9] border-[#EADBB8] text-[#2D2A26] hover:bg-[#FFF8E7]';

          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-[#2E9E5B] border-[#2E9E5B] text-white shadow-md scale-[1.01]';
            } else if (isSelected) {
              btnStyle = 'bg-[#D9483B] border-[#D9483B] text-white';
            } else {
              btnStyle = 'bg-[#F5F2EC] border-[#E2DDD5] text-[#A39B8E] opacity-70';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-lg sm:text-xl border-3 text-center transition-all flex items-center justify-between shadow-sm active:scale-98 ${btnStyle}`}
            >
              <span className="flex-1 text-center">{opt}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-white shrink-0 ml-2" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-white shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div className="mt-5 pt-4 border-t border-[#F0E2C0] flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="text-center sm:text-left">
            {selectedOption === currentQ.correctIndex ? (
              <div className="text-[#2E9E5B] font-extrabold text-lg flex items-center gap-1.5 justify-center sm:justify-start">
                <span>🌟 เก่งมากจ้า! ถูกต้องแล้ว</span>
              </div>
            ) : (
              <div className="text-[#D9483B] font-extrabold text-base">
                <span>ไม่เป็นไรนะ ลองดูคำตอบที่ถูกสีเขียวนะจ๊ะ 💪</span>
              </div>
            )}
            {currentQ.explanation && (
              <div className="text-xs sm:text-sm text-[#6B655C] mt-0.5">
                💡 {currentQ.explanation}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FF7A59] hover:bg-[#E86746] text-white font-bold text-base shadow-md transition-all active:scale-95"
          >
            <span>{currentIndex + 1 === questions.length ? 'ดูคะแนนรวม' : 'ข้อต่อไป'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
