
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
    passageWithLinesLength: passageWithLines?.length || 0,
    titleValue: title,
    passageTextLength: passageText?.length || 0
  });

  // If we have passageWithLines, use that format
  if (passageWithLines && passageWithLines.length > 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 text-slate-100 h-[900px] flex flex-col shadow-2xl">
        {title && (
          <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center border-b border-slate-600/50 pb-4 flex-shrink-0">
            {title}
          </h3>
        )}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          <div className="space-y-4 leading-relaxed">
            {passageWithLines.map((line, index) => (
              <div key={index} className="w-full">
                {showLineNumbers && (
                  <div className="text-slate-400 font-bold text-lg mb-2">
                    Line {line.lineNumber}
                  </div>
                )}
                <div className="text-slate-200 text-lg leading-relaxed w-full mb-4 px-2">
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
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 text-slate-100 h-[900px] flex flex-col shadow-2xl">
        {title && (
          <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center border-b border-slate-600/50 pb-4 flex-shrink-0">
            {title}
          </h3>
        )}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          <div className="space-y-4 leading-relaxed">
            {lines.map((line, index) => (
              <div key={index} className="w-full">
                {showLineNumbers && (
                  <div className="text-slate-400 font-bold text-lg mb-2">
                    Line {index + 1}
                  </div>
                )}
                <div className="text-slate-200 text-lg leading-relaxed w-full mb-4 px-2">
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
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50 text-center h-[900px] flex items-center justify-center shadow-2xl">
      <div className="text-slate-400 text-lg">אין קטע קריאה זמין</div>
    </div>
  );
};
