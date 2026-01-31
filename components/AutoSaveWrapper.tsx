'use client';

import { useAutoSave } from '@/hooks/useAutoSave';

export default function AutoSaveWrapper({ children }: { children: React.ReactNode }) {
  useAutoSave(true, 30000); // Auto-save every 30 seconds
  
  return <>{children}</>;
}