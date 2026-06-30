import React, { useEffect, useState } from 'react';

const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 40 small particles with random positions and animation properties
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1, // 1px to 3px
      left: Math.random() * 100, // 0% to 100%
      top: Math.random() * 100, // 0% to 100%
      duration: Math.random() * 60 + 30, // 30s to 90s
      delay: Math.random() * -60, // Negative delay to stagger start
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 opacity
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles-container">
      {/* Drifting particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="bg-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        ></div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
