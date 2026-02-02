'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-weavy-gray border border-gray-700 rounded-xl shadow-2xl p-8 flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-weavy-purple animate-spin mb-4" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}