"use client";

import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ImageUpload({ value = [], onChange, onRemove }) {
  
  // 🛡️ SAFETY CHECK: Ensure 'value' is always an array
  const formattedValue = Array.isArray(value) ? value : (value ? [value] : []);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState(null);

  const handleUpload = (result) => {
    onChange([...formattedValue, result.info.secure_url]);
  };

  const handleRemove = async (urlToRemove) => {
    setIsDeleting(true);
    setDeletingUrl(urlToRemove);

    try {
      // 1. Physically destroy image on Cloudinary via our secure backend route
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToRemove }),
      });

      if (!res.ok) {
         console.warn("Backend physical deletion skipped or failed. Proceeding with UI removal.", await res.json());
      } else {
         console.log("Cloudinary physical deletion successful.");
      }

      // 2. Remove from local UI/Database state
      const newValues = formattedValue.filter((url) => url !== urlToRemove);
      if (onRemove) {
          onRemove(newValues);
      } else {
          onChange(newValues);
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Network error while trying to delete the image.");
    } finally {
      setIsDeleting(false);
      setDeletingUrl(null);
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
                disabled={isDeleting && deletingUrl === url}
                onClick={() => handleRemove(url)}
                className={`p-2 rounded-full shadow-sm transition-colors ${
                  isDeleting && deletingUrl === url 
                   ? 'bg-neutral-800 text-white cursor-not-allowed' 
                   : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isDeleting && deletingUrl === url ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Loading Overlay */}
            {isDeleting && deletingUrl === url && (
               <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-0"></div>
            )}
            
            <Image 
              fill 
              className={`object-cover ${isDeleting && deletingUrl === url ? 'opacity-50' : ''}`} 
              alt="Upload" 
              src={url} 
            />
          </div>
        ))}
      </div>

      {/* 2. Upload Button */}
      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "buba_uploads"}
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
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center text-electric-blue">
                    <ImagePlus className="w-6 h-6" />
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