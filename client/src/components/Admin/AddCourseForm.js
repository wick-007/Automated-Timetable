import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCourseForm = () => {
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('07:00');

  useEffect(() => {
    const fetchData = async () => {
      const coursesResponse = await axios.get('/api/courses');
      setCourses(coursesResponse.data);

      const roomsResponse = await axios.get('/api/rooms');
      setRooms(roomsResponse.data);

      const lecturersResponse = await axios.get('/api/users?role=teacher');
      setLecturers(lecturersResponse.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/timetable/create', {
        day,
        startTime,
        endTime,
        courseId: selectedCourse,
        roomId: selectedRoom,
        lecturerId: selectedLecturer,
      });
      alert('Timetable entry created successfully');
    } catch (error) {
      console.error('Error creating timetable entry', error);
      alert('Error creating timetable entry');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Course</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>{course.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Room</label>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>{room.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Lecturer</label>
        <select value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)}>
          {lecturers.map((lecturer) => (
            <option key={lecturer._id} value={lecturer._id}>{lecturer.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Day</label>
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>
      </div>
      <div>
        <label>Start Time</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div>
        <label>End Time</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <button type="submit">Add to Timetable</button>
    </form>
  );
};

export default AddCourseForm;
