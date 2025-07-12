const ModernStatsSection = () => {
  const stats = [
    {
      number: "80+",
      label: "תלמידים הכירו אותנו אישית",
      description: "שנים של הוראה פרטית"
    },
    {
      number: "5",
      label: "שנות ניסיון בהוראה",
      description: "מתמחים באנגלית פסיכומטרי"
    },
    {
      number: "89%",
      label: "מהתלמידים שלנו שיפרו את הציון",
      description: "תוצאות מוכחות"
    },
    {
      number: "70%",
      label: "חיסכון במחיר",
      description: "לעומת הכנה מסורתית"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/10 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-2/3 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            המספרים מדברים בעד עצמם
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            תוצאות אמיתיות מתלמידים אמיתיים
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/20"
            >
              <div className="space-y-4">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-blue-100">
                  {stat.label}
                </div>
                <div className="text-sm text-blue-200 leading-relaxed">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernStatsSection;