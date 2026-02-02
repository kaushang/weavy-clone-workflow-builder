'use client';

import { useEffect } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B - Toggle left sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        useWorkflowStore.getState().toggleLeftSidebar();
      }

      // Ctrl/Cmd + H - Toggle right sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        useWorkflowStore.getState().toggleRightSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}