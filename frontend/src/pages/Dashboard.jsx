import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
// Graphs ke liye recharts ke components
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { FaUserGraduate, FaChalkboardTeacher, FaSchool, FaCheckCircle, FaUserPlus } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [classData, setClassData] = useState([]);

  // Donut/Pie chart segments ke rang
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/stats")
      .then((res) => {
        // 1. Live Counters Data set hua
        setStats({
          totalStudents: res.data.totalStudents,
          totalTeachers: res.data.totalTeachers,
          totalClasses: res.data.totalClasses
        });
        
        // 🚨 2. FIXED KEYS: Backend variables ke sath strict mapping ki
        setMonthlyData(res.data.monthlyAnalytics || []);
        setClassData(res.data.classAnalytics || []);
      })
      .catch((err) => console.error("Stats fetch error:", err));
  }, []);

  return (
    <MainLayout>
      <div className="p-6 bg-slate-50 space-y-6 min-h-screen">
        
        {/* Top Header Section */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-wide">School Dashboard Overview</h1>
            <p className="text-xs text-slate-500 font-medium">Real-time statistics and new student enrollment analytics.</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
            <FaCheckCircle className="animate-pulse" /> Live Synced
          </span>
        </div>

        {/* Dynamic Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Students Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-600 flex items-center justify-between transition hover:shadow-md">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{stats.totalStudents}</p>
            </div>
            <div className="text-2xl text-indigo-100 bg-indigo-50 p-3 rounded-xl">
              <FaUserGraduate className="text-indigo-600" />
            </div>
          </div>

          {/* Total Teachers Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between transition hover:shadow-md">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Teachers</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{stats.totalTeachers}</p>
            </div>
            <div className="text-2xl text-emerald-100 bg-emerald-50 p-3 rounded-xl">
              <FaChalkboardTeacher className="text-emerald-500" />
            </div>
          </div>

          {/* Total Classes Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500 flex items-center justify-between transition hover:shadow-md">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Classes</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{stats.totalClasses}</p>
            </div>
            <div className="text-2xl text-amber-100 bg-amber-50 p-3 rounded-xl">
              <FaSchool className="text-amber-500" />
            </div>
          </div>
        </div>

        {/* Analytics Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Left Side: Month-wise Admissions Flow (Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Monthly Enrollment Trend</h3>
                <p className="text-xs text-slate-400">Analysis of new admissions registered over the months.</p>
              </div>
              <span className="text-lg bg-indigo-50 text-indigo-600 p-2 rounded-xl">
                <FaUserPlus />
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="enrollments" fill="url(#dashboardBlue)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="dashboardBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Side: Class Distribution Share (Donut Pie Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Classwise Intake Share</h3>
              <p className="text-xs text-slate-400">Metrics of newly enrolled students split by grades.</p>
            </div>

            <div className="h-44 w-full relative my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="students"
                  >
                    {classData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends list with enrollment numbers per class */}
            <div className="space-y-1.5 border-t border-slate-50 pt-3">
              {classData.slice(0, 4).map((item, index) => (
                <div key={item.className} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="font-semibold text-slate-600">{item.className}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.students} Enrolled</span>
                </div>
              ))}
              {classData.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-2">No new enrollment data available.</p>
              )}
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;