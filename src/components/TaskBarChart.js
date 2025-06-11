import React, { useState, useEffect, useRef } from 'react';
import './TaskBarChart.css';

// Bar Chart Component
const TaskBarChart = ({
  data = { data: [], xAris: [] },
  title = 'Task Schedule Visualization',
  xAxisLabel = 'Time Unit',
  yAxisLabel = 'Resource Needed',
  className = '',
  barWidth = 20,
  barGap = 5,
  animationDuration = 1000,
  onBarClick = () => {}
}) => {
  // State for chart dimensions and responsiveness
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const chartRef = useRef(null);

  // State for animation progress
  const [animationProgress, setAnimationProgress] = useState(0);

  // Calculate chart dimensions based on container
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(300, width),
          height: Math.min(500, Math.max(300, width * 0.5))
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animate bars when data changes
  useEffect(() => {
    setAnimationProgress(0);

    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);

    return () => clearTimeout(timer);
  }, [JSON.stringify(data)]);

  // Extract data and categories
  const tasks = data.data || [];
  const xAxisValues = data.xAris || [];

  // Calculate scales
  const margin = { top: 60, right: 60, bottom: 80, left: 80 }; // 增加边距
  const innerWidth = dimensions.width - margin.left - margin.right;
  const innerHeight = dimensions.height - margin.top - margin.bottom;

  // Find the maximum value for y-axis scaling
  const maxValue = tasks.reduce((max, task) => {
    const taskMax = Math.max(...task.task_bar);
    return Math.max(max, taskMax);
  }, 0);

  // Calculate x and y scales
  const xScale = (index) => {
    const barGroupWidth = (barWidth + barGap) * tasks.length;
    const xPos = (index / xAxisValues.length) * innerWidth;
    return xPos + margin.left;
  };

  const yScale = (value) => {
    const scaledValue = (value / maxValue) * innerHeight;
    return margin.top + innerHeight - scaledValue;
  };

  // Color palette for tasks
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12',
    '#1abc9c', '#34495e', '#e67e22', '#d35400', '#27ae60'
  ];

  // Handle bar click with task and x-axis value
  const handleBarClick = (taskIndex, xIndex) => {
    const task = tasks[taskIndex];
    const xValue = xAxisValues[xIndex];
    const value = task.task_bar[xIndex];

    onBarClick({
      task: task.task_name,
      xValue,
      value,
      taskIndex,
      xIndex
    });
  };

  // Render the chart
  return (
    <div className={`task-bar-chart-container ${className}`} ref={chartRef}>
      {tasks.length === 0 || xAxisValues.length === 0 ? (
        <div className="chart-empty">No data available</div>
      ) : (
        <svg width={dimensions.width} height={dimensions.height}>
          {/* Y-axis */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={innerHeight}
              stroke="#ddd"
              strokeWidth={1}
            />

            {/* Y-axis ticks and labels */}
            {Array.from({ length: 6 }).map((_, i) => {
              const value = (i / 5) * maxValue;
              const yPos = innerHeight - (i / 5) * innerHeight;

              return (
                <g key={`y-tick-${i}`}>
                  <line
                    x1={-5}
                    y1={yPos}
                    x2={0}
                    y2={yPos}
                    stroke="#ddd"
                    strokeWidth={1}
                  />
                  <text
                    x={-10}
                    y={yPos + 5}
                    textAnchor="end"
                    fontSize={12}
                    fill="#666"
                  >
                    {value.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Y-axis label */}
            <text
              x={-margin.left / 2}
              y={innerHeight / 2}
              textAnchor="middle"
              transform="rotate(-90)"
              fontSize={14}
              fill="#333"
              fontWeight={500}
            >
              {yAxisLabel}
            </text>
          </g>

          {/* X-axis */}
          <g transform={`translate(${margin.left}, ${margin.top + innerHeight})`}>
            <line
              x1={0}
              y1={0}
              x2={innerWidth}
              y2={0}
              stroke="#ddd"
              strokeWidth={1}
            />

            {/* X-axis ticks and labels */}
            {xAxisValues.map((value, index) => {
              const xPos = xScale(index) - margin.left;

              return (
                <g key={`x-tick-${index}`}>
                  <line
                    x1={xPos}
                    y1={0}
                    x2={xPos}
                    y2={5}
                    stroke="#ddd"
                    strokeWidth={1}
                  />
                  <text
                    x={xPos}
                    y={20}
                    textAnchor="middle"
                    fontSize={10} // 减小字体大小
                    fill="#666"
                    transform={index % 2 === 1 ? "rotate(45) translate(15, -5)" : ""}
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* X-axis label */}
            <text
              x={innerWidth / 2}
              y={60} // 调整位置
              textAnchor="middle"
              fontSize={14}
              fill="#333"
              fontWeight={500}
            >
              {xAxisLabel}
            </text>
          </g>

          {/* Chart title */}
          <text
            x={dimensions.width / 2}
            y={margin.top / 2}
            textAnchor="middle"
            fontSize={16}
            fill="#333"
            fontWeight={600}
          >
            {title}
          </text>

          {/* Legend */}
          <g transform={`translate(${margin.left}, ${margin.top - 20})`}>
            {tasks.map((task, index) => (
              <g key={`legend-${index}`} transform={`translate(${index * 100}, 0)`}>
                <rect
                  x={0}
                  y={-10}
                  width={15}
                  height={15}
                  fill={colors[index % colors.length]}
                  rx={2}
                />
                <text
                  x={20}
                  y={3}
                  fontSize={10} // 减小字体大小
                  fill="#333"
                >
                  {task.task_name}
                </text>
              </g>
            ))}
          </g>

          {/* Bars */}
          {tasks.map((task, taskIndex) => (
            <g key={`task-${taskIndex}`}>
              {task.task_bar.map((value, xIndex) => {
                if (value === 0) return null;

                const xPos = xScale(xIndex) + (taskIndex * (barWidth + barGap));
                const height = (value / maxValue) * innerHeight * animationProgress;
                const yPos = margin.top + innerHeight - height;

                return (
                  <rect
                    key={`bar-${taskIndex}-${xIndex}`}
                    x={xPos}
                    y={yPos}
                    width={barWidth}
                    height={height}
                    fill={colors[taskIndex % colors.length]}
                    opacity={0.85}
                    onClick={() => handleBarClick(taskIndex, xIndex)}
                    className="task-bar"
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.cursor = 'pointer';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.85';
                    }}
                  >
                    <title>
                      {`Task: ${task.task_name}\n${xAxisLabel}: ${xAxisValues[xIndex]}\n${yAxisLabel}: ${value}`}
                    </title>
                  </rect>
                );
              })}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};

export default TaskBarChart;