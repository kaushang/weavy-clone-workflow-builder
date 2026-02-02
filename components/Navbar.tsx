'use client';

import { UserButton } from '@clerk/nextjs';
import { Play, Download, Zap, Circle } from 'lucide-react';
import SaveButton from './ui/SaveButton';
import WorkflowNameEditor from './ui/WorkflowNameEditor';
import { useWorkflowStore } from '@/store/workflowStore';
import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import LoadWorkflowDialog from './ui/LoadWorkflowDialog';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';

export default function Navbar() {
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const isSaved = useWorkflowStore((state) => state.isSaved);
  const { isExecuting, executeWorkflow } = useWorkflowExecution();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-weavy-gray/95 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo/Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-weavy-purple to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">
                Weavy Workflow Builder
              </h1>
              <p className="text-gray-400 text-xs">AI-Powered Automation</p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-700" />

          {/* Workflow Name Editor */}
          <div className="flex items-center gap-2">
            <WorkflowNameEditor />
            <Circle
              className={`w-2 h-2 ${isSaved ? 'text-green-500' : 'text-amber-500'}`}
              fill="currentColor"
            />
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-weavy-purple to-purple-600 hover:from-purple-600 hover:to-weavy-purple text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" fill="white" />
                Run Workflow
              </>
            )}
          </button>
          <button
            onClick={() => setShowLoadDialog(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700/50 hover:bg-gray-600 text-white rounded-lg transition-all border border-gray-600 hover:border-gray-500"
          >
            <FolderOpen className="w-4 h-4" />
            Load
          </button>

          <SaveButton />

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