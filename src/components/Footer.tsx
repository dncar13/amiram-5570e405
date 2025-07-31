
import { Link } from "react-router-dom";
import { ExternalLink, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      id="footer" 
      role="contentinfo" 
      style={{ backgroundColor: '#343a40' }} 
      className="text-white pt-12 pb-6"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4 text-white"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              צרו קשר
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="h-4 w-4 text-gray-300" />
                <span 
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  support@amiram.net
                </span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="h-4 w-4 text-gray-300" />
                <span 
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  0525602218 (ווצאפ בלבד)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
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
              </li>
              <li>
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
                  to="/terms" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  תקנון האתר
                </Link>
              </li>
              <li>
                <Link 
                  to="/accessibility" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  הצהרת נגישות
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Topics */}
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
                  to="/reading-comprehension" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  הבנת הנקרא
                </Link>
              </li>
              <li>
                <Link 
                  to="/topics/2/intro" 
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  דקדוק אנגלי
                </Link>
              </li>
              <li>
                <Link 
                  to="/topics/4/intro" 
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
