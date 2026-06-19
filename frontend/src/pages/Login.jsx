import React, { useState } from 'react';
import axios from 'axios';
import { FaSchool, FaUserShield, FaLock, FaCheckCircle } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await axios.post('https://school-management-system-ux11.onrender.com/api/auth/login', { username, password });
      if (response.data.success) {
        // 🚨 CHNAGE THIS: localStorage ki jagah sessionStorage kiya
        sessionStorage.setItem('authToken', response.data.token);
        
        window.location.href = '/';
      }
       
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Server connection failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 text-center animate-[fadeIn_0.5s_ease-out]">
        
        {/* Brand Logo */}
        <div className="space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <FaSchool className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide mt-2">SchoolSync</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Management Admin Portal</p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold text-left flex items-center space-x-2">
            <span>⚠️</span> <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Inputs Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          
          {/* Username Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Admin Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FaUserShield className="text-xs"/></span>
              <input 
                type="text" required placeholder="e.g., admin" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Secure Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><FaLock className="text-xs"/></span>
              <input 
                type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In To System'}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 font-medium border-t border-white/5 pt-4">🔒 Secured with industry standard local session hashing token.</p>
      </div>
    </div>
  );
};

export default Login;