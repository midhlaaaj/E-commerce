'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (min: number, max: number) => void;
  initialMin?: number;
  initialMax?: number;
}

export const PriceRangeSlider = ({ 
  min, 
  max, 
  step = 10, 
  onChange,
  initialMin,
  initialMax
}: PriceRangeSliderProps) => {
  const [minVal, setMinVal] = useState(initialMin ?? min);
  const [maxVal, setMaxVal] = useState(initialMax ?? max);
  const minValRef = useRef(initialMin ?? min);
  const maxValRef = useRef(initialMax ?? max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range selection from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range selection from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange(minVal, maxVal);
  }, [minVal, maxVal, onChange]);

  return (
    <div className="flex flex-col space-y-8 w-full px-2 py-4">
      <div className="relative w-full h-1 bg-gray-100 rounded-full">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range bg-[#D97706]" />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Starting at</span>
          <span className="text-sm font-black text-[#1A1614] leading-none">₹{minVal.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Up to</span>
          <span className="text-sm font-black text-[#1A1614] leading-none">₹{maxVal.toLocaleString()}</span>
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
          height: 0;
          width: 100%;
          outline: none;
        }

        /* Thumb appearance */
        .thumb::-webkit-slider-thumb {
          background-color: #1A1614;
          border: 2px solid #D97706;
          border-radius: 50%;
          cursor: pointer;
          height: 16px;
          width: 16px;
          margin-top: -6px;
          pointer-events: all;
          position: relative;
          transition: all 0.2s ease;
        }

        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background-color: #000;
        }

        /* For Firefox */
        .thumb::-moz-range-thumb {
          background-color: #1A1614;
          border: 2px solid #D97706;
          border-radius: 50%;
          cursor: pointer;
          height: 16px;
          width: 16px;
          pointer-events: all;
          position: relative;
        }

        .slider {
          position: relative;
          width: 100%;
        }

        .slider__track,
        .slider__range {
          position: absolute;
          height: 3px;
          border-radius: 2px;
        }

        .slider__track {
          background-color: #f3f3f3;
          width: 100%;
          z-index: 1;
        }

        .slider__range {
          background-color: #D97706;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};
