"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, X, ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ShopClientWrapper({ 
  children, 
  resolvedSearchParams, 
  activeFilterCount,
  activeSort,
  mobileFilters // Received from page.js
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchParams = useSearchParams();

  // Close menus when filters change/apply
  useEffect(() => {
    setIsFilterOpen(false);
    setIsSortOpen(false);
  }, [searchParams]);

  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  return (
    <>
      {/* HEADER TOOLS (Mobile 50/50 Split Action Bar) */}
      <div className="flex w-full lg:w-auto items-center lg:gap-4 bg-neutral-100 lg:bg-transparent rounded-xl lg:rounded-none p-1 lg:p-0">
        
        {/* Mobile Filter Button */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden flex-1 flex items-center justify-center gap-2 px-2 py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm border border-neutral-200/50 transition-all active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {activeFilterCount > 0 && (
             <span className="bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Sort Dropdown Toggle */}
        <div className="lg:hidden flex-1 relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
            className={`w-full flex items-center justify-center gap-2 px-2 py-3 text-black rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isSortOpen ? 'bg-white shadow-sm border border-neutral-200/50' : 'bg-transparent text-neutral-600'}`}
          >
            <ArrowDownUp className="w-4 h-4" />
            Sort
          </button>
          
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-3 w-[200px] bg-white border border-neutral-100 shadow-xl rounded-xl p-2 z-50 animate-fade-in origin-top-right">
              <div className="text-[10px] font-bold text-concrete uppercase tracking-widest px-3 py-2 border-b border-neutral-100 mb-1">Sort By</div>
              {sortOptions.map((option) => (
                <Link 
                  key={option.value}
                  href={{ query: { ...resolvedSearchParams, sort: option.value } }} 
                  className={`block w-full text-left px-3 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                    activeSort === option.value ? 'bg-black text-white' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP Action Tools */}
        <div className="hidden lg:flex items-center gap-6">
           <div className="relative">
             <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-black transition-colors px-2 py-1 uppercase tracking-widest"
              >
                Sort: <span className="text-black">{sortOptions.find(o => o.value === activeSort)?.label || 'Newest'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
             </button>
              
             {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-100 shadow-xl rounded-xl p-2 z-50 animate-fade-in origin-top-right">
                  {sortOptions.map((option) => (
                    <Link 
                      key={option.value}
                      href={{ query: { ...resolvedSearchParams, sort: option.value } }} 
                      className={`block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                        activeSort === option.value ? 'bg-black text-white shadow-md' : 'hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              )}
           </div>
        </div>

      </div>

      {/* MOBILE FILTER DRAWER (UPDATED SIZE) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 justify-end flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full sm:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white">
              <h2 className="font-oswald text-xl uppercase tracking-widest font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-24">
               {mobileFilters}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-neutral-100 bg-white/95 backdrop-blur-xl shrink-0 z-20">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-xl shadow-black/20"
              >
                View Sneakers
              </button>
               {/* Safe Area Spacer */}
              <div className="h-safe-bottom"></div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE CONTENT (Product Grid) */}
      {children}
    </>
  );
}