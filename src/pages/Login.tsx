import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_ACCOUNTS_MAP } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
  UserCheck,
  Building2,
  HelpCircle,
  Layers,
  Fingerprint,
  ChevronRight,
  UserPlus,
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateHome: () => void;
  initialMode?: 'login' | 'register';
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
  initialMode = 'login',
}) => {
  const { login, register } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state (Student registration)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regYear, setRegYear] = useState('3rd Year');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{
    role: UserRole;
    heading: string;
    subheading: string;
  } | null>(null);

  // Forgot password modal
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Restore remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('whisper_ledger_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Update mode if prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(cleanEmail, password);

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('whisper_ledger_remembered_email', cleanEmail);
      } else {
        localStorage.removeItem('whisper_ledger_remembered_email');
      }

      // Check role validity
      const userRole = authenticatedUser.role;
      const validRoles: UserRole[] = [
        'STUDENT',
        'HOD',
        'DEAN',
        'GRIEVANCE_COMMITTEE',
        'ADMIN',
      ];

      if (!userRole || !validRoles.includes(userRole)) {
        setErrorMessage(
          'Your account does not have a valid Whisper Ledger role. Please contact the administrator.'
        );
        setIsSubmitting(false);
        return;
      }

      // Prepare role-specific success message matching prompt Section 9
      let heading = 'Welcome back!';
      let subheading = '';

      switch (userRole) {
        case 'STUDENT':
          subheading = 'Student account verified.';
          break;
        case 'HOD':
          subheading = 'HOD account verified.';
          break;
        case 'DEAN':
          subheading = 'Dean account verified.';
          break;
        case 'GRIEVANCE_COMMITTEE':
          subheading = 'Grievance Committee account verified.';
          break;
        case 'ADMIN':
          subheading = 'Administrator account verified.';
          break;
        default:
          subheading = 'Account verified.';
      }

      setSuccessState({ role: userRole, heading, subheading });

      // Automatically redirect according to role after brief verification indicator
      setTimeout(() => {
        onLoginSuccess(userRole);
      }, 1100);
    } catch (err: any) {
      const msg = err.message || '';
      if (
        msg.includes('role') ||
        msg.includes('contact the administrator')
      ) {
        setErrorMessage(
          'Your account does not have a valid Whisper Ledger role. Please contact the administrator.'
        );
      } else {
        // Enforce generic message to avoid leaking user existence
        setErrorMessage('Invalid email or password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        department: regDepartment,
        year: regYear,
        password: regPassword,
        role: 'STUDENT',
      });

      setSuccessState({
        role: 'STUDENT',
        heading: 'Registration Complete!',
        subheading: 'Student account verified & cryptographic vault created.',
      });

      setTimeout(() => {
        onLoginSuccess('STUDENT');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (accountRole: UserRole) => {
    const creds = DEMO_ACCOUNTS_MAP[accountRole];
    if (creds) {
      setMode('login');
      setEmail(creds.email);
      setPassword(creds.pass);
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 sm:py-10">
      {/* Background Ambience */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50">
          {/* Left Column: Visual Security Pipeline Flow */}
          <div className="lg:col-span-5 bg-[#0B1020] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Glows using theme colors */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#3867FF]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6C63FF]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[#19D3F3]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Brand Logo & Title */}
              <div
                className="flex items-center gap-3 mb-6 cursor-pointer"
                onClick={onNavigateHome}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3867FF] via-[#6C63FF] to-[#19D3F3] p-0.5 flex items-center justify-center shadow-lg shadow-[#3867FF]/30">
                  <div className="w-full h-full bg-[#0B1020] rounded-[9px] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#19D3F3]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl tracking-tight text-white">
                      WHISPER
                    </span>
                    <span className="font-black text-xl tracking-tight text-[#19D3F3]">
                      LEDGER
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
                    Identity Vault
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  Anonymous for Students,
                  <br />
                  <span className="bg-gradient-to-r from-[#19D3F3] via-[#6C63FF] to-[#E94FD0] bg-clip-text text-transparent">
                    Accountable for Institutions.
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Cryptographic zero-identity ledger separating campus grievance
                  authors from institution triage authorities.
                </p>
              </div>

              {/* Security Pipeline Visual requested in Section 8 */}
              <div className="space-y-3 relative">
                {/* Visual Architecture Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#19D3F3] via-[#6C63FF] to-[#3867FF] opacity-40 pointer-events-none" />

                {/* Node 1: Student */}
                <div className="relative flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#3867FF]/20 border border-[#3867FF]/50 flex items-center justify-center text-[#19D3F3] shrink-0 z-10">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Student</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Zero-Leak Salt
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Grievance hashed with isolated student salt
                    </p>
                  </div>
                </div>

                {/* Flow Connector Arrow */}
                <div className="flex justify-center -my-1 text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-[#19D3F3]" />
                </div>

                {/* Node 2: Secure Authentication */}
                <div className="relative flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/50 flex items-center justify-center text-[#6C63FF] shrink-0 z-10">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Secure Authentication
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Spring / JWT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Backend validates role & mints verified session token
                    </p>
                  </div>
                </div>

                {/* Flow Connector Arrow */}
                <div className="flex justify-center -my-1 text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-[#6C63FF]" />
                </div>

                {/* Node 3: Privacy Layer */}
                <div className="relative flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#19D3F3]/20 border border-[#19D3F3]/50 flex items-center justify-center text-[#19D3F3] shrink-0 z-10">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Privacy Layer</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        ANON-TOKEN
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Identities permanently masked before reaching authorities
                    </p>
                  </div>
                </div>

                {/* Flow Connector Arrow */}
                <div className="flex justify-center -my-1 text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-[#3867FF]" />
                </div>

                {/* Node 4: Institution */}
                <div className="relative flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#E94FD0]/20 border border-[#E94FD0]/50 flex items-center justify-center text-[#E94FD0] shrink-0 z-10">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Institution</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        SLA Escalation
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      HOD • Dean • Committee oversight with auto-escalation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Guarantee */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ledger Genesis Intact
              </span>
              <span className="font-mono text-slate-300">SHA-256 Merkle Chain</span>
            </div>
          </div>

          {/* Right Column: Unified Login Card */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            <div className="max-w-md w-full mx-auto">
              {/* Header Titles required by Section 1 */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                    Unified Campus Access
                  </span>
                  <span className="text-xs text-slate-400">Single Sign-On</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  WHISPER LEDGER
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Anonymous for Students, Accountable for Institutions
                </p>
              </div>

              {/* Success Banner if authenticated */}
              {successState && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-fade-in shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-emerald-900">
                        {successState.heading}
                      </h4>
                      <p className="text-xs font-medium text-emerald-700">
                        {successState.subheading}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
                    <span>
                      Detected Role:{' '}
                      <strong className="font-mono font-bold">
                        {successState.role.replace('_', ' ')}
                      </strong>
                    </span>
                    <span className="font-semibold text-emerald-600 animate-pulse">
                      Redirecting to dashboard...
                    </span>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && !successState && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 animate-fade-in flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold leading-relaxed">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Login Mode vs Register Mode */}
              {mode === 'login' ? (
                /* LOGIN FORM (Section 1) */
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">
                      Welcome Back
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your credentials to securely access your ledger portal.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-medium outline-hidden transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPasswordModal(true)}
                          className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-medium outline-hidden transition-all placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs text-slate-600 font-medium">
                          Remember Me
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        SSL Encrypted
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !!successState}
                      className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Login</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Link to Create Student Account (Section 1) */}
                  <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                      New to Whisper Ledger?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMessage(null);
                        }}
                        className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2 ml-1"
                      >
                        Create Student Account
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* STUDENT REGISTRATION FORM */
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">
                      Create Student Account
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Register your student profile. Identity is mathematically
                      shielded before grievances touch the ledger.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Alex Chen"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-medium outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Campus Email
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. alex@campus.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-medium outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Department
                        </label>
                        <select
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-slate-900 text-xs font-medium outline-hidden bg-white"
                        >
                          <option>Computer Science</option>
                          <option>Electrical Engineering</option>
                          <option>Mechanical Engineering</option>
                          <option>Civil Engineering</option>
                          <option>Electronics & Communication</option>
                          <option>General Campus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Year of Study
                        </label>
                        <select
                          value={regYear}
                          onChange={(e) => setRegYear(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-slate-900 text-xs font-medium outline-hidden bg-white"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a secure password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-medium outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !!successState}
                      className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Registering account...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Create Student Account</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorMessage(null);
                        }}
                        className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2 ml-1"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Fill Helper (Section 10 Demo Accounts) */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Demo Evaluation Accounts (Section 10)
                </span>
                <span className="text-[10px] text-slate-400">
                  Click to auto-fill inputs
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {(
                  [
                    'STUDENT',
                    'HOD',
                    'DEAN',
                    'GRIEVANCE_COMMITTEE',
                    'ADMIN',
                  ] as UserRole[]
                ).map((roleKey) => {
                  const cred = DEMO_ACCOUNTS_MAP[roleKey];
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => handleQuickFill(roleKey)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 text-left transition-all text-[11px] group cursor-pointer"
                    >
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                        {roleKey === 'GRIEVANCE_COMMITTEE'
                          ? 'Committee'
                          : roleKey === 'ADMIN'
                          ? 'Admin'
                          : roleKey}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">
                        {cred.pass}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Password Recovery Protocol
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Whisper Ledger uses zero-knowledge salted identities to safeguard
              whistleblower safety. To prevent identity leaks, automated email
              recovery is disabled by design.
            </p>

            <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Students:</strong> Contact campus registrar with your
                  student ID for in-person credential re-issuance.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Faculty & Authorities:</strong> Contact IT Systems
                  Admin at{' '}
                  <span className="font-mono text-slate-900 font-semibold">
                    admin@whisperledger.local
                  </span>
                  .
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
