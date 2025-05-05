const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'אין טוקן גישה. לא ניתן לגשת' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // שמירה של ה-id של המשתמש בתוך הבקשה לשימוש בפונקציות הבאות
        req.userId = decoded.userId;
        next(); // ממשיכים לפונקציה הבאה
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'טוקן לא חוקי או שפג תוקפו' });
    }
};

module.exports = authenticateUser;
