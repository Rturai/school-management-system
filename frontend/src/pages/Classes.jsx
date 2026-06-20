import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ className: "", section: "", roomNumber: "", teacherAssigned: "" });

  const fetchData = async () => {
    const classRes = await axios.get("https://school-management-system-ux11.onrender.com/api/classes");
    const teacherRes = await axios.get("https://school-management-system-ux11.onrender.com/api/teachers");
    setClasses(classRes.data);
    setTeachers(teacherRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if(!formData.className || !formData.section) return alert("Fill class name and section!");
    await axios.post("http://localhost:5000/api/classes", formData);
    fetchData();
    setShowModal(false);
    setFormData({ className: "", section: "", roomNumber: "", teacherAssigned: "" });
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this class structure?")) {
      await axios.delete(`http://localhost:5000/api/classes?id=${id}`);
      fetchData();
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Class & Section Management</h1>
          <button onClick={() => setShowModal(true)} className="bg-amber-500 text-white px-5 py-2 rounded-lg font-medium shadow">
            Create Class Structure
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div key={c._id} className="bg-white p-5 rounded-xl shadow border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded text-xs uppercase tracking-wide">
                  Section {c.section}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">{c.className}</h3>
                <p className="text-sm text-slate-500 mt-1">📌 Room: {c.roomNumber || "N/A"}</p>
                <p className="text-sm font-medium text-indigo-600 mt-3">👨‍🏫 Class Teacher: {c.teacherAssigned?.name || "Not Assigned"}</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-rose-500 hover:text-rose-700 text-sm font-semibold mt-4 text-left">
                Remove Class
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Create New Class</h2>
              <div className="space-y-3">
                <input type="text" placeholder="e.g., Class 10" className="w-full border p-2 rounded" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})}/>
                <input type="text" placeholder="e.g., A" className="w-full border p-2 rounded" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}/>
                <input type="text" placeholder="Room Number" className="w-full border p-2 rounded" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})}/>
                <select className="w-full border p-2 rounded bg-white" value={formData.teacherAssigned} onChange={e => setFormData({...formData, teacherAssigned: e.target.value})}>
                  <option value="">Assign Class Teacher</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="bg-slate-200 px-4 py-2 rounded">Cancel</button>
                <button onClick={handleSubmit} className="bg-amber-500 text-white px-4 py-2 rounded">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Classes;