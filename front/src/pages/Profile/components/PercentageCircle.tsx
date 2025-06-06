import React from 'react';
import './circle.css';

interface PercentageCircleProps {
  easy: number;
  medium: number;
  hard: number;
}

const PercentageCircle: React.FC<PercentageCircleProps> = ({ easy, medium, hard }) => {
  // Calculate the total number of problems solved
  const total = easy + medium + hard;

  // Circle's total circumference (using radius of 50.625)
  const radius = 50.625;
  const circumference = 2 * Math.PI * radius;

  // Top 3/5 of the circle's circumference
  const visibleCircumference = (3 / 5) * circumference;

  // Calculate the stroke lengths for Easy, Medium, and Hard based on their percentages
  const easyLength = (easy / total) * visibleCircumference;
  const mediumLength = (medium / total) * visibleCircumference;
  const hardLength = (hard / total) * visibleCircumference;

  return (
    <div className="circleContainer">
      {/* Background Circle */}
      <div className="backgroundCircle"></div>

      {/* SVG Circle */}
      <svg viewBox="0 0 108 108" className="svgCircle">
        {/* Easy Circle (1/3 of top 3/5 portion) */}
        <circle
          cx="54"
          cy="54"
          r={radius}
          className="easyCircle"
          style={{
            strokeDasharray: easyLength,
            strokeDashoffset: 0, // Start from the top
          }}
        ></circle>

        {/* Medium Circle (1/3 of top 3/5 portion) */}
        <circle
          cx="54"
          cy="54"
          r={radius}
          className="mediumCircle"
          style={{
            strokeDasharray: mediumLength,
            strokeDashoffset: easyLength, // Start after the Easy section
          }}
        ></circle>

        {/* Hard Circle (1/3 of top 3/5 portion) */}
        <circle
          cx="54"
          cy="54"
          r={radius}
          className="hardCircle"
          style={{
            strokeDasharray: hardLength,
            strokeDashoffset: easyLength + mediumLength, // Start after the Medium section
          }}
        ></circle>
      </svg>

      {/* Circle Text */}
      <div className="circleTextContainer">
        <div>
          <div className="circelPercentage">
            <span>{easy + medium + hard}</span>
          </div>
          <div className="status">Solved</div>
        </div>
      </div>
    </div>
  );
};

export default PercentageCircle;
