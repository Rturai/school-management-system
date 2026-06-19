import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    subject: "", 
    gender: "", 
    image: "" 
  });

  // 1. Fetch Teachers from Backend
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => { 
    fetchTeachers(); 
  }, []);

  // 2. Base64 Image Upload Handler
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
    reader.readAsDataURL(file);
  };

  // 3. Submit Form Data (With Detailed Error Handlers)
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.gender) {
      alert("Please fill all fields, including Full Name at the top!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/teachers", formData);
      alert("Teacher registered successfully!");
      fetchTeachers(); // Refresh table & dynamic dashboard stats
      closeModal();
    } catch (error) {
      console.error("Error saving teacher:", error);
      // 🔥 FIXED: यह अब अलर्ट बॉक्स में असली एरर (जैसे डुप्लीकेट ईमेल) का कारण साफ़ बताएगा
      alert(error.response?.data?.message || "Server Error! Please check if the backend is running.");
    }
  };

  // 4. Delete Teacher Record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher permanently?")) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers?id=${id}`);
        fetchTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  // 5. Close & Reset Form
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", subject: "", gender: "", image: "" });
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Teachers Management</h1>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
          >
            Add Teacher
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="p-4">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Subject</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.length > 0 ? (
                teachers.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <img 
                        src={t.image || "https://via.placeholder.com/40?text=No+Img"} 
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-4 font-medium text-slate-900">{t.name}</td>
                    <td className="p-4 text-slate-600">{t.email}</td>
                    <td className="p-4 text-slate-600">{t.phone}</td>
                    <td className="p-4 text-slate-600">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-sm font-medium">
                        {t.subject}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(t._id)} 
                        className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No teacher records found. Click 'Add Teacher' to register.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-5 text-slate-800">Add New Teacher</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name *</label>
                  <input type="text" placeholder="e.g. John Doe" className="w-full border p-2 mt-1 rounded focus:outline-emerald-500 bg-white text-slate-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Email Address *</label>
                  <input type="email" placeholder="e.g. teacher@school.com" className="w-full border p-2 mt-1 rounded focus:outline-emerald-500 bg-white text-slate-800" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone Number *</label>
                  <input type="text" placeholder="Contact number" className="w-full border p-2 mt-1 rounded focus:outline-emerald-500 bg-white text-slate-800" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Subject Expertise *</label>
                  <input type="text" placeholder="e.g. Mathematics" className="w-full border p-2 mt-1 rounded focus:outline-emerald-500 bg-white text-slate-800" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}/>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Gender *</label>
                  <select className="w-full border p-2 mt-1 rounded bg-white focus:outline-emerald-500 text-slate-800" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Profile Picture</label>
                  <input type="file" accept="image/*" onChange={handleImage} className="w-full text-sm mt-1 text-slate-600"/>
                </div>

                {formData.image && (
                  <div className="flex flex-col items-start mt-2">
                    <span className="text-xs text-slate-400 mb-1">Preview:</span>
                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full object-cover border"/>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button onClick={closeModal} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded font-medium transition">Cancel</button>
                <button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded font-medium shadow transition">Save Teacher</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Teachers;