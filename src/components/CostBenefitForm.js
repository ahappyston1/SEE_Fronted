import React from 'react';

const CostBenefitForm = ({
  formData,
  errors,
  handleInputChange,
  handleSubmit,
  handleReset,
  loading // 接收加载状态
}) => {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-section">
        <h2 className="section-title">Initial Values</h2>

        <div className="form-group">
          <label htmlFor="initialCost">Initial Costs ($):</label>
          <input
            type="number"
            id="initialCost"
            name="initialCost"
            value={formData.initialCost}
            onChange={handleInputChange}
            className={errors.initialCost ? 'error-input' : ''}
          />
          {errors.initialCost && (
            <span className="error-message">{errors.initialCost}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="initialBenefit">Initial Benefits ($):</label>
          <input
            type="number"
            id="initialBenefit"
            name="initialBenefit"
            value={formData.initialBenefit}
            onChange={handleInputChange}
            className={errors.initialBenefit ? 'error-input' : ''}
          />
          {errors.initialBenefit && (
            <span className="error-message">{errors.initialBenefit}</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">Change Values</h2>

        <div className="form-group">
          <label htmlFor="changeCost">Change Costs ($):</label>
          <input
            type="number"
            id="changeCost"
            name="changeCost"
            value={formData.changeCost}
            onChange={handleInputChange}
            className={errors.changeCost ? 'error-input' : ''}
          />
          {errors.changeCost && (
            <span className="error-message">{errors.changeCost}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="changeRevenue">Change Revenue ($):</label>
          <input
            type="number"
            id="changeRevenue"
            name="changeRevenue"
            value={formData.changeRevenue}
            onChange={handleInputChange}
            className={errors.changeRevenue ? 'error-input' : ''}
          />
          {errors.changeRevenue && (
            <span className="error-message">{errors.changeRevenue}</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2 className="section-title">Additional Adjustments</h2>

        <div className="form-group">
          <label htmlFor="developmentCostChange">Development Cost Change ($):</label>
          <input
            type="number"
            id="developmentCostChange"
            name="developmentCostChange"
            value={formData.developmentCostChange}
            onChange={handleInputChange}
            className={errors.developmentCostChange ? 'error-input' : ''}
          />
          {errors.developmentCostChange && (
            <span className="error-message">{errors.developmentCostChange}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="revenueAlteration">Revenue Change ($):</label>
          <input
            type="number"
            id="revenueAlteration"
            name="revenueAlteration"
            value={formData.revenueAlteration}
            onChange={handleInputChange}
            className={errors.revenueAlteration ? 'error-input' : ''}
          />
          {errors.revenueAlteration && (
            <span className="error-message">{errors.revenueAlteration}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleReset} className="reset-button">
          Reset
        </button>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>
    </form>
  );
};

export default CostBenefitForm;