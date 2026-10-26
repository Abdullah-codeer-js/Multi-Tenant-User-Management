import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const canManageUsers = ["Admin", "Manager"].includes(user?.role);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canManageUsers) {
      return;
    }

    api
      .get("/users")
      .then((response) => setUsers(response.data.data))
      .catch((requestError) => {
        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load dashboard data.";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [canManageUsers]);

  const registrationsByMonth = useMemo(() => {
    const year = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, month) => ({
      month: new Date(year, month, 1).toLocaleString(undefined, {
        month: "short",
      }),
      registrations: 0,
    }));

    users.forEach((registeredUser) => {
      const createdAt = new Date(registeredUser.created_at);
      if (!Number.isNaN(createdAt.getTime()) && createdAt.getFullYear() === year) {
        months[createdAt.getMonth()].registrations += 1;
      }
    });

    return months;
  }, [users]);

  return (
    <div className="home">
      <div className="homeHeader">
        <div>
          <h1 className="homeTitle">{user?.role} Dashboard</h1>
          <p className="homeSubtitle">
            {user?.role === "Admin"
              ? "Manage your organization and its users."
              : user?.role === "Manager"
                ? "Manage your team and its users."
                : "Here’s your space to stay on top of things."}
          </p>
        </div>
        {canManageUsers && (
          <Link className="homeCreateUser" to="/users/new">
            <UserPlus size={18} />
            Create User
          </Link>
        )}
      </div>
      {!canManageUsers ? (
        <section className="employeeWelcomeCard">
          <div className="employeeWelcomeCopy">
            <span className="employeeWelcomeEyebrow">YOUR WORKSPACE</span>
            <h2>
              {greeting}, {user?.name?.split(" ")[0] || "there"}
              <span aria-hidden="true">!</span>
            </h2>
            <p>
              Your workspace is ready. Wishing you a focused and productive day.
            </p>
            <Link className="employeeProfileButton" to="/profile">
              View your profile
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="employeeWelcomeArt" aria-hidden="true">
            <span className="employeeWelcomeGlow" />
            <Sparkles size={56} strokeWidth={1.4} />
          </div>
        </section>
      ) : (
        <>
          {error && <p role="alert">{error}</p>}
          {loading ? (
            <p role="status">Loading dashboard...</p>
          ) : (
            <>
              <FeaturedInfo users={users} />
              <Chart data={registrationsByMonth} title="User Registrations" />
              <div className="homeWidgets">
                <WidgetSm users={users} />
                <WidgetLg users={users} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}