import { Subject, Badge } from '../types';
import { THAI_SUBJECT } from './curriculumThai';
import { MATH_SUBJECT } from './curriculumMath';
import { SCIENCE_SUBJECT } from './curriculumScience';
import { SOCIAL_SUBJECT, HEALTH_SUBJECT } from './curriculumSocialHealth';
import { ART_SUBJECT, MUSIC_SUBJECT } from './curriculumArtMusic';
import { WORK_SUBJECT } from './curriculumWork';
import { ENGLISH_SUBJECT } from './curriculumEnglish';

export { THAI_SUBJECT, MATH_SUBJECT, SCIENCE_SUBJECT, SOCIAL_SUBJECT, HEALTH_SUBJECT, ART_SUBJECT, MUSIC_SUBJECT, WORK_SUBJECT, ENGLISH_SUBJECT };

export const BADGES: Badge[] = [
  { id: 'b1', name: 'ต้นกล้าตัวน้อย', emoji: '🌱', description: 'เริ่มเรียนรู้และสะสมครบ 3 ดาว', requiredStars: 3 },
  { id: 'b2', name: 'นักอ่านจิ๋ว', emoji: '📖', description: 'สะสมดาวครบ 10 ดวง', requiredStars: 10 },
  { id: 'b3', name: 'ดาวเด่น ป.1', emoji: '⭐', description: 'สะสมดาวครบ 20 ดวง', requiredStars: 20 },
  { id: 'b4', name: 'หนูน้อยคนเก่ง', emoji: '🏆', description: 'สะสมดาวครบ 35 ดวง', requiredStars: 35 },
  { id: 'b5', name: 'สุดยอดด็อกเตอร์จิ๋ว', emoji: '👑', description: 'สะสมดาวครบ 50 ดวง', requiredStars: 50 },
  { id: 'b6', name: 'อัจฉริยะ ป.1', emoji: '🎖️', description: 'สะสมดาวครบ 75 ดวง', requiredStars: 75 },
];

export const SUBJECTS: Subject[] = [
  THAI_SUBJECT,
  MATH_SUBJECT,
  SCIENCE_SUBJECT,
  SOCIAL_SUBJECT,
  HEALTH_SUBJECT,
  ART_SUBJECT,
  MUSIC_SUBJECT,
  WORK_SUBJECT,
  ENGLISH_SUBJECT,
];
