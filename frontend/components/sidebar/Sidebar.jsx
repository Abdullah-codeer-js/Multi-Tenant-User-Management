
import "./sidebar.css";
import { LayoutDashboard, LogOut, UserRound, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to complete server sign-out."
      );
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>

          <ul className="sidebarList">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `link sidebarListItem ${isActive ? "active" : ""}`
                }
              >
                <LayoutDashboard className="sidebarIcon" />
                Home
              </NavLink>
              {["Admin", "Manager"].includes(user?.role) && (
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `link sidebarListItem ${isActive ? "active" : ""}`
                  }
                >
                  <Users className="sidebarIcon" />
                  Users
                </NavLink>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `link sidebarListItem ${isActive ? "active" : ""}`
                }
              >
                <UserRound className="sidebarIcon" />
                My Profile
              </NavLink>
              <button
                type="button"
                className="link sidebarListItem sidebarLogout"
                onClick={handleLogout}
              >
                <LogOut className="sidebarIcon" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
