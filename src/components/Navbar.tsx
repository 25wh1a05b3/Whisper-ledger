import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS_MAP } from '../context/AuthContext';
import { ROLE_DISPLAY_NAMES, UserRole } from '../types';
import {
  Shield,
  EyeOff,
  UserCheck,
  ChevronDown,
  PlusCircle,
  BarChart3,
  Layers,
  Code2,
  LogOut,
  Building2,
  LogIn,
  UserPlus,
  User,
  Sparkles,
  FileText,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSubmitModal: () => void;
  onOpenProfileModal: () => void;
  systemAlertCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSubmitModal,
  onOpenProfileModal,
  systemAlertCount = 2,
}) => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const roleTitle = role ? ROLE_DISPLAY_NAMES[role] || role : '';

  const getRoleBadgeClasses = (userRole: UserRole | null) => {
    switch (userRole) {
      case 'STUDENT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'HOD':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'DEAN':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'GRIEVANCE_COMMITTEE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isStudent = role === 'STUDENT';
  const isInstitution =
    role === 'HOD' ||
    role === 'DEAN' ||
    role === 'GRIEVANCE_COMMITTEE' ||
    role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 flex items-center justify-center shadow-sm shadow-blue-500/20">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  WHISPER
                </span>
                <span className="font-bold text-lg text-blue-600 tracking-tight">
                  LEDGER
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  Campus Shield
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Anonymous for Students • Accountable for Institutions
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links matching Section 11 */}
          <nav className="hidden md:flex items-center gap-1.5">
            {!isAuthenticated ? (
              /* Unauthenticated Nav (Section 11) */
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === 'home'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'login'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'register'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Register</span>
                </button>
              </>
            ) : isStudent ? (
              /* Student Authenticated Nav (Section 11) */
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onNavigate('my-complaints')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'my-complaints'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>My Complaints</span>
                </button>
                <button
                  onClick={onOpenProfileModal}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Profile</span>
                </button>
              </>
            ) : (
              /* Institution Authenticated Nav (HOD, DEAN, COMMITTEE, ADMIN) (Section 11) */
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'admin'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dashboard</span>
                  {systemAlertCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      {systemAlertCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onNavigate('complaints')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'complaints'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Complaints</span>
                </button>
                <button
                  onClick={() => onNavigate('analytics')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'analytics'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={onOpenProfileModal}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Profile</span>
                </button>
              </>
            )}

            {/* Architecture Link always accessible as secondary tab */}
            <button
              onClick={() => onNavigate('architecture')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                currentTab === 'architecture'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
              title="Inspect Spring Boot Architecture & Cryptographic Hash"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Architecture</span>
            </button>
          </nav>

          {/* Right Area: Role Badge & Profile / Actions (Section 4) */}
          <div className="flex items-center gap-2.5">
            {/* If Student, show Quick Submit Button */}
            {isStudent && (
              <button
                onClick={onOpenSubmitModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Grievance</span>
              </button>
            )}

            {isAuthenticated ? (
              /* User & Role Badge Display (Section 4) */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs shadow-2xs transition-all hover:border-blue-300 text-left cursor-pointer"
                >
                  {/* Status dot */}
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />

                  {/* Role & Name area */}
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-medium text-slate-500 truncate max-w-[130px]">
                      Welcome, <strong className="text-slate-800 font-bold">{user?.name?.split(' ')[0]}</strong>
                    </div>
                    {/* Role badge (Section 4) */}
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getRoleBadgeClasses(
                        role
                      )}`}
                    >
                      <span>Role: {roleTitle}</span>
                    </div>
                  </div>

                  {/* Mobile compact role pill */}
                  <div
                    className={`sm:hidden px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getRoleBadgeClasses(
                      role
                    )}`}
                  >
                    {role}
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-extrabold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-1.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getRoleBadgeClasses(
                            role
                          )}`}
                        >
                          Role: {roleTitle}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5 py-1">
                      <button
                        onClick={() => {
                          onOpenProfileModal();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Account & Permissions</span>
                      </button>

                      {isStudent && (
                        <button
                          onClick={() => {
                            onNavigate('my-complaints');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>My Complaints</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onNavigate('architecture');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Backend Ledger Specs</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          onNavigate('login');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Clear Session
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* If unauthenticated, show clean Sign In CTA button */
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu matching Section 11 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 space-y-2 animate-fade-in text-xs">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                  currentTab === 'home'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2 ${
                  currentTab === 'login'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                Login
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2 ${
                  currentTab === 'register'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Register
              </button>
            </>
          ) : isStudent ? (
            <>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-2">
                <div className="text-[11px] text-slate-500">
                  Welcome, <strong>{user?.name}</strong>
                </div>
                <div
                  className={`mt-1 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRoleBadgeClasses(
                    role
                  )}`}
                >
                  Role: {roleTitle}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('my-complaints');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                  currentTab === 'my-complaints'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                My Complaints
              </button>
              <button
                onClick={() => {
                  onOpenProfileModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-700"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  onNavigate('login');
                }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-2">
                <div className="text-[11px] text-slate-500">
                  Welcome, <strong>{user?.name}</strong>
                </div>
                <div
                  className={`mt-1 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRoleBadgeClasses(
                    role
                  )}`}
                >
                  Role: {roleTitle}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                  currentTab === 'admin'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('complaints');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                  currentTab === 'complaints'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700'
                }`}
              >
                Complaints
              </button>
              <button
                onClick={() => {
                  onNavigate('analytics');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                  currentTab === 'analytics'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => {
                  onOpenProfileModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-700"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  onNavigate('login');
                }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('architecture');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-amber-700 font-bold"
            >
              Spring Boot Architecture Hub
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
