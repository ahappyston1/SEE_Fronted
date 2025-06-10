import React from 'react';
import '../App.css';

const ResultDisplay2 = ({ results }) => {
  return (
    <div className="result-container">
      <h2 className="result-title">Analysis Results</h2>
      <div className="result-content">
        <div className="result-item">
          <div className="result-label">Total Costs:</div>
          <div className="result-value">${results.total_costs.toFixed(2)}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Total Benefits:</div>
          <div className="result-value">${results.total_benefits.toFixed(2)}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Net Benefit:</div>
          <div className="result-value" style={{ color: results.net_benefits >= 0 ? '#27ae60' : '#e74c3c' }}>
            ${results.net_benefits.toFixed(2)}
          </div>
        </div>
        <div className="result-item">
          <div className="result-label">Initial net benefits:</div>
          <div className="result-value" style={{ color: results.initial_net_benefits >= 0 ? '#27ae60' : '#e74c3c' }}>
            {results.initial_net_benefits.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay2;