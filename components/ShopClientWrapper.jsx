"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import Link from "next/link";



export default function ShopClientWrapper({ 
  children, 
  resolvedSearchParams, 
  activeFilterCount,
  activeSort,
  mobileFilters // Received from page.js
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <>
      {/* HEADER TOOLS */}
      <div className="flex items-center gap-2">
        
        {/* Mobile Filter Button */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-electric-blue text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop Sort Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
            className="flex items-center gap-2 text-sm font-medium hover:text-electric-blue transition-colors px-2 py-1"
          >
            Sort By: <span className="font-bold text-black capitalize">{activeSort.replace('-', ' ')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl rounded-lg p-1 z-50 animate-fade-in">
              {[
                { label: 'Newest', value: 'newest' },
                { label: 'Price: Low-High', value: 'price-asc' },
                { label: 'Price: High-Low', value: 'price-desc' },
              ].map((option) => (
                <Link 
                  key={option.value}
                  href={{ query: { ...resolvedSearchParams, sort: option.value } }} 
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSort === option.value ? 'bg-neutral-50 font-bold text-electric-blue' : 'hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FILTER DRAWER (UPDATED SIZE) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          {/* CHANGED: Width is now w-full on mobile, max 400px on tablet */}
          <div className="relative w-full sm:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="font-sans text-lg font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               {/* The accordion content from page.js renders here */}
               {mobileFilters}
            </div>

            <div className="p-5 border-t border-neutral-100 bg-white z-10">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-electric-blue transition-colors shadow-lg"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE CONTENT (Product Grid) */}
      {children}
    </>
  );
}