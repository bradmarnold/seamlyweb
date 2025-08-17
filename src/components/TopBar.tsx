'use client'

import { useCommands } from '@/contexts/CommandContext'

export default function TopBar() {
  const { undo, redo, canUndo, canRedo, undoDescription, redoDescription } = useCommands()

  return (
    <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">SeamlyWeb</h1>
        <nav className="flex space-x-4">
          <button className="px-3 py-1 hover:bg-gray-100 rounded">File</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Edit</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">View</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Tools</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Measurements</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Layout</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Help</button>
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className={`px-3 py-1 rounded text-sm ${
            canUndo 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={undo}
          disabled={!canUndo}
          title={undoDescription ? `Undo: ${undoDescription}` : 'Undo'}
        >
          Undo
        </button>
        <button 
          className={`px-3 py-1 rounded text-sm ${
            canRedo 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={redo}
          disabled={!canRedo}
          title={redoDescription ? `Redo: ${redoDescription}` : 'Redo'}
        >
          Redo
        </button>
      </div>
    </div>
  )
}