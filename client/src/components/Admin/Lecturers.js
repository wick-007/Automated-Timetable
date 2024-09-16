import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Lecturers.css';

const Lecturers = ({ setMessage }) => {
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    id: ''
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecturers');
      setLecturers(response.data);
    } catch (error) {
      setMessage({ text: 'Error fetching lecturers', type: 'error' });
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/lecturers/${id}`);
      setMessage({ text: 'Lecturer deleted successfully', type: 'success' });
      fetchLecturers();
    } catch (error) {
      setMessage({ text: 'Error deleting course', type: 'error' });
      console.error('Error deleting course', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.name || !formData.id) {
        setMessage({ text: 'Name and ID are required', type: 'error' });
        return;
      }

      const response = await axios.post('http://localhost:5001/api/lecturers', formData);
      if (response.status === 201) {
        setMessage({ text: 'Lecturer added successfully', type: 'success' });
        setLecturers([...lecturers, response.data]);
        setFormData({ name: '', id: '' });
      } else {
        setMessage({ text: 'Failed to add lecturer', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: `Error adding lecturer: ${error.response?.data?.message || error.message}`, type: 'error' });
      console.error('Error adding lecturer:', error);
    }
  };

  return (
    <div className="lecturers">
      <h2>Manage Lecturers</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='form-control' required />
        </label>
        <label>
          ID:
          <input type="text" name="id" className='form-control' value={formData.id} onChange={handleInputChange} required />
        </label>
        <button type="submit" className='__add__lecturer'>Add Lecturer</button>
      </form>
      <div >
        <h3>Current Lecturers</h3>
        <ul className="lecturer-list"> 
          {lecturers.map(lecturer => (
            <li key={lecturer._id}>{lecturer.name} (ID: {lecturer.id})
             <button className='deletebtn' onClick={() => handleDelete(lecturer._id)}>Delete</button></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lecturers;
