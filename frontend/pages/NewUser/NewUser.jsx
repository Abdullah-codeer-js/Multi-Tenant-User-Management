import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import "./NewUser.css";

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Request failed.";
}

export default function NewUser() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const availableRoles =
    user?.role === "Admin" ? ["Manager", "Employee"] : ["Employee"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/users", {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      toast.success("User created.");
      navigate("/users");
    } catch (requestError) {
      const message = getErrorMessage(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="newUserBackButton"
      >
        Back to Dashboard
      </button>

      {error && <p role="alert">{error}</p>}
      <form className="newUserForm" onSubmit={handleSubmit}>
        <div className="newUserItem">
          <label htmlFor="new-user-name">Name</label>
          <input
            id="new-user-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

        <div className="newUserItem">
          <label htmlFor="new-user-email">Email</label>
          <input
            id="new-user-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="newUserItem">
          <label htmlFor="new-user-password">Password</label>
          <input
            id="new-user-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div className="newUserItem">
          <label htmlFor="new-user-role">Role</label>
          <select
            className="newUserSelect"
            id="new-user-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="newUserButton" disabled={saving}>
          {saving ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
