import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js"; // 🚨 Naya Model Import kiya

export const getStats = async (req, res) => {
  try {
    // 1. 🔥 REAL-TIME DYNAMIC COUNT FROM EXISTING DATABASE
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();

    // 2. 📊 ENROLLMENT MONTH-WISE AGGREGATION
    const monthStats = await Enrollment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // 1 to 12 month number
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3. 🏫 ENROLLMENT CLASS-WISE AGGREGATION
    const classStats = await Enrollment.aggregate([
      {
        $group: {
          _id: "$className",
          count: { $sum: 1 }
        }
      },
      { $sort: { "count": -1 } }
    ]);

    // Month formatting array logic
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = monthNames.map((month, index) => {
      const found = monthStats.find(item => item._id === index + 1);
      return {
        month: month,
        enrollments: found ? found.count : 0
      };
    });

    // Class formatting map logic
    const formattedClassData = classStats.map(item => ({
      className: item._id ? item._id.toUpperCase().replace("-", " ") : "UNKNOWN",
      students: item.count
    }));

    // Saara data ek hi bar me response me bhejna
    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalClasses,
      monthlyAnalytics: formattedMonthlyData,
      classAnalytics: formattedClassData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};