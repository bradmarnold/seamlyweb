'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CommandStack, Command } from '@/utils/commands'

interface CommandContextType {
  commandStack: CommandStack
  executeCommand: (command: Command) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  undoDescription: string | null
  redoDescription: string | null
}

const CommandContext = createContext<CommandContextType | undefined>(undefined)

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [commandStack] = useState(() => new CommandStack())
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [undoDescription, setUndoDescription] = useState<string | null>(null)
  const [redoDescription, setRedoDescription] = useState<string | null>(null)

  const updateState = useCallback(() => {
    setCanUndo(commandStack.canUndo())
    setCanRedo(commandStack.canRedo())
    setUndoDescription(commandStack.getUndoDescription())
    setRedoDescription(commandStack.getRedoDescription())
  }, [commandStack])

  const executeCommand = useCallback((command: Command) => {
    commandStack.executeCommand(command)
    updateState()
  }, [commandStack, updateState])

  const undo = useCallback(() => {
    commandStack.undo()
    updateState()
  }, [commandStack, updateState])

  const redo = useCallback(() => {
    commandStack.redo()
    updateState()
  }, [commandStack, updateState])

  const value: CommandContextType = {
    commandStack,
    executeCommand,
    undo,
    redo,
    canUndo,
    canRedo,
    undoDescription,
    redoDescription
  }

  return (
    <CommandContext.Provider value={value}>
      {children}
    </CommandContext.Provider>
  )
}

export function useCommands() {
  const context = useContext(CommandContext)
  if (context === undefined) {
    throw new Error('useCommands must be used within a CommandProvider')
  }
  return context
}