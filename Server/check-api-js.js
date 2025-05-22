// check-api.js - קובץ בדיקה שמאפשר לוודא שהשרת עובד כראוי
// יש להריץ קובץ זה באמצעות Node.js לבדיקת חיבור לשרת

const axios = require('axios');

// כתובת השרת
const SERVER_URL = 'http://localhost:3000';

// פונקציה לבדיקת נקודת קצה של השרת
async function checkEndpoint(endpoint, method = 'GET', data = null) {
  try {
    console.log(`\nבודק ${method} ${endpoint}...`);
    
    let response;
    if (method === 'GET') {
      response = await axios.get(`${SERVER_URL}${endpoint}`);
    } else if (method === 'POST') {
      response = await axios.post(`${SERVER_URL}${endpoint}`, data);
    }
    
    console.log('סטטוס:', response.status);
    console.log('תשובה:', response.data);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('שגיאה:', error.message);
    
    if (error.response) {
      console.error('סטטוס:', error.response.status);
      console.error('תשובה:', error.response.data);
      return { success: false, error: error.response.data, status: error.response.status };
    } else {
      return { success: false, error: error.message };
    }
  }
}

// בדיקת מספר נקודות קצה עיקריות
async function runTests() {
  console.log('=== בדיקת חיבור לשרת ===');
  
  // בדיקה בסיסית - בריאות השרת
  await checkEndpoint('/api/health');
  
  // בדיקת הרשמה עם משתמש חדש לצורך הדגמה
  const testUser = {
    UserName: 'משתמש_בדיקה',
    email: `test${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'סיסמה123!'
  };
  
  console.log('\nמנסה להרשם עם המשתמש:', testUser);
  const registerResult = await checkEndpoint('/api/users/registerUser', 'POST', testUser);
  
  // אם ההרשמה הצליחה, מנסה להתחבר עם אותם פרטים
  if (registerResult.success) {
    console.log('\nהרשמה הצליחה, מנסה להתחבר...');
    await checkEndpoint('/api/users/loginUser', 'POST', {
      email: testUser.email,
      password: testUser.password
    });
  }
  
  console.log('\n=== סיום בדיקת השרת ===');
}

// הרצת הבדיקות
runTests().catch(err => {
  console.error('שגיאה בהרצת הבדיקות:', err);
});