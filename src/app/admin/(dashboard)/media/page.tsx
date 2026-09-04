"use client";

import React from "react";
import { ImageIcon, Cloud, Settings2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MediaLibraryPage() {
  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading flex items-center">
          <ImageIcon className="w-8 h-8 mr-3 text-orange-400" />
          Media Library
        </h1>
      </div>

      <div className="bg-[#131C31] border border-white/10 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Cloud className="w-12 h-12 text-blue-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Cloud Storage Integration Required</h2>
        
        <p className="text-slate-400 max-w-lg mb-8 leading-relaxed">
          The Media Library module requires an active integration with a cloud storage provider (like Amazon S3, Cloudinary, or Google Cloud Storage) to handle file uploads, optimization, and global CDN delivery.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-xl max-w-lg mb-8 text-sm flex items-start text-left">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Current Workaround</span>
            For now, you can continue to use external image URLs (e.g., from Unsplash, Imgur, or your existing CDN) directly in the image input fields across Blogs, Products, and Services.
          </div>
        </div>

        <Link 
          href="/admin/settings"
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all"
        >
          <Settings2 className="w-5 h-5 mr-2" />
          Configure Integrations in Settings
        </Link>
      </div>
    </div>
  );
}
