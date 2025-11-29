"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash, X } from 'lucide-react';
import Image from 'next/image';

export default function ImageUpload({ value = [], onChange, onRemove }) {
  
  // 🛡️ SAFETY CHECK: Ensure 'value' is always an array
  // If it's a string (old data), wrap it in []. If null, make it [].
  const formattedValue = Array.isArray(value) ? value : (value ? [value] : []);

  const handleUpload = (result) => {
    // Add new URL to the existing array
    onChange([...formattedValue, result.info.secure_url]);
  };

  const handleRemove = (urlToRemove) => {
    // Filter out the specific URL
    const newValues = formattedValue.filter((url) => url !== urlToRemove);
    // If we pass a specific onRemove handler (like in the parent), use it, 
    // otherwise call onChange with the new array
    if (onRemove) {
        onRemove(newValues);
    } else {
        onChange(newValues);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {/* 1. Show Existing Images */}
        {formattedValue.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 group">
            <div className="absolute top-2 right-2 z-10">
              <button 
                type="button" 
                onClick={() => handleRemove(url)}
                className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <Image 
              fill 
              className="object-cover" 
              alt="Upload" 
              src={url} 
            />
          </div>
        ))}
      </div>

      {/* 2. Upload Button */}
      <CldUploadWidget 
        uploadPreset="buba_uploads" // ⚠️ REPLACE WITH YOUR PRESET IF DIFFERENT
        onSuccess={handleUpload}
        options={{
            maxFiles: 5, 
            resourceType: "image",
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 bg-neutral-50 hover:bg-neutral-100 text-concrete hover:text-black px-6 py-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-all w-full justify-center group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6 text-electric-blue" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wide">
                    {formattedValue.length > 0 ? 'Add More Images' : 'Upload Images'}
                </span>
              </div>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}