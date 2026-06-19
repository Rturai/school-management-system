import Enrollment from "../models/Enrollment.js";

// 1. POST: Naya Student Enroll/Save Karna
export const createEnrollment = async (req, res) => {
  try {
    const newEnrollment = new Enrollment(req.body);
    await newEnrollment.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Student enrolled successfully in database!', 
      data: newEnrollment 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database save failed.', 
      error: error.message 
    });
  }
};

// 2. GET: Dashboard ke liye Month-wise Enrollment Stats
export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Enrollment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Month number (1 to 12) extract karega
          count: { $sum: 1 } // Total admissions count
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Graph me koi month khali na dikhe, isliye empty months ko 0 map karna
    const formattedStats = monthNames.map((month, index) => {
      const found = stats.find(item => item._id === index + 1);
      return {
        month: month,
        enrollments: found ? found.count : 0
      };
    });

    res.status(200).json({ success: true, data: formattedStats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};