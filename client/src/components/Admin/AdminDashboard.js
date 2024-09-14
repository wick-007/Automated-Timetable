import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus, faCogs, faSignOutAlt, faChartPie, faChalkboardTeacher, faBook, faClock, faClipboardList, faUsers, faBuilding, faExclamationTriangle, faEnvelopeOpenText, faTable } from '@fortawesome/free-solid-svg-icons';
import Classrooms from './Classrooms';
import Courses from './Courses';
import Lecturers from './Lecturers';
import TimetableGeneration from './TimetableGeneration';
import ConflictReports from './ConflictReports';
import LecturerPreferences from './LecturerPreferences';
import GeneratedTimetable from './GeneratedTimetable';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'classrooms':
        return <Classrooms setMessage={setMessage} />;
      case 'courses':
        return <Courses setMessage={setMessage} />;
      case 'lecturers':
        return <Lecturers setMessage={setMessage} />;
      case 'timetable':
        return <TimetableGeneration setMessage={setMessage} />;
      case 'conflictReports':
        return <ConflictReports />;
      case 'lecturerPreferences':
        return <LecturerPreferences />;
      case 'generatedTimetable':
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
          <button onClick={() => setActiveComponent('courses')}>Manage Courses</button>
        </div>
        <div className="stat-box">
          <h3>Allocated Lecturers</h3>
          <button onClick={() => setActiveComponent('lecturers')}>Manage Lecturers</button>
        </div>
        <div className="stat-box">
          <h3>Available Classrooms</h3>
          <button onClick={() => setActiveComponent('classrooms')}>Manage Classrooms</button>
        </div>
        <div className="stat-box">
          <h3>Timetable Generation</h3>
          <button onClick={() => setActiveComponent('timetable')}>Generate Timetable</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo">
          <img src="/UMaT_logo.jpg" alt="UMaT Logo" />
        </div>
        <ul>
          <li onClick={() => setActiveComponent('dashboard')}><FontAwesomeIcon icon={faChartPie} /><span>Dashboard</span></li>
          <li onClick={() => setActiveComponent('courses')}><FontAwesomeIcon icon={faBook} /><span>Courses</span></li>
          <li onClick={() => setActiveComponent('lecturers')}><FontAwesomeIcon icon={faChalkboardTeacher} /><span>Lecturers</span></li>
          <li onClick={() => setActiveComponent('classrooms')}><FontAwesomeIcon icon={faBuilding} /><span>Classrooms</span></li>
          <li onClick={() => setActiveComponent('timetable')}><FontAwesomeIcon icon={faClock} /><span>Timetable Generation</span></li>
          <li onClick={() => setActiveComponent('conflictReports')}><FontAwesomeIcon icon={faExclamationTriangle} /><span>Conflict Reports</span></li>
          <li onClick={() => setActiveComponent('lecturerPreferences')}><FontAwesomeIcon icon={faEnvelopeOpenText} /><span>Lecturer Preferences</span></li>
          <li onClick={() => setActiveComponent('generatedTimetable')}><FontAwesomeIcon icon={faTable} /><span>Generated Timetable</span></li>
          <li className="settings"><FontAwesomeIcon icon={faCogs} /><span>Settings</span></li>
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /><span>Logout</span></li>
        </ul>
      </div>
      <div className="content">
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="profile">
            <img src="/profile.jpg" alt="Admin Profile" />
            <span>Admin Name</span>
            <FontAwesomeIcon icon={faBell} />
          </div>
        </div>
        <div className="main-content">
          {message && <div className={`message ${message.type}`}>{message.text}</div>}
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
