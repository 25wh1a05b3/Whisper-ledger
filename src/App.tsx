import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { ProfileModal } from './components/ProfileModal';
import { StudentCanvasBackground } from './components/StudentCanvasBackground';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ComplaintDetails } from './pages/ComplaintDetails';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { ArchitectureHub } from './pages/ArchitectureHub';
import { AlertTriangle, X } from 'lucide-react';

function getInitialRoute(): string {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path === '/login') return 'login';
  if (path === '/register') return 'register';
  if (path === '/dashboard') return 'dashboard';
  if (path === '/admin') return 'admin';
  if (path === '/complaints') return 'complaints';
  if (path === '/my-complaints') return 'my-complaints';
  if (path === '/analytics') return 'analytics';
  if (path === '/architecture') return 'architecture';
  return 'home';
}

function routeToPath(route: string): string {
  switch (route) {
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'dashboard':
      return '/dashboard';
    case 'admin':
      return '/admin';
    case 'complaints':
      return '/complaints';
    case 'my-complaints':
      return '/my-complaints';
    case 'analytics':
      return '/analytics';
    case 'architecture':
      return '/architecture';
    default:
      return '/';
  }
}

function MainApp() {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(getInitialRoute);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [accessDeniedNotice, setAccessDeniedNotice] = useState<string | null>(null);

  // Sync route on popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setSelectedComplaintId(null);
      setCurrentTab(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL when currentTab changes
  const updateTabAndUrl = (tab: string, replace = false) => {
    setCurrentTab(tab);
    const targetUrl = routeToPath(tab);
    if (window.location.pathname !== targetUrl) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetUrl);
      } else {
        window.history.pushState({ tab }, '', targetUrl);
      }
    }
  };

  // Route Protection & Role Enforcement (Section 7)
  useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated users trying to access protected routes
    const protectedRoutes = ['dashboard', 'my-complaints', 'admin', 'complaints'];
    if (!isAuthenticated && protectedRoutes.includes(currentTab)) {
      setAccessDeniedNotice('Please log in to access this portal.');
      updateTabAndUrl('login', true);
      return;
    }

    // 2. Authenticated Student route protection
    if (isAuthenticated && role === 'STUDENT') {
      if (currentTab === 'admin' || currentTab === 'complaints') {
        setAccessDeniedNotice(
          'Institutional access only. Students cannot access administrative controls.'
        );
        updateTabAndUrl('dashboard', true);
        return;
      }
      if (currentTab === 'login' || currentTab === 'register') {
        updateTabAndUrl('dashboard', true);
        return;
      }
    }

    // 3. Authenticated Institution users route protection (HOD, DEAN, COMMITTEE, ADMIN)
    const isInstitution =
      role === 'HOD' ||
      role === 'DEAN' ||
      role === 'GRIEVANCE_COMMITTEE' ||
      role === 'ADMIN';

    if (isAuthenticated && isInstitution) {
      if (currentTab === 'dashboard' || currentTab === 'my-complaints') {
        updateTabAndUrl('admin', true);
        return;
      }
      if (currentTab === 'login' || currentTab === 'register') {
        updateTabAndUrl('admin', true);
        return;
      }
    }
  }, [currentTab, isAuthenticated, role, isLoading]);

  const handleNavigate = (tab: string) => {
    setAccessDeniedNotice(null);
    setSelectedComplaintId(null);

    // If student clicks admin directly
    if (isAuthenticated && role === 'STUDENT' && (tab === 'admin' || tab === 'complaints')) {
      setAccessDeniedNotice(
        'Institutional access only. Students cannot access administrative controls.'
      );
      updateTabAndUrl('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If unauthenticated clicks protected route
    if (!isAuthenticated && ['dashboard', 'my-complaints', 'admin', 'complaints'].includes(tab)) {
      setAccessDeniedNotice('Please log in to access this portal.');
      updateTabAndUrl('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    updateTabAndUrl(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setSelectedComplaintId(null);
  };

  const handleLoginSuccess = (detectedRole: UserRole) => {
    setAccessDeniedNotice(null);
    setSelectedComplaintId(null);

    // Role-based automatic redirect (Section 3)
    if (detectedRole === 'STUDENT') {
      updateTabAndUrl('dashboard');
    } else {
      updateTabAndUrl('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setAccessDeniedNotice(null);
    setSelectedComplaintId(null);
    updateTabAndUrl('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 font-mono">
            Verifying cryptographic session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Student Canvas Background: Soft daylight gradients, notebook grid, and hand-crafted study motifs */}
      <StudentCanvasBackground />

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSubmitModal={() => {
          setSelectedComplaintId(null);
          handleNavigate('dashboard');
          setIsSubmitModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        systemAlertCount={role && role !== 'STUDENT' ? 2 : 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Access Denied Banner (Section 7) */}
        {accessDeniedNotice && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 shadow-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <strong className="font-extrabold text-sm block sm:inline">
                  Access Denied
                </strong>
                <span className="text-xs text-rose-800 ml-0 sm:ml-2">
                  {accessDeniedNotice}
                </span>
              </div>
            </div>
            <button
              onClick={() => setAccessDeniedNotice(null)}
              className="p-1 rounded-lg text-rose-600 hover:text-rose-900 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {selectedComplaintId ? (
          <ComplaintDetails
            complaintId={selectedComplaintId}
            onBack={handleBackToFeed}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          />
        ) : (
          <>
            {/* Unified Login Page (Section 1) */}
            {(currentTab === 'login' || currentTab === 'register') && (
              <Login
                initialMode={currentTab === 'register' ? 'register' : 'login'}
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}

            {currentTab === 'home' && (
              <Home
                onNavigate={handleNavigate}
                onOpenSubmit={() => {
                  if (!isAuthenticated) {
                    handleNavigate('login');
                  } else {
                    handleNavigate('dashboard');
                    setIsSubmitModalOpen(true);
                  }
                }}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                onSelectComplaint={handleSelectComplaint}
              />
            )}

            {/* Student Dashboard & My Complaints (Section 3 & 11) */}
            {(currentTab === 'dashboard' || currentTab === 'my-complaints') && (
              <StudentDashboard
                onSelectComplaint={handleSelectComplaint}
                openSubmitOnMount={isSubmitModalOpen}
                initialTab={currentTab === 'my-complaints' ? 'MY' : 'ALL'}
              />
            )}

            {/* Institutional Admin Dashboard & Complaints (Section 3 & 11) */}
            {(currentTab === 'admin' || currentTab === 'complaints') && (
              <AdminDashboard onSelectComplaint={handleSelectComplaint} />
            )}

            {currentTab === 'analytics' && <AnalyticsDashboard />}

            {currentTab === 'architecture' && <ArchitectureHub />}
          </>
        )}
      </main>

      {/* Privacy Shield Modal */}
      <PrivacyShieldModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Profile & Permissions Modal (Section 4 & 5) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <Footer
        onOpenArchitecture={() => handleNavigate('architecture')}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
