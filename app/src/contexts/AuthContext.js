import { createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "./../utils/auth";
import { verifyToken } from "./../api/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null, loading: true });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null, loading: false });
    navigate("/login");
  };

  const loginUser = (token) => {
    const user = decodeToken(token);
    localStorage.setItem("token", token);
    setAuth({ user, token, loading: false });

    if (user.role === "student") navigate("/student/dashboard");
    else if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "club") navigate("/club/dashboard");
    else if (user.role === "council") navigate("/council/dashboard");
    else if (user.role === "guest") navigate("/guest/dashboard");
    else navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth({ user: null, token: null, loading: false });
      return;
    }
    verifyToken().then((result) => {
        if (!result.valid) {
          console.warn("Token invalid or expired:", result.reason);
          logout();
        } else {
          const user = decodeToken(token);
          setAuth({ user, token, loading: false });
        }
      }).catch(() => {
        logout();
      });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);