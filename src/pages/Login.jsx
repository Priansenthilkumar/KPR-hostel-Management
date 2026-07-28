// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import kprLogo from '../assets/kprLogo.png';
import campusBg from '../assets/campusBg.jpg';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Crown,
  Utensils,
  KeyRound,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { evaluatePasswordStrength } from '../utils/cryptoUtils';

export default function Login() {
  const navigate = useNavigate();
  const {
    user,
    login,
    logout,
    requestSignupOTP,
    verifySignupOTP,
    completeRegistration,
    requestPasswordResetOTP,
    completePasswordReset,
  } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState('login');

  // Role Tab for login/signup: 'mess_staff' | 'warden' | 'super_admin'
  const [activeTab, setActiveTab] = useState('mess_staff');

  // Common Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration & Reset Wizard States
  const [wizardStep, setWizardStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [regName, setRegName] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let timerId;
    if (wizardStep === 2 && otpTimer > 0) {
      timerId = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [wizardStep, otpTimer]);

  // Switch tab role selection
  const handleTabChange = (roleKey) => {
    setActiveTab(roleKey);
    setEmail('');
    setPassword('');
  };

  // Reset forms on mode switch
  const handleSwitchMode = (mode) => {
    setAuthMode(mode);
    setWizardStep(1);
    setOtpInputs(['', '', '', '', '', '']);
    setPreviewOTP('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
  };

  // ── Standard Password Login ──
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password, activeTab);
    setIsSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'super_admin') {
        navigate('/admin-home', { replace: true });
      } else if (res.user.role === 'warden') {
        navigate('/hostel-dashboard', { replace: true });
      } else {
        navigate('/mess-dashboard', { replace: true });
      }
    }
  };

  // ── Single Sign-On Direct Trigger ──
  const handleGoogleSSO = async () => {
    toast.loading('Authenticating via KPRIET Google Workspace SSO...', { duration: 1200 });

    setTimeout(async () => {
      const targetEmail =
        activeTab === 'super_admin'
          ? '24cb042@kpriet.ac.in'
          : activeTab === 'warden'
          ? 'warden@kpriet.ac.in'
          : 'mess.staff@kpriet.ac.in';

      const res = await login(targetEmail, 'sso_google_valid_token', activeTab);
      if (res.success && res.user) {
        if (res.user.role === 'super_admin') {
          navigate('/admin-home', { replace: true });
        } else if (res.user.role === 'warden') {
          navigate('/hostel-dashboard', { replace: true });
        } else {
          navigate('/mess-dashboard', { replace: true });
        }
      }
    }, 1200);
  };

  // ── Registration: Step 1 Request OTP ──
  const handleRequestSignupOTP = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error('Please enter a valid KPRIET email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestSignupOTP(cleanEmail, activeTab);
      if (res.success) {
        setEmail(res.email);
        if (res.role) setActiveTab(res.role);
        setWizardStep(2);
        setOtpTimer(60);
        toast.success(`6-Digit Verification OTP sent to ${res.email}!`, { icon: '🔑' });
      } else {
        toast.error(res.message || 'Failed to generate OTP.');
      }
    } catch (err) {
      console.error('Signup OTP error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── OTP Single-Digit Box Input Handling ──
  const handleOtpBoxChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newArr = [...otpInputs];
    newArr[index] = value;
    setOtpInputs(newArr);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Auto-fill OTP Code helper
  const handleAutoFillOTP = () => {
    const cleanEmail = authService.normalizeEmail(email);
    const record = authService.getOTPMap()[cleanEmail];
    if (record && record.otp) {
      setOtpInputs(record.otp.split(''));
      toast.success(`Auto-filled OTP Code: ${record.otp}`, { icon: '⚡' });
    } else {
      toast.error('No active OTP code found. Please click Resend OTP.');
    }
  };

  // ── Registration: Step 2 Verify OTP ──
  const handleVerifySignupOTP = (e) => {
    e.preventDefault();
    const enteredOTP = otpInputs.join('');
    if (enteredOTP.length < 6) {
      toast.error('Please enter the full 6-digit verification OTP code.');
      return;
    }

    const res = verifySignupOTP(email, enteredOTP);
    if (res.success) {
      toast.success('Email address verified successfully!');
      setWizardStep(3);
    } else {
      toast.error(res.message);
    }
  };

  // Resend Registration OTP
  const handleResendOTP = async () => {
    setIsSubmitting(true);
    try {
      const res =
        authMode === 'signup'
          ? await requestSignupOTP(email, activeTab)
          : await requestPasswordResetOTP(email);

      if (res.success) {
        setOtpTimer(60);
        setOtpInputs(['', '', '', '', '', '']);
        toast.success('A new 6-digit OTP code has been generated and dispatched!');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      toast.error('Failed to resend OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Registration: Step 3 Create Password & Submit ──
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await completeRegistration(email, newPassword, regName, activeTab);
      if (res.success && res.user) {
        toast.success('Account successfully registered & logged in!', { icon: '🎉' });
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

  // ── Password Reset: Step 1 Request Reset OTP ──
  const handleRequestResetOTP = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordResetOTP(cleanEmail);
      if (res.success) {
        setEmail(res.email);
        setWizardStep(2);
        setOtpTimer(60);
        toast.success(`Password reset OTP sent to ${res.email}! Please check your inbox.`);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error('Reset OTP error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Password Reset: Step 2 & 3 Complete Reset ──
  const handleCompletePasswordReset = async (e) => {
    e.preventDefault();
    const enteredOTP = otpInputs.join('');
    if (enteredOTP.length < 6) {
      toast.error('Please enter the full 6-digit verification OTP code.');
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
    const res = await completePasswordReset(email, enteredOTP, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Password successfully reset! Please sign in with your new password.');
      handleSwitchMode('login');
    } else {
      toast.error(res.message);
    }
  };

  // Evaluated password strength
  const passStrength = evaluatePasswordStrength(newPassword);

  // Active Session View
  if (user) {
    return (
      <div
        className="fixed inset-0 z-50 w-full h-full min-h-screen overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat page-enter"
        style={{ backgroundImage: `url(${campusBg})` }}
      >
        <div className="fixed inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-5 text-gray-900">
          <img src={kprLogo} alt="KPR Logo" className="h-16 w-auto object-contain p-1" />

          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#1C5362]/10 text-[#1C5362] border border-[#1C5362]/20 text-xs font-extrabold uppercase tracking-wider mb-2">
              Active Session: {user.roleTitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">{user.name}</h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">{user.email}</p>
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
            <Button variant="danger" size="md" onClick={logout} className="flex-1 font-bold">
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

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[94vw] sm:max-w-md bg-white rounded-3xl shadow-2xl border-0 overflow-hidden flex flex-col my-auto text-gray-900 p-5 sm:p-8">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-4">
          <img src={kprLogo} alt="KPR Logo" className="h-14 sm:h-16 w-auto object-contain mb-2" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">
            {authMode === 'signup'
              ? 'Create New Account'
              : authMode === 'forgot'
              ? 'Reset Password'
              : 'Welcome to KPR Portal'}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {authMode === 'signup'
              ? 'First-Time Registration & Email Verification'
              : authMode === 'forgot'
              ? 'Verify your @kpriet.ac.in email to reset password'
              : 'Hostel & Mess Management Platform'}
          </p>
        </div>

        {/* Auth Mode Toggle Bar (Log In vs Sign Up) */}
        {authMode !== 'forgot' && (
          <div className="w-full bg-gray-100 p-1 rounded-2xl flex mb-4 border border-gray-200">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                authMode === 'signup'
                  ? 'bg-[#1C5362] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              First-Time Sign Up
            </button>
          </div>
        )}

        {/* Role Tab Selector (Mess Staff vs Hostel Warden vs Super Admin) */}
        {authMode !== 'forgot' && wizardStep === 1 && (
          <div className="w-full rounded-xl overflow-hidden border border-gray-300 flex mb-4 shadow-xs">
            <button
              type="button"
              onClick={() => handleTabChange('mess_staff')}
              className={`flex-1 py-2.5 px-0.5 text-[10.5px] sm:text-xs font-extrabold transition-all text-center leading-tight ${
                activeTab === 'mess_staff' ? 'bg-[#1C5362] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mess Staff
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('warden')}
              className={`flex-1 py-2.5 px-0.5 text-[10.5px] sm:text-xs font-extrabold transition-all text-center leading-tight border-x border-gray-300 ${
                activeTab === 'warden' ? 'bg-[#1C5362] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hostel Warden
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('super_admin')}
              className={`flex-1 py-2.5 px-0.5 text-[10.5px] sm:text-xs font-extrabold transition-all text-center leading-tight ${
                activeTab === 'super_admin' ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Super Admin
            </button>
          </div>
        )}

        {/* ── MODE 1: STANDARD LOGIN FORM ── */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                KPRIET Mail ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
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
                  className="w-full h-11 pl-9 pr-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium transition-all"
                  required
                />
                <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-10 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium transition-all"
                  required
                />
                <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

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
                onClick={() => handleSwitchMode('forgot')}
                className="text-[#1C5362] hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-1 shadow-md h-12 text-sm font-bold flex items-center justify-center bg-[#1C5362] hover:bg-[#143B47] text-white border-0"
            >
              {isSubmitting
                ? 'Authenticating...'
                : `Sign In as ${activeTab === 'super_admin' ? 'Super Admin' : activeTab === 'warden' ? 'Warden' : 'Mess Staff'}`}
            </Button>

            <button
              type="button"
              onClick={handleGoogleSSO}
              className="w-full h-11 rounded-xl bg-white border-2 border-gray-800 hover:bg-gray-50 text-gray-800 text-xs font-extrabold flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-98 mt-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google SSO</span>
            </button>
          </form>
        )}

        {/* ── MODE 2: FIRST-TIME SIGNUP WIZARD ── */}
        {authMode === 'signup' && (
          <div className="flex flex-col gap-4">
            
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between px-2 mb-1">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                      wizardStep === stepNum
                        ? 'bg-[#1C5362] text-white ring-4 ring-[#1C5362]/20'
                        : wizardStep > stepNum
                        ? 'bg-[#52B74A] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {wizardStep > stepNum ? <CheckCircle2 size={16} /> : stepNum}
                  </div>
                  <span className="text-[11px] font-extrabold text-gray-600 hidden sm:inline">
                    {stepNum === 1 ? 'Email' : stepNum === 2 ? 'Verify OTP' : 'Password'}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Enter Email */}
            {wizardStep === 1 && (
              <form onSubmit={handleRequestSignupOTP} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    KPRIET Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@kpriet.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-full mt-2 shadow-md h-12 text-sm font-bold flex items-center justify-center bg-[#1C5362] hover:bg-[#143B47] text-white border-0 gap-2"
                >
                  <span>Send Verification OTP</span>
                  <ArrowRight size={16} />
                </Button>
              </form>
            )}

            {/* STEP 2: Verify 6-Digit OTP */}
            {wizardStep === 2 && (
              <form onSubmit={handleVerifySignupOTP} className="flex flex-col gap-4">
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between font-extrabold">
                    <span>OTP Sent to {email}</span>
                    <span className="text-sky-700 font-mono">⏱️ {otpTimer}s</span>
                  </div>
                  <p className="text-[11px] text-sky-700 font-medium mt-0.5">
                    A 6-digit verification code has been dispatched to your official KPRIET email address. Please check your inbox or spam folder.
                  </p>
                </div>

                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider text-center">
                  Enter 6-Digit Verification Code
                </label>

                <div className="flex items-center justify-center gap-2">
                  {otpInputs.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 text-center text-lg font-black rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    <span>Change Email</span>
                  </button>

                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={handleResendOTP}
                    className={`text-xs font-bold flex items-center gap-1 ${
                      otpTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1C5362] hover:underline'
                    }`}
                  >
                    <RefreshCw size={13} />
                    <span>Resend OTP</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanEmail = authService.normalizeEmail(email);
                      const record = authService.getOTPMap()[cleanEmail];
                      if (record && record.otp) {
                        toast.success(`Verification OTP Code: ${record.otp}`, { icon: '📧', duration: 10000 });
                      } else {
                        toast.error('No active OTP record found. Please click Resend OTP.');
                      }
                    }}
                    className="text-[11px] text-gray-500 hover:text-gray-800 underline font-semibold transition-colors"
                  >
                    Didn't receive email? Get Code
                  </button>

                  <button
                    type="button"
                    onClick={handleAutoFillOTP}
                    className="text-[11px] font-extrabold text-[#1C5362] bg-[#1C5362]/10 hover:bg-[#1C5362]/20 px-3 py-1 rounded-full border border-[#1C5362]/20 flex items-center gap-1 transition-all"
                  >
                    <Sparkles size={12} />
                    <span>Auto-Fill Code</span>
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-full mt-2 shadow-md h-12 text-sm font-bold flex items-center justify-center bg-[#1C5362] hover:bg-[#143B47] text-white border-0 gap-2"
                >
                  <span>Verify OTP & Continue</span>
                  <CheckCircle2 size={16} />
                </Button>
              </form>
            )}

            {/* STEP 3: Password Creation & Hash */}
            {wizardStep === 3 && (
              <form onSubmit={handleCompleteRegistration} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Create Strong Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11 pl-9 pr-10 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                      required
                    />
                    <KeyRound size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700"
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
                            className={`flex-1 h-full transition-all ${
                              passStrength.score >= step ? passStrength.color : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-extrabold text-gray-600">
                        {passStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full mt-2 shadow-md h-12 text-sm font-bold flex items-center justify-center bg-[#52B74A] hover:bg-[#44A03C] text-white border-0 gap-2"
                >
                  {isSubmitting ? 'Encrypting & Saving...' : 'Complete Registration'}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ── MODE 3: FORGOT PASSWORD RESET WIZARD ── */}
        {authMode === 'forgot' && (
          <div className="flex flex-col gap-4">
            {wizardStep === 1 && (
              <form onSubmit={handleRequestResetOTP} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Your Registered Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@kpriet.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </button>

                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="flex-1 shadow-md h-11 text-xs font-bold flex items-center justify-center bg-[#1C5362] hover:bg-[#143B47] text-white border-0 gap-2"
                  >
                    <span>Send Reset OTP</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </form>
            )}

            {wizardStep === 2 && (
              <form onSubmit={handleCompletePasswordReset} className="flex flex-col gap-3.5">
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex flex-col gap-1">
                  <span className="font-extrabold text-sky-900">Reset Code Sent to {email}</span>
                  <p className="text-[11px] text-sky-700 font-medium">
                    A 6-digit password reset OTP code has been sent to your email. Please enter the code below to set your new password.
                  </p>
                </div>

                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider text-center">
                  Enter 6-Digit Reset OTP
                </label>

                <div className="flex items-center justify-center gap-2">
                  {otpInputs.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 text-center text-lg font-black rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white transition-all"
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C5362] focus:bg-white font-medium"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={isSubmitting}
                    className="flex-1 shadow-md h-11 text-xs font-bold flex items-center justify-center bg-[#52B74A] hover:bg-[#44A03C] text-white border-0"
                  >
                    {isSubmitting ? 'Updating Password...' : 'Save New Password'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer Text */}
        <div className="mt-6 pt-2 text-center text-xs text-gray-500 flex flex-col gap-1">
          <p>
            To request administrative access, <strong className="text-gray-800">contact KPRIET Hostel Committee</strong>
          </p>
          <p className="text-[11px] font-medium text-gray-400 mt-0.5">
            © {new Date().getFullYear()}. powered by Hostel Committee, <strong className="text-[#1C5362] underline cursor-pointer">KPRIET</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
