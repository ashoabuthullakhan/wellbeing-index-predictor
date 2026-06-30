import React, { useState, useEffect } from 'react';

const ResultCard = ({ result }) => {
  const [displayScore, setDisplayScore] = useState(0);

  if (!result) return null;

  const { hdiScore, hdiCategory, countryName, lifeExpectancy, meanYearsSchooling, expectedYearsSchooling, gniPerCapita, createdAt } = result;

  /* ── Animated count-up ── */
  useEffect(() => {
    setDisplayScore(0);
    const target = hdiScore;
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hdiScore]);

  /* ── Category-driven content ── */
  let cardClass = '';
  let headline = '';
  let description = '';
  let recommendations = [];

  switch (hdiCategory) {
    case 'Very High':
      cardClass = 'result-very-high';
      headline = 'Very High Development Detected.';
      description = 'This profile shows exceptional performance across health, education, and economic output — placing it among the most developed nations globally.';
      recommendations = [
        "Focus on environmental sustainability to decouple economic growth from carbon emissions.",
        "Invest in advanced R&D and artificial intelligence to maintain global competitiveness.",
        "Implement progressive policies to address localized income inequality and housing costs."
      ];
      break;
    case 'High':
      cardClass = 'result-high';
      headline = 'High Development Achieved.';
      description = 'This profile shows solid development outcomes with moderate room for improvement in specific dimensions like education or income.';
      recommendations = [
        "Expand access to tertiary and vocational education to boost the knowledge economy.",
        "Diversify the economic base away from heavy manufacturing and toward high-value services.",
        "Enhance preventative healthcare systems to push life expectancy margins higher."
      ];
      break;
    case 'Medium':
      cardClass = 'result-medium';
      headline = 'Development Gaps Identified.';
      description = 'This profile shows moderate development. Strategic investments in healthcare, education access, or economic growth could significantly improve outcomes.';
      recommendations = [
        "Prioritize universal secondary education to build a resilient and skilled workforce.",
        "Increase capital investment in foundational healthcare infrastructure and maternal health.",
        "Modernize agricultural and informal sectors to rapidly raise median income levels."
      ];
      break;
    case 'Low':
      cardClass = 'result-low';
      headline = 'Low Development Risk Flagged.';
      description = 'This profile faces significant developmental challenges across multiple dimensions. Urgent policy intervention is recommended.';
      recommendations = [
        "Coordinate with international bodies to secure funding for clean water and sanitation.",
        "Launch aggressive universal primary education campaigns to eradicate illiteracy.",
        "Focus on infectious disease prevention and childhood immunizations to rapidly improve lifespans."
      ];
      break;
    default:
      cardClass = '';
      headline = 'Analysis Complete.';
      description = 'HDI classification could not be determined.';
      recommendations = [];
  }

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`glass-card result-card ${cardClass} animate-slide-up`}>
      {/* Dynamic headline */}
      <h2 className="result-dynamic-headline">{headline}</h2>
      <p className="result-dynamic-desc">{description}</p>

      {/* Metric card with big score */}
      <div className="result-metric-card animate-count-up">
        <div className="result-score-big">{displayScore.toFixed(4)}</div>
        <div className="result-score-label">HDI Score</div>
        <span className="result-status-badge">
          <span>●</span> {hdiCategory} Human Development
        </span>
      </div>

      {/* Insight box */}
      <div className="insight-box">
        <h4 className="insight-title">Development Assessment</h4>
        <p className="insight-body">{description}</p>
      </div>

      {/* Recommendations Box */}
      {recommendations.length > 0 && (
        <div className="recommendation-box">
          <h4 className="recommendation-title">
            <span style={{ fontSize: '1.2rem' }}>💡</span> Strategic Recommendations
          </h4>
          <ul className="recommendation-list">
            {recommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Input summary */}
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-item-label">Life Expectancy</span>
          <span className="summary-item-value">{lifeExpectancy} Yrs</span>
        </div>
        <div className="summary-item">
          <span className="summary-item-label">Expected Schooling</span>
          <span className="summary-item-value">{expectedYearsSchooling} Yrs</span>
        </div>
        <div className="summary-item">
          <span className="summary-item-label">Mean Schooling</span>
          <span className="summary-item-value">{meanYearsSchooling} Yrs</span>
        </div>
        <div className="summary-item">
          <span className="summary-item-label">GNI per Capita</span>
          <span className="summary-item-value">${gniPerCapita?.toLocaleString()}</span>
        </div>
      </div>

      {/* Metadata pills */}
      <div className="result-meta-row">
        {countryName && (
          <span className="meta-pill">
            🌍 {countryName}
          </span>
        )}
        {createdAt && (
          <span className="meta-pill">
            📅 {formatDate(createdAt)}
          </span>
        )}
        <span className="meta-pill">
          🤖 ML Model v1
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
