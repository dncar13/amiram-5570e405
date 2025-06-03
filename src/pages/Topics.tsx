
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { ArrowRight, List } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { RTLWrapper } from "../components/ui/rtl-wrapper";
import TopicCard from "../components/topics/TopicCard";
import { useAuth } from "../context/AuthContext";
import { topicsData } from "../data/topicsData";
import { categoryData } from "../data/categories/categoryData";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import StudyModes from "../components/topics/StudyModes";

const Topics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  const isTopicsList = location.pathname === "/topics/list";

  // Filter topics based on search term
  const filteredTopics = topicsData.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {isTopicsList ? (
          <RTLWrapper>
            {/* Hero section */}
            <section className="relative py-12 md:py-16 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">נושאי לימוד</h1>
                  <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-200">
                    בחר אחד מ-{filteredTopics.length} הנושאים להתמקדות בתרגול ממוקד
                  </p>
                  
                  <div className="max-w-md mx-auto relative bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 p-1.5 mb-8">
                    <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-300" />
                    <Input
                      type="text"
                      placeholder="חיפוש נושא..."
                      className="pl-3 pr-12 py-5 bg-transparent border-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => navigate("/topics")}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" /> חזרה למסך הבחירה
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Topics grid section */}
            <section className="py-8">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </div>
            </section>
          </RTLWrapper>
        ) : (
          <RTLWrapper>
            {/* Main selection screen - Use StudyModes component here */}
            <section className="relative py-16 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  בחר את דרך הלימוד שלך
                </h1>
                <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                  בין אם אתה מעדיף ללמוד לפי נושאים, לעבור על כל השאלות או להתחיל סימולציה מלאה - 
                  יש לנו את המסלול המושלם בשבילך
                </p>
              </div>
            </section>
            
            {/* Study Modes Section */}
            <StudyModes categories={categoryData} isPremium={isPremium || false} />
          </RTLWrapper>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Topics;
