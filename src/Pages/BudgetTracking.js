// src/pages/BudgetTracking.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';  // 引入api服务
import './BudgetTracking.css';
import ProjectSelector from '../components/ProjectSelector';
import BudgetList from '../components/BudgetList';
import AddBudgetForm from '../components/AddBudgetForm';
import Charts from '../components/Charts';
import AnalysisBlock from '../components/AnalysisBlock';

export default function BudgetTracking() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [cashFlows, setCashFlows] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [budgets, setBudgets] = useState([]);  // 存储预算追踪数据
  const [chartsData, setChartsData] = useState({ budgets: [], costs: [], barcharts: {} });
  const [projectMeta, setProjectMeta] = useState(null);
  const [analysis, setAnalysis] = useState('');

  // 计算投资回报率等财务指标
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
      console.log("11111")
      console.log(response.data)
      setError(null);
    } catch (err) {
      setError('Calculation failed. Please check the input or server connection');
      setResults(null);
    }
  };

  // 重置所有字段
  const handleReset = () => {
    setInitialInvestment('');
    setReturnAmount('');
    setCashFlows('');
    setDiscountRate('');
    setResults(null);
    setError(null);
  };

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      const res = await api.get('/budgeting/getprojects');
      setProjects(res.data.data); // 更新项目列表
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  // 获取选定项目的预算数据
  const fetchProjectBudgets = async (projectId) => {
    try {
      const res = await api.get(`/budgeting/getbudgetingtrack?project_id=${projectId}`);
      console.log('Fetched budgets:', res.data);  // 打印返回的数据
      if (Array.isArray(res.data.data)) {
        setBudgets(res.data.data); // 更新预算数据
      } else {
        console.error('Fetched data is not an array:', res.data.data);
        setBudgets([]);  // 如果不是数组，设置为空数组
      }
    } catch (error) {
      console.error('Failed to load budget data:', error);
      setBudgets([]);  // 在出错时设置为空数组
    }
  };

  // 获取项目的图表数据和分析报告
  const fetchChartsAndAnalysis = async (projectId) => {
    try {
      const chartsRes = await api.get(`/budgeting/showCharts?project_id=${projectId}`);
      console.log('Charts data:', chartsRes.data); // 调试信息

      setChartsData({
        budgets: chartsRes.data.data.linecharts.budgets,
        costs: chartsRes.data.data.linecharts.costs,
        barcharts: chartsRes.data.data.barcharts // 添加柱状图数据
      });

      // 从图表接口获取项目元数据
      setProjectMeta({
        project_name: chartsRes.data.data.project_name,
        initial_investment: chartsRes.data.data.initial_investment,
        total_cost: chartsRes.data.data.total_cost,
        project_period_num: chartsRes.data.data.project_period_num
      });

      setAnalysis(chartsRes.data.data.prediction.message);  // 获取预测分析
    } catch (error) {
      console.error('Error in fetching charts or analysis:', error);
    }
  };

  // 选择项目并加载相关数据
  const handleProjectConfirm = async (project) => {
    setSelectedProject(project);
    await fetchProjectBudgets(project.project_id); // 加载该项目的预算数据
    await fetchChartsAndAnalysis(project.project_id); // 获取图表数据和分析报告
  };

  // 刷新所有项目相关数据的统一函数
  const refreshProjectData = async () => {
    if (selectedProject) {
      await fetchProjectBudgets(selectedProject.project_id);
      await fetchChartsAndAnalysis(selectedProject.project_id);
    }
  };

  // 使用 useEffect 获取项目列表
  useEffect(() => {
    fetchProjects();
  }, []);

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

      <hr style={{ margin: '40px 0' }} />

      <h1 className="section-title">📁 Budget Tracking & Forecasting</h1>
      <ProjectSelector
        projects={projects}
        onCreateSuccess={fetchProjects}
        onConfirm={handleProjectConfirm}
      />

      {selectedProject && (
        <>
          <BudgetList budgets={budgets} />
          <AddBudgetForm
            projectId={selectedProject.project_id}
            budgets={budgets}
            onSuccess={refreshProjectData}  // 使用统一的刷新函数
          />
          <Charts data={chartsData} />
          <AnalysisBlock meta={projectMeta} text={analysis} />
        </>
      )}
    </div>
  );
}