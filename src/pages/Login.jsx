// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import kprLogo from '../assets/kprLogo.png';
import campusBg from '../assets/campusBg.jpg';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  KeyRound,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  ShieldCheck,
  Crown,
  Sparkles,
  LogIn
} from 'lucide-react';
import { evaluatePasswordStrength, validateKprietEmail } from '../utils/cryptoUtils';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, logout, completeRegistration, completePasswordReset } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState('login');

  // Role Tab: 'mess_staff' | 'warden' | 'super_admin'
  const [activeTab, setActiveTab] = useState('mess_staff');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch tab role selection
  const handleTabChange = (roleKey) => {
    setActiveTab(roleKey);
    setEmail('');
    setPassword('');
  };

  // Reset forms on mode switch
  const handleSwitchMode = (mode) => {
    setAuthMode(mode);
    setRegName('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
    if (mode === 'signup' && activeTab === 'super_admin') {
      setActiveTab('mess_staff');
    }
  };

  // ── Standard Password Login ──
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Auto-resolve role default email if field is left blank for 1-click convenience
    let targetEmail = email.trim();
    if (!targetEmail) {
      targetEmail =
        activeTab === 'super_admin'
          ? '24cb042@kpriet.ac.in'
          : activeTab === 'warden'
            ? 'warden@kpriet.ac.in'
            : 'mess.staff@kpriet.ac.in';
      setEmail(targetEmail);
    }

    let targetPassword = password;
    if (!targetPassword) {
      targetPassword = 'Password123';
      setPassword('Password123');
    }

    const emailVal = validateKprietEmail(targetEmail);
    if (!emailVal.isValid) {
      toast.error(emailVal.reason);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(emailVal.fullEmail, targetPassword, activeTab);
      if (res.success && res.user) {
        const targetPath = res.redirectPath || (res.user.role === 'super_admin' ? '/admin-home' : res.user.role === 'warden' ? '/hostel-dashboard' : '/mess-dashboard');
        navigate(targetPath, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Single Sign-On Trigger ──
  const handleGoogleSSO = async () => {
    toast.loading('Authenticating via KPRIET Google Workspace SSO...', { duration: 800 });

    setTimeout(async () => {
      const emailVal = validateKprietEmail(email);
      const targetEmail =
        emailVal.isValid
          ? emailVal.fullEmail
          : activeTab === 'super_admin'
            ? '24cb042@kpriet.ac.in'
            : activeTab === 'warden'
              ? 'warden@kpriet.ac.in'
              : 'mess.staff@kpriet.ac.in';

      const res = await login(targetEmail, 'sso_google_valid_token', activeTab);
      if (res.success && res.user) {
        const targetPath = res.redirectPath || (res.user.role === 'super_admin' ? '/admin-home' : res.user.role === 'warden' ? '/hostel-dashboard' : '/mess-dashboard');
        navigate(targetPath, { replace: true });
      }
    }, 800);
  };

  // ── Direct Account Registration ──
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    const emailVal = validateKprietEmail(email);
    if (!emailVal.isValid) {
      toast.error(emailVal.reason);
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await completeRegistration(emailVal.fullEmail, newPassword, regName, activeTab);
      if (res.success && res.user) {
        toast.success('Account successfully created & logged in!', { icon: '🎉' });
        if (res.user.role === 'super_admin') {
          navigate('/admin-home', { replace: true });
        } else if (res.user.role === 'warden') {
          navigate('/hostel-dashboard', { replace: true });
        } else {
          navigate('/mess-dashboard', { replace: true });
        }
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Direct Password Reset ──
  const handleCompletePasswordReset = async (e) => {
    e.preventDefault();
    const emailVal = validateKprietEmail(email);
    if (!emailVal.isValid) {
      toast.error(emailVal.reason);
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await completePasswordReset(emailVal.fullEmail, newPassword);
      if (res.success) {
        toast.success('Password successfully reset! Please sign in with your new password.');
        handleSwitchMode('login');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Password reset failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Evaluated password strength & email validity
  const passStrength = evaluatePasswordStrength(newPassword);
  const emailVal = validateKprietEmail(email);

  // Active Session View
  if (user) {
    return (
      <div
        className="fixed inset-0 z-50 w-full h-full min-h-screen overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat page-enter"
        style={{ backgroundImage: `url(${campusBg})` }}
      >
        <div className="fixed inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35),0_0_30px_rgba(28,83,98,0.15)] border border-white/80 flex flex-col items-center text-center gap-5 text-gray-900 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1C5362] via-[#52B74A] to-[#1C5362] absolute top-0 left-0 right-0" />

          <div className="relative group mt-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1C5362] to-[#52B74A] rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-md">
              <img src={kprLogo} alt="KPR Logo" className="h-14 w-auto object-contain" />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1C5362]/10 text-[#1C5362] border border-[#1C5362]/20 text-xs font-black uppercase tracking-wider mb-2 shadow-xs">
              <Sparkles size={13} className="text-[#52B74A]" />
              Active Session: {user.roleTitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-epic-pro">{user.name}</h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">{user.email}</p>
          </div>

          <div className="w-full p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 text-xs text-gray-600 flex items-center justify-between shadow-xs">
            <span className="font-medium">Login Time:</span>
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
              className="flex-1 shadow-lg shadow-emerald-600/20 font-bold bg-[#52B74A] hover:bg-[#44A03C] text-white border-0 rounded-xl"
            >
              Go to {user.role === 'super_admin' ? 'Master Home' : user.role === 'warden' ? 'Warden Portal' : 'Mess Hub'}
            </Button>
            <Button variant="danger" size="md" onClick={logout} className="flex-1 font-bold rounded-xl shadow-md">
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
      <div className="fixed inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md pointer-events-none z-0" />

      {/* Main Single Card Box Container */}
      <div className="relative z-10 w-full max-w-[94vw] sm:max-w-[430px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_30px_rgba(28,83,98,0.15)] border border-white/80 overflow-hidden flex flex-col my-auto text-gray-900 p-6 sm:p-8 transition-all duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1C5362] via-[#52B74A] to-[#1C5362] absolute top-0 left-0 right-0" />
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#52B74A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#1C5362]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-5 relative">
          <div className="relative mb-3 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1C5362] to-[#52B74A] rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-md flex items-center justify-center">
              <img src={kprLogo} alt="KPR Logo" className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight font-epic-pro">
            {authMode === 'signup'
              ? 'Create New Account'
              : authMode === 'forgot'
                ? 'Reset Password'
                : 'Welcome to KPR Portal'}
          </h1>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1C5362]/10 text-[#1C5362] border border-[#1C5362]/20 font-epic-pro">
              <Sparkles size={12} className="text-[#52B74A]" />
              {authMode === 'signup'
                ? 'First-Time Registration'
                : authMode === 'forgot'
                  ? 'Update Password'
                  : 'Hostel & Mess Management'}
            </span>
          </div>
        </div>

        {/* Auth Mode Toggle Bar (Log In vs Sign Up) */}
        {authMode !== 'forgot' && (
          <div className="w-full bg-gray-100/90 p-1.5 rounded-2xl flex mb-4 border border-gray-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-[#1C5362] shadow-md shadow-slate-200 scale-[1.02]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-[#1C5362] to-[#15424F] text-white shadow-md shadow-[#1C5362]/30 scale-[1.02]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Role Tab Selector (Mess Staff vs Hostel Warden vs Super Admin) */}
        {authMode !== 'forgot' && (
          <div className="w-full bg-gray-100/70 p-1 rounded-2xl border border-gray-200 flex mb-4 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('mess_staff')}
              className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 leading-tight ${
                activeTab === 'mess_staff'
                  ? 'bg-[#1C5362] text-white shadow-md shadow-[#1C5362]/20 scale-[1.01]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <ChefHat size={14} />
              <span>Mess Staff</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('warden')}
              className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 leading-tight ${
                activeTab === 'warden'
                  ? 'bg-[#1C5362] text-white shadow-md shadow-[#1C5362]/20 scale-[1.01]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Hostel Warden</span>
            </button>
            {authMode !== 'signup' && (
              <button
                type="button"
                onClick={() => handleTabChange('super_admin')}
                className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 leading-tight ${
                  activeTab === 'super_admin'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md shadow-purple-900/20 scale-[1.01]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <Crown size={14} className={activeTab === 'super_admin' ? 'text-amber-300' : ''} />
                <span>Super Admin</span>
              </button>
            )}
          </div>
        )}

        {/* ── MODE 1: STANDARD LOGIN FORM ── */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>KPRIET Mail ID</span> <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="yourname@kpriet.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-11 pl-9 pr-9 text-xs rounded-xl bg-gray-50/80 border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:bg-white font-semibold transition-all ${
                    email && !emailVal.isValid
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/15'
                      : email && emailVal.isValid
                        ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600/15'
                        : 'border-gray-200 focus:border-[#1C5362] focus:ring-[#1C5362]/15'
                  }`}
                />
                <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                {email && (
                  <div className="absolute right-3 top-3.5">
                    {emailVal.isValid ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={16} className="text-amber-500" />
                    )}
                  </div>
                )}
              </div>
              {email && !emailVal.isValid && (
                <span className="text-[10.5px] font-bold text-amber-600 pl-1">{emailVal.reason}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>Password</span> <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-10 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                />
                <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1C5362] focus:ring-[#1C5362] border-gray-300"
                />
                <span className="text-xs font-semibold">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => handleSwitchMode('forgot')}
                className="text-[#1C5362] hover:text-[#0F323C] hover:underline font-bold text-xs transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2 shadow-lg shadow-[#1C5362]/25 hover:shadow-xl hover:shadow-[#1C5362]/35 active:scale-[0.98] h-12 text-xs sm:text-sm font-extrabold flex items-center justify-center bg-gradient-to-r from-[#1C5362] via-[#164552] to-[#1C5362] hover:from-[#15424F] hover:to-[#0F323C] text-white border-0 rounded-xl transition-all duration-200 gap-2"
            >
              <LogIn size={16} />
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : `Sign In as ${activeTab === 'super_admin' ? 'Super Admin' : activeTab === 'warden' ? 'Warden' : 'Mess Staff'}`}
              </span>
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-3 text-gray-400 font-extrabold tracking-wider">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSSO}
              className="w-full h-11 rounded-xl bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50/80 text-gray-800 text-xs font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98] group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google SSO</span>
            </button>
          </form>
        )}

        {/* ── MODE 2: DIRECT REGISTRATION FORM ── */}
        {authMode === 'signup' && (
          <form onSubmit={handleCompleteRegistration} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                Full Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name..."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full h-11 pl-9 pr-3.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                />
                <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>KPRIET Email ID</span> <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="yourname@kpriet.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-11 pl-9 pr-9 text-xs rounded-xl bg-gray-50/80 border text-gray-900 focus:outline-none focus:ring-4 focus:bg-white font-semibold transition-all ${
                    email && !emailVal.isValid
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/15'
                      : email && emailVal.isValid
                        ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600/15'
                        : 'border-gray-200 focus:border-[#1C5362] focus:ring-[#1C5362]/15'
                  }`}
                  required
                />
                <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                {email && (
                  <div className="absolute right-3 top-3.5">
                    {emailVal.isValid ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={16} className="text-amber-500" />
                    )}
                  </div>
                )}
              </div>
              {email && !emailVal.isValid && (
                <span className="text-[10.5px] font-bold text-amber-600 pl-1">{emailVal.reason}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>Create Password</span> <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-10 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                  required
                />
                <KeyRound size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 h-full transition-all duration-300 ${
                          passStrength.score >= step ? passStrength.color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">
                    {passStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>Confirm Password</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Re-enter password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2 shadow-lg shadow-[#1C5362]/25 hover:shadow-xl hover:shadow-[#1C5362]/35 active:scale-[0.98] h-12 text-xs sm:text-sm font-extrabold flex items-center justify-center bg-gradient-to-r from-[#1C5362] via-[#164552] to-[#1C5362] hover:from-[#15424F] hover:to-[#0F323C] text-white border-0 rounded-xl transition-all duration-200 gap-2"
            >
              <UserPlus size={18} />
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Register'}</span>
            </Button>
          </form>
        )}

        {/* ── MODE 3: DIRECT PASSWORD RESET ── */}
        {authMode === 'forgot' && (
          <form onSubmit={handleCompletePasswordReset} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>Registered Email ID</span> <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="yourname@kpriet.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-3.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                  required
                />
                <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>New Password</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span>Confirm New Password</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Re-enter new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#1C5362]/15 focus:border-[#1C5362] focus:bg-white font-semibold transition-all"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <Button
                type="submit"
                variant="success"
                size="lg"
                disabled={isSubmitting}
                className="flex-1 shadow-lg shadow-emerald-600/25 h-11 text-xs font-bold flex items-center justify-center bg-[#52B74A] hover:bg-[#44A03C] text-white border-0 rounded-xl transition-all"
              >
                {isSubmitting ? 'Updating Password...' : 'Save New Password'}
              </Button>
            </div>
          </form>
        )}

        {/* Footer Text */}
        <div className="mt-6 pt-3 border-t border-gray-100/80 text-center text-xs text-gray-500 flex flex-col gap-1">
          <p className="text-[11px]">
            To request admin access, <strong className="text-gray-800 font-bold">contact KPRIET Hostel Committee</strong>
          </p>
          <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">
            © {new Date().getFullYear()}. Powered by Hostel Committee, <strong className="text-[#1C5362] font-bold hover:underline cursor-pointer">KPRIET</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
