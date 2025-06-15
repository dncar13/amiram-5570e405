
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
    titlePreview: title?.substring(0, 50),
    passageTextPreview: passageText?.substring(0, 100)
  });

  // If we have passageWithLines, use that format
  if (passageWithLines && passageWithLines.length > 0) {
    return (
      <div className="bg-black rounded-lg border border-gray-600 text-white shadow-sm h-full flex flex-col">
        {title && (
          <h3 className="text-2xl font-bold text-white p-6 pb-4 text-center border-b border-gray-600 flex-shrink-0" 
              dir="ltr" 
              style={{ textAlign: 'left' }}>
            {title}
          </h3>
        )}
        <div className="p-8 pt-6 overflow-y-auto flex-grow">
          <div className="space-y-2 leading-relaxed text-lg" dir="ltr" style={{ textAlign: 'left' }}>
            {passageWithLines.map((line, index) => (
              <div key={index} className="flex gap-4">
                {showLineNumbers && (
                  <span className="text-gray-400 font-mono text-base min-w-[3rem] text-right flex-shrink-0 mt-1 select-none">
                    {line.lineNumber}
                  </span>
                )}
                <span className="flex-1 text-white leading-relaxed text-lg">
                  {line.text}
                </span>
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
      <div className="bg-black rounded-lg border border-gray-600 text-white shadow-sm h-full flex flex-col">
        {title && (
          <h3 className="text-2xl font-bold text-white p-6 pb-4 text-center border-b border-gray-600 flex-shrink-0"
              dir="ltr" 
              style={{ textAlign: 'left' }}>
            {title}
          </h3>
        )}
        <div className="p-8 pt-6 overflow-y-auto flex-grow">
          <div className="space-y-2 leading-relaxed text-lg" dir="ltr" style={{ textAlign: 'left' }}>
            {lines.map((line, index) => (
              <div key={index} className="flex gap-4">
                {showLineNumbers && (
                  <span className="text-gray-400 font-mono text-base min-w-[3rem] text-right flex-shrink-0 mt-1 select-none">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1 text-white leading-relaxed text-lg">
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no passage content is available
  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-center">
      <div className="text-slate-500">אין קטע קריאה זמין</div>
      <div className="text-slate-400 text-sm mt-2">
        Debug: title={!!title}, passageWithLines={!!passageWithLines}, passageText={!!passageText}
      </div>
    </div>
  );
};
