
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
      <div className="bg-white rounded-lg h-[420px] flex flex-col overflow-hidden">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
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
      <div className="bg-white rounded-lg h-[420px] flex flex-col overflow-hidden">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
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
    <div className="bg-white rounded-lg text-center h-[420px] flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-500 text-lg">אין קטע קריאה זמין</div>
      </div>
    </div>
  );
};
