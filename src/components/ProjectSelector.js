import React, { useState } from 'react';
import api from '../services/api';  // 引入正确的 API 服务

export default function ProjectSelector({ projects, onCreateSuccess, onConfirm }) {
  const [mode, setMode] = useState('select');
  const [formData, setFormData] = useState({
    project_name: '',
    initial_investment: '',
    project_description: '',
    total_cost: '',
    project_period_num: ''
  });
  const [selectedId, setSelectedId] = useState('');

  // 创建项目
  const handleCreate = async () => {
    try {
      // 验证必填字段
      if (!formData.project_name || !formData.initial_investment || !formData.total_cost || !formData.project_period_num) {
        alert('Please fill in all required fields');
        return;
      }

      const res = await api.post('/budgeting/postProject', formData);  // 使用正确的接口路径
      alert(res.data.message || 'Project created successfully');  // 显示后端返回的消息

      // 清空表单
      setFormData({
        project_name: '',
        initial_investment: '',
        project_description: '',
        total_cost: '',
        project_period_num: ''
      });

      onCreateSuccess();  // 调用创建成功的回调函数
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please check your input and try again.');
    }
  };

  // 确认选择的项目
  const handleConfirm = () => {
    if (!selectedId) {
      alert('Please select a project first');
      return;
    }
    const project = projects.find(p => p.project_id === parseInt(selectedId));  // 确保使用 project_id
    if (project) onConfirm(project);
  };

  return (
    <div className="form-section">
      <h2 className="section-title">🎯 Project Selection</h2>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef',
        marginBottom: '20px'
      }}>
        <div className="button-group" style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setMode('select')}
            className={`btn ${mode === 'select' ? 'primary' : 'secondary'}`}
          >
            📋 Select Existing
          </button>
          <button
            onClick={() => setMode('create')}
            className={`btn ${mode === 'create' ? 'primary' : 'secondary'}`}
          >
            ➕ Create New
          </button>
        </div>

        {/* 选择现有项目 */}
        {mode === 'select' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#6c757d',
                fontWeight: '500'
              }}>
                📊 {projects.length} Project{projects.length > 1 ? 's' : ''} Available
              </span>
            </div>

            <div className="form-group">
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '8px'
              }}>
                Select Project *
              </label>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="form-input"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
              >
                <option value="">-- Choose a project --</option>
                {projects.map(p => (
                  <option key={p.project_id} value={p.project_id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn primary"
              onClick={handleConfirm}
              disabled={!selectedId}
              style={{ marginTop: '16px' }}
            >
              🚀 Confirm Selection
            </button>
          </div>
        )}

        {/* 创建新项目 */}
        {mode === 'create' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#e8f5e8',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#2b8a3e',
                fontWeight: '500'
              }}>
                ✨ CREATE NEW PROJECT
              </span>
            </div>

            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.project_name}
                onChange={e => setFormData({ ...formData, project_name: e.target.value })}
                placeholder="Enter project name"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group">
              <label>Initial Investment *</label>
              <input
                type="number"
                className="form-input"
                value={formData.initial_investment}
                onChange={e => setFormData({ ...formData, initial_investment: e.target.value })}
                placeholder="Enter initial investment amount"
                min="0"
                step="0.01"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group">
              <label>Project Description</label>
              <textarea
                className="form-input"
                value={formData.project_description}
                onChange={e => setFormData({ ...formData, project_description: e.target.value })}
                placeholder="Enter project description (optional)"
                rows="3"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div className="form-group">
              <label>Total Cost *</label>
              <input
                type="number"
                className="form-input"
                value={formData.total_cost}
                onChange={e => setFormData({ ...formData, total_cost: e.target.value })}
                placeholder="Enter expected total cost"
                min="0"
                step="0.01"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group">
              <label>Project Period Number *</label>
              <input
                type="number"
                className="form-input"
                value={formData.project_period_num}
                onChange={e => setFormData({ ...formData, project_period_num: e.target.value })}
                placeholder="Enter number of periods"
                min="1"
                step="1"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              className="btn primary"
              onClick={handleCreate}
              disabled={!formData.project_name || !formData.initial_investment || !formData.total_cost || !formData.project_period_num}
              style={{ marginTop: '16px' }}
            >
              🎯 Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}