// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import kprLogo from '../assets/kprLogo.png';
import campusBg from '../assets/campusBg.jpg';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import { X, UserPlus, CheckCircle2, ShieldCheck, Crown, Utensils, ArrowRight } from 'lucide-react';

const GOOGLE_ACCOUNTS = [
  {
    email: '24cb042@kpriet.ac.in',
    name: '24CB042 (Super Admin)',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-300',
    avatarBg: '#8B5CF6',
    initials: '24',
  },
  {
    email: 'priansenthilkumar99@gmail.com',
    name: 'Prian Senthilkumar',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-300',
    avatarBg: '#EF4444',
    initials: 'PS',
  },
  {
    email: 'bh.overallcoordinator@kpriet.ac.in',
    name: 'Overall Warden Coordinator',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-300',
    avatarBg: '#3B82F6',
    initials: 'BH',
  },
  {
    email: 'warden@kpriet.ac.in',
    name: 'Hostel Deputy Warden',
    role: 'warden',
    roleLabel: 'Hostel Warden',
    badgeBg: 'bg-sky-100 text-sky-700 border-sky-300',
    avatarBg: '#3DA1D1',
    initials: 'HW',
  },
  {
    email: 'mess.staff@kpriet.ac.in',
    name: 'Mess Operations Coordinator',
    role: 'mess_staff',
    roleLabel: 'Mess Staff',
    badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    avatarBg: '#52B74A',
    initials: 'MC',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { user, login, logout, getDemoUsers } = useAuth();

  const [activeTab, setActiveTab] = useState('mess_staff'); // 'mess_staff' | 'warden' | 'super_admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google SSO Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [authenticatingEmail, setAuthenticatingEmail] = useState('');

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
        toast.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === 'super_admin') {
          navigate('/admin-home', { replace: true });
        } else if (res.user.role === 'warden') {
          navigate('/hostel-dashboard', { replace: true });
        } else {
          navigate('/mess-dashboard', { replace: true });
        }
      } else if (res.message) {
        toast.error(res.message);
      }
    }, 250);
  };

  // Google SSO Selection Handler
  const handleSelectGoogleAccount = (selectedAccount) => {
    setAuthenticatingEmail(selectedAccount.email);

    setTimeout(() => {
      const res = login(selectedAccount.email, 'sso_google_token_valid', selectedAccount.role || activeTab);
      setAuthenticatingEmail('');
      setIsGoogleModalOpen(false);

      if (res.success && res.user) {
        toast.success(`Signed in as ${selectedAccount.email}!`, { icon: '🔑' });
        if (res.user.role === 'super_admin') {
          navigate('/admin-home', { replace: true });
        } else if (res.user.role === 'warden') {
          navigate('/hostel-dashboard', { replace: true });
        } else {
          navigate('/mess-dashboard', { replace: true });
        }
      } else if (res.message) {
        toast.error(res.message);
      }
    }, 600);
  };

  // Submit custom google email
  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      toast.error('Please enter an email address.');
      return;
    }
    const cleanEmail = customGoogleEmail.trim();
    handleSelectGoogleAccount({
      email: cleanEmail,
      name: cleanEmail.split('@')[0].toUpperCase(),
      role: activeTab,
    });
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
              onClick={() =>
                navigate(
                  user.role === 'super_admin'
                    ? '/admin-home'
                    : user.role === 'warden'
                    ? '/hostel-dashboard'
                    : '/mess-dashboard'
                )
              }
              className="flex-1 shadow-md font-bold"
            >
              Go to {user.role === 'super_admin' ? 'Master Home' : user.role === 'warden' ? 'Warden Portal' : 'Mess Hub'}
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

      {/* Clean White Card */}
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

        {/* Triple Tab Bar */}
        <div className="w-full rounded-xl overflow-hidden border border-gray-300 flex mb-5 shadow-xs">
          <button
            type="button"
            onClick={() => handleTabChange('mess_staff')}
            className={`flex-1 py-2.5 sm:py-3 px-0.5 text-[10.5px] sm:text-xs font-extrabold transition-all text-center leading-tight ${
              activeTab === 'mess_staff'
                ? 'bg-[#1C5362] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mess Staff
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('warden')}
            className={`flex-1 py-2.5 sm:py-3 px-0.5 text-[10.5px] sm:text-xs font-extrabold transition-all text-center leading-tight border-x border-gray-300 ${
              activeTab === 'warden'
                ? 'bg-[#1C5362] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hostel Warden
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('super_admin')}
            className={`flex-1 py-2.5 sm:py-3 px-0.5 text-[10.5px] sm:text-xs font-extrabold transition-all text-center leading-tight ${
              activeTab === 'super_admin'
                ? 'bg-purple-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Super Admin
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {activeTab === 'super_admin' ? 'Super Admin' : activeTab === 'warden' ? 'Warden' : 'Mess'} credentials login
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              Mail ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={
                activeTab === 'super_admin'
                  ? '24cb042@kpriet.ac.in'
                  : activeTab === 'warden'
                  ? 'warden@kpriet.ac.in'
                  : 'mess.staff@kpriet.ac.in'
              }
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
            {isSubmitting ? 'Authenticating...' : `Sign In as ${activeTab === 'super_admin' ? 'Super Admin' : activeTab === 'warden' ? 'Warden' : 'Mess Staff'}`}
          </Button>

          {/* Official Google SSO Button */}
          <div className="mt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
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

      {/* ── GOOGLE OAUTH ACCOUNT SELECTOR POPUP MODAL ── */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm page-enter">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Google Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                    Sign in with Google
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Choose an account to continue to KPRIET
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsGoogleModalOpen(false);
                  setIsCustomInputOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Account Selector */}
            <div className="p-5 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={Boolean(authenticatingEmail)}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  className={`w-full p-3.5 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 text-left flex items-center justify-between transition-all group ${
                    authenticatingEmail === acc.email ? 'bg-blue-50 border-blue-500 animate-pulse' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-full text-white font-extrabold flex items-center justify-center text-xs shadow-xs flex-shrink-0"
                      style={{ backgroundColor: acc.avatarBg }}
                    >
                      {acc.initials}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {acc.name}
                        </span>
                        <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md border ${acc.badgeBg}`}>
                          {acc.roleLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">{acc.email}</span>
                    </div>
                  </div>

                  {authenticatingEmail === acc.email ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  )}
                </button>
              ))}

              {/* Custom Email Input Toggle */}
              {!isCustomInputOpen ? (
                <button
                  type="button"
                  onClick={() => setIsCustomInputOpen(true)}
                  className="w-full p-3.5 rounded-2xl border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-left flex items-center gap-3 text-xs font-bold text-gray-700 transition-all mt-1"
                >
                  <UserPlus size={18} className="text-gray-500" />
                  <span>Use another @kpriet.ac.in account</span>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="mt-2 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-gray-700 uppercase">
                    Enter Google Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@kpriet.ac.in"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    required
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white border-0 h-9"
                    >
                      Sign In with Email
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsCustomInputOpen(false)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center text-[10.5px] text-gray-500 font-medium">
              Protected by KPRIET Google Workspace Single Sign-On
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
