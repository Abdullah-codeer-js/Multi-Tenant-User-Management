
import "./featuredInfo.css";
import { Users, UserPlus, Shield } from "lucide-react";

export default function FeaturedInfo({ users = [] }) {
  const currentDate = new Date();
  const newUsers = users.filter((user) => {
    const createdAt = new Date(user.created_at);
    return (
      createdAt.getMonth() === currentDate.getMonth() &&
      createdAt.getFullYear() === currentDate.getFullYear()
    );
  }).length;
  const admins = users.filter((user) => user.role === "Admin").length;

  return (
    <div className="featured">
      <div className="featuredItem">
        <div className="featuredHeader">
          <span className="featuredTitle">Total Users</span>
          <Users className="featuredIcon usersIcon" />
        </div>

        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{users.length}</span>
        </div>

        <span className="featuredSub">In your organization</span>
      </div>

      <div className="featuredItem">
        <div className="featuredHeader">
          <span className="featuredTitle">New Users</span>
          <UserPlus className="featuredIcon newUsersIcon" />
        </div>

        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{newUsers}</span>
        </div>

        <span className="featuredSub">Registered this month</span>
      </div>

      <div className="featuredItem">
        <div className="featuredHeader">
          <span className="featuredTitle">Administrators</span>
          <Shield className="featuredIcon adminIcon" />
        </div>

        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{admins}</span>
        </div>

        <span className="featuredSub">Organization admins</span>
      </div>
    </div>
  );
}
