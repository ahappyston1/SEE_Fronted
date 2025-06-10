import React, { useState } from 'react';
import api from '../services/api';
import './BudgetTracking.css';

export default function CostEstimation() {
  const [model, setModel] = useState('basic');
  const [projectType, setProjectType] = useState('Organic');
  const [kloc, setKloc] = useState('');
  const [costDrivers, setCostDrivers] = useState({});
  const [phaseAdjustments, setPhaseAdjustments] = useState({});
  const [fp, setFp] = useState('');
  const [tcf, setTcf] = useState('');
  const [language, setLanguage] = useState('Java');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await api.post('/costestimation/cocomo', {
        cocomo_type: model,
        kloc: parseFloat(kloc),
        project_type: projectType,
        cost_drivers: costDrivers,
        phase_adjustments: phaseAdjustments
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Calculation failed. Please check the input.');
      setResult(null);
    }
  };

  const handleKlocCalc = async () => {
    try {
      const response = await api.post('/costestimation/calkloc', {
        fp: parseFloat(fp),
        tcf: parseFloat(tcf),
        language: language
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('KLOC Calculation failed.');
      setResult(null);
    }
  };

  const handleReset = () => {
    setModel('basic');
    setProjectType('Organic');
    setKloc('');
    setCostDrivers({});
    setPhaseAdjustments({});
    setFp('');
    setTcf('');
    setLanguage('Java');
    setResult(null);
    setError(null);
  };

  return (
    <div className="budget-page">
      <h1 className="section-title">🧮 Cost Estimation (COCOMO)</h1>
      <div className="form-section">
        <div className="form-group"><label>Model Type</label>
          <select value={model} onChange={e => setModel(e.target.value)}>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div className="form-group"><label>Project Type</label>
          <select value={projectType} onChange={e => setProjectType(e.target.value)}>
            <option>Organic</option><option>Semi-detached</option><option>Embedded</option>
          </select>
        </div>

        <div className="form-group"><label>KLOC</label>
          <input type="number" value={kloc} onChange={e => setKloc(e.target.value)} />
        </div>

        {model !== 'basic' && (
          <div className="form-group"><label>Cost Drivers</label>
            {['RELY','DATA','CPLX','TIME','STOR','ACAP','PCAP','AEXP','MODP','TOOL','SCED'].map(k => (
              <input key={k} placeholder={k} type="number" value={costDrivers[k] || ''} onChange={e =>
                setCostDrivers({ ...costDrivers, [k]: parseFloat(e.target.value) })} />
            ))}
          </div>
        )}

        {model === 'detailed' && (
          <div className="form-group"><label>Phase Adjustments</label>
            {['Design', 'Coding', 'Testing'].map(p => (
              <input key={p} placeholder={p} type="number" value={phaseAdjustments[p] || ''} onChange={e =>
                setPhaseAdjustments({ ...phaseAdjustments, [p]: parseFloat(e.target.value) })} />
            ))}
          </div>
        )}

        <div className="button-group">
          <button className="btn primary" onClick={handleCalculate}>Calculate</button>
          <button className="btn secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">📏 FP → KLOC Converter</h3>
        <div className="form-group"><label>FP</label><input value={fp} onChange={e => setFp(e.target.value)} /></div>
        <div className="form-group"><label>TCF</label><input value={tcf} onChange={e => setTcf(e.target.value)} /></div>
        <div className="form-group"><label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option>Java</option><option>C++</option><option>Python</option><option>JavaScript</option>
          </select>
        </div>
        <div className="button-group"><button className="btn primary" onClick={handleKlocCalc}>Calculate</button></div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="result-section">
          <h3>📈 Results</h3>
          {Object.entries(result).map(([key, val]) => (
            <p key={key}><strong>{key}:</strong> {val.toFixed ? val.toFixed(2) : val}</p>
          ))}
        </div>
      )}
    </div>
  );
}
