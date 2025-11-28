import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = {
    name: "Aparna",
  };
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };
  return (
    <div>
      <Link>
        <img src="" alt="" />
      </Link>
      <div className="flex ">
        <p>Hii {user?.name}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
