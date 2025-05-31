
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { categoryData } from "@/data/categories/categoryData";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IconObject } from "@/data/types/topicTypes";
import React from "react";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isPremium, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const filteredCategories = categoryData.filter(category => {
    if (!searchTerm) return true;
    
    return category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderIcon = (icon: React.ReactNode | IconObject) => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    if (icon && typeof icon === 'object' && 'type' in icon) {
      const IconComponent = (icon as IconObject).type;
      return <IconComponent className="h-6 w-6 text-electric-blue" />;
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <RTLWrapper>
          <section className="electric-gradient text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">קטגוריות לימוד</h1>
              <p className="text-lg max-w-2xl mx-auto mb-6">
                בחר קטגוריה ללימוד והתחל בתרגול שאלות בנושאים דומים
              </p>
              
              <div className="max-w-md mx-auto relative">
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="חיפוש קטגוריה..."
                  className="pl-3 pr-10 py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => navigate("/topics")}
                >
                  <ArrowRight className="ml-2 h-4 w-4" /> חזרה למסך הבחירה
                </Button>
              </div>
            </div>
          </section>
          
          <section className="py-12 bg-electric-gray/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-4 justify-end">
                        <h3 className="text-xl font-semibold text-electric-navy">{category.title}</h3>
                        <span className="p-2 bg-electric-blue/10 rounded-full ml-3">
                          {renderIcon(category.icon)}
                        </span>
                      </div>
                      
                      <p className="text-electric-slate mb-6 text-right flex-grow">{category.description}</p>
                      
                      <div className="flex justify-between items-center text-sm text-electric-slate mb-4">
                        <span>{category.topicIds.length} נושאים</span>
                        <span>{category.topicIds.length * 15}+ שאלות</span>
                      </div>
                      
                      <div className="mt-auto">
                        <Button 
                          className="w-full"
                          onClick={() => navigate(`/questions/category/${category.id}`)}
                          disabled={!isPremium && category.id > 2}
                        >
                          {!isPremium && category.id > 2 ? "דורש חשבון פרימיום" : "התחל לימוד"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {!isPremium && (
                <div className="mt-12 bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
                  <div className="inline-block p-2 px-4 bg-electric-orange/10 rounded-full mb-4">
                    <span className="text-sm font-medium text-electric-orange">גישה מלאה</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">רוצים גישה לכל הקטגוריות?</h2>
                  <p className="text-electric-slate mb-6 max-w-2xl mx-auto">
                    שדרגו לחשבון פרימיום וקבלו גישה בלתי מוגבלת לכל הקטגוריות והנושאים.
                  </p>
                  <Button className="btn-premium text-base py-6 px-8" asChild>
                    <a href="/premium">שדרוג לחשבון פרימיום</a>
                  </Button>
                </div>
              )}
            </div>
          </section>
        </RTLWrapper>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
