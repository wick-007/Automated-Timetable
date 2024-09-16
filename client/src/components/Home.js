import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { APP_ROLES } from '../lib/constants';

const  { ADMIN, TEACHER, STUDENT} = APP_ROLES;
const Home = () => {
  const [role, setRole] = useState(ADMIN);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/authenticate', { role, id, password });
      if (response.data.success) {
        if (role === ADMIN) navigate('/admin');
        else if (role === TEACHER) navigate('/teacher');
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
        <form onSubmit={handleSubmit} className="form-control">
          <div className="form-group">
            <label style={{ color: 'white'}}>Select Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
              <option value={ADMIN}>Admin</option>
              <option value={TEACHER}>Teacher</option>
              <option value={STUDENT}>Student</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ color: 'white'}}>{role === 'student' ? 'Reference Number' : 'Unique ID'}:</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} required className="form-control" />
          </div>
          <div className="form-group">
            <label style={{ color: 'white'}}>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
          </div>
          <button type="submit" className="btn-submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
