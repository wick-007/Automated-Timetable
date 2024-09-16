import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GeneratedTimetable.css';
import TimetableButtons from '../timetableButtons';

const GeneratedTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/timetable');
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching timetable', error);
    }
  };

  const renderTimetableForDay = (day) => {
    const dayEntries = timetable.filter(entry => entry.day === day);

    // Get a list of unique classrooms
    const classrooms = [...new Set(dayEntries.flatMap(entry => entry.entries.map(e => e.classroom?.name || 'N/A')))];
    
    // Generate timetable rows for each classroom
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

  return (
    <div className="generated-timetable">
      <h2>Generated Timetable</h2>
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
      {timetable.length > 0 ? renderTimetableForDay(selectedDay) : <p>No timetable generated</p>}
    </div>
  );
};

export default GeneratedTimetable;
