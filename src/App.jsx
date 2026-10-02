import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './contexts/AuthContext';

function RolePage({ activeTab }) {
  const { user } = useAuth();
  if (!user) return null;
  
  if (activeTab === 'profile') return <Profile />;
  if (activeTab === 'book') return <Booking />;

  switch (user.role) {
    case 'manager':
      return <ManagerDashboard activeTab={activeTab} />;
    case 'superadmin':
      return <AdminDashboard activeTab={activeTab} />;
    case 'technician':
      return <TechnicianDashboard activeTab={activeTab} />;
    case 'security':
      return <SecurityDashboard activeTab={activeTab} />;
    default:
      return <CustomerDashboard activeTab={activeTab} />;
  }
}

function PageWrapper({ activeTab }) {
  return (
    <DashboardLayout activeTab={activeTab}>
      <RolePage activeTab={activeTab} />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dedicated Page Routes for Customer / Common Features */}
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper activeTab="overview" /></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><DashboardLayout activeTab="book"><Booking /></DashboardLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PageWrapper activeTab="history" /></ProtectedRoute>} />
        <Route path="/simulator" element={<ProtectedRoute><PageWrapper activeTab="charge" /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><PageWrapper activeTab="billing" /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><PageWrapper activeTab="support" /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DashboardLayout activeTab="profile"><Profile /></DashboardLayout></ProtectedRoute>} />

        {/* Manager Dedicated Page Routes */}
        <Route path="/approvals" element={<ProtectedRoute><PageWrapper activeTab="bookings" /></ProtectedRoute>} />
        <Route path="/slots" element={<ProtectedRoute><PageWrapper activeTab="slots" /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><PageWrapper activeTab="maintenance" /></ProtectedRoute>} />

        {/* Superadmin Dedicated Page Routes */}
        <Route path="/stations" element={<ProtectedRoute><PageWrapper activeTab="stations" /></ProtectedRoute>} />
        <Route path="/personnel" element={<ProtectedRoute><PageWrapper activeTab="personnel" /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><PageWrapper activeTab="complaints" /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageWrapper activeTab="settings" /></ProtectedRoute>} />

        {/* Technician & Security Dedicated Page Routes */}
        <Route path="/schedule" element={<ProtectedRoute><PageWrapper activeTab="calendar" /></ProtectedRoute>} />
        <Route path="/entry-logs" element={<ProtectedRoute><PageWrapper activeTab="logs" /></ProtectedRoute>} />

        {/* Legacy redirect helpers */}
        <Route path="/dashboard/book" element={<Navigate to="/book" replace />} />
        <Route path="/dashboard/profile" element={<Navigate to="/profile" replace />} />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
