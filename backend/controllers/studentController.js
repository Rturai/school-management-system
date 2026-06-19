import Student from '../models/Student.js';

// 1. Get All Students (डैशबोर्ड और लिस्ट दोनों के लिए छात्र ढूंढना)
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 }); // नए छात्र सबसे ऊपर दिखेंगे
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Create a Student (नया छात्र डेटाबेस में सेव करना)
export const createStudent = async (req, res) => {
    try {
        // चेक करें कि क्या यह रोल नंबर या ईमेल पहले से मौजूद तो नहीं है
        const existingStudent = await Student.findOne({ 
            $or: [{ rollNumber: req.body.rollNumber }, { email: req.body.email }] 
        });
        
        if (existingStudent) {
            return res.status(400).json({ message: "Roll Number or Email already exists!" });
        }

        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// 3. Update a Student (Edit बटन के लिए)
export const updateStudent = async (req, res) => {
    const { id } = req.query; // फ़्रॉन्टएंड से आ रही `?id=...` को कैप्चर करना
    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Delete a Student (Delete बटन के लिए)
export const deleteStudent = async (req, res) => {
    const { id } = req.query; // फ़्रॉन्टएंड से आ रही `?id=...` को कैप्चर करना
    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};