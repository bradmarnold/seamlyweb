export interface Measurement {
  id: string
  name: string
  value: number | string // Can be a number or formula
  formula?: string
  description?: string
  units: 'mm' | 'cm' | 'in'
  category?: string
}

export interface Variable {
  name: string
  value: number
  measurement?: Measurement
}

export class FormulaEngine {
  private variables = new Map<string, number>()

  setVariable(name: string, value: number): void {
    this.variables.set(name, value)
  }

  getVariable(name: string): number | undefined {
    return this.variables.get(name)
  }

  evaluateFormula(formula: string): number {
    try {
      // Simple formula evaluation - replace variables and basic math
      let processedFormula = formula.toLowerCase()
      
      // Replace variables
      for (const [name, value] of this.variables) {
        const regex = new RegExp(`\\b${name.toLowerCase()}\\b`, 'g')
        processedFormula = processedFormula.replace(regex, value.toString())
      }
      
      // Basic safety check - only allow numbers, operators, parentheses, and whitespace
      if (!/^[\d+\-*/().\s]+$/.test(processedFormula)) {
        throw new Error('Invalid formula')
      }
      
      // Evaluate using Function constructor (safer than eval)
      const result = new Function('return ' + processedFormula)()
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Formula result is not a valid number')
      }
      
      return result
    } catch (error) {
      throw new Error(`Formula evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  updateMeasurement(measurement: Measurement): Measurement {
    if (typeof measurement.value === 'string' && measurement.formula) {
      try {
        const result = this.evaluateFormula(measurement.formula)
        return { ...measurement, value: result }
      } catch (error) {
        console.error('Error evaluating formula:', error)
        return { ...measurement, value: 0 }
      }
    }
    return measurement
  }

  getDependentMeasurements(measurements: Measurement[], changedVariable: string): Measurement[] {
    return measurements.filter(m => 
      m.formula && m.formula.toLowerCase().includes(changedVariable.toLowerCase())
    )
  }
}