require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Connection error handling
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Models
const childSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }
});

const parentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String
});

const sessionSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
  date: Date,
  startTime: Date,
  endTime: Date,
  type: { type: String, enum: ['hourly', 'daily'] },
  pickupCost: Number,
  additionalCosts: [{
    description: String,
    amount: Number
  }]
});

const Child = mongoose.model('Child', childSchema);
const Parent = mongoose.model('Parent', parentSchema);
const Session = mongoose.model('Session', sessionSchema);

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.get('/api/parents', async (req, res) => {
  try {
    const parents = await Parent.find();
    res.json(parents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/parents', async (req, res) => {
  try {
    const parent = new Parent(req.body);
    const newParent = await parent.save();
    res.status(201).json(newParent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/parents/:id', async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedParent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/parents/:id', async (req, res) => {
  try {
    await Child.deleteMany({ parentId: req.params.id });
    await Parent.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Children routes
app.get('/api/children', async (req, res) => {
  try {
    const children = await Child.find().populate('parentId');
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/children', async (req, res) => {
  try {
    const child = new Child(req.body);
    const newChild = await child.save();
    const populatedChild = await Child.findById(newChild._id).populate('parentId');
    res.status(201).json(populatedChild);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Sessions routes
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate({
        path: 'childId',
        populate: { path: 'parentId' }
      });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});