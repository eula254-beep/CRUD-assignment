// importing the server and the mongodb
const express = require('express'); // this is the server
const mongoose = require('mongoose'); // this is the mongodb
const cors = require('cors'); // <-- allow requests from frontend
const path = require('path');

// initialize the express app and allow it to handle json data/requests
const app = express();
app.use(express.json());
app.use(cors()); // allow React or other ports to connect

// establish a connection to the mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((error) => {
  console.error('❌ Error connecting to MongoDB:', error);
});

// Define the schema and model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String
});
const Student = mongoose.model('Student', studentSchema);

// ---------------- CRUD ROUTES ----------------

// CREATE - Add a new student
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ - Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Update a student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve your HTML file (optional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});
