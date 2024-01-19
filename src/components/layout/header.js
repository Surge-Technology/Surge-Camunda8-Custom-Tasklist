import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilAccountLogout } from "@coreui/icons";
import { CAvatar } from "@coreui/react";
import "../style/header.css";

const Header = () => {
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutButton(!showLogoutButton); // Toggle the visibility
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <header className="navbar navbar-dark bg-light ">
        <div className="heading">
          <Link className="nav-link">
            <CAvatar color="secondary" size="lg">
              C
            </CAvatar>
            <span className="spacer"></span>
            Surge Tasklist
          </Link>
        </div>

        
        <div className="navbar navbar-dark bg-light mr-4">
          <button className="name" onClick={handleLogoutClick}>
            <div className="Assigne-name ">
              demo
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
