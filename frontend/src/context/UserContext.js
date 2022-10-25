import React, { createContext, useState, useMemo, useContext } from "react";
import { isAuthenticated } from "../utils/AuthService";
import LoginPage from "../pages/LoginPage";

const UserContext = createContext();

export function UseUserDetails () {
  const context = useContext(UserContext)
  return context
}
export function UserProvider({ children }) {
  const userFromStrage = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : undefined;

  const [userDetails, setUserDetails] = useState({ ...userFromStrage });

  const value = useMemo(() => {
    function updateuserDetails() {
      setUserDetails(userFromStrage);
    }
    return [{ ...userDetails }, updateuserDetails];
  }, [userDetails]);
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
