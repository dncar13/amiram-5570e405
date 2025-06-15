
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
      <div className="bg-slate-50 rounded-lg border border-slate-200 text-slate-800 h-[420px] flex flex-col">
        {/* Header section with title outside scrollable area */}
        <div className="flex-shrink-0 p-4 border-b border-slate-300">
          <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">
            Reading Passage
          </div>
          {title && (
            <div className="text-lg font-semibold text-slate-900">
              {title}
            </div>
          )}
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto bg-white rounded-b-lg">
          <div className="p-4">
            <div className="space-y-3 leading-relaxed">
              {passageWithLines.map((line, index) => (
                <div key={index} className="w-full">
                  {showLineNumbers && (
                    <div className="text-slate-600 font-bold text-lg mb-1">
                      Line {line.lineNumber}
                    </div>
                  )}
                  <div className="text-slate-800 text-lg leading-relaxed w-full mb-3">
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
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
      <div className="bg-slate-50 rounded-lg border border-slate-200 text-slate-800 h-[420px] flex flex-col">
        {/* Header section with title outside scrollable area */}
        <div className="flex-shrink-0 p-4 border-b border-slate-300">
          <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">
            Reading Passage
          </div>
          {title && (
            <div className="text-lg font-semibold text-slate-900">
              {title}
            </div>
          )}
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto bg-white rounded-b-lg">
          <div className="p-4">
            <div className="space-y-3 leading-relaxed">
              {lines.map((line, index) => (
                <div key={index} className="w-full">
                  {showLineNumbers && (
                    <div className="text-slate-600 font-bold text-lg mb-1">
                      Line {index + 1}
                    </div>
                  )}
                  <div className="text-slate-800 text-lg leading-relaxed w-full mb-3">
                    {line}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no passage content is available
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 text-center h-[420px] flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-slate-300">
        <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">
          Reading Passage
        </div>
        {title && (
          <div className="text-lg font-semibold text-slate-900">
            {title}
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-500 text-lg">אין קטע קריאה זמין</div>
      </div>
    </div>
  );
};
