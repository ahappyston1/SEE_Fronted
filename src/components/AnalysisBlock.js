import React from 'react';

export default function AnalysisBlock({ meta, text }) {
  // 解析分析文本，将其分割成不同的分析点
  const parseAnalysisText = (analysisText) => {
    if (!analysisText) return [];

    const lines = analysisText.split('\n').filter(line => line.trim() !== '');
    const analysisPoints = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        // 判断分析类型并添加图标和样式
        let type = 'info';
        let icon = '📊';

        if (trimmedLine.toLowerCase().includes('has been overspent') ||
            trimmedLine.toLowerCase().includes('exceeds') ||
            trimmedLine.toLowerCase().includes('apply for more funds')) {
          type = 'warning';
          icon = '⚠️';
        } else if (trimmedLine.toLowerCase().includes('not been overspent') ||
                   trimmedLine.toLowerCase().includes('normal')) {
          type = 'success';
          icon = '✅';
        } else if (trimmedLine.toLowerCase().includes('remaining investment amount is 0')) {
          type = 'danger';
          icon = '🚨';
        }

        analysisPoints.push({
          text: trimmedLine,
          type: type,
          icon: icon
        });
      }
    });

    return analysisPoints;
  };

  const analysisPoints = parseAnalysisText(text);

  // 计算一些关键指标
  const calculateMetrics = () => {
    if (!meta) return null;

    const budgetUtilization = meta.total_cost ?
      ((meta.initial_investment / meta.total_cost) * 100).toFixed(1) : 0;

    return {
      budgetUtilization,
      projectProgress: meta.project_period_num ?
        `${meta.project_period_num} periods planned` : 'Not specified'
    };
  };

  const metrics = calculateMetrics();

  const getAnalysisTypeStyle = (type) => {
    const baseStyle = {
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '10px',
      borderLeft: '4px solid',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    };

    switch(type) {
      case 'success':
        return { ...baseStyle, borderLeftColor: '#2b8a3e', backgroundColor: '#f8fff9' };
      case 'warning':
        return { ...baseStyle, borderLeftColor: '#f39c12', backgroundColor: '#fffdf7' };
      case 'danger':
        return { ...baseStyle, borderLeftColor: '#e74c3c', backgroundColor: '#fff8f8' };
      default:
        return { ...baseStyle, borderLeftColor: '#3498db', backgroundColor: '#f8fcff' };
    }
  };

  return (
    <div className="form-section">
      <h3 className="section-title">📉 Forecast & Analysis</h3>

      {meta && (
        <div className="result-section" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 Project Overview
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>PROJECT NAME</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{meta.project_name}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>INITIAL INVESTMENT</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>${meta.initial_investment?.toLocaleString()}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>EXPECTED TOTAL COST</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>${meta.total_cost?.toLocaleString()}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>PROJECT PERIODS</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{meta.project_period_num}</div>
            </div>
          </div>

          {metrics && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '8px' }}>KEY METRICS</div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px' }}>
                  📊 Budget Utilization: <strong>{metrics.budgetUtilization}%</strong>
                </span>
                <span style={{ fontSize: '14px' }}>
                  📅 {metrics.projectProgress}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #f8f9fa'
        }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>🧠</span>
          <h4 style={{
            margin: 0,
            color: '#2c3e50',
            fontWeight: '600',
            fontSize: '18px'
          }}>
            AI-Powered Financial Analysis
          </h4>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#6c757d',
            fontWeight: '500',
            marginBottom: '16px'
          }}>
            🔍 COMPREHENSIVE ASSESSMENT REPORT
          </div>
        </div>

        {analysisPoints.length > 0 ? (
          <div>
            {analysisPoints.map((point, index) => (
              <div key={index} style={getAnalysisTypeStyle(point.type)}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{point.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: 0,
                      lineHeight: '1.6',
                      color: '#2c3e50',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {point.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #6c757d'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px' }}>📋</span>
                <strong style={{ fontSize: '14px', color: '#2c3e50' }}>Analysis Summary</strong>
              </div>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#6c757d',
                lineHeight: '1.5'
              }}>
                This analysis is generated using advanced algorithms that evaluate budget performance,
                cost efficiency, and timeline adherence. Recommendations are based on industry best practices
                and real-time project data assessment.
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>📊</div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
              Analysis will be available once project data is processed
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: '0.8' }}>
              Add budget items to generate comprehensive insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}