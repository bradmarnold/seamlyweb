import { Point, Line, Arc } from '@/types/geometry'

export interface Command {
  id: string
  type: string
  execute(): void
  undo(): void
  redo(): void
  description: string
  timestamp: number
}

export class CreatePointCommand implements Command {
  id: string
  type = 'create-point'
  description: string
  timestamp: number
  
  constructor(
    private point: Point,
    private points: Point[],
    private setPoints: (points: Point[]) => void
  ) {
    this.id = `cmd-${Date.now()}-${Math.random()}`
    this.description = `Create point ${point.name}`
    this.timestamp = Date.now()
  }

  execute(): void {
    const newPoints = [...this.points, this.point]
    this.setPoints(newPoints)
  }

  undo(): void {
    const newPoints = this.points.filter(p => p.id !== this.point.id)
    this.setPoints(newPoints)
  }

  redo(): void {
    this.execute()
  }
}

export class CreateLineCommand implements Command {
  id: string
  type = 'create-line'
  description: string
  timestamp: number
  
  constructor(
    private line: Line,
    private lines: Line[],
    private setLines: (lines: Line[]) => void
  ) {
    this.id = `cmd-${Date.now()}-${Math.random()}`
    this.description = `Create line from ${line.startPoint.name} to ${line.endPoint.name}`
    this.timestamp = Date.now()
  }

  execute(): void {
    const newLines = [...this.lines, this.line]
    this.setLines(newLines)
  }

  undo(): void {
    const newLines = this.lines.filter(l => l.id !== this.line.id)
    this.setLines(newLines)
  }

  redo(): void {
    this.execute()
  }
}

export class CreateArcCommand implements Command {
  id: string
  type = 'create-arc'
  description: string
  timestamp: number
  
  constructor(
    private arc: Arc,
    private arcs: Arc[],
    private setArcs: (arcs: Arc[]) => void
  ) {
    this.id = `cmd-${Date.now()}-${Math.random()}`
    this.description = `Create arc centered at ${arc.centerPoint.name}`
    this.timestamp = Date.now()
  }

  execute(): void {
    const newArcs = [...this.arcs, this.arc]
    this.setArcs(newArcs)
  }

  undo(): void {
    const newArcs = this.arcs.filter(a => a.id !== this.arc.id)
    this.setArcs(newArcs)
  }

  redo(): void {
    this.execute()
  }
}

export class CommandStack {
  private commands: Command[] = []
  private currentIndex = -1
  private maxSize = 100

  executeCommand(command: Command): void {
    // Remove any commands after current index (when undoing then doing new command)
    this.commands = this.commands.slice(0, this.currentIndex + 1)
    
    // Add new command
    this.commands.push(command)
    this.currentIndex++
    
    // Execute the command
    command.execute()
    
    // Limit stack size
    if (this.commands.length > this.maxSize) {
      this.commands.shift()
      this.currentIndex--
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0
  }

  canRedo(): boolean {
    return this.currentIndex < this.commands.length - 1
  }

  undo(): void {
    if (this.canUndo()) {
      const command = this.commands[this.currentIndex]
      command.undo()
      this.currentIndex--
    }
  }

  redo(): void {
    if (this.canRedo()) {
      this.currentIndex++
      const command = this.commands[this.currentIndex]
      command.redo()
    }
  }

  getUndoDescription(): string | null {
    if (this.canUndo()) {
      return this.commands[this.currentIndex].description
    }
    return null
  }

  getRedoDescription(): string | null {
    if (this.canRedo()) {
      return this.commands[this.currentIndex + 1].description
    }
    return null
  }

  clear(): void {
    this.commands = []
    this.currentIndex = -1
  }

  getCommands(): Command[] {
    return [...this.commands]
  }

  getCurrentIndex(): number {
    return this.currentIndex
  }
}