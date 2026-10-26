import { useEffect, useState } from "react";
import { ArrowLeft, Mail, UserRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import "./user.css";

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Request failed.";
}

export default function User() {
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useAuth();
  const isOwnProfile =
    !routeUserId || String(routeUserId) === String(currentUser?.id);
  const userId = routeUserId || currentUser?.id;
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const profileRequest = isOwnProfile
      ? api.get("/auth/profile")
      : api.get(`/users/${userId}`);

    profileRequest
      .then((response) => {
        const loadedUser = response.data.data;
        setUser(loadedUser);
        setFormData({
          name: loadedUser.name,
          email: loadedUser.email,
          role: "",
        });
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [isOwnProfile, userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const updates = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
    };
    if (formData.role) updates.role = formData.role;

    try {
      const response = isOwnProfile
        ? await updateProfile(updates)
        : await api.patch(`/users/${userId}`, updates);
      setUser(response.data.data);
      setFormData((current) => ({ ...current, role: "" }));
      toast.success(isOwnProfile ? "Profile updated." : "User updated.");
      if (isOwnProfile) navigate("/dashboard");
    } catch (requestError) {
      const message = getErrorMessage(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const availableRoles =
    currentUser?.role === "Admin" ? ["Manager", "Employee"] : ["Employee"];
  const canManageUser =
    isOwnProfile ||
    currentUser?.role === "Admin" ||
    (currentUser?.role === "Manager" && user?.role === "Employee");
  const canChangeRole = !isOwnProfile &&
    ["Admin", "Manager"].includes(currentUser?.role);

  return (
    <div className="user">
      <div className="userTitleContainer">
        <button
          type="button"
          onClick={() => navigate(isOwnProfile ? "/dashboard" : "/users")}
          className="userBackButton"
          aria-label="Back to dashboard"
          title="Back to dashboard"
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <h1 className="userTitle">
          {isOwnProfile ? "My Profile" : "Edit User"}
        </h1>
        {!isOwnProfile && (
          <Link to="/users/new">
            <button className="userAddButton" type="button">
              Create
            </button>
          </Link>
        )}
      </div>

      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">Loading user...</p>
      ) : user ? (
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <div className="userShowTopTitle">
                <span className="userShowUsername">{user.name}</span>
                <span className="userShowUserTitle">{user.role}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Account Details</span>
              <div className="userShowInfo">
                <UserRound className="userShowIcon" />
                <span className="userShowInfoTitle">ID: {user.id}</span>
              </div>
              <div className="userShowInfo">
                <Mail className="userShowIcon" />
                <span className="userShowInfoTitle">{user.email}</span>
              </div>
              <div className="userShowInfo">
                <span className="userShowInfoTitle">
                  Created:{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
          {canManageUser ? (
            <div className="userUpdate">
              <span className="userUpdateTitle">Edit account</span>
              <form className="userUpdateForm" onSubmit={handleSubmit}>
                <div className="userUpdateLeft">
                  <div className="userUpdateItem">
                    <label htmlFor="edit-user-name">Name</label>
                    <input
                      id="edit-user-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="userUpdateInput"
                      required
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label htmlFor="edit-user-email">Email</label>
                    <input
                      id="edit-user-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="userUpdateInput"
                      required
                    />
                  </div>
                  {canChangeRole && (
                    <div className="userUpdateItem">
                      <label htmlFor="edit-user-role">Change role (optional)</label>
                      <select
                        id="edit-user-role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="userUpdateInput"
                      >
                        <option value="">Keep current role</option>
                        {availableRoles.map((role) => (
                          <option value={role} key={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="userUpdateRight">
                  <button
                    className="userUpdateButton"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <p>This account cannot be updated by your role.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
