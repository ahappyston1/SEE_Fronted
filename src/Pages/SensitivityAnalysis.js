// src/pages/RiskManagement.js
import React, { useState, useEffect } from 'react';
import CostBenefitForm from "../components/CostBenefitForm";
import ResultDisplay2 from "../components/ResultDisplay2";

export default function RiskManagement() {
  const [inputValues, setInputValues] = useState({
    initialCost: '',
    initialBenefit: '',
    changeCost: '',
    changeRevenue: '',
    developmentCostChange: 0,
    revenueAlteration: 0
  });

  const [analysisResults, setAnalysisResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    validateInputField(name, value);
  };

  const validateInputField = (name, value) => {
    let validationMessage = '';
    const numericValue = parseFloat(value);

    switch (name) {
      case 'initialCost':
        if (!value) validationMessage = 'This field is mandatory';
        else if (isNaN(numericValue) || numericValue <= 0)
          validationMessage = 'Must be a positive number';
        break;
      case 'initialBenefit':
        if (!value) validationMessage = 'This field is mandatory';
        else if (isNaN(numericValue))
          validationMessage = 'Must be a valid number';
        break;
      case 'changeCost':
        if (!value) validationMessage = 'This field is mandatory';
        else if (isNaN(numericValue))
          validationMessage = 'Must be a valid number';
        break;
      case 'changeRevenue':
        if (!value) validationMessage = 'This field is mandatory';
        else if (isNaN(numericValue))
          validationMessage = 'Must be a valid number';
        break;
      case 'developmentCostChange':
        if (isNaN(numericValue))
          validationMessage = 'Must be a valid number';
        break;
      case 'revenueAlteration':
        if (isNaN(numericValue))
          validationMessage = 'Must be a valid number';
        break;
      default:
        break;
    }

    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: validationMessage
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const newValidationErrors = {};

    ['initialCost', 'initialBenefit', 'changeCost', 'changeRevenue', 'developmentCostChange', 'revenueAlteration'].forEach(field => {
      if (!inputValues[field] && field !== 'developmentCostChange' && field !== 'revenueAlteration') {
        newValidationErrors[field] = 'This field is mandatory';
        isValid = false;
      } else if (isNaN(parseFloat(inputValues[field]))) {
        if (field === 'initialCost') {
          newValidationErrors[field] = 'Must be a positive number';
        } else {
          newValidationErrors[field] = 'Must be a valid number';
        }
        isValid = false;
      } else if (field === 'initialCost' && parseFloat(inputValues[field]) <= 0) {
        newValidationErrors[field] = 'Must be a positive number';
        isValid = false;
      }
    });

    setValidationErrors(newValidationErrors);

    if (isValid) {
      // Calculate results
      const formData = {
        'initial_costs':parseFloat(inputValues.initialCost),
        'initial_benefits':parseFloat(inputValues.initialBenefit),
        'change_costs':parseFloat(inputValues.changeCost),
        'change_revenue':parseFloat(inputValues.changeRevenue),
        'dev_cost_change':parseFloat(inputValues.developmentCostChange),
        'revenue_change':parseFloat(inputValues.revenueAlteration),
      }

      try {
        setLoading(true); // 开始加载

        console.log('Sending request to API with data:', inputValues);

        // 发送数据到后端
        const response = await fetch('http://127.0.0.1:5000/riskmanagement/sensitivity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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
        console.log("data:",data)
        setAnalysisResults(data);// 存储后端返回的结果

      } catch (error) {
        console.error('Error sending data to backend:', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          backend: 'Failed to connect to server. Please try again later.'
        }));
      } finally {
        setLoading(false); // 结束加载
      }
    }
  };

  const handleFormReset = () => {
    setInputValues({
      initialCost: '',
      initialBenefit: '',
      changeCost: '',
      changeRevenue: '',
      developmentCostChange: 0,
      revenueAlteration: 0
    });
    setValidationErrors({});
    setAnalysisResults(null);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Sensitivity Analysis</h1>
      <CostBenefitForm
        formData={inputValues}
        errors={validationErrors}
        handleInputChange={handleFieldChange}
        handleSubmit={handleFormSubmit}
        handleReset={handleFormReset}
      />
      {analysisResults && <ResultDisplay2 results={analysisResults} />}
    </div>
  );
}