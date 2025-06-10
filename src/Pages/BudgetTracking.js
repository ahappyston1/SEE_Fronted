// src/pages/BudgetTracking.js

import React, { useState } from 'react';
import api from '../services/api';
import './BudgetTracking.css'; // 引入样式表

export default function BudgetTracking() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [cashFlows, setCashFlows] = useState('');
  const [discountRate, setDiscountRate] = useState('');

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    try {
      const cashFlowArray = cashFlows.split(',').map(Number);
      const response = await api.post('/budgeting/calindicator', {
      return_amount: parseFloat(returnAmount),
      initial_investment: parseFloat(initialInvestment),
      cash_flows: cashFlowArray,
      discount_rate: parseFloat(discountRate),
    });

      setResults(response.data);
      setError(null);
    } catch (err) {
      setError('Calculation failed. Please check the input or server connection');
      setResults(null);
    }
  };

  const handleReset = () => {
    setInitialInvestment('');
    setReturnAmount('');
    setCashFlows('');
    setDiscountRate('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="budget-page">
      <h1 className="section-title">📊 Investment Indicator Calculator</h1>
      <div className="form-section">
        <div className="form-group">
          <label>Initial Investment</label>
          <input type="number" value={initialInvestment} onChange={e => setInitialInvestment(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Total Return</label>
          <input type="number" value={returnAmount} onChange={e => setReturnAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Cash Flows (separated by ",")</label>
          <input type="text" value={cashFlows} onChange={e => setCashFlows(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Discount Rate (%)</label>
          <input type="number" step="0.01" value={discountRate} onChange={e => setDiscountRate(e.target.value)} />
        </div>
        <div className="button-group">
          <button className="btn primary" onClick={handleCalculate}>Calculate</button>
          <button className="btn secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {results && (
        <div className="result-section">
          <h3>📈 Results</h3>
          <p><strong>ROI:</strong> {results.roi.toFixed(2)}%</p>
          <p><strong>NPV:</strong> {results.npv.toFixed(2)}</p>
          <p><strong>IRR:</strong> {results.irr.toFixed(2)}%</p>
          <p><strong>Payback Period:</strong> {results.period} year(s)</p>
        </div>
      )}

      <div className="variance-section">
        <h2 className="section-title">📉 Budget Tracking & Variance Analysis</h2>
        <p>This module helps compare planned budgets with actual expenditures and supports future forecasting.</p>
        <p>Charts and analytics will be added in future updates to visualize trends.</p>
      </div>
    </div>
  );
}
