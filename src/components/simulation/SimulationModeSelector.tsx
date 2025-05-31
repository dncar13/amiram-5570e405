
import { BookOpen, GraduationCap, Timer, CheckCircle, Lock, Activity } from "lucide-react";

interface SimulationModeSelectorProps {
  selectedMode: 'practice' | 'exam';
  onModeSelect: (mode: 'practice' | 'exam') => void;
  timerMinutes: number;
}

export const SimulationModeSelector = ({ 
  selectedMode, 
  onModeSelect,
  timerMinutes
}: SimulationModeSelectorProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-center mb-6">בחר מצב סימולציה</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* כרטיס מצב תרגול */}
        <div 
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            selectedMode === 'practice' 
              ? "bg-green-50 border-green-400 shadow-lg scale-[1.02]" 
              : "bg-white border-gray-200 hover:border-green-300 hover:shadow"
          }`}
          onClick={() => onModeSelect('practice')}
        >
          <div className="text-center mb-4">
            <BookOpen className={`h-12 w-12 mx-auto mb-3 ${
              selectedMode === 'practice' ? 'text-green-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-bold text-green-700">מצב תרגול</h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 text-right">
            <li className="flex items-center justify-end gap-2">
              <span>ללא הגבלת זמן</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span>תשובות מיידיות</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span>למידה בקצב אישי</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </li>
          </ul>
        </div>

        {/* כרטיס מצב מבחן */}
        <div 
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            selectedMode === 'exam' 
              ? "bg-blue-50 border-blue-400 shadow-lg scale-[1.02]" 
              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow"
          }`}
          onClick={() => onModeSelect('exam')}
        >
          <div className="text-center mb-4">
            <GraduationCap className={`h-12 w-12 mx-auto mb-3 ${
              selectedMode === 'exam' ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-bold text-blue-700">מצב מבחן</h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 text-right">
            <li className="flex items-center justify-end gap-2">
              <span>טיימר פעיל ({timerMinutes} דקות)</span>
              <Timer className="h-4 w-4 text-blue-500" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span>תשובות רק בסוף</span>
              <Lock className="h-4 w-4 text-blue-500" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span>סימולציה של מבחן אמיתי</span>
              <Activity className="h-4 w-4 text-blue-500" />
            </li>
          </ul>
        </div>
      </div>

      {/* שורת חיווי */}
      <div className={`mt-4 text-center p-3 rounded-lg ${
        selectedMode === 'exam' 
          ? 'bg-blue-100 text-blue-700' 
          : 'bg-green-100 text-green-700'
      }`}>
        <p className="font-medium">
          {selectedMode === 'exam' 
            ? '⚡ בחרת במצב מבחן – הטיימר יתחיל מיד עם תחילת הסימולציה'
            : '📚 בחרת במצב תרגול – תוכל ללמוד בקצב שלך'}
        </p>
      </div>
    </div>
  );
};
