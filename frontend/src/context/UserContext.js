import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../utils/AuthService";
import LoginPage from "../pages/LoginPage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let currentUser = isAuthenticated();
      if (currentUser === null) {
        localStorage.setItem("user", "");
        currentUser = "";
      }

      setUser(currentUser);
    };

    checkLoggedIn();
  }, []);

  console.log("usercontext", user);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {user?.key ? children : <LoginPage />}
    </UserContext.Provider>
  );
};

export default UserContext;
