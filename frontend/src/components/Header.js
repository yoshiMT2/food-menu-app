import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Button from "./Button";

const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const cuser = localStorage.getItem("user");
  const username = JSON.parse(cuser)["user"]["name"];
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate("/login");
  };

  return (
    <nav className="p-2 bg-indigo-700">
      <div className="container px-4 mx-5 flex flex-wrap items-center justify-between">
        <a
          className="text-sm font-bold leading-relaxed uppercase text-white"
          href="/"
        >
          Flimapp
        </a>
        <p>{username}</p>
        <button
						type='button'
						onClick={logoutHandler}
					>
						Log out
					</button>
      </div>
    </nav>
  );
};

export default Navbar;
