// TasklistPage.jsx
import React from "react";
import Header from "./header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MainContent from "./MainContent";

const Tasklist= () => {
  return (
    <div>
      <Header />
      <MainContent/>
      <div className="Notification-container">
       
      </div>
      <Footer />
    </div>
  );
};

export default Tasklist;
