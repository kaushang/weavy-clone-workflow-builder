'use client';

export default function WorkflowCanvas() {
  return (
    <div className="w-full h-full bg-weavy-dark dot-pattern flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-lg mb-2">Workflow Canvas</p>
        <p className="text-gray-500 text-sm">
          Click a node type from the sidebar to add it here
        </p>
      </div>
    </div>
  );
}