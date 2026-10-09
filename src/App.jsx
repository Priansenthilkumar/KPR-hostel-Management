// src/App.jsx
import { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  CheckCircle2
} from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MobileHeader from './components/Layout/MobileHeader';
import MobileBottomNav from './components/Layout/MobileBottomNav';
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
import GatePassForm from './pages/GatePassForm';
import GatePassReview from './pages/GatePassReview';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <img
        src={kprLogo}
        alt="KPRIET Logo"
        className="h-12 w-auto object-contain bg-white p-2 rounded-xl shadow-md"
      />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#00A859] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide">
        Loading KPRIET Portal…
      </p>
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
  const { user } = useAuth();
  const isLogin = location.pathname === '/login';

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  if (isLogin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className={`app-layout min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 relative flex`}>

      {/* Dark Backdrop when Sidebar Open */}
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 animate-fade-in cursor-pointer"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Slide-out Left Sidebar Drawer */}
      <Sidebar
        sidebarVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onHideSidebar={() => setSidebarVisible(false)}
        onOpenComplaints={() => setIsComplaintOpen(true)}
        isDark={isDark}
        onToggleDark={toggle}
      />

      {/* Main Content Area */}
      <div className="main-area flex-1 min-w-0 min-h-screen flex flex-col">
        
        {/* Desktop Top Header (hidden on mobile) */}
        <div className="hidden md:block">
          <Header
            sidebarVisible={sidebarVisible}
            onToggleSidebar={() => setSidebarVisible((prev) => !prev)}
            isDark={isDark}
            onToggleDark={toggle}
            onOpenComplaints={() => setIsComplaintOpen(true)}
          />
        </div>

        {/* Mobile Top Header (visible on mobile only) */}
        <MobileHeader
          onOpenSidebar={() => setSidebarVisible(true)}
          isDark={isDark}
          onToggleDark={toggle}
        />

        {/* Page Content */}
        <main className="flex-1 w-full max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-20 md:pb-12">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Super Admin */}
              <Route path="/admin-home" element={<ProtectedRoute allowedRole="super_admin"><SuperAdminHome /></ProtectedRoute>} />

              {/* Mess Routes */}
              <Route path="/" element={<ProtectedRoute allowedRole="mess_staff"><HomeRedirect /></ProtectedRoute>} />
              <Route path="/mess-dashboard" element={<ProtectedRoute allowedRole="mess_staff"><Dashboard /></ProtectedRoute>} />
              <Route path="/overview" element={<ProtectedRoute allowedRole="mess_staff"><Overview /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute allowedRole="mess_staff"><FoodMenu /></ProtectedRoute>} />
              <Route path="/add-entry" element={<ProtectedRoute allowedRole="mess_staff"><AddEntry /></ProtectedRoute>} />
              <Route path="/add-entry/:id" element={<ProtectedRoute allowedRole="mess_staff"><AddEntry /></ProtectedRoute>} />

              {/* Hostel Routes */}
              <Route path="/hostel-dashboard" element={<ProtectedRoute allowedRole="warden"><HostelDashboard /></ProtectedRoute>} />
              <Route path="/hostel-overview" element={<ProtectedRoute allowedRole="warden"><HostelManagement /></ProtectedRoute>} />
              <Route path="/hostel-add-entry" element={<ProtectedRoute allowedRole="warden"><AddHostelEntry /></ProtectedRoute>} />
              <Route path="/hostel-gatepass" element={<ProtectedRoute allowedRole="warden"><GatePassForm /></ProtectedRoute>} />
              <Route path="/gatepass-review" element={<ProtectedRoute allowedRole="warden"><GatePassReview /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenSidebar={() => setSidebarVisible(true)} />

      {/* Complaints Modal */}
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
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,43,73,0.12)',
                border: '1px solid var(--border)',
                background: 'var(--toast-bg)',
                color: 'var(--text-primary)',
              },
              success: {
                iconTheme: { primary: '#00A859', secondary: '#fff' },
                style: { borderLeft: '4px solid #00A859' },
              },
              error: {
                iconTheme: { primary: '#DC2626', secondary: '#fff' },
                style: { borderLeft: '4px solid #DC2626' },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
