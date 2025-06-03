// קובץ עזרה לאתחול מחדש של השאלות במערכת
// יש להריץ אותו פעם אחת בדפדפן כדי לאתחל מחדש את כל השאלות
// לאחר הרצה הקובץ לא נדרש יותר

document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing questions reset helper");
  
  // נקה את local storage מנתוני השאלות הקודמים
  localStorage.removeItem('savedQuestions');
  console.log("Cleared savedQuestions from localStorage");
  
  // הוסף כפתור לעמוד שיאפשר איתחול מחדש
  const resetButton = document.createElement('button');
  resetButton.innerText = 'אתחל שאלות מחדש';
  resetButton.style.position = 'fixed';
  resetButton.style.bottom = '10px';
  resetButton.style.right = '10px';
  resetButton.style.zIndex = '9999';
  resetButton.style.padding = '10px';
  resetButton.style.backgroundColor = '#ff5722';
  resetButton.style.color = 'white';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '4px';
  resetButton.style.cursor = 'pointer';
  
  resetButton.addEventListener('click', function() {
    localStorage.removeItem('savedQuestions');
    sessionStorage.clear();
    console.log("Questions reset completed");
    alert('השאלות אותחלו מחדש. הדף יטען מחדש.');
    window.location.reload();
  });
  
  document.body.appendChild(resetButton);
  
  // הוסף הודעה למסך
  const message = document.createElement('div');
  message.innerText = 'מאתחל שאלות... אנא רענן את הדף';
  message.style.position = 'fixed';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.padding = '20px';
  message.style.backgroundColor = 'rgba(0,0,0,0.8)';
  message.style.color = 'white';
  message.style.borderRadius = '8px';
  message.style.zIndex = '9999';
  
  document.body.appendChild(message);
  
  // הסר את ההודעה אחרי 3 שניות
  setTimeout(function() {
    message.style.display = 'none';
  }, 3000);
  
  // רענן את הדף אוטומטית אחרי 1 שניה
  setTimeout(function() {
    window.location.reload();
  }, 1000);
});
