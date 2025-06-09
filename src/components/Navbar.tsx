import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Brain, 
  BookOpen, 
  Trophy, 
  User, 
  LogIn,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  );
  
  const navBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(20px)"]
  );
  
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'בית', path: '/', icon: <Home className="w-4 h-4" /> },
    { 
      label: 'סימולציות', 
      path: '/simulations-entry', 
      icon: <Brain className="w-4 h-4" />,
      children: [
        { label: 'סימולציה מלאה', path: '/simulation/full' },
        { label: 'תרגול לפי נושא', path: '/simulation/by-type' },
        { label: 'היסטוריה', path: '/simulation/history' }
      ]
    },
    { label: 'למידה', path: '/learn', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'פרימיום', path: '/premium', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor: navBackground,
            backdropFilter: navBlur,
            WebkitBackdropFilter: navBlur,
            borderBottom: `1px solid`,
            borderColor: navBorder
          }}
        />
        
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center ml-2">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white"
                      style={{ fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  פסיכומטרי Pro
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link to={item.path}>
                    <motion.div
                      className={`px-4 py-2 rounded-xl flex items-center space-x-1 rtl:space-x-reverse transition-colors ${
                        location.pathname === item.path 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.icon}
                      <span className="mr-1">{item.label}</span>
                      {item.children && <ChevronDown className="w-4 h-4" />}
                    </motion.div>
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.children && hoveredItem === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 py-2 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
                      >
                        {item.children.map((child) => (
                          <Link key={child.path} to={child.path}>
                            <motion.div
                              className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                              whileHover={{ x: 5 }}
                            >
                              {child.label}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4 ml-2" />
                  התחברות
                </Button>
              </Link>
              
              <Link to="/premium">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg border-0 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ opacity: 0.3 }}
                    />
                    <Sparkles className="w-4 h-4 ml-2" />
                    <span className="relative z-10">שדרג לפרימיום</span>
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-gray-900/95 backdrop-blur-xl border-l border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-20">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 rtl:space-x-reverse py-4 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.icon}
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                <div className="mt-8 space-y-3">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full text-white border-white/20 hover:bg-white/10"
                    >
                      <LogIn className="w-4 h-4 ml-2" />
                      התחברות
                    </Button>
                  </Link>
                  
                  <Link to="/premium" onClick={() => setIsOpen(false)}>
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      <Sparkles className="w-4 h-4 ml-2" />
                      שדרג לפרימיום
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;