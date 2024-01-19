// Sidebar.jsx
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../style/sidebar.css";
import { CFormSelect } from "@coreui/react";

const Sidebar = () => {
  const [isExpanded, setExpanded] = useState(false); // Set initial state to false
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!isExpanded);
    setShowDropdown(false);
  };

  return (
    <div className="side">
      <div className={`sidebar ${isExpanded ? "expanded" : "minimized"}`}>
        <div className="toggle-container">
          {isExpanded && <span className="text">Tasks</span>}
          <button className="toggle-button" onClick={toggleSidebar}>
            {isExpanded ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
        {isExpanded && (
          <div className="dropdown">
            <CFormSelect
              size="sm"
              className="mb-3"
              aria-label="select"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <option>All Open</option>
              <option value="2">Claim</option>
              <option value="3">UnClaim</option>
              <option value="4">Complete</option>
            </CFormSelect>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
