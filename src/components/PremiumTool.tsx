import { useState } from 'react';
import { FileSearch } from 'lucide-react';

export default function PremiumTool() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
        <FileSearch className="w-10 h-10 text-zinc-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Image Metadata Extractor</h3>
      <p className="text-zinc-400 max-w-md mb-8">
        This is a premium tool. You have successfully unlocked it by signing in! 
        Advanced image analysis and EXIF data extraction features are now available.
      </p>
      <div className="w-full max-w-lg p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600">
        Drop an image here to extract metadata (Premium Feature)
      </div>
    </div>
  );
}
