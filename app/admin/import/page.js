"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, FileSpreadsheet, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Papa from "papaparse";

export default function ImportPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);

    // 1. Parse the CSV file locally
    Papa.parse(file, {
      header: true, // Use the first row as keys (name, price, etc.)
      skipEmptyLines: true,
      complete: async (results) => {
        // 2. Send parsed data to API
        try {
          const res = await fetch("/api/admin/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: results.data }),
          });

          const data = await res.json();

          if (res.ok) {
            setSummary(data);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError("Network error occurred.");
        } finally {
          setUploading(false);
        }
      },
      error: (err) => {
        setError("Could not parse CSV file: " + err.message);
        setUploading(false);
      }
    });
  };

  if (summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="font-oswald text-4xl font-bold uppercase">Import Successful!</h1>
        <p className="text-concrete mt-2 text-lg">Added {summary.count} new products to inventory.</p>
        <div className="flex gap-4 mt-8">
             <Link href="/admin/inventory">
                <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all">
                    View Inventory
                </button>
             </Link>
             <button onClick={() => window.location.reload()} className="text-concrete hover:text-black underline">
                Import More
             </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/admin" className="inline-flex items-center text-concrete hover:text-black mb-8 font-bold text-sm uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-neutral-100">
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-green-50 rounded-full text-green-600">
                <FileSpreadsheet className="w-8 h-8" />
             </div>
             <div>
                <h1 className="font-oswald text-3xl font-bold uppercase">Bulk Import</h1>
                <p className="text-concrete text-sm">Upload a .CSV file to add products instantly.</p>
             </div>
          </div>

          {/* Template Download Link */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
             <p className="font-bold mb-1">💡 Required CSV Columns:</p>
             <p className="font-mono text-xs">name, brand, price, category, gender, description, images</p>
          </div>

          <label className={`border-2 border-dashed border-neutral-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-neutral-50 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
             <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
             
             {uploading ? (
                 <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
             ) : (
                 <Upload className="w-12 h-12 text-neutral-300 group-hover:text-black mb-4 transition-colors" />
             )}
             
             <span className="font-bold text-lg group-hover:text-electric-blue transition-colors">
                {uploading ? "Processing..." : "Click to Select CSV"}
             </span>
             <p className="text-concrete text-sm mt-2">Supports .csv files only</p>
          </label>

          {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                      <p className="font-bold">Import Failed</p>
                      <p className="text-sm">{error}</p>
                  </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}