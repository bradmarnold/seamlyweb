export default function TopBar() {
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
        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
          Undo
        </button>
        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
          Redo
        </button>
      </div>
    </div>
  )
}