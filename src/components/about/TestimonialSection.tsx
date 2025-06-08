
import { Star } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-8 shadow-lg text-center border-2 border-blue-100">
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-lg text-gray-700 mb-4 italic">
          "בזכות AMIRAM Academy עברתי את מבחן האמירם עם ציון 134! 
          הסימולציות היו זהות למבחן האמיתי והמעקב האישי עזר לי להתמקד במה שחשוב."
        </p>
        <p className="font-semibold text-blue-900">- רותם כהן, סטודנטית לרפואה</p>
      </div>
    </section>
  );
};

export default TestimonialSection;
