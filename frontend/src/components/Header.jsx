import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseUserDetails } from "../context/UserContext";

const Navbar = () => {
  const [userDetails, setUserDetails] = UseUserDetails();
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut ] = useState(false)

  useEffect(() => {
    if(isLoggedOut){
      navigate('/login');
      window.location.reload(false)
    }
  }, [userDetails])

  const logoutHandler = () => {
    localStorage.removeItem("userDetails");
    setUserDetails({});
    setIsLoggedOut(true)
  };


  const logoutButton = () => {
    if (userDetails?.key) {
      return (
        <button
          type="button"
          onClick={logoutHandler}
          className="block px-2 text-white rounded-md hover:bg-indigo-600 disabled:text-transparent"
        >
          Logout
        </button>
      );
    } else {
        return null
    }
  };

  return (
    <nav className="p-2 bg-indigo-700 sticky top-0 z-50">
      <div className="container px-4 mx-5 flex flex-wrap items-center justify-between">
        <a
          className="text-sm font-bold leading-relaxed uppercase text-white"
          href="/"
        >
          Flimapp
        </a>
        {logoutButton()}
      </div>
    </nav>
  );
};

export default Navbar;
