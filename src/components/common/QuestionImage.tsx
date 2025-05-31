
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface QuestionImageProps {
  /** נתיב התמונה (אפשר גם absolute URL) */
  src: string;
  /** טקסט אלטרנטיבי – חובה לנגישות */
  alt: string;
  /** גובה מרבי בתצוגה Embedded – ברירת-מחדל 18 rem */
  maxHeightRem?: number;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({
  src,
  alt,
  maxHeightRem = 18,
}) => {
  const [open, setOpen] = React.useState(false);

  /** inline-style כדי לחשב ‎max-h-[#]‎ דינמי */
  const inlineStyle = {
    maxHeight: `${maxHeightRem}rem`,
  } as const;

  return (
    <>
      <button
        type="button"
        className="mx-auto my-4 focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          style={inlineStyle}
          className="w-auto rounded-md shadow object-contain"
          loading="lazy"
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] w-auto mx-auto rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
