import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Star, 
  Users, 
  Clock, 
  Calendar,
  Target,
  Trophy,
  Gift,
  CheckCircle2,
  Play,
  TrendingUp,
  BookOpen,
  HeadphonesIcon,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  Timer,
  DollarSign,
  ArrowRight,
  Sparkles,
  Crown,
  Lock,
  Shield,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import CardcomPaymentForm from "@/components/payment/CardcomPaymentForm";
import SuccessDialog from "@/components/premium/SuccessDialog";

const Premium = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const coupons = {
    'SAVE20': { discount: 20, description: 'הנחה של 20%' },
    'STUDENT15': { discount: 15, description: 'הנחה לסטודנטים 15%' },
    'WELCOME10': { discount: 10, description: 'הנחה לחברים חדשים 10%' }
  };

  const plans = [
    {
      id: 'daily',
      name: 'גישה ליום',
      price: 20,
      period: '24 שעות',
      description: 'נסיון אינטנסיבי לפני המבחן',
      subtitle: 'לתלמידים במבחן מחר',
      icon: Clock,
      features: ['גישה לסימולציות נבחרות', 'מעקב בסיסי', 'תמיכה בווטסאפ'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'weekly',
      name: 'גישה לשבוע',
      price: 50,
      period: '7 ימים',
      description: 'תרגול בקצב שלכם',
      subtitle: 'לחיזוק מיומנויות',
      icon: Calendar,
      features: ['גישה מלאה לכל התכנים', 'מעקב מתקדם', 'תמיכה בווטסאפ', 'סרטוני הסבר'],
      color: 'from-green-500 to-teal-500',
      discount: 34
    },
    {
      id: 'monthly',
      name: 'גישה לחודש',
      price: 99,
      period: '30 ימים',
      description: 'ההמלצה שלנו!',
      subtitle: 'הכנה יסודית לפטור',
      icon: Zap,
      features: ['יותר מ-50 קטעי קריאה', 'מעל 1,000 שאלות', 'מסלולי למידה מותאמים', 'סטטיסטיקות מתקדמות', 'תמיכה ראשונית'],
      color: 'from-purple-500 to-pink-500',
      recommended: true,
      discount: 40
    },
    {
      id: 'quarterly',
      name: 'גישה ל-3 חודשים',
      price: 239,
      period: '90 ימים',
      description: 'הכי משתלם למתכוננים מוקדם',
      subtitle: 'לשיפור מעמיק',
      icon: Trophy,
      features: ['כל התכנים + זמן לשיפור אמיתי', 'מעקב מתקדם', 'תמיכה VIP', 'עדכוני תוכן', 'ייעוץ אישי'],
      color: 'from-yellow-500 to-orange-500',
      discount: 45
    }
  ];

  const testimonials = [
    {
      name: 'שרה כהן',
      role: 'סטודנטית להנדסה',
      content: 'הסימולציות עזרו לי מאוד להתכונן למבחן. הסביבה זהה למבחן האמיתי והתוצאות היו מדויקות.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    {
      name: 'דוד לוי',
      role: 'סטודנט לרפואה',
      content: 'המעקב האישי עזר לי לזהות בדיוק איפה אני צריך להשתפר. הגעתי למבחן בטוח ומוכן.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      name: 'מיכל אברהם',
      role: 'סטודנטית לפסיכולוגיה',
      content: 'הפלטפורמה הכי טובה להכנה למבחן! קיבלתי את הציון שרציתי ואפילו יותר.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ];

  const faqs = [
    {
      id: 'renewal',
      question: 'האם יש חידוש אוטומטי?',
      answer: 'לא! כל התוכניות שלנו הן תשלום חד-פעמי בלבד. אין חידוש אוטומטי. אתם משלמים פעם אחת ומקבלים גישה לתקופה שבחרתם.'
    },
    {
      id: 'included',
      question: 'מה כלול בחבילה?',
      answer: 'כל החבילות כוללות גישה לכל נושאי הסימולציה, מעל 950 שאלות, סרטוני הסבר, מעקב התקדמות ותמיכה בווטסאפ.'
    },
    {
      id: 'support',
      question: 'איך אפשר לקבל תמיכה?',
      answer: 'אנחנו זמינים דרך ווטסאפ, מייל או הצ\'אט באתר. זמן התגובה הממוצע שלנו הוא פחות מ-2 שעות.'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePaymentSuccess = () => {
    localStorage.setItem("isPremiumUser", "true");
    setIsProcessing(false);
    setIsDialogOpen(true);
  };

  const handlePaymentCancel = () => {
    setIsProcessing(false);
  };

  const handleSuccessfulPayment = () => {
    setIsDialogOpen(false);
    navigate("/simulations-entry");
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase() as keyof typeof coupons];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: coupon.discount });
      setCouponError('');
    } else {
      setCouponError('קוד קופון לא תקין');
      setAppliedCoupon(null);
    }
  };

  const getAmount = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    let amount = plan?.price || 99;
    
    if (appliedCoupon) {
      amount = amount * (1 - appliedCoupon.discount / 100);
    }
    
    return Math.round(amount);
  };

  const getOriginalAmount = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    return plan?.price || 99;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Gradient */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4">
            <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Limited Time Offer Banner */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-pulse">
                <Gift className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">מבצע זמן מוגבל - חסכו עד 45%</span>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                הכנו את עצמכם לפטור באנגלית
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  עם הסימולציות הכי מדויקות
                </span>
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-white/90">
                תשלום חד-פעמי • אין חידוש אוטומטי • גישה מלאה לכל התכנים
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Users className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">15,000+ תלמידים פעילים</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="text-sm font-medium">4.9/5 (3,847 ביקורות)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <ShieldCheck className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium">תשלום מאובטח</span>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Benefits */}
              <div className="space-y-8">
                <div className="text-center lg:text-right">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 mb-4">
                    <Crown className="w-4 h-4 ml-1" />
                    חשבון פרימיום
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    כל המסלולים שלנו כוללים:
                  </h2>
                </div>

                {/* Benefits List */}
                <div className="space-y-6">
                  {[
                    {
                      icon: BookOpen,
                      title: 'גישה מלאה לכל הסימולציות',
                      description: 'תרגול סימולציות מלאות המדמות את מבחן אמיר"ם/אמירנט.'
                    },
                    {
                      icon: Target,
                      title: 'כל סימולציה בנויה בדיוק כמו בבחינה האמיתית',
                      description: 'חוויה אמיתית – אותו פורמט, אותם סוגי שאלות.'
                    },
                    {
                      icon: Clock,
                      title: 'מבחנים ועדכונים חדשים כל הזמן',
                      description: 'מאגר השאלות מתעדכן ומורחב באופן קבוע.\nתמיד נבחן על החומר הרלוונטי ביותר'
                    },
                    {
                      icon: TrendingUp,
                      title: 'התאמה לרמת הנבחן',
                      description: 'ניתן לבחור תרגולים וסימולציות לפי רמת הקושי שלך.\nשליטה מלאה על קצב הלמידה'
                    },
                    {
                      icon: Award,
                      title: 'דו"חות וסטטיסטיקות שיפור',
                      description: 'דו"חות ביצועים אישיים בסיום כל סימולציה.\nהצגת החוזקות והחולשות שלך בזמן אמת'
                    },
                    {
                      icon: CheckCircle,
                      title: 'פתרונות והסברים לכל שאלה',
                      description: 'כל שאלה כוללת הסבר מלא וברור.\nאפשרות לעבור בין סימולציה לתרגול חופשי'
                    },
                    {
                      icon: MessageSquare,
                      title: 'תמיכה אישית בוואטסאפ',
                      description: 'צוות תמיכה זמין לכל שאלה טכנית או לימודית.'
                    }
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 text-right">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 text-sm text-right leading-relaxed whitespace-pre-line">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Right Column - Pricing */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">בחרו את התוכנית המתאימה</h3>
                  
                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {plans.map((plan, index) => {
                      const IconComponent = plan.icon;
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <div
                          key={plan.id}
                          className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                            isSelected ? 'border-purple-500 ring-4 ring-purple-100' : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => setSelectedPlan(plan.id as 'daily' | 'weekly' | 'monthly' | 'quarterly')}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                          }}
                        >
                          {plan.recommended && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1.5 animate-pulse">
                                <Crown className="w-3 h-3 ml-1" />
                                הכי פופולרי
                              </Badge>
                            </div>
                          )}
                          
                          {plan.discount && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-red-500 text-white border-0 text-xs px-2 py-1 rounded-full">
                                -{plan.discount}%
                              </Badge>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                            
                            <div className="mb-4">
                              <div className="text-3xl font-bold text-gray-900">
                                ₪{plan.price}
                              </div>
                              <div className="text-sm text-gray-500">{plan.period}</div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">סה״כ לתשלום:</span>
                      <div className="text-right">
                        {appliedCoupon && (
                          <div className="text-sm text-gray-500 line-through">
                            ₪{getOriginalAmount()}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-purple-600">
                          ₪{getAmount()}
                        </div>
                      </div>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">
                            קוד קופון {appliedCoupon.code} הוחל - חסכתם ₪{getOriginalAmount() - getAmount()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700">תשלום מאובטח באמצעות Cardcom</span>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Gift className="w-5 h-5 text-purple-600" />
                        יש לכם קוד קופון?
                      </h3>
                      <div className="flex gap-2 mb-2">
                        <Input
                          type="text"
                          placeholder="הכניסו קוד קופון"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="bg-white border-gray-300"
                        />
                        <Button 
                          onClick={applyCoupon}
                          className="bg-purple-600 text-white hover:bg-purple-700"
                        >
                          החל
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-red-600 text-sm">{couponError}</p>
                      )}
                      {appliedCoupon && (
                        <p className="text-green-600 text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          קוד קופון הוחל בהצלחה! הנחה של {appliedCoupon.discount}%
                        </p>
                      )}
                      <div className="mt-3 text-xs text-gray-600">
                        קודים זמינים: SAVE20, STUDENT15, WELCOME10
                      </div>
                    </div>
                  </div>

                  <CardcomPaymentForm
                    amount={getAmount()}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </div>

                {/* No Auto-renewal Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">שקיפות מלאה</span>
                  </div>
                  <p className="text-sm text-green-700">
                    כל התוכניות הן תשלום חד-פעמי בלבד. אין חידוש אוטומטי.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                מה אומרים התלמידים שלנו
              </h2>
              <p className="text-lg text-gray-600">
                יותר מ-15,000 תלמידים כבר הצליחו עם המערכת שלנו
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                שאלות נפוצות
              </h2>
              <p className="text-lg text-gray-600">
                כל מה שצריך לדעת לפני הרכישה
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-gray-50 rounded-xl overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-right flex items-center justify-between hover:bg-gray-100 transition-colors"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              צריכים עזרה? אנחנו כאן בשבילכם
            </h2>
            <p className="text-lg mb-8 text-white/90">
              הצוות שלנו זמין לכם 24/7 לכל שאלה או בעיה
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4"
                onClick={() => window.open('https://wa.me/972525602218', '_blank')}
              >
                <MessageSquare className="w-5 h-5 ml-2" />
                ווטסאפ: 0525602218
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4"
                onClick={() => window.open('mailto:support@amiram.net', '_blank')}
              >
                support@amiram.net
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <SuccessDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        onSuccess={handleSuccessfulPayment} 
      />
      
      <Footer />
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Premium;