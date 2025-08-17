interface TutorialPanelProps {
  selectedTool: string
  onClose: () => void
}

export default function TutorialPanel({ selectedTool, onClose }: TutorialPanelProps) {
  const getTutorialContent = (tool: string) => {
    switch (tool) {
      case 'select':
        return (
          <div>
            <h4 className="font-medium mb-2">Select Tool</h4>
            <ul className="text-sm space-y-1">
              <li>• Click objects to select them</li>
              <li>• Right-click for properties dialog</li>
              <li>• Drag to move selected objects</li>
              <li>• Hold Ctrl to multi-select</li>
            </ul>
          </div>
        )
      case 'point-distance-angle':
        return (
          <div>
            <h4 className="font-medium mb-2">Point at Distance & Angle</h4>
            <ul className="text-sm space-y-1">
              <li>• Click to place a point</li>
              <li>• Enter distance and angle</li>
              <li>• Use Shift for 45° increments</li>
              <li>• Press Enter to confirm</li>
            </ul>
          </div>
        )
      case 'line-points':
        return (
          <div>
            <h4 className="font-medium mb-2">Line Between Points</h4>
            <ul className="text-sm space-y-1">
              <li>• Click first point (existing or create new)</li>
              <li>• Click second point (existing or create new)</li>
              <li>• Line will be created automatically</li>
              <li>• Continue clicking for chained lines</li>
              <li>• Yellow highlight shows point under cursor</li>
              <li>• Blue dashed line shows preview</li>
            </ul>
          </div>
        )
      default:
        return (
          <div>
            <h4 className="font-medium mb-2">Welcome to SeamlyWeb</h4>
            <p className="text-sm">
              Select a tool from the toolbox to see specific instructions.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-300 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tutorial</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        {getTutorialContent(selectedTool)}
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Space: Pan mode</li>
            <li>• Shift: 45° angle snap</li>
            <li>• Esc: Cancel operation</li>
            <li>• Enter: Confirm operation</li>
            <li>• Ctrl+Z: Undo</li>
            <li>• Ctrl+Shift+Z: Redo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}