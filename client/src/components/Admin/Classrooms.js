import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Classrooms.css';

const Classrooms = ({ setMessage }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({ name: '', capacity: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/classrooms', formData);
      if (response.status === 201) {
        setMessage('Classroom added successfully');
        fetchClassrooms();
        setShowForm(false);
      }
    } catch (error) {
      setMessage('Error adding classroom');
      console.error('Error adding classroom', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/classrooms/${id}`);
      setMessage('Classroom deleted successfully');
      fetchClassrooms();
    } catch (error) {
      setMessage('Error deleting classroom');
      console.error('Error deleting classroom', error);
    }
  };

  return (
    <div className="classrooms">
      <button className='addcoursebtn'onClick={() => setShowForm(!showForm)}>Add Classroom</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="classroom-form">
          <h2>Add Classroom</h2>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Capacity:
            <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required />
          </label>
          <button type="submit">Add</button>
        </form>
      )}
      <ul className="classroom-list">
        {classrooms.map((classroom) => (
          <li key={classroom._id}>
            {classroom.name} - Capacity: {classroom.capacity}
            <button onClick={() => handleDelete(classroom._id)} className='deletebtn'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Classrooms;
