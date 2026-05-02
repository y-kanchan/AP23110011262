// src/components/ScoreBar.tsx

import React from "react";

interface ScoreBarProps {
  score: number;
  weightScore: number;
  recencyScore: number;
}

export function ScoreBar({ score, weightScore, recencyScore }: ScoreBarProps) {
  return (
    <div className="score-bar-container" title={`Priority score: ${(score * 100).toFixed(1)}%`}>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${score * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(score * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="score-details">
        <span className="score-chip weight">W {(weightScore * 100).toFixed(0)}%</span>
        <span className="score-chip recency">R {(recencyScore * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
