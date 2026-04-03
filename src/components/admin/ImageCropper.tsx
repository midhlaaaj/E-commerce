'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '@/lib/cropImage';
import { Check, X, Loader2, ArrowRight, Monitor, Smartphone } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  originalFile: File;
  onCropComplete: (desktopFile: File, mobileFile: File, desktopPreview: string, mobilePreview: string) => void;
  onCancel: () => void;
}

export function ImageCropper({ imageSrc, originalFile, onCropComplete, onCancel }: ImageCropperProps) {
  const [step, setStep] = useState<'desktop' | 'mobile'>('desktop');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [desktopResult, setDesktopResult] = useState<{ file: File; preview: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Initialize crop with aspect ratio when image loads or step changes
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = step === 'desktop' ? 16 / 9 : 9 / 16;
    
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  };

  // Reset crop when step changes
  useEffect(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const aspect = step === 'desktop' ? 16 / 9 : 9 / 16;
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    }
  }, [step]);

  const handleApplyStep = async () => {
    if (!completedCrop || !imgRef.current) return;
    
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        `${step}-${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg` 
      );
      const previewUrl = URL.createObjectURL(croppedFile);

      if (step === 'desktop') {
        setDesktopResult({ file: croppedFile, preview: previewUrl });
        setStep('mobile');
      } else {
        if (desktopResult) {
          onCropComplete(desktopResult.file, croppedFile, desktopResult.preview, previewUrl);
        }
      }
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col w-full max-w-5xl max-h-full animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${step === 'desktop' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Monitor size={18} />
            </div>
            <div className="h-px w-4 bg-gray-200" />
            <div className={`p-2 rounded-lg ${step === 'mobile' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Smartphone size={18} />
            </div>
            <div className="ml-2">
              <h3 className="font-heading font-black text-xl italic tracking-tighter uppercase">
                {step === 'desktop' ? 'Step 1: Desktop View' : 'Step 2: Mobile View'}
              </h3>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">
                {step === 'desktop' ? 'Crop for laptops and monitors (16:9)' : 'Crop for mobile devices (9:16)'}
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Body */}
        <div className="flex-1 bg-[#F8F8F8] p-4 flex items-center justify-center overflow-visible min-h-0">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={step === 'desktop' ? 16 / 9 : 9 / 16}
            className="shadow-lg !max-w-full"
            style={{ maxHeight: 'calc(100vh - 300px)' }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop selection"
              className="object-contain mx-auto block"
              style={{ maxHeight: 'calc(100vh - 300px)', width: 'auto' }}
              onLoad={onImageLoad}
              crossOrigin="anonymous" 
            />
          </ReactCrop>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {step === 'desktop' ? 'Step 1 of 2' : 'Step 2 of 2'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyStep}
              disabled={isProcessing || !completedCrop}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-[#D97706] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : step === 'desktop' ? (
                <>
                  Next: Mobile Crop
                  <ArrowRight size={16} />
                </>
              ) : (
               <>
                 <Check size={16} />
                 Finish & Save
               </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

