import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'jspdf-autotable'; // Import for tables in jsPDF
import './TeacherDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBook, faCalendarAlt, faBell, faCog, faSignOutAlt, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import 'react-calendar/dist/Calendar.css';
import GeneratedTimetable from './GeneratedTimetable';
import AnalyticsCalendar from '../calendar';
import HeaderImage from '../headerImage';

const TeacherDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [preferences, setPreferences] = useState('');
  const [conflict, setConflict] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimetable();
  }, []);

  useEffect(() => {
    const updateUpcomingClasses = () => {
      const classesForDay = timetable.filter(entry => entry.day === selectedDay);
      setUpcomingClasses(classesForDay);
    };

    updateUpcomingClasses();
  }, [timetable, selectedDay]);

  const fetchTimetable = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/timetable');
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable', error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/preferences', { preferences });
      alert('Preferences sent successfully');
      setPreferences('');
    } catch (error) {
      console.error('Error sending preferences', error);
    }
  };

  const handleConflictSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/conflict-reports', { conflict });
      alert('Conflict reported successfully');
      setConflict('');
    } catch (error) {
      console.error('Error reporting conflict', error);
    }
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleConvenient = async () => {
    try {
      await axios.post('http://localhost:5001/api/schedule-preferences', {
        scheduleId: selectedSchedule?._id,
        status: 'convenient'
      });
      alert('Marked as convenient');
      setShowModal(false);
    } catch (error) {
      console.error('Error marking schedule', error);
    }
  };

  const handleInconvenient = async () => {
    try {
      await axios.post('http://localhost:5001/api/schedule-preferences', {
        scheduleId: selectedSchedule?._id,
        status: 'inconvenient'
      });
      alert('Marked as inconvenient');
      setShowModal(false);
    } catch (error) {
      console.error('Error marking schedule', error);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'myClasses':
        return <MyClasses />;
      case 'timetable':
        return (
          <GeneratedTimetable 
            timetable={timetable}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            handleScheduleClick={handleScheduleClick}
          />
        );
      case 'notifications':
        return <Notifications />;
      case 'preferences':
        return renderPreferencesForm();
      case 'conflicts':
        return renderConflictForm();
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const Dashboard = () => (
    <div className="dashboard-content">
      <h2>Welcome to the Teacher Dashboard</h2>
    </div>
  );

  const MyClasses = () => (
    <div className="my-classes">
      <h2>My Classes</h2>
    </div>
  );

  const Notifications = () => (
    <div className="notifications">
      <h2>Notifications</h2>
    </div>
  );

  const Preferences = () => (
    <div className="preferences">
      <h2>Preferences</h2>
    </div>
  );

  const Settings = () => (
    <div className="settings">
      <h2>Settings</h2>
    </div>
  );

  const renderPreferencesForm = () => (
    <div className="preferences-form">
      <h2>Send Preferences</h2>
      <form onSubmit={handlePreferencesSubmit}>
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Enter your preferences"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );

  const renderConflictForm = () => (
    <div className="conflict-form">
      <h2>Report Conflict</h2>
      <form onSubmit={handleConflictSubmit}>
        <textarea
          value={conflict}
          onChange={(e) => setConflict(e.target.value)}
          placeholder="Describe the conflict"
          required
        />
        <button type="submit">Report</button>
      </form>
    </div>
  );

  return (
    <div className="teacher-dashboard">
      <div className="sidebar">
        <HeaderImage />
        <ul>
          <li onClick={() => setActiveComponent('dashboard')}><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</li>
          <li onClick={() => setActiveComponent('myClasses')}><FontAwesomeIcon icon={faBook} /> My Classes</li>
          <li onClick={() => setActiveComponent('timetable')}><FontAwesomeIcon icon={faCalendarAlt} /> Timetable</li>
          <li onClick={() => setActiveComponent('notifications')}><FontAwesomeIcon icon={faBell} /> Notifications</li>
          <li onClick={() => setActiveComponent('preferences')}><FontAwesomeIcon icon={faPaperPlane} /> Preferences</li>
          <li onClick={() => setActiveComponent('conflicts')}><FontAwesomeIcon icon={faBell} /> Report Conflict</li>
          <li className="menu-spacing"></li>
          <li onClick={() => setActiveComponent('settings')}><FontAwesomeIcon icon={faCog} /> Settings</li>
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</li>
        </ul>
      </div>
      <main className="content">
        <header>
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="profile">
            <img src="/teacher_profile.jpg" alt="Teacher Profile" className="profile-photo" />
            <span className="profile-name">Teacher Name</span>
            <span className="notification-bell">🔔</span>
          </div>
        </header>
        <div className="main-content">
          {renderComponent()}
        </div>
        <AnalyticsCalendar upcomingClasses={upcomingClasses} setSelectedDay={setSelectedDay}/>
        <footer className="footer">
          <p>&copy; 2024 UMaT. All rights reserved.</p>
        </footer>
      </main>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Mark Schedule</h2>
            <p>{selectedSchedule?.course?.name} ({selectedSchedule?.course?.code}) - {selectedSchedule?.lecturer?.name}</p>
            <button onClick={handleConvenient}>Convenient</button>
            <button onClick={handleInconvenient}>Inconvenient</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
