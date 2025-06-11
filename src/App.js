// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './Pages/ProjectList';
import CostEstimation from './Pages/CostEstimation';
import EconomicMetrics from './Pages/EconomicMetrics';
import BudgetTracking from './Pages/BudgetTracking';
import ResourceAllocation from './Pages/ResourceAllocation';
import Navbar from './components/Navbar';
import SensitivityAnalysis from './Pages/SensitivityAnalysis';
import MonteCarloSimulation from './Pages/MonteCarloSimulation';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Default route and cost-estimation route both render the CostEstimation component */}
          <Route path="/" element={<CostEstimation />} />
          <Route path="/cost-estimation" element={<CostEstimation />} />
          <Route path="/economic-metrics" element={<EconomicMetrics />} />
          <Route path="/budget-tracking" element={<BudgetTracking />} />
          <Route path="/risk/sensitivity-analysis" element={<SensitivityAnalysis />} />
          <Route path="/risk/monte-carlo" element={<MonteCarloSimulation />} />
          <Route path="/resource-allocation" element={<ResourceAllocation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
