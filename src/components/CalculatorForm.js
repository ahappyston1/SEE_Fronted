import React from 'react';

const CalculatorForm = ({
  formData,
  errors,
  handleInputChange,
  handleCostDriverChange,
  handlePhaseAdjustmentChange,
  handleSubmit,
  handleReset,
  showCostDrivers,
  showPhaseAdjustments
}) => {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* COCOMO Type Section */}
      <div className="form-section">
        <h2 className="section-title">COCOMO Type</h2>
        <div className="form-group">
          <label htmlFor="cocomoType">COCOMO Model:</label>
          <select
            id="cocomoType"
            name="cocomoType"
            value={formData.cocomoType}
            onChange={handleInputChange}
            className={errors.cocomoType ? 'error-input' : ''}
          >
            <option value="">Select COCOMO type</option>
            <option value="basic">Basic COCOMO</option>
            <option value="intermediate">Intermediate COCOMO</option>
            <option value="detailed">Detailed COCOMO</option>
          </select>
          {errors.cocomoType && (
            <span className="error-message">{errors.cocomoType}</span>
          )}
        </div>
      </div>

      {/* Project Size Section */}
      <div className="form-section">
        <h2 className="section-title">Project Size</h2>
        <div className="form-group">
          <label htmlFor="kloc">Kilo Lines of Code (KLOC):</label>
          <input
            type="number"
            id="kloc"
            name="kloc"
            value={formData.kloc}
            onChange={handleInputChange}
            className={errors.kloc ? 'error-input' : ''}
          />
          {errors.kloc && (
            <span className="error-message">{errors.kloc}</span>
          )}
        </div>
      </div>

      {/* Project Type Section */}
      <div className="form-section">
        <h2 className="section-title">Project Type</h2>
        <div className="form-group">
          <label htmlFor="projectType">Project Type:</label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            className={errors.projectType ? 'error-input' : ''}
          >
            <option value="">Select project type</option>
            <option value="Organic">Organic</option>
            <option value="Semi-detached">Semi-detached</option>
            <option value="Embedded">Embedded</option>
          </select>
          {errors.projectType && (
            <span className="error-message">{errors.projectType}</span>
          )}
        </div>
      </div>

      {/* Cost Drivers Section (Conditionally Rendered) */}
      {showCostDrivers && (
        <div className="form-section">
          <h2 className="section-title">Cost Drivers</h2>

          {/* RELY Driver */}
          <div className="form-group">
            <label htmlFor="RELY">
              Required Software Reliability (RELY):
              <span className="range-indicator">(0.75-1.40)</span>
            </label>
            <input
              type="number"
              id="RELY"
              name="RELY"
              step="0.01"
              min="0.75"
              max="1.40"
              value={formData.costDrivers.RELY}
              onChange={(e) => handleCostDriverChange('RELY', e.target.value)}
              className={errors['costDrivers.RELY'] ? 'error-input' : ''}
            />
            {errors['costDrivers.RELY'] && (
              <span className="error-message">{errors['costDrivers.RELY']}</span>
            )}
          </div>

          {/* DATA Driver */}
          <div className="form-group">
            <label htmlFor="DATA">
              Database Size (DATA):
              <span className="range-indicator">(0.94-1.16)</span>
            </label>
            <input
              type="number"
              id="DATA"
              name="DATA"
              step="0.01"
              min="0.94"
              max="1.16"
              value={formData.costDrivers.DATA}
              onChange={(e) => handleCostDriverChange('DATA', e.target.value)}
              className={errors['costDrivers.DATA'] ? 'error-input' : ''}
            />
            {errors['costDrivers.DATA'] && (
              <span className="error-message">{errors['costDrivers.DATA']}</span>
            )}
          </div>

          {/* CPLX Driver */}
          <div className="form-group">
            <label htmlFor="CPLX">
              Product Complexity (CPLX):
              <span className="range-indicator">(0.70-1.65)</span>
            </label>
            <input
              type="number"
              id="CPLX"
              name="CPLX"
              step="0.01"
              min="0.70"
              max="1.65"
              value={formData.costDrivers.CPLX}
              onChange={(e) => handleCostDriverChange('CPLX', e.target.value)}
              className={errors['costDrivers.CPLX'] ? 'error-input' : ''}
            />
            {errors['costDrivers.CPLX'] && (
              <span className="error-message">{errors['costDrivers.CPLX']}</span>
            )}
          </div>
        </div>
      )}

      {/* Phase Adjustments Section (Conditionally Rendered) */}
      {showPhaseAdjustments && (
        <div className="form-section">
          <h2 className="section-title">Phase Adjustments</h2>

          {/* Design Phase */}
          <div className="form-group">
            <label htmlFor="Design">
              Design Phase (%):
            </label>
            <input
              type="number"
              id="Design"
              name="Design"
              step="1"
              value={formData.phaseAdjustments.Design}
              onChange={(e) => handlePhaseAdjustmentChange('Design', e.target.value)}
              className={errors['phaseAdjustments.Design'] ? 'error-input' : ''}
            />
            {errors['phaseAdjustments.Design'] && (
              <span className="error-message">{errors['phaseAdjustments.Design']}</span>
            )}
          </div>

          {/* Coding Phase */}
          <div className="form-group">
            <label htmlFor="Coding">
              Coding Phase (%):
            </label>
            <input
              type="number"
              id="Coding"
              name="Coding"
              step="1"
              value={formData.phaseAdjustments.Coding}
              onChange={(e) => handlePhaseAdjustmentChange('Coding', e.target.value)}
              className={errors['phaseAdjustments.Coding'] ? 'error-input' : ''}
            />
            {errors['phaseAdjustments.Coding'] && (
              <span className="error-message">{errors['phaseAdjustments.Coding']}</span>
            )}
          </div>

          {/* Testing Phase */}
          <div className="form-group">
            <label htmlFor="Testing">
              Testing Phase (%):
            </label>
            <input
              type="number"
              id="Testing"
              name="Testing"
              step="1"
              value={formData.phaseAdjustments.Testing}
              onChange={(e) => handlePhaseAdjustmentChange('Testing', e.target.value)}
              className={errors['phaseAdjustments.Testing'] ? 'error-input' : ''}
            />
            {errors['phaseAdjustments.Testing'] && (
              <span className="error-message">{errors['phaseAdjustments.Testing']}</span>
            )}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={handleReset}
          className="reset-button"
        >
          Reset
        </button>
        <button
          type="submit"
          className="submit-button"
        >
          Calculate
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;