import { useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";
const Login = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const {login} =useAuth();
    const [formData,setFormData] = useState({
        email: location.state?.email || "",
        password:"",
        tenantSubdomain: location.state?.subdomain || "",
    });
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

      const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setError(""),
    setLoading(true);

    const toastId = toast.loading("Signing in...");

    try{
        await login(
            formData.email.trim(),
            formData.password,
            formData.tenantSubdomain.trim()
        );
        toast.success("Welcome Back !",{id:toastId});
        navigate("/dashboard",{replace:true});
    }catch(err){
        const message = 
        err.response?.data?.message ||
        err.message ||
        "Unable to Sign In. Please Check your credentials. ";
        setError(message);
        toast.error(message,{id:toastId});
    }finally{
        setLoading(false);
    }
  };
  return(
    <div className="auth-page">
        <motion.div
        className="auth-container"
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.45}}
        >
            <div className="auth-card">
                <div className="auth-gradient-bar"/>
               <div className="auth-content">
                <div className="auth-heading">
                    <div className="auth-logo">
                        <LogIn size={30} />
                        </div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your organization account</p>
                        </div>
                        {error && (
                            <div className="auth-error" role="alert">
                                {error}
                            </div>
                        )}
                        <form className="auth-form"
                        onSubmit={handleSubmit} >
                            <div className="auth-form-group">
                                <label className="auth-label" htmlFor="login-email" >
                                    Email Address
                                </label>
                                <input 
                                id="login-email"
                                className="auth-input"
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email" required />
                            </div>
                            <div className="auth-form-group">
                                <label className="auth-label" htmlFor="login-password">
                                    Password
                                </label>
                                <input id="login-password"
                                className="auth-input"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password" required 
                                />
                            </div>
                            <div className="auth-form-group">
                                <label htmlFor="login-subdomain" className="auth-label">
                                    Organization Sub-Domain
                                </label>
                                <input id="login-subdomain"
                                className="auth-input"
                                type="text"
                                name="tenantSubdomain"
                                placeholder="e.g. acme" 
                                value={formData.tenantSubdomain}
                                onChange={handleChange}
                                autoComplete="organization" required/>
                            </div>
                            <div className="auth-submit">
                                <button type="submit" disabled={loading}>
                                    {loading ?(
         <span className="auth-loading" >
            <span className="auth-spinner" />
            Signing In
         </span>
         ):(
            <span className="auth-button-content" >
                <LogIn size={20} />
                Sign In </span>
         )}
                                </button>
                            </div>
                        </form>
                        <div className="auth-footer">
                            <p>Don't have an organization ?{""} 
                                <Link to="/register" >
                            Register your company
                            </Link>
                             </p>
                        </div>
                        </div>                         
                         </div>
                         <div className="auth-floating auth-floating-one"/>
                         <div className="auth-floating auth-floating-two"/>
        </motion.div>

    </div>
  );
};

export default Login;
