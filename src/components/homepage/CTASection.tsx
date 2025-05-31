
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-6">רוצים לקבוע שיחת ייעוץ?</h2>
        <p className="text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
          צוות המומחים שלנו זמין לענות על כל שאלה שיש לכם. מלאו את הפרטים ואנו נחזור אליכם בהקדם
        </p>
        
        <Button to="/contact" className="bg-electric-orange text-white font-bold py-3 px-8 rounded-md hover:bg-orange-600 transition-colors">
          צרו קשר עכשיו
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
