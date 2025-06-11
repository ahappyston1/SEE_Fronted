// src/components/BudgetList.js
import React from 'react';

export default function BudgetList({ budgets }) {
  // 检查 budgets 是否为数组，且数组是否为空
  if (!Array.isArray(budgets) || budgets.length === 0) {
    return (
      <div className="form-section">
        <h3 className="section-title">📋 Budget Items</h3>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #ddd'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>📄</div>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
            No budget items found for this project
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: '0.8' }}>
            Add your first budget item to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h3 className="section-title">📋 Budget Items</h3>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
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
            📊 {budgets.length} Budget Item{budgets.length > 1 ? 's' : ''} Found
          </span>
        </div>

        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          {budgets.map((budget, index) => (
            <div
              key={budget.budget_id}
              style={{
                padding: '16px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto auto',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3498db',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  P{budget.budget_period}
                </div>

                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '16px',
                    marginBottom: '4px'
                  }}>
                    {budget.budget_name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d'
                  }}>
                    Period {budget.budget_period}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginBottom: '2px'
                  }}>
                    Budget
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: '#2b8a3e',
                    fontSize: '14px'
                  }}>
                    ${budget.budget_amount?.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginBottom: '2px'
                  }}>
                    Cost
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: '#e74c3c',
                    fontSize: '14px'
                  }}>
                    ${budget.cost_amount?.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginBottom: '2px'
                  }}>
                    Variance
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: budget.budget_amount >= budget.cost_amount ? '#2b8a3e' : '#e74c3c',
                    fontSize: '14px'
                  }}>
                    {budget.budget_amount >= budget.cost_amount ? '+' : ''}
                    ${(budget.budget_amount - budget.cost_amount).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #3498db'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
              Total Summary:
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <span style={{ fontSize: '14px' }}>
                Total Budget: <strong style={{ color: '#2b8a3e' }}>
                  ${budgets.reduce((sum, budget) => sum + (budget.budget_amount || 0), 0).toLocaleString()}
                </strong>
              </span>
              <span style={{ fontSize: '14px' }}>
                Total Cost: <strong style={{ color: '#e74c3c' }}>
                  ${budgets.reduce((sum, budget) => sum + (budget.cost_amount || 0), 0).toLocaleString()}
                </strong>
              </span>
              <span style={{ fontSize: '14px' }}>
                Net Variance: <strong style={{
                  color: budgets.reduce((sum, budget) => sum + (budget.budget_amount || 0), 0) >=
                         budgets.reduce((sum, budget) => sum + (budget.cost_amount || 0), 0) ? '#2b8a3e' : '#e74c3c'
                }}>
                  ${(budgets.reduce((sum, budget) => sum + (budget.budget_amount || 0), 0) -
                     budgets.reduce((sum, budget) => sum + (budget.cost_amount || 0), 0)).toLocaleString()}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}