import React, { useState, useEffect } from 'react';
import api from '../services/api';  // 引入正确的api服务

export default function AddBudgetForm({ projectId, budgets, onSuccess }) {
  const [budgetData, setBudgetData] = useState({
    budget_name: '',
    budget_amount: '',
    cost_amount: '',
    budget_period: ''
  });

  // 自动计算下一个budget_period
  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // 找到现有预算项中的最大period值
      const maxPeriod = Math.max(...budgets.map(budget => parseInt(budget.budget_period) || 0));
      const nextPeriod = maxPeriod + 1;
      setBudgetData(prev => ({
        ...prev,
        budget_period: nextPeriod.toString()
      }));
    } else {
      // 如果没有现有预算项，从期数1开始
      setBudgetData(prev => ({
        ...prev,
        budget_period: '1'
      }));
    }
  }, [budgets]);

  const handleSubmit = async () => {
    try {
      // 验证必填字段
      if (!budgetData.budget_name || !budgetData.budget_amount || !budgetData.cost_amount) {
        alert('Please fill in all required fields');
        return;
      }

      // 使用正确的API路径和数据格式
      const res = await api.post('/budgeting/postBudgeting', {
        project_id: projectId,
        budget_data: [budgetData]  // 后端期望的数据格式
      });

      alert(res.data.message || 'Budget item added successfully');

      // 清空表单（除了budget_period，它会自动重新计算）
      setBudgetData(prev => ({
        budget_name: '',
        budget_amount: '',
        cost_amount: '',
        budget_period: prev.budget_period // 保持当前的period值
      }));

      onSuccess(); // 调用成功回调刷新预算列表
    } catch (error) {
      console.error('Failed to add budget:', error);
      alert('Failed to add budget item. Please check your input and try again.');
    }
  };

  const handleInputChange = (field, value) => {
    // budget_period字段不允许手动修改
    if (field === 'budget_period') {
      return;
    }
    setBudgetData({ ...budgetData, [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="section-title">➕ Add Budget Item</h3>

      <div className="form-group">
        <label>Budget Name *</label>
        <input
          type="text"
          className="form-input"
          value={budgetData.budget_name}
          onChange={e => handleInputChange('budget_name', e.target.value)}
          placeholder="Enter budget item name"
        />
      </div>

      <div className="form-group">
        <label>Budget Amount *</label>
        <input
          type="number"
          className="form-input"
          value={budgetData.budget_amount}
          onChange={e => handleInputChange('budget_amount', e.target.value)}
          placeholder="Enter budget amount"
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label>Cost Amount *</label>
        <input
          type="number"
          className="form-input"
          value={budgetData.cost_amount}
          onChange={e => handleInputChange('cost_amount', e.target.value)}
          placeholder="Enter actual cost amount"
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label>Budget Period (Auto-generated)</label>
        <input
          type="text"
          className="form-input"
          value={budgetData.budget_period}
          readOnly
          style={{
            backgroundColor: '#f5f5f5',
            cursor: 'not-allowed',
            color: '#666'
          }}
          title="This field is automatically calculated based on existing budget periods"
        />
      </div>

      <button
        className="btn primary"
        onClick={handleSubmit}
        disabled={!budgetData.budget_name || !budgetData.budget_amount || !budgetData.cost_amount}
      >
        Add Budget Item
      </button>
    </div>
  );
}