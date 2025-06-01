
import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ backgroundColor: '#343a40' }} className="text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <BookOpen className="h-8 w-8" style={{ color: '#ff7f0e' }} />
              <span 
                className="text-xl font-bold"
                style={{ fontFamily: 'Rubik, sans-serif' }}
              >
                AMIRAM Academy
              </span>
            </div>
            <p 
              className="text-gray-300 mb-4"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                lineHeight: '1.6'
              }}
            >
              פלטפורמה מתקדמת לתרגול והכנה למבחן אמירם - מבחן מיון רמת אנגלית לסטודנטים.
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
            <h3 
              className="text-lg font-semibold mb-4 text-white"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              ניווט מהיר
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  דף הבית
                </Link>
              </li>              <li>
                <Link 
                  to="/simulations-entry" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  הסימולציות שלי
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  אודות
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  התחברות
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 
              className="text-lg font-semibold mb-4 text-white"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              נושאים פופולריים
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/topics/1" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  הבנת הנקרא
                </Link>
              </li>
              <li>
                <Link 
                  to="/topics/2" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  דקדוק אנגלי
                </Link>
              </li>
              <li>
                <Link 
                  to="/topics/4" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  אוצר מילים
                </Link>
              </li>
              <li>
                <a 
                  href="#premium" 
                  className="flex items-center space-x-1 space-x-reverse transition-colors"
                  style={{ color: '#ff7f0e' }}
                >
                  <span style={{ fontFamily: 'Rubik, sans-serif' }}>לגישה לכל הנושאים</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p 
            className="text-gray-400 text-sm"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            &copy; {currentYear} AMIRAM Academy. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
