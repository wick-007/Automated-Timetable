import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LecturerPreferences.css';

const LecturerPreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [formData, setFormData] = useState({
    lecturer: '',
    preferences: ''
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecturer-preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching lecturer preferences', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/lecturer-preferences', formData);
      if (response.status === 201) {
        fetchPreferences(); // Refresh the list after adding a new preference
      }
    } catch (error) {
      console.error('Error adding lecturer preference', error);
    }
  };

  return (
    <div className="lecturer-preferences">
      <h2>Lecturer Preferences</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <label>
          Lecturer ID:
          <input type="text" name="lecturer" value={formData.lecturer} onChange={handleInputChange} required />
        </label>
        <label>
          Preferences:
          <textarea name="preferences" value={formData.preferences} onChange={handleInputChange} required />
        </label>
        <button type="submit">Add Preference</button>
      </form>
      <h3>All Preferences</h3>
      <ul>
        {preferences.map((preference) => (
          <li key={preference._id}>
            <strong>Lecturer:</strong> {preference.lecturer.name}<br />
            <strong>Preferences:</strong> {preference.preferences}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LecturerPreferences;
