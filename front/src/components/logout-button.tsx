import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children }: any) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
  };
  return (
    <button className=" flex items-center" onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
