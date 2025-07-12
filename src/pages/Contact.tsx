
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MessageCircle } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הטופס נשלח בהצלחה",
      description: "נציג יצור איתך קשר בהקדם האפשרי",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">צור קשר</h1>
          <p className="text-center mb-12 text-gray-600 max-w-2xl mx-auto">
            יש לך שאלות? צוות המומחים שלנו ישמח לעזור לך. מלא את הטופס ואנו נחזור אליך בהקדם
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="w-full md:w-2/3 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">שלח לנו הודעה</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם מלא *</Label>
                    <Input id="name" placeholder="הכנס את שמך המלא" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל *</Label>
                    <Input id="email" type="email" placeholder="הכנס את כתובת האימייל שלך" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input id="phone" placeholder="הכנס את מספר הטלפון שלך" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">נושא *</Label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="בחר נושא" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">שאלה כללית</SelectItem>
                        <SelectItem value="technical">תמיכה טכנית</SelectItem>
                        <SelectItem value="billing">שאלות לגבי תשלום</SelectItem>
                        <SelectItem value="course">מידע על קורסים</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <Label htmlFor="message">הודעה *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="כתוב את ההודעה שלך כאן" 
                    rows={5} 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full bg-electric-navy hover:bg-blue-800">
                  שלח הודעה
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="w-full md:w-1/3">
              <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-6">פרטי התקשרות</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-electric-navy" />
                    </div>
                    <div>
                      <h3 className="font-medium">טלפון</h3>
                      <p className="text-gray-600">0525602218 (ווצאפ בלבד)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-electric-navy" />
                    </div>
                    <div>
                      <h3 className="font-medium">אימייל</h3>
                      <p className="text-gray-600">support@amiram.net</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageCircle className="h-5 w-5 text-electric-navy" />
                    </div>
                    <div>
                      <h3 className="font-medium">שעות פעילות</h3>
                      <p className="text-gray-600">ימים א'-ה': 09:00-18:00</p>
                      <p className="text-gray-600">יום ו': 09:00-13:00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-electric-navy text-white p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">מוקד שירות לקוחות</h3>
                <p className="mb-4">צוות התמיכה שלנו זמין לענות על כל שאלותיך</p>
                <div className="border-t border-white/30 pt-4 mt-4">
                  <p className="font-medium">מספר חירום לתמיכה טכנית:</p>
                  <p className="text-xl font-bold">0525602218 (ווצאפ בלבד)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
