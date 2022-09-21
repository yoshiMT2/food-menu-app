import React from "react";
import { UseUserDetails } from "../context/UserContext";
import { Navigate } from "react-router-dom";

function HomePage() {
  const [userDetails, setUserDetails] = UseUserDetails();

  if (!userDetails?.key) {
    return <Navigate to='/login' />
  }
  return (
    <div className="container m-10 text-center text-primary hover:text-black font-bold text-5xl">
      Landing Page
    </div>
  );
}
export default HomePage;
