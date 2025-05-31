
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface TopicNotFoundProps {
  onNavigateToTopics: () => void;
}

export function TopicNotFound({ onNavigateToTopics }: TopicNotFoundProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mb-6">הנושא לא נמצא</p>
          <Button onClick={onNavigateToTopics} className="mx-2">חזרה לנושאים</Button>
          <Link to="/" className="text-blue-500 hover:text-blue-700 transition-colors mx-2">
            חזרה לדף הבית
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
