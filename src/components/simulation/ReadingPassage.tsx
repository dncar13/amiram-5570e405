
import { PassageLine } from "@/data/types/questionTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ReadingPassageProps {
  title?: string;
  passageWithLines?: PassageLine[];
  showLineNumbers?: boolean;
}

export const ReadingPassage = ({ 
  title, 
  passageWithLines, 
  showLineNumbers = false 
}: ReadingPassageProps) => {
  if (!passageWithLines || passageWithLines.length === 0) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-900 flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          {title || "Reading Passage"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {passageWithLines.map((line) => (
            <div key={line.lineNumber} className="flex gap-3">
              {showLineNumbers && (
                <div className="flex-shrink-0 w-8 text-right">
                  <span className="text-xs text-blue-600 font-mono bg-blue-100 px-1.5 py-0.5 rounded">
                    {line.startLine}-{line.endLine}
                  </span>
                </div>
              )}
              <p className="text-gray-800 leading-relaxed text-sm flex-1">
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
