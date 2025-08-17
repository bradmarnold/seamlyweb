export interface Point {
  x: number
  y: number
  id: string
  name: string
}

export interface Line {
  id: string
  startPoint: Point
  endPoint: Point
}

export interface Arc {
  id: string
  centerPoint: Point
  startPoint: Point
  endPoint: Point
  radius: number
}

export interface SnapPoint {
  x: number
  y: number
  type: 'point' | 'midpoint' | 'intersection' | 'grid' | 'axis'
  sourceObject?: Point | Line | Arc
}

export type Tool = 
  | 'select'
  | 'point-distance-angle'
  | 'point-along-line'
  | 'point-perp-foot'
  | 'point-line-angle'
  | 'point-midpoint'
  | 'point-divide'
  | 'line-points'
  | 'arc-center'
  | 'arc-radius'
  | 'curve-spline'