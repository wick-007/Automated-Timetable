import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable'; // Import for table generation in PDF
import './StudentDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBook, faCalendarAlt, faBell, faCog, faSignOutAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register necessary Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [conflict, setConflict] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimetable();
  }, []);

  useEffect(() => {
    updateUpcomingClasses(selectedDay);
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

  const updateUpcomingClasses = (day) => {
    const classesForDay = timetable.filter(entry => entry.day === day);
    setUpcomingClasses(classesForDay);
  };

  // New function to handle PDF printing
  const printTimetable = () => {
    const doc = new jsPDF();
    const columns = ['Time', 'Classroom', 'Course', 'Lecturer']; // Column headers for the PDF table
    const rows = [];

    timetable
      .filter(entry => entry.day === selectedDay)
      .forEach(entry => {
        entry.entries.forEach(e => {
          rows.push([entry.time, e.classroom.name, e.course.name, e.lecturer.name]);
        });
      });

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save(`Timetable_${selectedDay}.pdf`);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'myClasses':
        return <MyClasses />;
      case 'timetable':
        return renderTimetable();
      case 'notifications':
        return <Notifications />;
      case 'preferences':
        return <Preferences />;
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
      <h2>Welcome Selby</h2>
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

  const renderConflictForm = () => (
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
  );

 
  const renderTimetableForDay = (day) => {
    const dayEntries = timetable.filter(entry => entry.day === day);
  
    // Get a list of unique classrooms
    const classrooms = [...new Set(dayEntries.flatMap(entry => entry.entries.map(e => e.classroom?.name || 'N/A')))];
    
    return (
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
          {classrooms.map((classroom, index) => (
            <React.Fragment key={index}>
              {dayEntries
                .filter(entry => entry.entries.some(e => e.classroom?.name === classroom))
                .map((entry, i) => {
                  const [startHour, startMinute] = entry.time.split(':').map(Number);
                  const endHour = startHour + entry.duration; // Calculate end time based on duration
                  const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
                  const classroomEntries = entry.entries.filter(e => e.classroom?.name === classroom);
  
                  return classroomEntries.map((en, j) => (
                    <tr key={j}>
                      {j === 0 && <td rowSpan={classroomEntries.length}>{classroom}</td>} {/* Display classroom only once per group */}
                      <td>{`${entry.time} - ${endTime}`}</td>
                      <td>{`${en.course?.name} (${en.course?.code})`}</td>
                      <td>{en.lecturer?.name || 'N/A'}</td>
                    </tr>
                  ));
                })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };
  
//CHANGES TO MAKE TO TEACHER DASHBOARD FOR PRINTING PDF STARTS HERE!!!!, THE BUTTONS AND THE FUNCTIONS
  const renderTimetable = () => (
    <div className="timetable">
      {/* <h2>Timetable</h2> */}
      <div className='__btn__container'><div className='__print__btn__container'>
        <button onClick={exportSelctedDayToExcel} className="__export__btn" style={{ marginRight: 10}}>Export Timetable For Selected Day</button> 
        <button onClick={exportAllDaysToExcel} className="__export__btn">Export Full Timetable</button>
      </div>
      <div className='__print__btn__container'>
        <button onClick={printTimetableForSelectedDay} className="print-button" style={{ marginRight: 10}}>Print Timetable for Selected Day</button> 
        <button onClick={printWholeTimetable} className="print-button">Print Full Timetable</button>
      </div></div>
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
      {renderTimetableForDay(selectedDay)}
    </div>
  );

  const printTimetableForSelectedDay = () => {
    const doc = new jsPDF();
    const columns = ['Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration']; // Added Duration
    const rows = [];
  
    timetable
      .filter(entry => entry.day === selectedDay)
      .forEach(entry => {
        entry.entries.forEach(e => {
          const [startHour, startMinute] = entry.time.split(':').map(Number);
          const endHour = startHour + entry.duration; // Calculate end time based on duration
          const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
          rows.push([`${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]); // Include duration
        });
      });
  
    doc.autoTable({
      head: [columns],
      body: rows,
    });
  
    doc.save(`Timetable_${selectedDay}.pdf`);
  };
  const printWholeTimetable = () => {
    const doc = new jsPDF();
    const columns = ['Day', 'Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration']; // Added Duration
    const rows = [];
  
    timetable.forEach(entry => {
      entry.entries.forEach(e => {
        const [startHour, startMinute] = entry.time.split(':').map(Number);
        const endHour = startHour + entry.duration; // Calculate end time based on duration
        const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        rows.push([entry.day, `${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]); // Include duration
      });
    });
  
    doc.autoTable({
      head: [columns],
      body: rows,
    });
  
    doc.save('Full_Timetable.pdf');
  };

  const exportSelctedDayToExcel = async () => {
    const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.19.2/package/xlsx.mjs");
  
    // Prepare the data
    const columns = ['Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration'];
    const rows = [];
  
    timetable
      .filter(entry => entry.day === selectedDay)
      .forEach(entry => {
        entry.entries.forEach(e => {
          const [startHour, startMinute] = entry.time.split(':').map(Number);
          const endHour = startHour + entry.duration; // Calculate end time based on duration
          const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
          rows.push([`${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]);
        });
      });
  
    // Convert rows to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
      // Set column widths
  const colWidths = [
    { width: 20 }, // Width for 'Time'
    { width: 20 }, // Width for 'Classroom'
    { width: 15 }, // Width for 'Course Code'
    { width: 30 }, // Width for 'Lecturer'
    { width: 15 }  // Width for 'Duration'
  ];
  worksheet['!cols'] = colWidths;
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedDay);
  
    // Write the workbook to a file
    XLSX.writeFile(workbook, `Timetable_${selectedDay}.xlsx`, { compression: true });
  };

  const exportAllDaysToExcel = async () => {
    const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.19.2/package/xlsx.mjs");
  
    // Prepare the workbook
    const workbook = XLSX.utils.book_new();
  
    // Get unique days from the timetable
    const days = [...new Set(timetable.map(entry => entry.day))];
  
    // Loop through each day and prepare the worksheet
    days.forEach(day => {
      const columns = ['Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration'];
      const rows = [];
  
      timetable
        .filter(entry => entry.day === day)
        .forEach(entry => {
          entry.entries.forEach(e => {
            const [startHour, startMinute] = entry.time.split(':').map(Number);
            const endHour = startHour + entry.duration; // Calculate end time based on duration
            const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            rows.push([`${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]);
          });
        });
  
      // Convert rows to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
  
      // Set column widths
      const colWidths = [
        { width: 20 }, // Width for 'Time'
        { width: 20 }, // Width for 'Classroom'
        { width: 15 }, // Width for 'Course Code'
        { width: 30 }, // Width for 'Lecturer'
        { width: 15 }  // Width for 'Duration'
      ];
      worksheet['!cols'] = colWidths;
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, day);
    });
  
    // Write the workbook to a file
    XLSX.writeFile(workbook, 'Timetable_All_Days.xlsx', { compression: true });
  };
  

  // Define the days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Calculate hours per day based on timetable data
  const hoursData = days.map(day => {
    const dayEntries = timetable.filter(entry => entry.day === day);
    return dayEntries.reduce((total, entry) => total + entry.entries.reduce((sum, e) => sum + entry.duration, 0), 0);
  });

  // Prepare day bar chart data
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
      <aside className="menu">
        <img src="/umat_logo.png" alt="UMaT Logo" className="logo" />
        <ul>
          <li onClick={() => setActiveComponent('dashboard')}><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</li>
          <li onClick={() => setActiveComponent('myClasses')}><FontAwesomeIcon icon={faBook} /> My Classes</li>
          <li onClick={() => setActiveComponent('timetable')}><FontAwesomeIcon icon={faCalendarAlt} /> Timetable</li>
          <li onClick={() => setActiveComponent('notifications')}><FontAwesomeIcon icon={faBell} /> Notifications</li>
          <li onClick={() => setActiveComponent('preferences')}><FontAwesomeIcon icon={faClock} /> Preferences</li>
          <li className="menu-spacing"></li>
          <li onClick={() => setActiveComponent('settings')}><FontAwesomeIcon icon={faCog} /> Settings</li>
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</li>
        </ul>
      </aside>
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
        <div className="upcoming-classes-container">
          <div className="upcoming-classes">
            <h3>Upcoming Classes</h3>
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((entry, index) => (
                <div key={index} className="upcoming-class">
                  {entry.entries.map(e => (
                    <div key={e._id}>
                      <p>{e.course.name}</p>
                      <p>{entry.time} - {entry.duration} hour(s)</p>
                      <p>{e.classroom.name}</p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No upcoming classes for today</p>
            )}
          </div>
          <div className="assignments">
            <h3>Assignments</h3>
            <p>No assignments due.</p>
          </div>
          <div className="calendar-container">
            <h3>Calendar</h3>
            <Calendar
              value={new Date()}
              onClickDay={(value) => setSelectedDay(value.toLocaleDateString('en-US', { weekday: 'long' }))}
            />
          </div>
        </div>
        <footer className="footer">
          <p>&copy; 2024 UMaT. All rights reserved.</p>
        </footer>
        <div className="graphs">
          <div className="graph-container">
            <Bar data={dayBarChartData} /> {/* Render bar chart */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
