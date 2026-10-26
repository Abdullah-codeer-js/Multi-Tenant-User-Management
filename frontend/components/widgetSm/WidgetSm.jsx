
import "./widgetSm.css";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WidgetSm({ users = [] }) {
  const navigate = useNavigate();
  const newMembers = users.slice(0, 5);

  return (
    <div className="widgetSm">
      <h3 className="widgetSmTitle">New Team Members</h3>

      <ul className="widgetSmList">
        {newMembers.map((member) => (
          <li className="widgetSmListItem" key={member.id}>
            
            <div className="widgetSmUser">
              <span className="widgetSmUsername">
                {member.name}
              </span>

              <span className="widgetSmUserTitle">
                {member.role}
              </span>
            </div>

            <button
              type="button"
              className="widgetSmButton"
              onClick={() => navigate(`/users/${member.id}`)}
              aria-label={`View ${member.name}`}
            >
              <Eye className="widgetSmIcon" />
            </button>
          </li>
        ))}
        {!newMembers.length && <li>No users found.</li>}
      </ul>
    </div>
  );
}
