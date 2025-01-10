const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./userModel'); // Mongoose User model
const Goal = require('./goalModel'); // Mongoose Goal model
const app = express();

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://acepro6825:Jotaro6825@cluster0.5amsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).send('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.send('Registration successful');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('Invalid username or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid username or password');

  const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}

// Route to create a goal
app.post('/goals', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const username = req.user.username;

  const goal = new Goal({ username, title, description });
  await goal.save();

  res.send('Goal created successfully');
});

// Route to fetch goals
app.get('/goals', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const goals = await Goal.find({ username });
  res.json(goals);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Route to allow user to update goal status
app.put('/goals/:id', authenticateToken, async (req, res) => {
  const goalId = req.params.id;
  const { status } = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { status },
      { new: true }
    );

    if (!updatedGoal) return res.status(404).send('Goal not found');
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).send('Error updating goal');
  }
});


// Dashboard route
app.get('/dashboard', authenticateToken, async (req, res) => {
  const username = req.user.username; // Get the username from the token

  try {
    // Fetch all goals for the user
    const totalGoals = await Goal.countDocuments({ username });
    const completedGoals = await Goal.countDocuments({ username, status: 'completed' });
    const inProgressGoals = totalGoals - completedGoals;

    // Send the summary as a response
    res.json({
      totalGoals,
      completedGoals,
      inProgressGoals
    });
  } catch (err) {
    res.status(500).send('Error fetching dashboard data');
  }
});

