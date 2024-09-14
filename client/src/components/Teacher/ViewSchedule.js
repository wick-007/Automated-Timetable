import React, { useState, useEffect } from 'react';
import { getTeacherSchedule } from '../../services/api';

const ViewSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const teacherId = "teacher-id"; // Replace with actual teacher ID

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getTeacherSchedule(teacherId);
        setSchedule(response.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [teacherId]);

  return (
    <div>
      <h1>My Schedule</h1>
      {schedule.length > 0 ? (
        <ul>
          {schedule.map((item) => (
            <li key={item._id}>
              {item.courseId.name} - {item.timeSlot} in {item.roomId.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No schedule available.</p>
      )}
    </div>
  );
};

export default ViewSchedule;
