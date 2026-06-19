import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUser, FaGraduationCap, FaCheckCircle, FaTimes, FaCalendarAlt, FaPhoneAlt, FaMapMarkerAlt, FaPrint } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout'; 
import axios from 'axios'; 

const Enrollment = () => {
  // Form input fields state
  const [formData, setFormData] = useState({
    name: '', email: '', dob: '', gender: '', className: '', guardianName: '', guardianPhone: '', address: ''
  });
  
  // Table sheets data states
  const [enrollments, setEnrollments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Live data pull karne ka standard handler
  const fetchEnrollments = () => {
    axios.get('http://localhost:5000/api/all-enrollments')
      .then(res => {
        if (res.data && res.data.data) {
          setEnrollments(res.data.data);
        } else if (Array.isArray(res.data)) {
          setEnrollments(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Data loading failed:", err);
        setLoading(false);
      });
  };

  // Component load hote hi data fetch trigger hoga
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await axios.post('http://localhost:5000/api/enroll', formData);
      if (response.data.success) {
        setSubmitted(true);
        // Form inputs khali karein
        setFormData({ name: '', email: '', dob: '', gender: '', className: '', guardianName: '', guardianPhone: '', address: '' });
        // Live data refresh taaki niche instantly naya record dikhe
        fetchEnrollments(); 
      }
    } catch (error) {
      setErrorMsg("Data backend tak nahi ja saka!");
    }
  };

  // PREMIUM ADMISSION RECEIPT PRINT LOGIC
  const handlePrintSlip = (student) => {
    const printWindow = window.open('', '_blank');
    const slipHtml = `
      <html>
        <head>
          <title>Admission Slip - ${student.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-8 text-slate-800 font-sans">
          <div class="max-w-xl mx-auto border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
            <div class="text-center border-b pb-4 mb-6">
              <h1 class="text-2xl font-black text-indigo-600 tracking-wide">SCHOOLSYNC ACADEMY</h1>
              <p class="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Student Admission Acknowledgement Slip</p>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mb-6 font-semibold">
              <span>Receipt No: ACK-${student._id?.slice(-6).toUpperCase() || 'NEW'}</span>
              <span>Date: ${new Date(student.createdAt || Date.now()).toLocaleDateString('en-IN')}</span>
            </div>
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-indigo-500 uppercase tracking-wider border-b pb-1">1. Student Information</h3>
              <div class="grid grid-cols-2 gap-y-2 text-sm">
                <span class="font-bold text-slate-400">Full Name:</span> <span class="font-black text-slate-800">${student.name}</span>
                <span class="font-bold text-slate-400">Class Assigned:</span> <span class="font-bold text-indigo-600 uppercase">${student.className?.replace("-", " ") || 'N/A'}</span>
                <span class="font-bold text-slate-400">Date of Birth:</span> <span>${student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : 'N/A'}</span>
                <span class="font-bold text-slate-400">Gender:</span> <span>${student.gender}</span>
              </div>
              <h3 class="text-sm font-bold text-indigo-500 uppercase tracking-wider border-b pb-1 mt-6">2. Guardian Info</h3>
              <div class="grid grid-cols-2 gap-y-2 text-sm">
                <span class="font-bold text-slate-400">Guardian Name:</span> <span class="font-bold text-slate-700">${student.guardianName}</span>
                <span class="font-bold text-slate-400">Contact Number:</span> <span class="font-mono">${student.guardianPhone}</span>
                <span class="font-bold text-slate-400 flex-shrink-0">Address:</span> <span class="text-slate-600 text-xs">${student.address}</span>
              </div>
            </div>
          </div>
          <script>
            window.print();
            window.onafterprint = function() { window.close(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(slipHtml);
    printWindow.document.close();
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto bg-slate-50 min-h-screen space-y-8 relative">
        
        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
            <FaUserPlus className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-wide">Student Enrollment Hub</h1>
            <p className="text-sm text-slate-500 font-medium">Submit new candidate details and view live records below.</p>
          </div>
        </div>

        {errorMsg && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl">⚠️ {errorMsg}</div>}

        {/* 1. Form Layout Block */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-4">
              <FaUser /><span>Personal Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" placeholder="Student Name"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">DOB *</label>
                <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Gender *</label>
                <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-indigo-500">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-4">
              <FaGraduationCap className="text-sm" /><span>Academic & Guardian Info</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Class *</label>
                <select name="className" required value={formData.className} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-indigo-500">
                  <option value="">Select Class</option>
                  <option value="class-1">Class 1</option>
                  <option value="class-2">Class 2</option>
                  <option value="class-3">Class 3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" placeholder="optional@email.com"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Guardian Name *</label>
                <input type="text" name="guardianName" required value={formData.guardianName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Guardian Phone *</label>
                <input type="tel" name="guardianPhone" required value={formData.guardianPhone} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"/>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Address *</label>
                <textarea name="address" required rows="2" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-indigo-500"></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-md hover:opacity-90 active:scale-95 transition">Enroll Student</button>
          </div>
        </form>

        {/* 2. Live Sheet Data Table */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Recently Enrolled Students</h2>
            <p className="text-xs text-slate-400">Live feed of student admissions from MongoDB ledger database.</p>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs font-bold text-slate-400">Loading records...</div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <th className="px-6 py-3.5">Student Info</th>
                      <th className="px-6 py-3.5">Class</th>
                      <th className="px-6 py-3.5">Guardian Details</th>
                      <th className="px-6 py-3.5">Address</th>
                      <th className="px-6 py-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {enrollments.length > 0 ? enrollments.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-3 font-bold text-slate-800 text-sm">
                          {item.name}
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                            <FaCalendarAlt className="text-[9px]" /> DOB: {item.dob ? new Date(item.dob).toLocaleDateString() : 'N/A'} | {item.gender}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border border-indigo-100">
                            {item.className?.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold">
                          {item.guardianName}
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                            <FaPhoneAlt className="text-[9px]" /> {item.guardianPhone}
                          </div>
                        </td>
                        <td className="px-6 py-3 max-w-xs truncate text-slate-500 font-medium">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-slate-400 text-[10px] shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handlePrintSlip(item)}
                            title="Print Admission Slip"
                            className="bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 p-2.5 rounded-xl transition-all inline-flex items-center justify-center transform active:scale-90 border border-transparent hover:border-indigo-100"
                          >
                            <FaPrint className="text-xs" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-slate-400 font-medium">No records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Success Modal */}
        {submitted && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative animate-[bounce_0.5s_ease-out]">
              <button onClick={() => setSubmitted(false)} className="absolute top-4 right-4 text-slate-400 p-1.5 hover:bg-slate-50 rounded-lg"><FaTimes /></button>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner"><FaCheckCircle className="animate-pulse" /></div>
              <h3 className="text-lg font-black text-slate-800 mb-0.5">Enrolled Successfully!</h3>
              <p className="text-xs text-slate-500 mb-5">Student safely saved. You can print receipt below.</p>
              <button onClick={() => setSubmitted(false)} className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-md">Awesome, Got it!</button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Enrollment;