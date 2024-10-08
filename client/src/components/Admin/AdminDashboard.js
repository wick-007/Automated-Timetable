import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import '../../styles/sidebar.styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Classrooms from "./Classrooms";
import Courses from "./Courses";
import Lecturers from "./Lecturers";
import TimetableGeneration from "./TimetableGeneration";
import ConflictReports from "./ConflictReports";
import LecturerPreferences from "./LecturerPreferences";
import GeneratedTimetable from "./GeneratedTimetable";
import { componentsData } from "../../lib/data";
import HeaderImage from "../headerImage";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "classrooms":
        return <Classrooms setMessage={setMessage} />;
      case "courses":
        return <Courses setMessage={setMessage} />;
      case "lecturers":
        return <Lecturers setMessage={setMessage} />;
      case "timetable":
        return <TimetableGeneration setMessage={setMessage} />;
      case "conflictReports":
        return <ConflictReports />;
      case "lecturerPreferences":
        return <LecturerPreferences />;
      case "generatedTimetable":
        return <GeneratedTimetable />;
      default:
        return <Dashboard />;
    }
  };

  const Dashboard = () => (
    <div className="dashboard-content">
      <h2>Welcome to the Admin Dashboard</h2>
      <div className="stats">
        <div className="stat-box">
          <h3>Active Courses</h3>
          <button onClick={() => setActiveComponent("courses")}>
            Manage Courses
          </button>
        </div>
        <div className="stat-box">
          <h3>Allocated Lecturers</h3>
          <button onClick={() => setActiveComponent("lecturers")}>
            Manage Lecturers
          </button>
        </div>
        <div className="stat-box">
          <h3>Available Classrooms</h3>
          <button onClick={() => setActiveComponent("classrooms")}>
            Manage Classrooms
          </button>
        </div>
        <div className="stat-box">
          <h3>Timetable Generation</h3>
          <button onClick={() => setActiveComponent("timetable")}>
            Generate Timetable
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <HeaderImage />
        <ul>
          {componentsData.map(({ label, icon: iconName, name }, index) => (
            <li
              key={index}
              onClick={
                name === "logout"
                  ? () => handleLogout()
                  : name === "settings"
                  ? undefined
                  : () => setActiveComponent(name)
              }
            >
              <FontAwesomeIcon icon={iconName}  style={{ marginRight: 10}}/>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="profile">
            <HeaderImage type={'raw'}/>
            <span>Admin Name</span>
            <FontAwesomeIcon icon={faBell} />
          </div>
        </div>
        <div className="main-content">
          {message && (
            <div className={`__message__container ${message.type}`}>
              <div className={`message `}>{message.text}</div>
              <FontAwesomeIcon icon={faTimes} className="__message__icon" onClick={() => setMessage(null)}/>
            </div>
          )}
          {renderComponent()}
        </div>
        <div className="footer">
          <p>&copy; 2024 UMaT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
