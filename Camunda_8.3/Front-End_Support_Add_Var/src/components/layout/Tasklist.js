// TasklistPage.jsx
import React from "react";
import Header from "./header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Tasklist= () => {
  return (
    <div>
      <Header />
      <Sidebar />
     
      <div className="Notification-container">
       
      </div>
      <Footer />
    </div>
  );
};

export default Tasklist;
