
const TestimonialsSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#f7f9fc' }}>
      <div className="container mx-auto px-4">
        <h2 
          className="text-4xl font-bold mb-16 text-center"
          style={{ 
            color: '#0056b3',
            fontFamily: 'Rubik, sans-serif',
            fontWeight: '700'
          }}
        >
          מה אומרים התלמידים שלנו
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div 
            className="bg-white rounded-lg p-8 transition-transform duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              padding: '32px'
            }}
          >
            <div className="flex items-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                alt="תמונת פרופיל" 
                className="w-12 h-12 rounded-full ml-4"
              />
              <div>
                <h4 
                  className="font-semibold text-lg"
                  style={{ 
                    color: '#0056b3',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: '700'
                  }}
                >
                  שרה כהן
                </h4>
                <p 
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  סטודנטית להנדסה
                </p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" style={{ color: '#ff7f0e' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                lineHeight: '1.6'
              }}
            >
              "הסימולציות עזרו לי מאוד להתכונן למבחן אמירם. הסביבה זהה למבחן האמיתי והתוצאות היו מדויקות."
            </p>
          </div>
          
          {/* Testimonial 2 */}
          <div 
            className="bg-white rounded-lg p-8 transition-transform duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              padding: '32px'
            }}
          >
            <div className="flex items-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                alt="תמונת פרופיל" 
                className="w-12 h-12 rounded-full ml-4"
              />
              <div>
                <h4 
                  className="font-semibold text-lg"
                  style={{ 
                    color: '#0056b3',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: '700'
                  }}
                >
                  דוד לוי
                </h4>
                <p 
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  סטודנט לרפואה
                </p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" style={{ color: '#ff7f0e' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                lineHeight: '1.6'
              }}
            >
              "המעקב האישי עזר לי לזהות בדיוק איפה אני צריך להשתפר. הגעתי למבחן בטוח ומוכן."
            </p>
          </div>
          
          {/* Testimonial 3 */}
          <div 
            className="bg-white rounded-lg p-8 transition-transform duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              padding: '32px'
            }}
          >
            <div className="flex items-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                alt="תמונת פרופיל" 
                className="w-12 h-12 rounded-full ml-4"
              />
              <div>
                <h4 
                  className="font-semibold text-lg"
                  style={{ 
                    color: '#0056b3',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: '700'
                  }}
                >
                  מיכל אברהם
                </h4>
                <p 
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  סטודנטית לפסיכולוגיה
                </p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" style={{ color: '#ff7f0e' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                lineHeight: '1.6'
              }}
            >
              "הפלטפורמה הכי טובה להכנה למבחן אמירם! קיבלתי את הציון שרציתי ואפילו יותר."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
