import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimetableGeneration.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const TimetableGeneration = ({ setMessage }) => {
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('06:00');
  const [duration, setDuration] = useState(1);
  const [schedules, setSchedules] = useState([{ course: '', lecturer: '', classroom: '' }]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      // Create an array of promises
      const [coursesResponse, lecturersResponse, classroomsResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/courses'),
        axios.get('http://localhost:5001/api/lecturers'),
        axios.get('http://localhost:5001/api/classrooms'),
      ]);
  
      // Set the state with the fetched data
      setCourses(coursesResponse.data);
      setLecturers(lecturersResponse.data);
      setClassrooms(classroomsResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setMessage({ type: 'error', text: 'Error fetching data' });
    }
  };
  

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = schedules.map((schedule, i) =>
      i === index ? { ...schedule, [field]: value } : schedule
    );
    setSchedules(updatedSchedules);
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { course: '', lecturer: '', classroom: '' }]);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/timetable/new', {
        day,
        time,
        duration,
        entries: schedules,
      });
      setMessage({ type: 'success', text: 'Timetable generated successfully' });
    } catch (error) {
      console.error('Error generating timetable', error);
      setMessage({ type: 'error', text: 'Error generating timetable' + (error.response?.data.message || 'Unknown error') });
    }
  };

  return (
    <div className="timetable-generation">
      <h2>Generate Timetable</h2>
      <form onSubmit={handleSubmit} className="timetable-form">
        <div className="form-group">
          <label>Day:</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="form-control">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (hours):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            className="form-control"
            required
            min="1"
            max="4"
          />
        </div>
        <div className="schedules">
          {schedules.map((schedule, index) => (
            <div key={index} className="schedule-entry">
              <div className="form-group">
                <label>Course:</label>
                <select
                  value={schedule.course}
                  onChange={(e) => handleScheduleChange(index, 'course', e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Lecturer:</label>
                <select
                  value={schedule.lecturer}
                  onChange={(e) => handleScheduleChange(index, 'lecturer', e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Lecturer</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer._id} value={lecturer._id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Classroom:</label>
                <select
                  value={schedule.classroom}
                  onChange={(e) => handleScheduleChange(index, 'classroom', e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={() => handleRemoveSchedule(index)} className="remove-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSchedule} className="add-button">
            <FontAwesomeIcon icon={faPlus} /> Add Schedule
          </button>
        </div>
        <button type="submit" className="btn-submit">Generate Timetable</button>
      </form>
    </div>
  );
};

export default TimetableGeneration;
