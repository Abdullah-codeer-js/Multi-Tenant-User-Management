
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Topbar from "../components/topbar/Topbar";
import "./App.css";
import Sidebar from "../components/sidebar/Sidebar";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import UserList from "../pages/userList/UserList";
import User from "../pages/user/User";
import NewUser from "../pages/NewUser/NewUser";
import { AuthProvider } from "../context/AuthProvider";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  return (
    <>
      <Topbar />
      <div className="container">
        <Sidebar />
        <main className="mainContent">{children}</main>
      </div>
    </>
  );
}

function ProtectedRoute({ children, roles }) {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return <div role="status">Restoring your session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* dashboard */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <User />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* User management */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["Admin", "Manager"]}>
              <DashboardLayout>
                <UserList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute roles={["Admin", "Manager"]}>
              <DashboardLayout>
                <User />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/new"
          element={
            <ProtectedRoute roles={["Admin", "Manager"]}>
              <DashboardLayout>
                <NewUser />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
