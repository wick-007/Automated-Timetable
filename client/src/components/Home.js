import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [role, setRole] = useState('admin');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/authenticate', { role, id, password });
      if (response.data.success) {
        if (role === 'admin') navigate('/admin');
        else if (role === 'teacher') navigate('/teacher');
        else navigate('/student');
      } else {
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication', error);
      alert('Error during authentication');
    }
  };

  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="home-content">
        <h1>Welcome to the Automated Timetable System</h1>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label>Select Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="form-group">
            <label>{role === 'student' ? 'Reference Number' : 'Unique ID'}:</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} required className="form-control" />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
          </div>
          <button type="submit" className="btn-submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
