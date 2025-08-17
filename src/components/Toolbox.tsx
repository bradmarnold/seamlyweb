interface ToolboxProps {
  selectedTool: string
  onToolSelect: (tool: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const TOOLS = [
  { id: 'select', name: 'Select', icon: '↖️' },
  { id: 'point-distance-angle', name: 'Point at Distance and Angle', icon: '📍' },
  { id: 'point-along-line', name: 'Point Along Line', icon: '📐' },
  { id: 'point-perp-foot', name: 'Perpendicular Foot', icon: '⊥' },
  { id: 'point-line-angle', name: 'Point from Line and Angle', icon: '📐' },
  { id: 'point-midpoint', name: 'Midpoint', icon: '⚬' },
  { id: 'point-divide', name: 'Divide Line', icon: '📏' },
  { id: 'line-points', name: 'Line Between Points', icon: '━' },
  { id: 'arc-center', name: 'Arc by Center', icon: '⌒' },
  { id: 'arc-radius', name: 'Arc by Radius', icon: '◐' },
  { id: 'curve-spline', name: 'Spline Curve', icon: '〜' },
]

export default function Toolbox({ selectedTool, onToolSelect, collapsed, onToggleCollapse }: ToolboxProps) {
  return (
    <div className={`bg-gray-50 border-r border-gray-300 transition-all duration-200 ${
      collapsed ? 'w-12' : 'w-64'
    }`}>
      <div className="p-2">
        <button
          onClick={onToggleCollapse}
          className="w-full p-2 hover:bg-gray-200 rounded flex items-center justify-center"
        >
          {collapsed ? '▶️' : '◀️'}
        </button>
      </div>
      
      {!collapsed && (
        <div className="p-2 space-y-1">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tools</h3>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`tool-button w-full text-left ${
                selectedTool === tool.id ? 'active' : ''
              }`}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-sm">{tool.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}