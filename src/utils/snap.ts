import { Point, Line, Arc, SnapPoint } from '@/types/geometry'

export class SnapEngine {
  static SNAP_TOLERANCE = 15 // pixels

  static findSnapPoints(
    x: number, 
    y: number, 
    points: Point[], 
    lines: Line[], 
    arcs: Arc[],
    zoom: number,
    panOffset: { x: number; y: number }
  ): SnapPoint[] {
    const snapPoints: SnapPoint[] = []
    const screenX = x * zoom + panOffset.x
    const screenY = y * zoom + panOffset.y

    // Snap to existing points
    points.forEach(point => {
      const pointScreenX = point.x * zoom + panOffset.x
      const pointScreenY = point.y * zoom + panOffset.y
      const distance = Math.sqrt(
        (screenX - pointScreenX) ** 2 + (screenY - pointScreenY) ** 2
      )
      
      if (distance < this.SNAP_TOLERANCE) {
        snapPoints.push({
          x: point.x,
          y: point.y,
          type: 'point',
          sourceObject: point
        })
      }
    })

    // Snap to line midpoints
    lines.forEach(line => {
      const midX = (line.startPoint.x + line.endPoint.x) / 2
      const midY = (line.startPoint.y + line.endPoint.y) / 2
      const midScreenX = midX * zoom + panOffset.x
      const midScreenY = midY * zoom + panOffset.y
      const distance = Math.sqrt(
        (screenX - midScreenX) ** 2 + (screenY - midScreenY) ** 2
      )
      
      if (distance < this.SNAP_TOLERANCE) {
        snapPoints.push({
          x: midX,
          y: midY,
          type: 'midpoint',
          sourceObject: line
        })
      }
    })

    // Snap to grid (20px grid)
    const gridSize = 20
    const gridX = Math.round(x / gridSize) * gridSize
    const gridY = Math.round(y / gridSize) * gridSize
    const gridScreenX = gridX * zoom + panOffset.x
    const gridScreenY = gridY * zoom + panOffset.y
    const gridDistance = Math.sqrt(
      (screenX - gridScreenX) ** 2 + (screenY - gridScreenY) ** 2
    )
    
    if (gridDistance < this.SNAP_TOLERANCE) {
      snapPoints.push({
        x: gridX,
        y: gridY,
        type: 'grid'
      })
    }

    // Snap to axis (horizontal/vertical through existing points)
    points.forEach(point => {
      // Horizontal axis through point
      const hDistance = Math.abs(screenY - (point.y * zoom + panOffset.y))
      if (hDistance < this.SNAP_TOLERANCE) {
        snapPoints.push({
          x: x,
          y: point.y,
          type: 'axis',
          sourceObject: point
        })
      }

      // Vertical axis through point
      const vDistance = Math.abs(screenX - (point.x * zoom + panOffset.x))
      if (vDistance < this.SNAP_TOLERANCE) {
        snapPoints.push({
          x: point.x,
          y: y,
          type: 'axis',
          sourceObject: point
        })
      }
    })

    // Return closest snap point
    if (snapPoints.length > 0) {
      return snapPoints.sort((a, b) => {
        const distA = Math.sqrt((screenX - (a.x * zoom + panOffset.x)) ** 2 + (screenY - (a.y * zoom + panOffset.y)) ** 2)
        const distB = Math.sqrt((screenX - (b.x * zoom + panOffset.x)) ** 2 + (screenY - (b.y * zoom + panOffset.y)) ** 2)
        return distA - distB
      }).slice(0, 1)
    }

    return []
  }

  static getSnapPosition(
    x: number, 
    y: number, 
    points: Point[], 
    lines: Line[], 
    arcs: Arc[],
    zoom: number,
    panOffset: { x: number; y: number },
    enableSnapping: boolean = true
  ): { x: number; y: number; snapPoint?: SnapPoint } {
    if (!enableSnapping) {
      return { x, y }
    }

    const snapPoints = this.findSnapPoints(x, y, points, lines, arcs, zoom, panOffset)
    
    if (snapPoints.length > 0) {
      const snap = snapPoints[0]
      return { x: snap.x, y: snap.y, snapPoint: snap }
    }

    return { x, y }
  }
}