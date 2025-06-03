
const User = require('../Models/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const registerUser = async (req, res) => {
    try {
        const { UserName, email, password } = req.body;
        if (!UserName || !email || !password) {
            return res.status(400).json({ message: 'יש למלא את כל השדות' }); 
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'The User already exists.' }); 
        }
        const hashedPassword = await bcrypt.hash(password, 8); 
        const newUser = new User({ UserName, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign(
            {
                userId: newUser._id 
            },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        res.status(201).json({ token, UserName: newUser.UserName });

 } catch (error) {
    console.error(' Registration error:', error.message); 
    res.status(500).json({ message: 'Server error', error: error.message });
}
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'יש למלא את כל השדות' });
        }
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: 'The User not exists.' });
        }
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }
        const token = jwt.sign(
            {
                userId: userExists._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, UserName: userExists.UserName });
    } catch (error) {
        console.error(' Login error:', error.message); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUser:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
module.exports = { registerUser, loginUser,getUser }; 

