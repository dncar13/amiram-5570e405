
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#343a40' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* עמודה 1: ניווט מהיר */}
          <div>
            <h3 
              className="text-2xl font-semibold mb-6"
              style={{ 
                color: '#ffffff',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              ניווט מהיר
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="/" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  דף הבית
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  אודות
                </a>
              </li>
              <li>
                <a 
                  href="/topics" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  הסימולציות שלי
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  יצירת קשר
                </a>
              </li>
            </ul>
          </div>

          {/* עמודה 2: תמיכה ומידע */}
          <div>
            <h3 
              className="text-2xl font-semibold mb-6"
              style={{ 
                color: '#ffffff',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              תמיכה ומידע
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="/support" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  תמיכה ושאלות נפוצות
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  תנאי שימוש
                </a>
              </li>
              <li>
                <a 
                  href="/privacy" 
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: 'Rubik, sans-serif',
                    textDecoration: 'none'
                  }}
                >
                  מדיניות פרטיות
                </a>
              </li>
            </ul>
          </div>

          {/* עמודה 3: טופס יצירת קשר */}
          <div>
            <h3 
              className="text-2xl font-semibold mb-6"
              style={{ 
                color: '#ffffff',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              צרו קשר
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="שם מלא"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                style={{ fontFamily: 'Rubik, sans-serif' }}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="כתובת אימייל"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                style={{ fontFamily: 'Rubik, sans-serif' }}
                required
              />
              <Textarea
                name="message"
                placeholder="הודעה קצרה"
                value={formData.message}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 min-h-[100px]"
                style={{ fontFamily: 'Rubik, sans-serif' }}
                required
              />
              <Button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: '#ff7f0e',
                  fontFamily: 'Rubik, sans-serif',
                  borderRadius: '8px'
                }}
              >
                שלח הודעה
              </Button>
            </form>
          </div>
        </div>

        {/* זכויות יוצרים */}
        <div className="border-t border-gray-600 mt-12 pt-8 text-center">
          <p 
            className="text-gray-400"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            &copy; {new Date().getFullYear()} AMIRAM Academy. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
