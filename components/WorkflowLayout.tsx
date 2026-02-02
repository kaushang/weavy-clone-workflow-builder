'use client';

import { ReactNode } from 'react';

interface WorkflowLayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
  history: ReactNode;
}

export default function WorkflowLayout({ sidebar, canvas, history }: WorkflowLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-weavy-dark overflow-hidden">
      {/* Left Sidebar */}
      {/* <aside className="w-64 bg-weavy-gray border-r border-gray-700 flex-shrink-0"> */}
        {sidebar}
      {/* </aside> */}

      {/* Main Canvas Area */}
      <main className="flex-1 relative">
        {canvas}
      </main>

      {/* Right Sidebar (History) */}
      {/* <aside className="w-80 bg-weavy-gray border-l border-gray-700 flex-shrink-0"> */}
        {history}
      {/* </aside> */}
    </div>
  );
}