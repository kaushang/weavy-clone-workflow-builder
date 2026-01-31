'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function WorkflowNameEditor() {
  const { workflowName, setWorkflowName } = useWorkflowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(workflowName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempName.trim()) {
      setWorkflowName(tempName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempName(workflowName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-3 py-1.5 bg-weavy-dark text-white text-sm rounded border border-weavy-purple focus:outline-none focus:ring-2 focus:ring-weavy-purple/50"
          placeholder="Workflow name..."
          maxLength={50}
        />
        <button
          onClick={handleSave}
          className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          title="Save"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 px-3 py-1.5 hover:bg-weavy-dark/50 rounded transition-colors group"
    >
      <span className="text-white text-sm font-medium">{workflowName}</span>
      <Edit2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}