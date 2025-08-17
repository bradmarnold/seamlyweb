'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Point, Line, Arc, SnapPoint } from '@/types/geometry'
import { SnapEngine } from '@/utils/snap'

interface CanvasProps {
  selectedTool: string
}

export default function Canvas({ selectedTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [arcs, setArcs] = useState<Arc[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Tool-specific state
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([])
  const [isWaitingForSecondPoint, setIsWaitingForSecondPoint] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null)
  const [previewLine, setPreviewLine] = useState<{ start: Point; end: Point } | null>(null)
  const [snapPoint, setSnapPoint] = useState<SnapPoint | null>(null)
  const [enableSnapping, setEnableSnapping] = useState(true)

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20 * zoom
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1

    // Vertical lines
    for (let x = panOffset.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = panOffset.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }, [zoom, panOffset])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Apply transformations
    ctx.save()
    ctx.translate(panOffset.x, panOffset.y)
    ctx.scale(zoom, zoom)

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height)

    // Draw lines
    lines.forEach(line => {
      ctx.beginPath()
      ctx.moveTo(line.startPoint.x, line.startPoint.y)
      ctx.lineTo(line.endPoint.x, line.endPoint.y)
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw preview line
    if (previewLine && selectedTool === 'line-points') {
      ctx.beginPath()
      ctx.moveTo(previewLine.start.x, previewLine.start.y)
      ctx.lineTo(previewLine.end.x, previewLine.end.y)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw arcs
    arcs.forEach(arc => {
      ctx.beginPath()
      const startAngle = Math.atan2(arc.startPoint.y - arc.centerPoint.y, arc.startPoint.x - arc.centerPoint.x)
      const endAngle = Math.atan2(arc.endPoint.y - arc.centerPoint.y, arc.endPoint.x - arc.centerPoint.x)
      ctx.arc(arc.centerPoint.x, arc.centerPoint.y, arc.radius, startAngle, endAngle)
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw points
    points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
      
      // Highlight hovered or selected points
      if (hoveredPoint?.id === point.id) {
        ctx.fillStyle = '#fbbf24'
        ctx.strokeStyle = '#f59e0b'
      } else if (selectedPoints.some(p => p.id === point.id)) {
        ctx.fillStyle = '#10b981'
        ctx.strokeStyle = '#059669'
      } else {
        ctx.fillStyle = '#3b82f6'
        ctx.strokeStyle = '#1e40af'
      }
      
      ctx.fill()
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw point name
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px sans-serif'
      ctx.fillText(point.name, point.x + 8, point.y - 8)
    })

    // Draw snap indicators
    if (snapPoint) {
      ctx.strokeStyle = '#ef4444'
      ctx.fillStyle = '#ef4444'
      ctx.lineWidth = 2
      
      if (snapPoint.type === 'point') {
        // Draw circle around snapped point
        ctx.beginPath()
        ctx.arc(snapPoint.x, snapPoint.y, 8, 0, 2 * Math.PI)
        ctx.stroke()
      } else if (snapPoint.type === 'midpoint') {
        // Draw square for midpoint
        ctx.beginPath()
        ctx.rect(snapPoint.x - 4, snapPoint.y - 4, 8, 8)
        ctx.stroke()
      } else if (snapPoint.type === 'grid') {
        // Draw cross for grid snap
        ctx.beginPath()
        ctx.moveTo(snapPoint.x - 6, snapPoint.y)
        ctx.lineTo(snapPoint.x + 6, snapPoint.y)
        ctx.moveTo(snapPoint.x, snapPoint.y - 6)
        ctx.lineTo(snapPoint.x, snapPoint.y + 6)
        ctx.stroke()
      } else if (snapPoint.type === 'axis') {
        // Draw diamond for axis snap
        ctx.beginPath()
        ctx.moveTo(snapPoint.x, snapPoint.y - 6)
        ctx.lineTo(snapPoint.x + 6, snapPoint.y)
        ctx.lineTo(snapPoint.x, snapPoint.y + 6)
        ctx.lineTo(snapPoint.x - 6, snapPoint.y)
        ctx.closePath()
        ctx.stroke()
      }
    }

    ctx.restore()
  }, [points, lines, arcs, panOffset, zoom, drawGrid, previewLine, selectedTool, hoveredPoint, selectedPoints, snapPoint])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      draw()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [draw])

  useEffect(() => {
    draw()
  }, [draw])

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - panOffset.x) / zoom,
      y: (e.clientY - rect.top - panOffset.y) / zoom
    }
  }

  const findPointAt = (x: number, y: number, tolerance = 10) => {
    return points.find(point => {
      const dx = (point.x * zoom + panOffset.x) - (x * zoom + panOffset.x)
      const dy = (point.y * zoom + panOffset.y) - (y * zoom + panOffset.y)
      return Math.sqrt(dx * dx + dy * dy) < tolerance
    })
  }

  const createPoint = (x: number, y: number) => {
    const newPoint: Point = {
      id: `point-${Date.now()}`,
      name: `A${points.length + 1}`,
      x,
      y
    }
    setPoints(prev => [...prev, newPoint])
    return newPoint
  }

  const createLine = (startPoint: Point, endPoint: Point) => {
    const newLine: Line = {
      id: `line-${Date.now()}`,
      startPoint,
      endPoint
    }
    setLines(prev => [...prev, newLine])
    return newLine
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e)
    
    // Apply snapping to click position
    const snapResult = SnapEngine.getSnapPosition(
      coords.x, 
      coords.y, 
      points, 
      lines, 
      arcs, 
      zoom, 
      panOffset, 
      enableSnapping
    )
    
    if (e.button === 1 || e.shiftKey) { // Middle mouse or shift+click for panning
      setIsPanning(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      return
    }

    const pointAtLocation = findPointAt(snapResult.x, snapResult.y)

    if (selectedTool === 'point-distance-angle') {
      if (!pointAtLocation) {
        createPoint(snapResult.x, snapResult.y)
      }
    } else if (selectedTool === 'line-points') {
      if (pointAtLocation) {
        if (!isWaitingForSecondPoint) {
          // First point selected
          setSelectedPoints([pointAtLocation])
          setIsWaitingForSecondPoint(true)
        } else {
          // Second point selected
          if (selectedPoints[0] && pointAtLocation.id !== selectedPoints[0].id) {
            createLine(selectedPoints[0], pointAtLocation)
          }
          setSelectedPoints([])
          setIsWaitingForSecondPoint(false)
          setPreviewLine(null)
        }
      } else {
        // Click on empty space - create new point (using snapped position)
        const newPoint = createPoint(snapResult.x, snapResult.y)
        if (!isWaitingForSecondPoint) {
          setSelectedPoints([newPoint])
          setIsWaitingForSecondPoint(true)
        } else {
          // Second point created
          if (selectedPoints[0]) {
            createLine(selectedPoints[0], newPoint)
          }
          setSelectedPoints([])
          setIsWaitingForSecondPoint(false)
          setPreviewLine(null)
        }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e)
    
    // Apply snapping
    const snapResult = SnapEngine.getSnapPosition(
      coords.x, 
      coords.y, 
      points, 
      lines, 
      arcs, 
      zoom, 
      panOffset, 
      enableSnapping
    )
    
    setMousePos(snapResult)
    setSnapPoint(snapResult.snapPoint || null)

    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    } else {
      // Update hovered point
      const pointAtLocation = findPointAt(snapResult.x, snapResult.y)
      setHoveredPoint(pointAtLocation || null)

      // Update preview line for line tool
      if (selectedTool === 'line-points' && isWaitingForSecondPoint && selectedPoints[0]) {
        setPreviewLine({
          start: selectedPoints[0],
          end: pointAtLocation || { x: snapResult.x, y: snapResult.y, id: 'preview', name: 'preview' }
        })
      }
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.1, Math.min(5, prev * zoomFactor)))
  }

  // Reset tool state when tool changes
  useEffect(() => {
    setSelectedPoints([])
    setIsWaitingForSecondPoint(false)
    setPreviewLine(null)
    setHoveredPoint(null)
    setSnapPoint(null)
  }, [selectedTool])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        setIsPanning(true)
      } else if (e.key === 'Shift') {
        // Enable 45-degree angle snapping (todo: implement)
      } else if (e.key === 'Escape') {
        // Cancel current operation
        setSelectedPoints([])
        setIsWaitingForSecondPoint(false)
        setPreviewLine(null)
        setHoveredPoint(null)
      } else if (e.key === 's' || e.key === 'S') {
        // Toggle snapping
        setEnableSnapping(!enableSnapping)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPanning(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [enableSnapping])

  return (
    <div className="flex-1 relative bg-white">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Mouse coordinates display */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-sm font-mono">
        X: {mousePos.x.toFixed(1)}, Y: {mousePos.y.toFixed(1)} | Zoom: {(zoom * 100).toFixed(0)}%
        {isWaitingForSecondPoint && <div className="text-blue-600">Select second point...</div>}
        {snapPoint && (
          <div className="text-red-600">
            Snap: {snapPoint.type} 
            {snapPoint.sourceObject && 'name' in snapPoint.sourceObject && ` (${snapPoint.sourceObject.name})`}
          </div>
        )}
        <div className="text-xs text-gray-500">
          Press &apos;S&apos; to toggle snapping ({enableSnapping ? 'ON' : 'OFF'})
        </div>
      </div>
    </div>
  )
}