// src/pages/ResourceSmoothing.js
import React, {useState} from 'react';
import '../components/ResultDisplay3'
import ResultDisplay3 from "../components/ResultDisplay3.js";
import TaskBarChart from "../components/TaskBarChart";
import "./ResourceSmoothing.css"

export default function ResourceSmoothing() {
  // 添加时间轴刻度组件
  const TimelineTicks = ({ projectDuration }) => {
    const ticks = [];
    for (let i = 0; i <= projectDuration; i++) {
      ticks.push(
        <div key={i} className="timeline-tick">
          <div className="tick-line"></div>
          <div className="tick-label">Day {i + 1}</div>
        </div>
      );
    }
    return <div className="timeline-ticks">{ticks}</div>;
  };


  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    id: '',
    duration: 1,
    resource: 1,
    predecessors: []
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({
      ...currentTask,
      [name]: name === 'id' ? value : Number(value)
    });
  };

  // 处理前置任务选择
  const handlePredecessorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setCurrentTask({
      ...currentTask,
      predecessors: selectedOptions
    });
  };

  // 添加任务
  const addTask = () => {
    // 验证输入
    if (!currentTask.id.trim()) {
      setError('任务ID不能为空');
      return;
    }

    if (tasks.some(task => task.id === currentTask.id)) {
      setError('任务ID已存在');
      return;
    }

    if (currentTask.duration <= 0 || currentTask.resource <= 0) {
      setError('持续时间和资源量必须为正数');
      return;
    }

    // 添加新任务
    setTasks([...tasks, currentTask]);
    setCurrentTask({
      id: '',
      duration: 1,
      resource: 1,
      predecessors: []
    });
    setError('');
  };

  // 删除任务
  const removeTask = (id) => {
    // 删除任务并更新依赖关系
    const updatedTasks = tasks
      .filter(task => task.id !== id)
      .map(task => ({
        ...task,
        predecessors: task.predecessors.filter(pred => pred !== id)
      }));

    setTasks(updatedTasks);
  };

  // 提交任务数据
  const submitTasks = async () => {
    if (tasks.length === 0) {
      setError('请至少添加一个任务');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 模拟后端API调用
      // 实际项目中这里应该是fetch或axios调用
      const response = await fetch('http://127.0.0.1:5000/resourceallocation/resourcesmoothing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      });

      if (!response.ok) {
        // 先尝试解析为 JSON
        let errorBody;
        try {
          console.log('response:', response);
          errorBody = await response.json();
        } catch (e) {
          // 如果 JSON 解析失败，读取原始文本
          errorBody = await response.text();
        }

        // 抛出包含完整错误信息的异常
        throw new Error(JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: errorBody
        }));
      }

      // 处理成功响应
      const data = await response.json();
      console.log(data)
      setResults(data);

    } catch (err) {
      setError('处理失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 重置所有数据
  const resetAll = () => {
    setTasks([]);
    setCurrentTask({
      id: '',
      duration: 1,
      resource: 1,
      predecessors: []
    });
    setResults(null);
    setError('');
  };

  // 可用的前置任务选项
  const availablePredecessors = tasks.map(task => task.id);

  return (
    <div className="resource-smoothing-container">
      <h1>Resource smoothing algorithm tool</h1>
      <p className="subtitle">Optimize project resource allocation and reduce resource fluctuation</p>

      <div className="input-section">
        <h2>Add New Task</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Task ID:</label>
          <input
            type="text"
            name="id"
            value={currentTask.id}
            onChange={handleInputChange}
            placeholder="Enter a unique task ID"
          />
        </div>

        <div className="form-group">
          <label>Duration (days):</label>
          <input
            type="number"
            name="duration"
            value={currentTask.duration}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Daily resource demand:</label>
          <input
            type="number"
            name="resource"
            value={currentTask.resource}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Predecessors:</label>
          <select
            multiple
            size="4"
            value={currentTask.predecessors}
            onChange={handlePredecessorChange}
            disabled={availablePredecessors.length === 0}
          >
            {availablePredecessors.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          <div className="hint">
            {availablePredecessors.length === 0
              ? "You can select predecessor tasks after adding tasks"
              : "Press Ctrl/Cmd to select multiple"}
          </div>
        </div>

        <button
          className="add-button"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="tasks-section">
        <h2>task list ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks have been added</div>
        ) : (
          <div className="tasks-grid">
            <div className="tasks-header">
              <div>ID</div>
              <div>Duration</div>
              <div>Resources/day</div>
              <div>Predecessors</div>
              <div>Operation</div>
            </div>

            {tasks.map(task => (
              <div key={task.id} className="task-row">
                <div className="task-id">{task.id}</div>
                <div>{task.duration} day</div>
                <div>{task.resource}</div>
                <div>
                  {task.predecessors.length > 0
                    ? task.predecessors.join(', ')
                    : 'null'}
                </div>
                <div>
                  <button
                    className="remove-button"
                    onClick={() => removeTask(task.id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions-section">
        <button
          className="submit-button"
          onClick={submitTasks}
          disabled={tasks.length === 0 || loading}
        >
          {loading ? 'Processing...' : 'Execute resource smoothing algorithm'}
        </button>

        <button
          className="reset-button"
          onClick={resetAll}
        >
          Reset All
        </button>
      </div>

      {results && (
        <div className="results-section">
          <h2>Asset Smoothing Results</h2>

          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-title">Total project duration</div>
              <div className="card-value">{results.project_duration} day</div>
            </div>

            <div className="summary-card">
              <div className="card-title">Resource peak</div>
              <div className="card-value">{results.max_resource}</div>
            </div>

            <div className="summary-card">
              <div className="card-title">Resource valley value</div>
              <div className="card-value">{results.min_resource}</div>
            </div>

            <div className="summary-card">
              <div className="card-title">Resource variance</div>
              <div className="card-value">{results.resource_variance.toFixed(2)}</div>
            </div>
          </div>

          <h3>Resource use distribution</h3>
          <div className="resource-chart">
            {results.resource_profile.map((value, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar" style={{ height: `${value * 20}px` }}>
                  <div className="bar-value">{value}</div>
                </div>
                <div className="bar-label">Day {index + 1}</div>
              </div>
            ))}
          </div>

          <h3>Task Schedule</h3>
          {results && (
            <div className="results-section">
              <div className="schedule-container">
                <div className="schedule-header">
                  <div className="task-id-header">Task</div>
                  <div className="timeline-header">
                    <TimelineTicks projectDuration={results.project_duration} />
                  </div>
                </div>

                <div className="schedule-items">
                  {Object.entries(results.activities).map(([taskId, timing]) => {
                    const duration = timing.end - timing.start;
                    return (
                      <div key={taskId} className="schedule-item">
                        <div className="schedule-task-id">{taskId}</div>
                        <div className="schedule-timeline">
                          <div
                            className="schedule-duration"
                            style={{
                              left: `${(timing.start / results.project_duration) * 100}%`,
                              width: `${(duration / results.project_duration) * 100}%`
                            }}
                          >
                            <span className="duration-label">
                              {timing.start + 1} - {timing.end}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}