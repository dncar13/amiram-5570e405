
import { Link } from "react-router-dom";
import { BoltIcon, Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-electric-navy text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <BoltIcon className="h-8 w-8 text-electric-orange" />
              <span className="text-xl font-bold">TD-Academy</span>
            </div>
            <p className="text-gray-300 mb-4">
              פלטפורמה מתקדמת לתרגול ולמידה של נושאים בחשמל למהנדסים, טכנאים וסטודנטים.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">ניווט מהיר</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">דף הבית</Link>
              </li>
              <li>
                <Link to="/topics" className="text-gray-300 hover:text-white transition-colors">נושאים</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">אודות</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">התחברות</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">נושאים פופולריים</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/topics/1" className="text-gray-300 hover:text-white transition-colors">יסודות החשמל</Link>
              </li>
              <li>
                <Link to="/topics/2" className="text-gray-300 hover:text-white transition-colors">מעגלים חשמליים</Link>
              </li>
              <li>
                <Link to="/topics/4" className="text-gray-300 hover:text-white transition-colors">בטיחות בחשמל</Link>
              </li>
              <li>
                <a href="#premium" className="flex items-center space-x-1 space-x-reverse text-electric-orange hover:text-orange-300 transition-colors">
                  <span>לגישה לכל הנושאים</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} TD-Academy. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
