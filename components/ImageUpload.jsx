"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';

export default function ImageUpload({ value, onChange, onRemove }) {
  
  const handleUpload = (result) => {
    onChange(result.info.secure_url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
            <div className="absolute top-2 right-2 z-10">
              <button 
                type="button" 
                onClick={() => onRemove(value)}
                className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <Image 
              fill 
              className="object-cover" 
              alt="Upload" 
              src={value} 
            />
          </div>
        )}
      </div>

      <CldUploadWidget 
        // 1. PASTE THE NEW PRESET NAME YOU JUST CREATED HERE
        uploadPreset="buba_uploads" 
        
        options={{
            // 2. PASTE YOUR CLOUD NAME HERE (doevklqj6)
            cloudName: 'doevklqj6', 
            maxFiles: 1,
            resourceType: "image"
        }}
        
        onSuccess={handleUpload}
        onError={(err) => console.error("Widget Error:", err)}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 bg-neutral-50 hover:bg-neutral-100 text-concrete hover:text-black px-6 py-8 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-all w-full justify-center group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6 text-electric-blue" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wide">Click to Upload Image</span>
              </div>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}