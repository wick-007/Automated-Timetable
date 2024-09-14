import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConflictReports.css';

const ConflictReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/conflict-reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching conflict reports', error);
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.post(`http://localhost:5001/api/conflict-reports/${id}/resolve`);
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error resolving report', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:5001/api/conflict-reports/${id}/reject`);
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting report', error);
    }
  };

  return (
    <div className="conflict-reports">
      <h2>Conflict Reports</h2>
      <ul className="report-list">
        {reports.map((report) => (
          <li key={report._id} className="report-item">
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <div className="report-actions">
              <button className="resolve" onClick={() => handleResolve(report._id)}>Resolve</button>
              <button className="reject" onClick={() => handleReject(report._id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConflictReports;
