'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface CanvasProps {
  selectedTool: string
}

interface Point {
  x: number
  y: number
  id: string
  name: string
}

interface Line {
  id: string
  startPoint: Point
  endPoint: Point
}

export default function Canvas({ selectedTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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

    // Draw points
    points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#3b82f6'
      ctx.fill()
      ctx.strokeStyle = '#1e40af'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw point name
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px sans-serif'
      ctx.fillText(point.name, point.x + 8, point.y - 8)
    })

    ctx.restore()
  }, [points, lines, panOffset, zoom, drawGrid])

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

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e)
    
    if (e.button === 1 || e.shiftKey) { // Middle mouse or shift+click for panning
      setIsPanning(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      return
    }

    if (selectedTool === 'point-distance-angle') {
      const newPoint: Point = {
        id: `point-${Date.now()}`,
        name: `A${points.length + 1}`,
        x: coords.x,
        y: coords.y
      }
      setPoints(prev => [...prev, newPoint])
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos(getCanvasCoordinates(e))

    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
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
      </div>
    </div>
  )
}