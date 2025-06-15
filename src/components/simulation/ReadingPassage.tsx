
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
  return (
    <div className="h-full flex flex-col bg-slate-50 rounded-lg border border-slate-200">
      {/* כותרת - קבועה */}
      <div className="p-4 border-b border-slate-300">
        {title && (
          <h3 className="text-xl font-bold">{title}</h3>
        )}
      </div>
      {/* תוכן - יגלול רק כשצריך */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 leading-relaxed">
        {passageWithLines && passageWithLines.length > 0 ? (
          passageWithLines.map((line, index) => (
            <p key={index}>
              {showLineNumbers && (
                <span className="text-slate-500">Line {line.lineNumber}</span>
              )}
              <br />
              {line.text}
            </p>
          ))
        ) : passageText ? (
          passageText.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))
        ) : (
          <div className="text-slate-500 text-lg text-center">
            אין קטע קריאה זמין
          </div>
        )}
      </div>
    </div>
  );
};
