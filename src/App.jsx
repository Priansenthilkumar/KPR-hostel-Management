// src/App.jsx
import { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import ComplaintBox from './components/Dashboard/ComplaintBox';
import { useDarkMode } from './hooks/useDarkMode';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import Login from './pages/Login';
import kprLogo from './assets/kprLogo.png';

import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import FoodMenu from './pages/FoodMenu';
import AddEntry from './pages/AddEntry';

// Parallel Hostel Management Suite
import HostelDashboard from './pages/HostelDashboard';
import HostelManagement from './pages/HostelManagement';
import AddHostelEntry from './pages/AddHostelEntry';
import SuperAdminHome from './pages/SuperAdminHome';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <img
        src={kprLogo}
        alt="KPR Logo"
        className="h-10 w-auto object-contain bg-white/95 p-1.5 rounded-xl shadow-xs"
      />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#52B74A] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && user?.role !== 'super_admin' && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'super_admin' ? '/admin-home' : user?.role === 'warden' ? '/hostel-dashboard' : '/'} replace />;
  }
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (user?.role === 'super_admin') {
    return <SuperAdminHome />;
  }
  if (user?.role === 'warden') {
    return <Navigate to="/hostel-dashboard" replace />;
  }
  return <Dashboard />;
}

function MainAppLayout({ isDark, toggle }) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  if (isLogin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="app-layout min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 relative flex">
      {/* Permanent Fixed 260px Left Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenComplaints={() => setIsComplaintOpen(true)}
        isDark={isDark}
        onToggleDark={toggle}
      />

      {/* Floating Hamburger Toggle Button for Small Mobile Screens Only */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 p-2.5 rounded-xl bg-[#0C242C] text-white border border-white/20 shadow-lg active:scale-95 transition-all"
        aria-label="Open Navigation Drawer"
      >
        <Menu size={20} strokeWidth={2.2} />
      </button>

      {/* Main Area Flex Container: Content + Footer */}
      <div className="main-area flex-1 min-w-0 min-h-screen flex flex-col lg:pl-[260px]">
        <main className="flex-1 w-full max-w-[1550px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Common Super Admin Home Route */}
              <Route path="/admin-home" element={<ProtectedRoute allowedRole="super_admin"><SuperAdminHome /></ProtectedRoute>} />

              {/* Mess Protected Routes */}
              <Route path="/" element={<ProtectedRoute allowedRole="mess_staff"><HomeRedirect /></ProtectedRoute>} />
              <Route path="/mess-dashboard" element={<ProtectedRoute allowedRole="mess_staff"><Dashboard /></ProtectedRoute>} />
              <Route path="/overview" element={<ProtectedRoute allowedRole="mess_staff"><Overview /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute allowedRole="mess_staff"><FoodMenu /></ProtectedRoute>} />
              <Route path="/add-entry" element={<ProtectedRoute allowedRole="mess_staff"><AddEntry /></ProtectedRoute>} />
              <Route path="/add-entry/:id" element={<ProtectedRoute allowedRole="mess_staff"><AddEntry /></ProtectedRoute>} />

              {/* Hostel Management Suite Routes */}
              <Route path="/hostel-dashboard" element={<ProtectedRoute allowedRole="warden"><HostelDashboard /></ProtectedRoute>} />
              <Route path="/hostel-overview" element={<ProtectedRoute allowedRole="warden"><HostelManagement /></ProtectedRoute>} />
              <Route path="/hostel-add-entry" element={<ProtectedRoute allowedRole="warden"><AddHostelEntry /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Footer sits inside main-area at bottom */}
        <Footer />
      </div>

      {/* Complaints Modal Overlay */}
      <ComplaintBox
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />
    </div>
  );
}

export default function App() {
  const { isDark, toggle } = useDarkMode();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <MainAppLayout isDark={isDark} toggle={toggle} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                fontSize: '13.5px',
                fontWeight: 500,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                border: '1px solid var(--border)',
                background: 'var(--toast-bg)',
                color: 'var(--text-primary)',
              },
              success: {
                iconTheme: { primary: '#52B74A', secondary: '#fff' },
                style: { borderLeft: '4px solid #52B74A' },
              },
              error: {
                iconTheme: { primary: '#D32F2F', secondary: '#fff' },
                style: { borderLeft: '4px solid #D32F2F' },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
