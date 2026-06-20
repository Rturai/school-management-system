import { useState, useEffect } from "react";

import MainLayout from "../layouts/MainLayout";
import API from "./api";
const Students = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    className: "",
    section: "",
    gender: "",
    dob: "",
    image: "",
    rollNumber: "", // Added missing rollNumber in initial state
  });

  // 1. Fetch Students from Backend API on Component Mount
  const fetchStudents = async () => {
    try {
     const response = await API.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Base64 Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  // 3. Add or Update Student Details
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.className || !formData.section || !formData.rollNumber) {
      alert("Please fill all required fields (Name, Roll Number, Email, Class, Section)");
      return;
    }

    try {
      if (isEditing) {
        await API.put(`/students?id=${editId}`, formData);
        alert("Student updated successfully!");
      } else {
        await API.post("/students", formData);
        alert("Student registered successfully!");
      }
      
      fetchStudents();
      closeModal();
    } catch (error) {
      console.error("Error saving student:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // 4. Delete Student
  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student permanently?")) {
      try {
        await API.delete(`/students?id=${id}`);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  // 🔥 5. Dynamic Print Profile Function
  const handlePrint = (student) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Identity Card - ${student.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; padding: 40px; background: #fff; }
            .badge-container { max-w: 650px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .header { background: #4f46e5; color: white; text-align: center; padding: 24px; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase; }
            .header p { margin: 4px 0 0 0; opacity: 0.9; font-size: 14px; }
            .content { display: flex; gap: 32px; padding: 32px; align-items: center; }
            .avatar-box { text-align: center; }
            .avatar { width: 140px; height: 140px; rounded-radius: 50%; object-fit: cover; border: 4px solid #e2e8f0; border-radius: 50%; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
            .info-table { width: 100%; border-collapse: collapse; }
            .info-table td { padding: 10px 12px; font-size: 15px; border-bottom: 1px solid #f1f5f9; }
            .info-table td.label { font-weight: 600; color: #64748b; width: 35%; }
            .info-table td.value { color: #0f172a; font-weight: 500; }
            .footer { background: #f8fafc; text-align: center; padding: 12px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            @media print {
              body { padding: 0; background: none; }
              .badge-container { border: 1px solid #cbd5e1; box-shadow: none; margin-top: 50px; }
            }
          </style>
        </head>
        <body>
          <div class="badge-container">
            <div class="header">
              <h1>School Management System</h1>
              <p>Official Student Information Record</p>
            </div>
            <div class="content">
              <div class="avatar-box">
                <img class="avatar" src="${student.image || 'https://via.placeholder.com/150?text=No+Photo'}" alt="Student" />
              </div>
              <div style="flex-grow: 1;">
                <table class="info-table">
                  <tr><td class="label">Full Name</td><td class="value">${student.name}</td></tr>
                  <tr><td class="label">Roll Number</td><td class="value">${student.rollNumber || "N/A"}</td></tr>
                  <tr><td class="label">Email</td><td class="value">${student.email}</td></tr>
                  <tr><td class="label">Phone</td><td class="value">${student.phone || "—"}</td></tr>
                  <tr><td class="label">Class & Sec</td><td class="value">${student.className} - ${student.section.toUpperCase()}</td></tr>
                  <tr><td class="label">Blood Group</td><td class="value" style="color: #dc2626; font-weight: bold;">${student.bloodGroup || "—"}</td></tr>
                  <tr><td class="label">Date of Birth</td><td class="value">${student.dob || "—"}</td></tr>
                  <tr><td class="label">Gender</td><td class="value">${student.gender || "—"}</td></tr>
                </table>
              </div>
            </div>
            <div class="footer">
              Generated via Administration Portal on ${new Date().toLocaleDateString()}
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 6. Setup Form for Editing (Opens Modal with Data)
  const openEditModal = (student) => {
    setIsEditing(true);
    setEditId(student._id);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber || "",
      email: student.email,
      phone: student.phone || "",
      bloodGroup: student.bloodGroup || "",
      className: student.className,
      section: student.section,
      gender: student.gender || "",
      dob: student.dob ? student.dob.split('T')[0] : "",
      image: student.image || "",
    });
    setShowModal(true);
  };

  // 7. Reset Form on Close
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      rollNumber: "",
      email: "",
      phone: "",
      bloodGroup: "",
      className: "",
      section: "",
      gender: "",
      dob: "",
      image: "",
    });
  };

  // 8. Client Side Filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Students Management</h1>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search Student by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-lg w-72 bg-white shadow-sm focus:outline-indigo-500"
            />

            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="p-4">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Blood Group</th> {/* 🔥 1. टेबल हेडर में ब्लड ग्रुप कॉलम जोड़ा */}
                <th className="p-4">Class</th>
                <th className="p-4">Section</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <img
                        src={student.image || "https://via.placeholder.com/50?text=No+Img"}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-4 font-medium text-slate-900">{student.name}</td>
                    <td className="p-4 text-slate-600">{student.rollNumber || "N/A"}</td>
                    <td className="p-4 text-slate-600">{student.email}</td>
                    <td className="p-4 text-slate-600">{student.phone || "—"}</td>
                    <td className="p-4 font-semibold text-rose-600">{student.bloodGroup || "—"}</td> {/* 🔥 2. टेबल बॉडी में ब्लड ग्रुप रेंडर किया */}
                    <td className="p-4 text-slate-600">{student.className}</td>
                    <td className="p-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-sm uppercase">
                        {student.section}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2 flex items-center justify-center h-20">
                      {/* 🔥 3. प्रिंट करने का नया बटन */}
                      <button
                        onClick={() => handlePrint(student)}
                        className="bg-slate-700 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded text-sm font-medium shadow-sm transition"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => openEditModal(student)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    No records found. Add a new student to see data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form Modal (Add / Edit) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-5 text-slate-800">
                {isEditing ? "Edit Student Details" : "Add New Student"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name *</label>
                  <input
                    type="text"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Roll Number *</label>
                  <input
                    type="text"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.rollNumber || ""}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    disabled={isEditing}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Email Address *</label>
                  <input
                    type="email"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Phone Number</label>
                  <input
                    type="text"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Class *</label>
                  <input
                    type="text"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Section *</label>
                  <input
                    type="text"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Blood Group</label>
                  <input
                    type="text"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full border p-2 mt-1 rounded focus:outline-indigo-500"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Gender</label>
                  <select
                    className="w-full border p-2 mt-1 rounded bg-white focus:outline-indigo-500"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Student Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm mt-1"
                    onChange={handleImageUpload}
                  />
                </div>

                {formData.image && (
                  <div className="col-span-1 md:col-span-2 flex flex-col items-start mt-2">
                    <span className="text-xs text-slate-400 mb-1">Image Preview:</span>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded font-medium transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-medium shadow transition"
                >
                  {isEditing ? "Save Changes" : "Save Student"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Students;