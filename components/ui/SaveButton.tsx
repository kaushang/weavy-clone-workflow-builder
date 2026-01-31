'use client';

import { useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { createWorkflow, updateWorkflow } from '@/lib/api/workflows';

export default function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  
  const { 
    nodes, 
    edges, 
    workflowId, 
    workflowName, 
    isSaved,
    setWorkflowId,
    markAsSaved,
  } = useWorkflowStore();

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      let savedWorkflow;
      
      if (workflowId) {
        // Update existing workflow
        savedWorkflow = await updateWorkflow(workflowId, nodes, edges);
      } else {
        // Create new workflow
        savedWorkflow = await createWorkflow(workflowName, nodes, edges);
        setWorkflowId(savedWorkflow.id);
      }
      
      markAsSaved();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving || (isSaved && !justSaved)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border font-medium ${
        justSaved
          ? 'bg-green-600 hover:bg-green-700 text-white border-green-500'
          : isSaved
          ? 'bg-gray-700/50 text-gray-400 border-gray-600 cursor-not-allowed'
          : 'bg-gray-700/50 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500'
      }`}
    >
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </>
      ) : justSaved ? (
        <>
          <Check className="w-4 h-4" />
          Saved!
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved' : 'Save'}
        </>
      )}
    </button>
  );
}