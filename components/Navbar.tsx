'use client';

import { UserButton } from '@clerk/nextjs';
import { Play, Save, Download, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-weavy-gray/95 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-weavy-purple to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              Weavy Workflow Builder
            </h1>
            <p className="text-gray-400 text-xs">AI-Powered Automation</p>
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-weavy-purple to-purple-600 hover:from-purple-600 hover:to-weavy-purple text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/50 font-medium">
            <Play className="w-4 h-4" fill="white" />
            Run Workflow
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-700/50 hover:bg-gray-600 text-white rounded-lg transition-all border border-gray-600 hover:border-gray-500">
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-700/50 hover:bg-gray-600 text-white rounded-lg transition-all border border-gray-600 hover:border-gray-500">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Right: User Button */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-gray-700" />
          <UserButton 
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-weavy-purple/50"
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}