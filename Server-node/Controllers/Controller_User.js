
const User = require('../Models/User'); // ייבוא מודל המשתמש
const jwt = require('jsonwebtoken'); // ייבוא ספריית JWT ליצירת טוקנים
const bcrypt = require('bcrypt'); // ייבוא ספריית bcrypt להחסמת סיסמאות

// פונקציה להרשמת משתמש חדש
const registerUser = async (req, res) => {
    try {
        // חילוץ נתונים מתוך גוף הבקשה
        const { UserName, email, password } = req.body;

        // בדיקה אם כל השדות מולאו
        if (!UserName || !email || !password) {
            return res.status(400).json({ message: 'יש למלא את כל השדות' }); // אם יש שדה ריק, מחזירים שגיאה
        }

        // בדיקה אם המשתמש כבר קיים במערכת לפי כתובת הדוא"ל
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'The User already exists.' }); // אם המשתמש כבר קיים, מחזירים שגיאה
        }

        // החסמת סיסמת המשתמש לפני שמירתה
        const hashedPassword = await bcrypt.hash(password, 8); // חישוב הסיסמה המוצפנת בעזרת bcrypt

        // יצירת אובייקט משתמש חדש
        const newUser = new User({ UserName, email, password: hashedPassword });

        // שמירת המשתמש החדש בבסיס הנתונים
        await newUser.save();

        // יצירת טוקן JWT עבור המשתמש החדש (כולל ה־userId שלו)
        const token = jwt.sign(
            {
                userId: newUser._id // כולל את ה־ID של המשתמש החדש בתוך הטוקן
            },
            process.env.JWT_SECRET, // המפתח הסודי ליצירת הטוקן, נמצא בקובץ הסביבה
            { expiresIn: '3w' } // הגדרת תוקף הטוקן לשלושה שבועות
        );

        // שליחת הטוקן בתשובה עם סטטוס 201 (המשתמש נוצר בהצלחה)
        res.status(201).json({ token, UserName: newUser.UserName });

    } catch (error) {
        console.error('Registration error:', error); // הדפסת השגיאה לקונסול
        res.status(500).json({ message: 'Server error' }); // במקרה של שגיאה בשרת, מחזירים שגיאה כללית
    }

};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // בדיקה אם כל השדות מולאו
    if (!email || !password) {
        return res.status(400).json({ message: 'יש למלא את כל השדות' }); // אם יש שדה ריק, מחזירים שגיאה
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.status(400).json({ message: 'The User not exists.' }); // אם המשתמש לא קיים, מחזירים שגיאה
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    // אם הסיסמה לא נכונה, מחזירים שגיאה
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Incorrect password.' });
    }

    // יצירת טוקן JWT לאחר שהמשתמש זוהה בהצלחה
    const token = jwt.sign(
        {
            userId: userExists._id // מכניסים את ה-ID של המשתמש לטוקן
        },
        process.env.JWT_SECRET, // המפתח הסודי ליצירת הטוקן
        { expiresIn: '3w' } // תוקף הטוקן לשלושה שבועות
    );

    // שליחת הטוקן בתשובה עם סטטוס 200 (התחברות הצליחה)
    res.status(200).json({ token , UserName: userExists.UserName})
};

const getUser = async (req, res) => {
    try {
        // נשלוף את הטוקן מה-headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // נפרש את הטוקן ונשלוף את ה-userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // נביא את המשתמש מהמסד לפי ה-id
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // נחזיר את פרטי המשתמש
        res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUser:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = { registerUser, loginUser,getUser }; // יצוא הפונקציה לשימוש בקבצים אחרים
