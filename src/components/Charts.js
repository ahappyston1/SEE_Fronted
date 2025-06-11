// src/components/Charts.js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';

// 组件按需引入
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent
} from 'echarts/components';

import {
  LineChart,
  BarChart
} from 'echarts/charts';

import {
  CanvasRenderer
} from 'echarts/renderers';

// 注册组件（只注册一次）
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  LineChart,
  BarChart,
  CanvasRenderer
]);

export default function Charts({ data }) {
  const lineRef = useRef();
  const barRef = useRef();

  useEffect(() => {
    if (!data.budgets || !data.budgets.length) return;

    const xLabels = data.budgets.map((_, i) => `Period ${i + 1}`);

    // 销毁旧图表避免内存泄漏
    if (lineRef.current) {
      const existingChart = echarts.getInstanceByDom(lineRef.current);
      if (existingChart) {
        existingChart.dispose();
      }
    }
    if (barRef.current) {
      const existingChart = echarts.getInstanceByDom(barRef.current);
      if (existingChart) {
        existingChart.dispose();
      }
    }

    // 折线图配置
    const lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      title: {
        text: 'Budget vs Cost Trend Analysis',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#fff'
        },
        formatter: function(params) {
          let result = `<strong>${params[0].axisValueLabel}</strong><br/>`;
          params.forEach(param => {
            result += `${param.marker} ${param.seriesName}: $${param.value.toLocaleString()}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Budget', 'Cost'],
        top: 30,
        textStyle: {
          fontSize: 12,
          color: '#2c3e50'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: {
          color: '#666',
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#666',
          fontSize: 11,
          formatter: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [
        {
          name: 'Budget',
          type: 'line',
          data: data.budgets,
          lineStyle: {
            color: '#2b8a3e',
            width: 3
          },
          itemStyle: {
            color: '#2b8a3e'
          },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Cost',
          type: 'line',
          data: data.costs,
          lineStyle: {
            color: '#e74c3c',
            width: 3
          },
          itemStyle: {
            color: '#e74c3c'
          },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    });

    // 柱状图配置 - 按照用户要求的格式
    if (data.barcharts && Object.keys(data.barcharts).length > 0) {
      const barChart = echarts.init(barRef.current);

      // 构造数据源
      const barchartData = data.barcharts;
      const categories = ['Budget', 'Cost', 'Time'];
      const expectedData = [];
      const actualData = [];
      const categoryLabels = [];

      // 提取数据
      if (barchartData.budgets) {
        categoryLabels.push('Budget ($)');
        expectedData.push(barchartData.budgets[1]); // expected value
        actualData.push(barchartData.budgets[2]);   // actual value
      }

      if (barchartData.costs) {
        categoryLabels.push('Cost ($)');
        expectedData.push(barchartData.costs[1]);
        actualData.push(barchartData.costs[2]);
      }

      if (barchartData.time) {
        categoryLabels.push('Time (Periods)');
        expectedData.push(barchartData.time[1]);
        actualData.push(barchartData.time[2]);
      }

      barChart.setOption({
        title: {
          text: 'Expected vs Actual Performance Comparison',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(50, 50, 50, 0.8)',
          borderColor: '#777',
          textStyle: {
            color: '#fff'
          },
          formatter: function(params) {
            let result = `<strong>${params[0].axisValueLabel}</strong><br/>`;
            params.forEach(param => {
              const value = param.axisValueLabel.includes('Time') ?
                param.value :
                '$' + param.value.toLocaleString();
              result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: ['Expected', 'Actual'],
          top: 30,
          textStyle: {
            fontSize: 12,
            color: '#2c3e50'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categoryLabels,
          axisLabel: {
            color: '#666',
            fontSize: 11,
            interval: 0,
            rotate: 0
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666',
            fontSize: 11,
            formatter: function(value) {
              return value.toLocaleString();
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [
          {
            name: 'Expected',
            type: 'bar',
            data: expectedData,
            itemStyle: {
              color: '#3498db',
              borderRadius: [4, 4, 0, 0]
            },
            barWidth: '35%'
          },
          {
            name: 'Actual',
            type: 'bar',
            data: actualData,
            itemStyle: {
              color: '#e67e22',
              borderRadius: [4, 4, 0, 0]
            },
            barWidth: '35%'
          }
        ]
      });
    }

    // 响应式设计
    const handleResize = () => {
      lineChart.resize();
      if (data.barcharts && Object.keys(data.barcharts).length > 0) {
        const barChartInstance = echarts.getInstanceByDom(barRef.current);
        if (barChartInstance) {
          barChartInstance.resize();
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      lineChart.dispose();
      const barChartInstance = echarts.getInstanceByDom(barRef.current);
      if (barChartInstance) {
        barChartInstance.dispose();
      }
    };
  }, [data]);

  return (
    <div className="form-section">
      <h3 className="section-title">📊 Budget vs Cost Analysis</h3>

      {/* 折线图 */}
      <div
        ref={lineRef}
        style={{
          height: 450,
          marginBottom: 50,
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />

      {/* 柱状图 */}
      {data.barcharts && Object.keys(data.barcharts).length > 0 && (
        <div
          ref={barRef}
          style={{
            height: 450,
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      )}

      {(!data.budgets || data.budgets.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #ddd'
        }}>
          <p>📈 No data available for charts. Please add budget items to see the analysis.</p>
        </div>
      )}
    </div>
  );
}