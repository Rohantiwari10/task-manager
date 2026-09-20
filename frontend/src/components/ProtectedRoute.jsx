import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // React-side protection for authenticated pages
  const token = localStorage.getItem("token");

  // No token → send user to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Token exists → allow access
  return children;
};

export default ProtectedRoute;