import React, { useState } from 'react';

const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    countryName: '',
    lifeExpectancy: '',
    meanYearsSchooling: '',
    expectedYearsSchooling: '',
    gniPerCapita: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    const le = Number(formData.lifeExpectancy);
    if (!formData.lifeExpectancy) {
      newErrors.lifeExpectancy = 'Required';
    } else if (isNaN(le) || le < 20 || le > 100) {
      newErrors.lifeExpectancy = 'Must be between 20 and 100';
    }

    const mys = Number(formData.meanYearsSchooling);
    if (!formData.meanYearsSchooling) {
      newErrors.meanYearsSchooling = 'Required';
    } else if (isNaN(mys) || mys < 0 || mys > 25) {
      newErrors.meanYearsSchooling = 'Must be between 0 and 25';
    }

    const eys = Number(formData.expectedYearsSchooling);
    if (!formData.expectedYearsSchooling) {
      newErrors.expectedYearsSchooling = 'Required';
    } else if (isNaN(eys) || eys < 0 || eys > 30) {
      newErrors.expectedYearsSchooling = 'Must be between 0 and 30';
    }

    const gni = Number(formData.gniPerCapita);
    if (!formData.gniPerCapita) {
      newErrors.gniPerCapita = 'Required';
    } else if (isNaN(gni) || gni < 100 || gni > 150000) {
      newErrors.gniPerCapita = 'Must be $100 – $150,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="glass-card">
      <h2 className="form-card-title">Development Indicators</h2>
      <p className="form-card-subtitle">
        Enter a country's key metrics or use the preset pills above for quick analysis.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Country name */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" htmlFor="countryName">Country Name (Optional)</label>
          <div className="input-wrapper">
            <span className="input-icon">🌍</span>
            <input
              type="text"
              id="countryName"
              name="countryName"
              value={formData.countryName}
              onChange={handleInputChange}
              placeholder="e.g., Sweden, Brazil, Kenya"
              disabled={isLoading}
              className="form-control has-icon"
            />
          </div>
        </div>

        {/* 2×2 Indicator grid */}
        <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="lifeExpectancy">Life Expectancy (Years)</label>
            <div className="input-wrapper">
              <span className="input-icon">❤️</span>
              <input
                type="number"
                step="0.1"
                id="lifeExpectancy"
                name="lifeExpectancy"
                value={formData.lifeExpectancy}
                onChange={handleInputChange}
                placeholder="e.g., 75.2"
                disabled={isLoading}
                className={`form-control has-icon ${errors.lifeExpectancy ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.lifeExpectancy && <span className="error-text">{errors.lifeExpectancy}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gniPerCapita">GNI per Capita (PPP $)</label>
            <div className="input-wrapper">
              <span className="input-icon">💵</span>
              <input
                type="number"
                step="1"
                id="gniPerCapita"
                name="gniPerCapita"
                value={formData.gniPerCapita}
                onChange={handleInputChange}
                placeholder="e.g., 18500"
                disabled={isLoading}
                className={`form-control has-icon ${errors.gniPerCapita ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.gniPerCapita && <span className="error-text">{errors.gniPerCapita}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="expectedYearsSchooling">Expected Schooling (Years)</label>
            <div className="input-wrapper">
              <span className="input-icon">📚</span>
              <input
                type="number"
                step="0.1"
                id="expectedYearsSchooling"
                name="expectedYearsSchooling"
                value={formData.expectedYearsSchooling}
                onChange={handleInputChange}
                placeholder="e.g., 13.8"
                disabled={isLoading}
                className={`form-control has-icon ${errors.expectedYearsSchooling ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.expectedYearsSchooling && <span className="error-text">{errors.expectedYearsSchooling}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meanYearsSchooling">Mean Schooling (Years)</label>
            <div className="input-wrapper">
              <span className="input-icon">🎓</span>
              <input
                type="number"
                step="0.1"
                id="meanYearsSchooling"
                name="meanYearsSchooling"
                value={formData.meanYearsSchooling}
                onChange={handleInputChange}
                placeholder="e.g., 10.5"
                disabled={isLoading}
                className={`form-control has-icon ${errors.meanYearsSchooling ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.meanYearsSchooling && <span className="error-text">{errors.meanYearsSchooling}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner-container">
              <span className="spinner"></span> Analyzing...
            </span>
          ) : (
            <>Calculate HDI Index <span className="btn-icon">→</span></>
          )}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
