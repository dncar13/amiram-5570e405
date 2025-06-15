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
      <div className="bg-slate-50 rounded-lg border border-slate-200 text-slate-800 h-full flex flex-col">
        {title && (
          <div className="p-6 pb-4 border-b border-slate-300 flex-shrink-0">
            <h3 className="text-2xl font-bold text-slate-900 text-center">
              {title}
            </h3>
          </div>
        )}
        <div className="flex-1 p-6 pt-4 overflow-y-auto">
          <div className="space-y-6 leading-relaxed h-full">
            {passageWithLines.map((line, index) => (
              <div key={index} className="w-full">
                {showLineNumbers && (
                  <div className="text-slate-600 font-bold text-lg mb-3">
                    Line {line.lineNumber}
                  </div>
                )}
                <div className="text-slate-800 text-lg leading-relaxed w-full">
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to passageText if available
  if (passageText) {
    // Split by lines for simple display
    const lines = passageText.split('\n').filter(line => line.trim());
    
    return (
      <div className="bg-slate-50 rounded-lg border border-slate-200 text-slate-800 h-full flex flex-col">
        {title && (
          <div className="p-6 pb-4 border-b border-slate-300 flex-shrink-0">
            <h3 className="text-2xl font-bold text-slate-900 text-center">
              {title}
            </h3>
          </div>
        )}
        <div className="flex-1 p-6 pt-4 overflow-y-auto">
          <div className="space-y-6 leading-relaxed h-full">
            {lines.map((line, index) => (
              <div key={index} className="w-full">
                {showLineNumbers && (
                  <div className="text-slate-600 font-bold text-lg mb-3">
                    Line {index + 1}
                  </div>
                )}
                <div className="text-slate-800 text-lg leading-relaxed w-full">
                  {line}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no passage content is available
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 text-center h-full flex items-center justify-center">
      <div className="text-slate-500 text-lg">אין קטע קריאה זמין</div>
    </div>
  );
};