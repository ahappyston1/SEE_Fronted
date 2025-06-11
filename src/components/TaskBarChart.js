import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent
} from 'echarts/components';

import {
  BarChart
} from 'echarts/charts';

import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

export default function Charts({ data }) {
  const barRef = useRef();

  useEffect(() => {
    if (!data.data || !data.data.length) return;

    // 销毁旧图表避免内存泄漏
    if (barRef.current) {
      const existingChart = echarts.getInstanceByDom(barRef.current);
      if (existingChart) {
        existingChart.dispose();
      }
    }

    if (data && data.data && data.data.length > 0) {
      const barChart = echarts.init(barRef.current);

      const final_xAxis = [{
        type: 'category',
        data: data.xAris
      }];
      const final_series = [];

      for (let i = 0; i < data.data.length; i++) {
        const task = data.data[i];
        final_series.push({
          name: task.task_name,
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: task.task_bar
        });
      }

      barChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: final_xAxis,
        yAxis: [{ type: 'value' }],
        series: final_series
      });
    }

    // 清理函数（移除 dispose 即可）
    return () => {
      const barChartInstance = echarts.getInstanceByDom(barRef.current);
      if (barChartInstance) {
        barChartInstance.dispose();
      }
    };
  }, [data]);

  return (
    <div className="form-section">
      {data.data && data.data.length > 0 && (
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
    </div>
  );
}
