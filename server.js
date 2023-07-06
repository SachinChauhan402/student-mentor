const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const db = require("./db")
const {Mentor, Student } = require("./models")
const PORT = process.env.PORT || 70

db.connect();

let mentors = []
let students = [];
app.post("/mentors", (req,res) => {
    const mentorData = req.body;
    const mentor = new Mentor(mentorData);
  
    mentor.save()
      .then(savedMentor => {
        res.json(savedMentor);
      })
      .catch(error => {
        res.status(500).json({ error: 'Error saving mentor' });
      });
    
})

app.post('/students', (req, res) => {
    const studentData = req.body;
    const student = new Student(studentData);
  
    student.save()
      .then(savedStudent => {
        res.json(savedStudent);
      })
      .catch(error => {
        res.status(500).json({ error: 'Error saving student' });
      });
});

app.post('/assign-mentor', async (req, res) => {
    const mentorId = req.body.mentorId;
    const studentIds = req.body.studentIds;
  
    try {
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        res.status(404).json({ error: 'Mentor not found' });
        return;
      }
  
      const studentsWithoutMentor = await Student.find({
        _id: { $in: studentIds },
        mentorId: { $exists: false },
      });
  
      if (studentsWithoutMentor.length === 0) {
        res.json({ message: 'No students available to assign or all students already have a mentor' });
        return;
      }
  
      await Student.updateMany(
        { _id: { $in: studentsWithoutMentor.map(student => student._id) } },
        { mentorId }
      );
  
      res.json({ message: 'Students assigned to the mentor successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error assigning students to the mentor' });
    }
  });
  

  app.put('/assign-mentor/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const mentorId = req.body.mentorId;
    
    const student = students.find(student => student.id === studentId);
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    
    student.mentorId = mentorId;
    
    res.json({ message: 'Mentor assigned to the student successfully' });
  });

  app.get('/students/:mentorId', (req, res) => {
    const mentorId = req.params.mentorId;
    
    const mentor = mentors.find(mentor => mentor.id === mentorId);
    if (!mentor) {
      res.status(404).json({ error: 'Mentor not found' });
      return;
    }
    
    const mentorStudents = students.filter(student => student.mentorId === mentorId);
    
    res.json(mentorStudents);
  });

  app.get('/mentor/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    
    const student = students.find(student => student.id === studentId);
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    
    const mentor = mentors.find(mentor => mentor.id === student.mentorId);
    
    if (!mentor) {
      res.json({ message: 'No mentor assigned to the student' });
    } else {
      res.json(mentor);
    }
  });
  
  
  
  



app.listen(PORT , (req,res) => {
    console.log(`Server is running on port : ${PORT}`)
})