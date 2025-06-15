
import React from "react";

export const ScanSuccessCheck = () => (
  <svg
    width={48}
    height={48}
    fill="none"
    viewBox="0 0 48 48"
    className="animate-bounce-soft"
    style={{
      display: "block",
      filter: "drop-shadow(0 0 12px #00c85399)"
    }}
  >
    <circle
      cx={24}
      cy={24}
      r={24}
      fill="#00c853"
      opacity={0.8}
    />
    <path
      d="M16.5 24l6 6 9-13"
      stroke="#fff"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 30,
        strokeDashoffset: 30,
        animation: "check-stroke 0.7s cubic-bezier(0.66,0,0.3,1) forwards"
      }}
    />
    <style>{`
      @keyframes check-stroke {
        to { stroke-dashoffset: 0; }
      }
    `}</style>
  </svg>
);
