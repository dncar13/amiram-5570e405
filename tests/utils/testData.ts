
export const TestUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test@1234!',
    firstName: 'בדיקה',
    lastName: 'אוטומטית'
  },
  
  invalidUser: {
    email: 'invalid@example.com',
    password: 'WrongPassword123!'
  },
  
  newUser: () => ({
    email: `test_${Date.now()}@example.com`,
    password: 'Test@1234!',
    firstName: 'משתמש',
    lastName: 'חדש'
  })
};

export const TestData = {
  // Simulation data
  simulationTypes: ['full', 'practice', 'reading-comprehension'],
  
  // Expected URLs
  urls: {
    home: '/',
    login: '/login',
    register: '/register',
    simulation: '/simulation',
    simulationEntry: '/simulations-entry',
    readingComprehension: '/reading-comprehension',
    history: '/simulation-history',
    about: '/about'
  },
  
  // Expected texts
  texts: {
    loginSuccess: ['שלום', 'ברוך הבא', 'התחברת בהצלחה'],
    loginError: ['שגיאה', 'לא נכון', 'פרטים שגויים'],
    signupSuccess: ['הרשמה הושלמה', 'נרשמת בהצלחה', 'ברוך הבא'],
    signupError: ['כתובת המייל כבר קיימת', 'שגיאה בהרשמה']
  },
  
  // Performance thresholds
  performance: {
    maxLoadTime: 3000, // 3 seconds
    maxImageLoadTime: 2000 // 2 seconds
  }
};

export const generateUniqueEmail = (): string => {
  return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
};

export const generateTestUser = () => ({
  email: generateUniqueEmail(),
  password: 'Test@1234!',
  firstName: 'בדיקה',
  lastName: 'אוטומטית'
});
