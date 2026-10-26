
import "./widgetLg.css";

export default function WidgetLg({ users = [] }) {
  const recentUsers = users.slice(0, 5);

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Recently Registered Users</h3>

      <div className="widgetLgTableContainer">
        <table className="widgetLgTable">
          <thead>
            <tr className="widgetLgTr">
              <th className="widgetLgTh">User</th>
              <th className="widgetLgTh">Registered</th>
              <th className="widgetLgTh">Role</th>
            </tr>
          </thead>

          <tbody>
            {recentUsers.map((user) => (
              <tr className="widgetLgTr" key={user.id}>
                <td className="widgetLgUser">
                  <div className="widgetLgAvatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="widgetLgUserInfo">
                    <span className="widgetLgName">
                      {user.name}
                    </span>
                    <span className="widgetLgEmail">
                      {user.email}
                    </span>
                  </div>
                </td>

                <td className="widgetLgDate">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </td>

                <td>
                  <span className={`widgetLgRole ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>

              </tr>
            ))}
            {!recentUsers.length && (
              <tr>
                <td colSpan="3">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
