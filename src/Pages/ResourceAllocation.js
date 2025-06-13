// src/pages/ResourceAllocation.js
import React, {useState} from 'react';
import './ResourceAllocation.css';
import '../components/ResultDisplay3'
import ResultDisplay3 from "../components/ResultDisplay3.js";
import TaskBarChart from "../components/TaskBarChart";

export default function ResourceAllocation() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    task: '',
    resource_needed: 0,
    duration: 1,
    start_time: 0,
    end_time: 1,
  });
  const [maxDuration, setMaxDuration] = useState(1);
  const [errors, setErrors] = useState({});
  const [bestSchedule, setBestSchedule] = useState([]);
  const [changedBarCharts, setChangedBarCharts] = useState({ data: [], xAris: [] });
  const [initialBarCharts, setInitialBarCharts] = useState({ data: [], xAris: [] });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.task.trim()) {
      newErrors.task = 'Task name is required';
    }

    if (formData.resource_needed < 0) {
      newErrors.resource_needed = 'Resource needed cannot be negative';
    }

    if (formData.duration <= 0 || !Number.isInteger(formData.duration)) {
      newErrors.duration = 'Duration must be a positive integer';
    }

    if (formData.start_time < 0) {
      newErrors.start_time = 'Start time cannot be negative';
    }

    if (formData.end_time <= 0 || !Number.isInteger(formData.end_time)) {
      newErrors.end_time = 'End time must be a positive integer';
    }

    if (formData.end_time <= 0 || !Number.isInteger(formData.end_time)) {
      newErrors.end_time = 'End time must be a positive integer';
    }

    if (maxDuration <= 0 || !Number.isInteger(maxDuration)) {
      newErrors.maxDuration = 'Max duration must be a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'task' ? value : Number(value)
    });
  };

  const handleMaxDurationChange = (e) => {
    setMaxDuration(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setTasks([...tasks, { ...formData }]);
      setFormData({
        task: '',
        resource_needed: 0,
        duration: 1,
        start_time: 0,
        end_time: 1
      });
      setErrors({});
    }
  };

  const handleSubmitTasks = async (e) => {
    try {
      // 发送数据到后端
      const content = {
        "tasks":tasks,
        "max_duration":maxDuration
      }
      const response = await fetch('http://127.0.0.1:5000/resourceallocation/resourceleveling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
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
      console.log("data[best_schedule]",data["best_schedule"])
      console.log("data[changed_bar_charts]",data["changed_bar_charts"])
      console.log("data[initial_bar_charts]",data["initial_bar_charts"])
      console.log("data[initial_bar_charts]",data["initial_bar_charts"])
      setBestSchedule(data["best_schedule"]);// 存储后端返回的结果
      setChangedBarCharts(data["changed_bar_charts"]);
      setInitialBarCharts(data["initial_bar_charts"]);

    } catch (error) {
      console.error('Error sending data to backend:', error);
      setErrors(prevErrors => ({
        ...prevErrors,
        backend: 'Failed to connect to server. Please try again later.'
      }));
    }
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="task-app">
      <h1>Task Management(Resuorce balance)</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task">Task Name:</label>
          <input
            type="text"
            id="task"
            name="task"
            value={formData.task}
            onChange={handleChange}
            className={errors.task ? 'error-input' : ''}
          />
          {errors.task && <span className="error-message">{errors.task}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="resource_needed">Resource Needed:</label>
          <input
            type="number"
            id="resource_needed"
            name="resource_needed"
            value={formData.resource_needed}
            onChange={handleChange}
            min="0"
            className={errors.resource_needed ? 'error-input' : ''}
          />
          {errors.resource_needed && <span className="error-message">{errors.resource_needed}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration:</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            step="1"
            className={errors.duration ? 'error-input' : ''}
          />
          {errors.duration && <span className="error-message">{errors.duration}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="start_time">Start Time:</label>
          <input
            type="number"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            min="0"
            className={errors.start_time ? 'error-input' : ''}
          />
          {errors.start_time && <span className="error-message">{errors.start_time}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="end_time">End Time:</label>
          <input
            type="number"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            min="1"
            step="1"
            className={errors.end_time ? 'error-input' : ''}
          />
          {errors.end_time && <span className="error-message">{errors.end_time}</span>}
        </div>
        <button type="submit" className="submit-button">Add Task</button>
      </form>

      <div className="form-group">
        <label htmlFor="max_duration">Max Duration:</label>
        <input
          type="number"
          id="max_duration"
          name="max_duration"
          value={maxDuration}
          onChange={handleMaxDurationChange}
          min="1"
          step="1"
          className={errors.max_duration ? 'error-input' : ''}
        />
        {errors.max_duration && <span className="error-message">{errors.max_duration}</span>}
      </div>

      <div className="task-list">
        <h2>Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks added yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Resource Needed</th>
                <th>Duration</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.task}</td>
                  <td>{task.resource_needed}</td>
                  <td>{task.duration}</td>
                  <td>{task.start_time}</td>
                  <td>{task.end_time}</td>
                  <td>
                    <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
          <button type="submit" className="submit-button" onClick={handleSubmitTasks}>Submit Tasks</button>
      </div>
      <div>
          <ResultDisplay3 data={bestSchedule} />
          <h3 className="chart-title">initialBarCharts</h3>
          <TaskBarChart data={initialBarCharts} />
          <h3 className="chart-title">changedBarCharts</h3>
          <TaskBarChart data={changedBarCharts} />
      </div>
    </div>
  );
}