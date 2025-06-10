import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [riskDropdownOpen, setRiskDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleRiskDropdown = () => {
    setRiskDropdownOpen(prev => !prev);
  };

  // 点击页面其他地方关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRiskDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="nav-brand">
        📊 Economic Analysis and Decision-Making Tool
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/cost-estimation">Cost Estimation</Link>
        </li>
        <li>
          <Link to="/budget-tracking">Budgeting and Cost Management</Link>
        </li>

        {/* Risk Management 下拉菜单 */}
        <li className="dropdown" ref={dropdownRef}>
          <span
            className="dropdown-toggle"
            onClick={toggleRiskDropdown}
            style={{ cursor: 'pointer' }}
          >
            Risk Management
            <i className="fa fa-chevron-down ml-1"></i>
          </span>
          <ul className={`dropdown-menu ${riskDropdownOpen ? 'show' : ''}`}>
            <li>
              <Link to="/risk/sensitivity-analysis" onClick={() => setRiskDropdownOpen(false)}>
                Sensitivity Analysis
              </Link>
            </li>
            <li>
              <Link to="/risk/monte-carlo" onClick={() => setRiskDropdownOpen(false)}>
                Monte Carlo Simulation
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/resource-allocation">Resource Allocation & Optimization</Link>
        </li>
      </ul>
    </nav>
  );
}
