import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { SUBJECTS } from '../data/curriculum';
import { loadUserStats, resetUserStats, saveUserStats } from '../utils/stats';
import { UserStats } from '../types';
import { playSound } from '../utils/audio';
import {
  BarChart3,
  PieChart as PieIcon,
  Award,
  BookOpen,
  CheckCircle,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface StatsDashboardProps {
  onBack: () => void;
  onSelectSubject: (subjectId: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ onBack, onSelectSubject }) => {
  const [stats, setStats] = useState<UserStats>(loadUserStats());
  const [activeChartTab, setActiveChartTab] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    setStats(loadUserStats());
  }, []);

  // Format data for Recharts
  const chartData = SUBJECTS.map((subj) => {
    const s = stats.subjects[subj.id] || {
      studyCount: 0,
      quizTotal: 0,
      quizCorrect: 0,
      starsEarned: 0,
    };

    const accuracy = s.quizTotal > 0 ? Math.round((s.quizCorrect / s.quizTotal) * 100) : 0;

    return {
      id: subj.id,
      name: subj.name,
      shortName: subj.name.split(' ')[0],
      emoji: subj.emoji,
      color: subj.color,
      studyCount: s.studyCount,
      quizTotal: s.quizTotal,
      quizCorrect: s.quizCorrect,
      starsEarned: s.starsEarned,
      accuracy,
    };
  });

  // Data for Pie Chart (Subjects studied proportion)
  const pieData = chartData
    .filter((d) => d.studyCount > 0 || d.quizTotal > 0)
    .map((d) => ({
      name: `${d.emoji} ${d.shortName}`,
      value: d.studyCount + d.quizCorrect,
      color: d.color,
    }));

  // Fallback pie data if fresh install
  const displayPieData =
    pieData.length > 0
      ? pieData
      : chartData.slice(0, 5).map((d, i) => ({
          name: `${d.emoji} ${d.shortName}`,
          value: (5 - i) * 3,
          color: d.color,
        }));

  // Global totals
  const totalStudies = chartData.reduce((acc, c) => acc + c.studyCount, 0);
  const totalQuizAnswers = chartData.reduce((acc, c) => acc + c.quizTotal, 0);
  const totalQuizCorrect = chartData.reduce((acc, c) => acc + c.quizCorrect, 0);
  const totalStars = stats.totalStars;
  const overallAccuracy =
    totalQuizAnswers > 0 ? Math.round((totalQuizCorrect / totalQuizAnswers) * 100) : 0;

  // Best subject
  const bestSubject = [...chartData].sort((a, b) => b.quizCorrect - a.quizCorrect)[0];

  const handleSeedDemoData = () => {
    playSound('star');
    const demo: UserStats = {
      totalStars: 42,
      subjects: {
        th: { subjectId: 'th', studyCount: 14, quizTotal: 15, quizCorrect: 13, starsEarned: 13 },
        ma: { subjectId: 'ma', studyCount: 12, quizTotal: 12, quizCorrect: 10, starsEarned: 10 },
        sc: { subjectId: 'sc', studyCount: 9, quizTotal: 10, quizCorrect: 9, starsEarned: 9 },
        so: { subjectId: 'so', studyCount: 6, quizTotal: 5, quizCorrect: 4, starsEarned: 4 },
        he: { subjectId: 'he', studyCount: 7, quizTotal: 5, quizCorrect: 5, starsEarned: 5 },
        ar: { subjectId: 'ar', studyCount: 8, quizTotal: 5, quizCorrect: 4, starsEarned: 4 },
        mu: { subjectId: 'mu', studyCount: 5, quizTotal: 5, quizCorrect: 4, starsEarned: 4 },
        wk: { subjectId: 'wk', studyCount: 4, quizTotal: 5, quizCorrect: 3, starsEarned: 3 },
        en: { subjectId: 'en', studyCount: 16, quizTotal: 20, quizCorrect: 18, starsEarned: 18 },
      },
    };
    saveUserStats(demo);
    setStats(demo);
  };

  const handleResetData = () => {
    playSound('pop');
    if (confirm('ต้องการรีเซ็ตสถิติการเรียนรู้ทั้งหมดเป็น 0 หรือไม่?')) {
      const fresh = resetUserStats();
      setStats(fresh);
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#F0E2C0] shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FC] text-[#2563EB] text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Learning Analytics for Grade 1
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D2A26] flex items-center gap-2">
            📊 แดชบอร์ดสรุปสถิติการเรียนรู้
          </h2>
          <p className="text-sm text-[#7C7467] font-medium mt-1">
            รายงานพัฒนาการ ความถี่ในการเรียนรู้ และผลคะแนนแบบฝึกหัดของน้อง ป.1
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeedDemoData}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#FFF3D6] hover:bg-[#FFE8B3] text-[#A66E00] font-bold text-xs border border-[#F2C94C] transition-all active:scale-95"
            title="ใส่ตัวอย่างสถิติเพื่อดูการแสดงผลของกราฟ"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ตัวอย่างสถิติ
          </button>
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#F5F2EC] hover:bg-[#EAE4D9] text-[#7C7467] font-bold text-xs border border-[#DCD3C4] transition-all active:scale-95"
            title="ล้างข้อมูลสถิติ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            รีเซ็ต
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 rounded-3xl border-2 border-[#FFD966] shadow-xs text-center">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-2xl sm:text-3xl font-black text-[#2D2A26]">{totalStars}</div>
          <div className="text-xs font-bold text-[#8B8378]">ดาวสะสมทั้งหมด</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-[#93C5FD] shadow-xs text-center">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-2xl sm:text-3xl font-black text-[#2563EB]">{totalStudies}</div>
          <div className="text-xs font-bold text-[#8B8378]">ครั้งที่เข้าเรียน</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-[#86EFAC] shadow-xs text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xl sm:text-3xl font-black text-[#2E9E5B]">
            {overallAccuracy}%
          </div>
          <div className="text-xs font-bold text-[#8B8378]">
            ความแม่นยำ ({totalQuizCorrect}/{totalQuizAnswers})
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-[#F472B6] shadow-xs text-center">
          <div className="text-2xl mb-1">{bestSubject ? bestSubject.emoji : '🏆'}</div>
          <div className="text-lg sm:text-xl font-black text-[#2D2A26] truncate">
            {bestSubject && bestSubject.quizCorrect > 0 ? bestSubject.shortName : 'เริ่มทำโจทย์'}
          </div>
          <div className="text-xs font-bold text-[#8B8378]">วิชาที่ทำคะแนนได้ดีสุด</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#F0E2C0] shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0E2C0]">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#2D2A26] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF7A59]" />
              {activeChartTab === 'bar'
                ? 'กราฟเปรียบเทียบความก้าวหน้าและการทำแบบฝึกหัดแยกตามวิชา'
                : 'แผนภูมิวงกลมสัดส่วนความสนใจในแต่ละวิชา'}
            </h3>
            <p className="text-xs text-[#8B8378] mt-0.5">
              วิเคราะห์ความสนใจและจุดแข็งของเด็กเพื่อส่งเสริมได้อย่างตรงจุด
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#F5F0E4] rounded-2xl">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setActiveChartTab('bar');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeChartTab === 'bar'
                  ? 'bg-white text-[#2D2A26] shadow-xs'
                  : 'text-[#6B655C] hover:text-[#2D2A26]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              กราฟแท่ง
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setActiveChartTab('pie');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeChartTab === 'pie'
                  ? 'bg-white text-[#2D2A26] shadow-xs'
                  : 'text-[#6B655C] hover:text-[#2D2A26]'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              แผนภูมิวงกลม
            </button>
          </div>
        </div>

        {/* 1. Bar Chart */}
        {activeChartTab === 'bar' && (
          <div className="w-full h-[360px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE8D8" />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#554F45', fontSize: 11, fontWeight: 700 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#8B8378', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === 'studyCount') return [`${value} ครั้ง`, 'เข้าเรียนรู้'];
                    if (name === 'quizCorrect') return [`${value} ข้อ`, 'ตอบแบบฝึกหัดถูก'];
                    if (name === 'starsEarned') return [`${value} ⭐`, 'ดาวที่ได้รับ'];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    borderColor: '#EADBB8',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontFamily: 'Mali, sans-serif',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar
                  dataKey="studyCount"
                  name="เข้าเรียน (ครั้ง)"
                  fill="#3B82C4"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="quizCorrect"
                  name="ตอบถูก (ข้อ)"
                  fill="#2E9E5B"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="starsEarned"
                  name="ดาวที่ได้รับ (⭐)"
                  fill="#F59E0B"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 2. Pie Chart */}
        {activeChartTab === 'pie' && (
          <div className="w-full h-[360px] sm:h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={120}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} คะแนนกิจกรรม`, 'ความก้าวหน้า']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    borderColor: '#EADBB8',
                    fontFamily: 'Mali, sans-serif',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Table / Cards per Subject */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#F0E2C0] shadow-sm">
        <h3 className="text-xl font-black text-[#2D2A26] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#3B82C4]" />
          รายละเอียดความก้าวหน้าทุกวิชา
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {chartData.map((item) => {
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border-2 border-[#EADBB8] hover:border-[#D9C496] transition-all bg-[#FFFDF9] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      แม่นยำ {item.accuracy}%
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-[#2D2A26]">{item.name}</h4>
                  <div className="text-xs text-[#7C7467] space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span>เข้าเรียน:</span>
                      <strong className="text-[#2D2A26]">{item.studyCount} ครั้ง</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>ทำแบบฝึกหัด:</span>
                      <strong className="text-[#2E9E5B]">
                        {item.quizCorrect} / {item.quizTotal} ข้อ
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>ดาวที่ได้รับ:</span>
                      <strong className="text-[#F59E0B]">{item.starsEarned} ⭐</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectSubject(item.id)}
                  className="mt-3 w-full py-1.5 rounded-xl bg-white hover:bg-[#F5EFE0] border border-[#D9D0C3] text-xs font-bold text-[#554F45] transition-all active:scale-95"
                >
                  ไปที่วิชานี้ →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
