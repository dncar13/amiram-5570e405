
import { Category } from '../types/topicTypes';
import { Zap, ShieldAlert, Building2, HeartPulse, Lightbulb, FileSpreadsheet } from 'lucide-react';

export const categoryData: Category[] = [
  {
    id: 1,
    title: "הארקות והגנות",
    description: "הארקות, איפוס, השוואת פוטנציאלים, הגנות מפני ברקים ומערכות אל-פסק",
    icon: { type: Zap },
    topicIds: [1, 2, 3, 19, 20]
  },
  {
    id: 2,
    title: "ציוד ומערכות",
    description: "שנאים, מוליכים, מפסקים, הגנות, אביזרים ומשני מתח וזרם",
    icon: { type: ShieldAlert },
    topicIds: [4, 5, 7, 8, 16, 18]
  },
  {
    id: 3,
    title: "התקנות ייעודיות",
    description: "לוחות חשמל, אתרי בנייה, התקנות זמניות ומתקנים חקלאיים",
    icon: { type: Building2 },
    topicIds: [9, 15, 23, 25]
  },
  {
    id: 4,
    title: "התקנות מיוחדות",
    description: "בריכות, חדרי רחצה, בניינים רבי קומות, מתקנים רפואיים ומתקני מגורים",
    icon: { type: HeartPulse },
    topicIds: [10, 11, 12, 24]
  },
  {
    id: 5,
    title: "תאורה וחיווט",
    description: "תאורת חוץ, מרכזיות תאורה, מערכות רמזורים, גופי תאורה וכבלים",
    icon: { type: Lightbulb },
    topicIds: [6, 13, 14, 17, 21]
  },
  {
    id: 6,
    title: "בדיקות ותקנים",
    description: "בדיקות, מדידות, תקנים, אישורי מוצרים, חישובי עכבות וזרמי קצר",
    icon: { type: FileSpreadsheet },
    topicIds: [22, 26, 27]
  }
];
