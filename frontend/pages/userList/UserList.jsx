import { useEffect, useState } from "react";
import { ShieldAlert, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import "./userList.css";

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Request failed.";
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data.data))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;
    const userId = userToDelete.id;
    setDeletingId(userId);

    try {
      await api.delete(`/users/${userId}`);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId)
      );
      setUserToDelete(null);
      toast.success("User deleted.");
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="userList">
      <h1 className="userListTitle">Users</h1>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="userListBackButton"
      >
        Back to Dashboard
      </button>

      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">Loading users...</p>
      ) : (
        <div className="userListTableContainer">
          <table className="userListTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="userListUser">
                    <span className="userListAvatar" aria-hidden="true">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="userListActions">
                    {(currentUser?.role === "Admin" ||
                      user.role === "Employee") && (
                      <Link to={`/users/${user.id}`}>
                        <button type="button" className="userListEdit">
                          Edit
                        </button>
                      </Link>
                    )}
                    {(currentUser?.role === "Admin" ||
                      user.role === "Employee") && (
                      <button
                        type="button"
                        className="userListDelete"
                        aria-label={`Delete ${user.name}`}
                        disabled={deletingId === user.id}
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan="6">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {userToDelete && (
        <div
          className="deleteConfirmOverlay"
          onClick={() => !deletingId && setUserToDelete(null)}
        >
          <section
            className="deleteConfirmDialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="deleteConfirmIcon" aria-hidden="true">
              <ShieldAlert size={25} />
            </div>
            <h2 id="delete-confirm-title">Delete this user?</h2>
            <p id="delete-confirm-description">
              Are you sure you want to delete{" "}
              <strong>{userToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="deleteConfirmActions">
              <button
                type="button"
                className="deleteConfirmCancel"
                disabled={deletingId === userToDelete.id}
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="deleteConfirmSubmit"
                disabled={deletingId === userToDelete.id}
                onClick={handleDelete}
              >
                {deletingId === userToDelete.id ? "Deleting..." : "Delete user"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
