interface StatusBarProps {
  selectedTool: string
}

export default function StatusBar({ selectedTool }: StatusBarProps) {
  const getToolDescription = (tool: string) => {
    switch (tool) {
      case 'select':
        return 'Click to select objects. Right-click for properties.'
      case 'point-distance-angle':
        return 'Click to place point. Enter distance and angle in dialog.'
      case 'point-along-line':
        return 'Click line, then specify position along line.'
      case 'point-perp-foot':
        return 'Click line, then click point to drop perpendicular.'
      case 'line-points':
        return 'Click first point, then second point to create line. Click empty space to create new points.'
      case 'point-midpoint':
        return 'Click two points to create a midpoint between them.'
      case 'arc-center':
        return 'Click center point, then start point, then end point to create arc.'
      default:
        return 'Select a tool to begin drawing.'
    }
  }

  return (
    <div className="bg-gray-100 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Tool:</span>
        <span className="font-medium">{selectedTool.replace('-', ' ')}</span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-600">{getToolDescription(selectedTool)}</span>
      </div>
      
      <div className="flex items-center space-x-4 text-gray-600">
        <span>Shortcuts: Space=Pan, Shift=45°, Esc=Cancel, Enter=Confirm</span>
      </div>
    </div>
  )
}