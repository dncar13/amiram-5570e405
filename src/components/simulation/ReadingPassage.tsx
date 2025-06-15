
import { PassageLine } from "@/data/types/questionTypes";

interface ReadingPassageProps {
  title?: string;
  passageWithLines?: PassageLine[];
  passageText?: string;
  showLineNumbers?: boolean;
}

export const ReadingPassage = ({ 
  title, 
  passageWithLines, 
  passageText,
  showLineNumbers = true 
}: ReadingPassageProps) => {
  
  console.log('[ReadingPassage] Props received:', {
    hasTitle: !!title,
    hasPassageWithLines: !!(passageWithLines && passageWithLines.length > 0),
    hasPassageText: !!passageText,
    showLineNumbers,
    passageWithLinesLength: passageWithLines?.length || 0
  });

  // If we have passageWithLines, use that format
  if (passageWithLines && passageWithLines.length > 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-slate-800 max-h-[600px] overflow-y-auto">
        {title && (
          <h3 className="text-lg font-bold text-slate-900 mb-4 text-center border-b border-slate-300 pb-2">
            {title}
          </h3>
        )}
        <div className="space-y-1 leading-relaxed text-sm">
          {passageWithLines.map((line, index) => (
            <div key={index} className="flex gap-3">
              {showLineNumbers && (
                <span className="text-slate-500 font-mono text-xs min-w-[2rem] text-right flex-shrink-0 mt-0.5">
                  {line.lineNumber}
                </span>
              )}
              <span className="flex-1 text-slate-700 leading-relaxed">
                {line.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to passageText if available
  if (passageText) {
    // Split by lines for simple display
    const lines = passageText.split('\n').filter(line => line.trim());
    
    return (
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-slate-800 max-h-[600px] overflow-y-auto">
        {title && (
          <h3 className="text-lg font-bold text-slate-900 mb-4 text-center border-b border-slate-300 pb-2">
            {title}
          </h3>
        )}
        <div className="space-y-1 leading-relaxed text-sm">
          {lines.map((line, index) => (
            <div key={index} className="flex gap-3">
              {showLineNumbers && (
                <span className="text-slate-500 font-mono text-xs min-w-[2rem] text-right flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
              )}
              <span className="flex-1 text-slate-700 leading-relaxed">
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no passage content is available
  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-center">
      <div className="text-slate-500">אין קטע קריאה זמין</div>
    </div>
  );
};
