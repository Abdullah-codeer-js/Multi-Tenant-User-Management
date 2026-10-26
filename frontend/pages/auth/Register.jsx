
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    subdomain: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "subdomain"
          ? value.toLowerCase().replace(/[^a-z0-9-]/g, "")
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(formData.subdomain)) {
      setError("Enter a valid organization subdomain.");
      toast.error("Enter a valid organization subdomain.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your organization...");

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        subdomain: formData.subdomain.trim(),
        fullName: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        passwordConfirmation: formData.confirmPassword,
      };

      const response = await api.post("/auth/register", payload);

      toast.success(
        response.data.message || "Registration successful!",
        { id: toastId }
      );

      navigate("/login", {
        replace: true,
        state: { email: payload.email, subdomain: payload.subdomain },
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container auth-container-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="auth-card">
          <div className="auth-gradient-bar" />

          <div className="auth-content">
            <div className="auth-heading">
              <div className="auth-logo">
                <UserPlus size={30} />
              </div>

              <h1>Create Organization</h1>
              <p>
                Register your company and create its administrator account.
              </p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  id="companyName"
                  className="auth-input"
                  type="text"
                  name="companyName"
                  placeholder="e.g. Acme Technologies"
                  value={formData.companyName}
                  onChange={handleChange}
                  maxLength={150}
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="subdomain">
                  Organization Subdomain
                </label>
                <input
                  id="subdomain"
                  className="auth-input"
                  type="text"
                  name="subdomain"
                  placeholder="e.g. acme"
                  value={formData.subdomain}
                  onChange={handleChange}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  title="Use lowercase letters, numbers, and internal hyphens."
                  maxLength={63}
                  autoComplete="off"
                  required
                />
                <small>
                  Use lowercase letters, numbers, and hyphens.
                </small>
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="name">
                  Admin Name
                </label>
                <input
                  id="name"
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="email">
                  Admin Email
                </label>
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label
                  className="auth-label"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  className="auth-input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="auth-submit">
                <button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="auth-loading">
                      <span className="auth-spinner" />
                      Creating organization...
                    </span>
                  ) : (
                    <span className="auth-button-content">
                      <Building size={20} />
                      Register Organization
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-floating auth-floating-one" />
        <div className="auth-floating auth-floating-two" />
      </motion.div>
    </div>
  );
};

export default Register;
