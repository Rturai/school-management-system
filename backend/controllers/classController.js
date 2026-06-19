import Class from "../models/Class.js";

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("teacherAssigned", "name");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};