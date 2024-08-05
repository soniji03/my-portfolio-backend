// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


// JWT secret key (should be stored in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({ name, email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    // Create and send JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token,user });
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    console.log(user, "user")
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const saltRounds = 10; // Debe ser el mismo número usado al crear el usuario
    const hashedInputPassword = await bcrypt.hash(password, saltRounds);

    console.log('INPUT HASH PASSWORD:', hashedInputPassword);
    console.log('STORED HASH PASSWORD:', user.password);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('ismatch', isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong Paasword' });
    }
    
    // Create and send JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token,user});
    });
  } catch (error) {
    return res.status(500).json({ message: 'Somthing Went Wrong' });
  }
};

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    // req.user is set by the authMiddleware
    console.log(req.user);
    const userId = req.user.id; // Change this line

    // Find the user by ID, excluding the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.logout();
    res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
      }
      };

exports.checkLoginStatus = async (req, res, next)=>{
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) return res.status(401).json({ message: 'Token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded?.user?.id){
     return res.status(200).json({status:true,message:'user logged in.'})
    }else{
     return res.status(401).json({status:false,message:'user not logged in.'})
    }
  } catch (error) {
    return res.status(401).json({ message: 'User not logged in' });
  }
}

// Export the authMiddleware for use in routes

exports.authMiddleware = authMiddleware;

// Add other controller functions here







