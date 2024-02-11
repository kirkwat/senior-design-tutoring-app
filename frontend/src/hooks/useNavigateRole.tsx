import { useNavigate } from "react-router-dom";

import useAuth from "./useAuth";

const userRoleRoutes = {
  admin: "admin",
  user: "dashboard",
  tutor: "tutor",
};

export const useNavigateRole = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const navigateByRole = (role?: "admin" | "tutor" | "user") => {
    const route = role || (auth?.role ? userRoleRoutes[auth.role] : "");
    navigate(`/${route}`, { replace: true });
  };

  return navigateByRole;
};
