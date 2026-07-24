// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import kprLogo from '../assets/kprLogo.png';
import campusBg from '../assets/campusBg.jpg';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, logout, getDemoUsers } = useAuth();

  const [activeTab, setActiveTab] = useState('mess_staff'); // 'mess_staff' | 'warden'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoUsers = getDemoUsers ? getDemoUsers() : [];

  // Switch tab role selection
  const handleTabChange = (roleKey) => {
    setActiveTab(roleKey);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password, activeTab);
      setIsSubmitting(false);

      if (res.success && res.user) {
        if (res.user.role === 'warden') {
          navigate('/hostel-dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }, 250);
  };

  // Google / Single Sign On Handler
  const handleGoogleSSO = () => {
    toast.loading('Authenticating via KPRIET Google SSO...', { duration: 1500 });
    
    setTimeout(() => {
      const ssoEmail = activeTab === 'warden' ? 'warden@kpr.edu' : 'mess.staff@kpr.edu';
      const res = login(ssoEmail, 'sso_token_ok', activeTab);
      if (res.success && res.user) {
        if (res.user.role === 'warden') {
          navigate('/hostel-dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }, 1500);
  };

  // Active Session View
  if (user) {
    return (
      <div
        className="fixed inset-0 z-50 w-full h-full min-h-screen overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat page-enter"
        style={{ backgroundImage: `url(${campusBg})` }}
      >
        {/* Soft Blur Backdrop covering 100% of viewport */}
        <div className="fixed inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-5 text-gray-900">
          <img
            src={kprLogo}
            alt="KPR Logo"
            className="h-16 w-auto object-contain p-1"
          />

          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#1C5362]/10 text-[#1C5362] border border-[#1C5362]/20 text-xs font-extrabold uppercase tracking-wider mb-2">
              Active Session: {user.roleTitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
              {user.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">
              {user.email}
            </p>
          </div>

          <div className="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
            <span>Login Time:</span>
            <strong className="text-gray-900 font-bold">{user.loginTime}</strong>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="success"
              size="md"
              onClick={() => navigate(user.role === 'warden' ? '/hostel-dashboard' : '/')}
              className="flex-1 shadow-md font-bold"
            >
              Go to {user.role === 'warden' ? 'Warden Portal' : 'Mess Hub'}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={logout}
              className="flex-1 font-bold"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full min-h-screen overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat page-enter"
      style={{ backgroundImage: `url(${campusBg})` }}
    >
      {/* Soft Blur Backdrop covering 100% of screen */}
      <div className="fixed inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md pointer-events-none z-0" />

      {/* Clean White CAP Style Card */}
      <div className="relative z-10 w-full max-w-[94vw] sm:max-w-md bg-white rounded-3xl shadow-2xl border-0 overflow-hidden flex flex-col my-auto text-gray-900 p-5 sm:p-8">
        
        {/* Top KPRIET Emblem Logo */}
        <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
          <img
            src={kprLogo}
            alt="KPR Logo"
            className="h-14 sm:h-18 w-auto object-contain mb-2 sm:mb-3"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">
            Welcome to KPR Portal
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Hostel & Mess Management Platform
          </p>
        </div>

        {/* Dual Tab Bar (Mess Coordinator vs Hostel Warden) */}
        <div className="w-full rounded-xl overflow-hidden border border-gray-300 flex mb-5 shadow-xs">
          <button
            type="button"
            onClick={() => handleTabChange('mess_staff')}
            className={`flex-1 py-2.5 sm:py-3 px-1 text-[11px] sm:text-xs font-extrabold transition-all text-center leading-tight ${
              activeTab === 'mess_staff'
                ? 'bg-[#1C5362] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mess Coordinator
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('warden')}
            className={`flex-1 py-2.5 sm:py-3 px-1 text-[11px] sm:text-xs font-extrabold transition-all text-center leading-tight ${
              activeTab === 'warden'
                ? 'bg-[#1C5362] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hostel Warden
          </button>
        </div>

        {/* Divider with Text */}
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {activeTab === 'warden' ? 'Warden' : 'Mess'} credentials login
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              KPRIET Email / Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={activeTab === 'warden' ? 'warden@kpr.edu' : 'mess.staff@kpr.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium transition-all"
              required
            />
          </div>

          {/* Remember me & Submit */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#1C5362] focus:ring-[#1C5362]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => toast('Password reset instructions sent to email.', { icon: '📧' })}
              className="text-[#1C5362] hover:underline font-bold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Direct Sign In Button */}
          <Button
            type="submit"
            variant="success"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2 shadow-md h-12 text-sm font-bold flex items-center justify-center bg-[#1C5362] hover:bg-[#143B47] text-white border-0"
          >
            {isSubmitting ? 'Authenticating...' : `Sign In as ${activeTab === 'warden' ? 'Warden' : 'Mess Staff'}`}
          </Button>

          {/* Official Google SSO Button from Screenshot */}
          <div className="mt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleGoogleSSO}
              className="w-full h-12 rounded-xl bg-white border-2 border-gray-800 hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

        </form>

        {/* Footer Text */}
        <div className="mt-8 pt-2 text-center text-xs text-gray-500 flex flex-col gap-1">
          <p>
            To create an account, <strong className="text-gray-800">contact Hostel Committee</strong>
          </p>
          <p className="text-[11px] font-medium text-gray-400 mt-1">
            © {new Date().getFullYear()}. powered by Hostel Committee, <strong className="text-[#1C5362] underline cursor-pointer">KPRIET</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
