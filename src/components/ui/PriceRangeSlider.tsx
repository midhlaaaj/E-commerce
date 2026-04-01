'use client';

import { useRef, useCallback, useEffect } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

export const PriceRangeSlider = ({ 
  min, 
  max, 
  valueMin,
  valueMax,
  step = 10, 
  onChange
}: PriceRangeSliderProps) => {
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => {
      const rangeVal = max - min;
      if (rangeVal <= 0) return 0;
      return Math.round(((value - min) / rangeVal) * 100);
    },
    [min, max]
  );

  // Update visual range track
  useEffect(() => {
    const minPercent = getPercent(valueMin);
    const maxPercent = getPercent(valueMax);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [valueMin, valueMax, getPercent]);

  return (
    <div className="flex flex-col space-y-7 w-full py-2">
      <div className="relative w-full h-4 flex items-center group overflow-hidden">
        {/* Track Background */}
        <div className="absolute w-full h-[1.5px] bg-gray-100 rounded-full" />
        
        {/* Active Range Line */}
        <div 
          ref={range} 
          className="absolute h-[2px] bg-black z-[1] transition-all duration-75"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(event) => {
            const val = Math.min(Number(event.target.value), valueMax - step);
            onChange(val, valueMax);
          }}
          className="thumb thumb--left"
          style={{ zIndex: valueMin > max - 100 ? "10" : "5" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(event) => {
            const val = Math.max(Number(event.target.value), valueMin + step);
            onChange(valueMin, val);
          }}
          className="thumb thumb--right"
          style={{ zIndex: "5" }}
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-1">From</span>
          <span className="text-[11px] font-black text-[#1A1614]">₹{valueMin.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-1">To</span>
          <span className="text-[11px] font-black text-[#1A1614]">₹{valueMax.toLocaleString()}</span>
        </div>
      </div>

      <style jsx>{`
        .thumb,
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb {
          pointer-events: none;
          position: absolute;
          height: 16px;
          width: 100%;
          outline: none;
          background: transparent;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          margin: 0;
          z-index: 10;
        }

        /* Webkit Thumbs */
        .thumb::-webkit-slider-thumb {
          background-color: #000;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 50%;
          cursor: grab;
          height: 12px;
          width: 12px;
          pointer-events: all;
          position: relative;
          transition: transform 0.1s ease;
        }

        .thumb::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }

        /* Firefox Thumbs */
        .thumb::-moz-range-thumb {
          background-color: #000;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 50%;
          cursor: grab;
          height: 12px;
          width: 12px;
          pointer-events: all;
          position: relative;
        }
      `}</style>
    </div>
  );
};
