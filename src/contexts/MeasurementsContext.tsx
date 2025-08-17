'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Measurement, FormulaEngine } from '@/types/measurements'

interface MeasurementsContextType {
  measurements: Measurement[]
  formulaEngine: FormulaEngine
  addMeasurement: (measurement: Measurement) => void
  updateMeasurement: (id: string, updates: Partial<Measurement>) => void
  deleteMeasurement: (id: string) => void
  getMeasurement: (name: string) => Measurement | undefined
  evaluateFormula: (formula: string) => number
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined)

export function MeasurementsProvider({ children }: { children: React.ReactNode }) {
  const [measurements, setMeasurements] = useState<Measurement[]>([
    {
      id: '1',
      name: 'waist',
      value: 80,
      units: 'cm',
      description: 'Waist circumference',
      category: 'Body'
    },
    {
      id: '2', 
      name: 'hip',
      value: 90,
      units: 'cm',
      description: 'Hip circumference',
      category: 'Body'
    }
  ])
  
  const [formulaEngine] = useState(new FormulaEngine())

  // Initialize formula engine when measurements change
  React.useEffect(() => {
    measurements.forEach(m => {
      if (typeof m.value === 'number') {
        formulaEngine.setVariable(m.name, m.value)
      }
    })
  }, [measurements, formulaEngine])

  const addMeasurement = useCallback((measurement: Measurement) => {
    const processedMeasurement = formulaEngine.updateMeasurement(measurement)
    setMeasurements(prev => [...prev, processedMeasurement])
  }, [formulaEngine])

  const updateMeasurement = useCallback((id: string, updates: Partial<Measurement>) => {
    setMeasurements(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates }
        
        // If updating a formula, recalculate
        if (updates.formula || (typeof updates.value === 'string')) {
          updated.formula = updates.formula || (typeof updates.value === 'string' ? updates.value as string : undefined)
          return formulaEngine.updateMeasurement(updated)
        }
        
        // If updating a base value, update formula engine and recalculate dependents
        if (typeof updates.value === 'number') {
          formulaEngine.setVariable(updated.name, updates.value)
          
          // Recalculate dependent measurements
          const dependents = formulaEngine.getDependentMeasurements(prev, updated.name)
          setTimeout(() => {
            setMeasurements(current => current.map(measurement => {
              if (dependents.some(d => d.id === measurement.id)) {
                return formulaEngine.updateMeasurement(measurement)
              }
              return measurement
            }))
          }, 0)
        }
        
        return updated
      }
      return m
    }))
  }, [formulaEngine])

  const deleteMeasurement = useCallback((id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id))
  }, [])

  const getMeasurement = useCallback((name: string) => {
    return measurements.find(m => m.name.toLowerCase() === name.toLowerCase())
  }, [measurements])

  const evaluateFormula = useCallback((formula: string) => {
    return formulaEngine.evaluateFormula(formula)
  }, [formulaEngine])

  const value: MeasurementsContextType = {
    measurements,
    formulaEngine,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMeasurement,
    evaluateFormula
  }

  return (
    <MeasurementsContext.Provider value={value}>
      {children}
    </MeasurementsContext.Provider>
  )
}

export function useMeasurements() {
  const context = useContext(MeasurementsContext)
  if (context === undefined) {
    throw new Error('useMeasurements must be used within a MeasurementsProvider')
  }
  return context
}