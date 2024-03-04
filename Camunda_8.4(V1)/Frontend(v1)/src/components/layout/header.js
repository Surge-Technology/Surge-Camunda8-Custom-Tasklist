import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../style/header.css";
import icons from "../images/2logo.jpg";
const Header = () => {
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutButton(!showLogoutButton); 
  };
  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setShowLogoutButton(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div>
      <header className="navbar navbar-dark bg-light ">
      
        <div className="heading">
          <Link className="nav-link" style={{marginLeft:"8px",color: "rgb(98, 98, 110)",fontSize: "16px",
          fontWeight: "500"}}>
           
            <img src={icons} alt="My Icon" />
            <span className="spacer" ></span>
             Tasklist
          </Link>
        </div>

        
        <div className="navbar navbar-dark bg-light mr-4">
          <button className="name" ref={buttonRef} onClick={handleLogoutClick}>
            <div className="Assigne-name ">
            {username}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </button>
          {showLogoutButton && (
            <ul className="listing-down">
              <li className="clickOpt">
                <button className="logbutton"
                onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      </header>
      
    </div>
  );
};

export default Header;
