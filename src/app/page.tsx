'use client'

import { useState } from 'react'
import Toolbox from '@/components/Toolbox'
import Canvas from '@/components/Canvas'
import StatusBar from '@/components/StatusBar'
import TopBar from '@/components/TopBar'
import TutorialPanel from '@/components/TutorialPanel'

export default function Home() {
  const [selectedTool, setSelectedTool] = useState('select')
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState(false)
  const [isTutorialVisible, setIsTutorialVisible] = useState(true)

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <TopBar />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbox */}
        <Toolbox
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          collapsed={isToolboxCollapsed}
          onToggleCollapse={() => setIsToolboxCollapsed(!isToolboxCollapsed)}
        />
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col bg-white">
          <Canvas selectedTool={selectedTool} />
        </div>
        
        {/* Right Tutorial Panel */}
        {isTutorialVisible && (
          <TutorialPanel 
            selectedTool={selectedTool}
            onClose={() => setIsTutorialVisible(false)}
          />
        )}
      </div>
      
      {/* Status Bar */}
      <StatusBar selectedTool={selectedTool} />
    </div>
  )
}