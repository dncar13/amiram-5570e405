
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
        <div className="max-w-2xl mx-auto">
          {/* טופס יצירת קשר */}
          <div className="text-center">
            <h3 
              className="text-3xl font-semibold mb-6"
              style={{ 
                color: '#ffffff',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              צרו קשר
            </h3>
            <p 
              className="text-lg mb-8 text-gray-300"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              יש לכם שאלות? רוצים לקבל עזרה? אנחנו כאן בשבילכם!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 min-h-[120px]"
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
      </div>
    </section>
  );
};

export default ContactSection;
