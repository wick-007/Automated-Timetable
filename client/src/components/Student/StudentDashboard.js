import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'jspdf-autotable'; 
import './StudentDashboard.css';
import '../../styles/sidebar.styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBook, faCalendarAlt, faBell, faCog, faSignOutAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import 'react-calendar/dist/Calendar.css';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TimetableButtons from '../timetableButtons';
import AnalyticsCalendar from '../calendar';
import HeaderImage from '../headerImage';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [conflict, setConflict] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/timetable');
        setTimetable(data);
      } catch (error) {
        console.error('Error fetching timetable', error);
      }
    };

    fetchTimetable();
  }, []);

  useEffect(() => {
    const updateUpcomingClasses = () => {
      const classesForDay = timetable.filter(entry => entry.day === selectedDay);
      setUpcomingClasses(classesForDay);
    };

    updateUpcomingClasses();
  }, [timetable, selectedDay]);

  const handleLogout = () => navigate('/');

  const renderComponent = () => {
    const components = {
      myClasses: () => <div className="my-classes"><h2>My Classes</h2></div>,
      timetable: () => (
        <div className="timetable">
          <TimetableButtons timetable={timetable} selectedDay={selectedDay}/>
          <div className="day-selector">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={selectedDay === day ? 'active' : ''}
              >
                {day}
              </button>
            ))}
          </div>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Classroom</th>
                <th>Time</th>
                <th>Course (Code)</th>
                <th>Lecturer</th>
              </tr>
            </thead>
            <tbody>
              {timetable.filter(entry => entry.day === selectedDay).flatMap(entry => 
                entry.entries.map((e, i) => (
                  <tr key={i}>
                    <td>{e.classroom.name}</td>
                    <td>{`${entry.time} - ${entry.endTime}`}</td>
                    <td>{`${e.course.name} (${e.course.code})`}</td>
                    <td>{e.lecturer.name || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ),
      notifications: () => <div className="notifications"><h2>Notifications</h2></div>,
      preferences: () => <div className="preferences"><h2>Preferences</h2></div>,
      settings: () => <div className="settings"><h2>Settings</h2></div>,
      conflicts: () => (
        <div className="conflict-form">
          <h2>Report Conflict</h2>
          <form>
            <textarea
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              placeholder="Describe the conflict"
              required
            />
            <button type="submit">Report</button>
          </form>
        </div>
      ),
      dashboard: () => <div className="dashboard-content"><h2>Welcome Selby</h2></div>,
    };

    return components[activeComponent] ? components[activeComponent]() : components.dashboard();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hoursData = days.map(day => {
    const dayEntries = timetable.filter(entry => entry.day === day);
    return dayEntries.reduce((total, entry) => total + entry.entries.reduce((sum, e) => sum + entry.duration, 0), 0);
  });

  const dayBarChartData = {
    labels: days,
    datasets: [
      {
        label: 'Hours per Day',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: hoursData
      }
    ]
  };

  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <HeaderImage />
        <ul>
          {['dashboard', 'myClasses', 'timetable', 'notifications', 'preferences', 'settings'].map(item => (
            <li key={item} onClick={() => setActiveComponent(item)}>
              <FontAwesomeIcon icon={{ dashboard: faTachometerAlt, myClasses: faBook, timetable: faCalendarAlt, notifications: faBell, preferences: faClock, settings: faCog }[item]} style={{ marginRight: 10}}/> {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </li>
          ))}
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 10}}/> Logout</li>
        </ul>
      </div>
      <main className="content">
        <header>
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="profile">
            <span className="profile-name">Selby</span>
            <span className="notification-bell">🔔</span>
          </div>
        </header>
        <div className="main-content">
          {renderComponent()}
        </div>
        
        <AnalyticsCalendar upcomingClasses={upcomingClasses} setSelectedDay={setSelectedDay}/>
        <div className="graphs">
          <div className="graph-container">
            <Bar data={dayBarChartData} />
          </div>
          <div className="assignments">
            <h3>Assignments</h3>
            <p>No assignments due.</p>
          </div>
        </div>

        <footer className="footer">
          <p>&copy; 2024 UMaT. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default StudentDashboard;
