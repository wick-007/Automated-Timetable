import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courses.css';

const Courses = ({ setMessage }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/courses');
      setCourses(response.data);
    } catch (error) {
      setMessage({ text: 'Error fetching courses', type: 'error' });
      console.error('Error fetching courses', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/courses', formData);
      if (response.status === 201) {
        setMessage({ text: 'Course added successfully', type: 'success' });
        fetchCourses();
        setShowForm(false);
      }
    } catch (error) {
      setMessage({ text: 'Error adding course', type: 'error' });
      console.error('Error adding course', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/courses/${id}`);
      setMessage({ text: 'Course deleted successfully', type: 'success' });
      fetchCourses();
    } catch (error) {
      setMessage({ text: 'Error deleting course', type: 'error' });
      console.error('Error deleting course', error);
    }
  };

  return (
    <div className="courses">
      <button onClick={() => setShowForm(!showForm)} className='addcoursebtn'>Add Course</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form-group">
          <h2>Add Course</h2>
          <label>
            Name:
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Code:
            <input type="text" name="code" className="form-control" value={formData.code} onChange={handleInputChange} required />
          </label>
          <button type="submit" className='addcoursebtn'> Add</button>
        </form>
      )}
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course._id}>
            {course.name} - Code: {course.code}
            <button onClick={() => handleDelete(course._id)} className='deletebtn'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
