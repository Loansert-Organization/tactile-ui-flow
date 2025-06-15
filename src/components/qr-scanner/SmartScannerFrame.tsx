
import React from 'react';

interface SmartScannerFrameProps {
  borderColor?: string;
  borderThickness?: number;
  scannerState?: 'scanning' | 'success' | 'failed';
}

export const SmartScannerFrame = ({
  borderColor = "#396afc",
  borderThickness = 3,
  scannerState = 'scanning',
}: SmartScannerFrameProps) => {
  // 70vw = responsive size on most mobiles, with minimum/maximum constraint
  return (
    <div
      className="relative"
      style={{
        width: 'min(70vw, 410px)',
        height: 'min(70vw, 410px)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        background: 'rgba(30,30,38,0.16)',
        boxShadow: '0 1px 18px 0 rgba(56,120,255,0.18)',
        minWidth: 240,
        minHeight: 240,
        maxWidth: 410,
        maxHeight: 410,
        transition: 'border-color 0.3s',
        outline: scannerState === 'success'
          ? '3px solid #00c853'
          : scannerState === 'failed'
            ? '3px solid #ef5350'
            : undefined
      }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 12,
          border: `${borderThickness}px solid transparent`,
          background: 'conic-gradient(from 0deg, #396afc, #6A00F4, #00c853, #396afc)',
          WebkitMaskImage: 'linear-gradient(#fff 0 0)',
          maskImage: 'linear-gradient(#fff 0 0)',
          animation: scannerState === 'scanning' ? 'shimmer-qr 10s linear infinite' : undefined,
          zIndex: 2
        }}
      />
      {/* Inner content */}
      <div
        className="absolute inset-[6px] bg-black/30 rounded-[8px]"
        style={{
          boxShadow: '0 1px 20px #396afc44, 0 0 0 2px #396afc55 inset',
          pointerEvents: 'none'
        }}
      ></div>
      <style>
        {`
        @keyframes shimmer-qr {
          100% { filter: hue-rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
}
