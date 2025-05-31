
import { Shield, Clock, BarChart } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4">
        <h2 
          className="text-4xl font-bold mb-6 text-center"
          style={{ 
            color: '#0056b3',
            fontFamily: 'Rubik, sans-serif',
            fontWeight: '700'
          }}
        >
          למה לבחור בנו?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div 
            className="bg-white rounded-lg p-8 text-center transition-transform duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              padding: '32px',
              margin: '20px'
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#28a745' }}>
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 
              className="text-2xl font-semibold mb-4"
              style={{ 
                color: '#0056b3',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              הכנה מותאמת אישית
            </h3>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '1.6'
              }}
            >
              תכנית לימודים מותאמת אישית לרמת האנגלית שלכם כדי להתקדם במהירות וביעילות.
            </p>
          </div>
          
          <div 
            className="bg-white rounded-lg p-8 text-center transition-transform duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              padding: '32px',
              margin: '20px'
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#007bff' }}>
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 
              className="text-2xl font-semibold mb-4"
              style={{ 
                color: '#0056b3',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              סימולציה אמיתית
            </h3>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '1.6'
              }}
            >
              סביבת סימולציה זהה למבחן האמיתי עם שעון וזמן מדויק כדי שתגיעו מוכנים.
            </p>
          </div>
          
          <div 
            className="bg-white rounded-lg p-8 text-center transition-transform duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              padding: '32px',
              margin: '20px'
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#6f42c1' }}>
              <BarChart className="h-8 w-8 text-white" />
            </div>
            <h3 
              className="text-2xl font-semibold mb-4"
              style={{ 
                color: '#0056b3',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              מעקב התקדמות
            </h3>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '1.6'
              }}
            >
              מעקב נתונים מתקדם כדי לזהות חולשות, לחזק את הידע ולהגיע מוכנים.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
