import Teacher from "../models/Teacher.js";

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.query.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};