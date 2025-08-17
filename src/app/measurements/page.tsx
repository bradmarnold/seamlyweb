'use client'

import { useState } from 'react'
import { Measurement } from '@/types/measurements'
import { useMeasurements } from '@/contexts/MeasurementsContext'

export default function MeasurementsPage() {
  const { 
    measurements, 
    addMeasurement, 
    updateMeasurement, 
    deleteMeasurement 
  } = useMeasurements()
  
  const [newMeasurement, setNewMeasurement] = useState<Partial<Measurement>>({
    name: '',
    value: 0,
    units: 'cm',
    description: '',
    category: 'Custom'
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddMeasurement = () => {
    if (!newMeasurement.name) return

    const measurement: Measurement = {
      id: Date.now().toString(),
      name: newMeasurement.name,
      value: newMeasurement.value || 0,
      units: newMeasurement.units || 'cm',
      description: newMeasurement.description || '',
      category: newMeasurement.category || 'Custom',
      formula: typeof newMeasurement.value === 'string' ? newMeasurement.value : undefined
    }

    addMeasurement(measurement)
    setNewMeasurement({ name: '', value: 0, units: 'cm', description: '', category: 'Custom' })
    setShowAddForm(false)
  }

  const exportMeasurements = () => {
    const dataStr = JSON.stringify(measurements, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'measurements.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importMeasurements = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Measurement[]
        // Clear existing measurements and add imported ones
        measurements.forEach(m => deleteMeasurement(m.id))
        imported.forEach(m => addMeasurement(m))
      } catch (error) {
        alert('Error importing measurements: Invalid file format')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Measurements</h1>
                <p className="text-gray-600 mt-1">Manage your pattern measurements and formulas</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Measurement
                </button>
                <button
                  onClick={exportMeasurements}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Export
                </button>
                <label className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importMeasurements}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="border-b border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Add New Measurement</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newMeasurement.name || ''}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., waist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value/Formula</label>
                  <input
                    type="text"
                    value={newMeasurement.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setNewMeasurement(prev => ({ 
                        ...prev, 
                        value: isNaN(Number(value)) ? value : Number(value)
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="80 or waist/4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                  <select
                    value={newMeasurement.units || 'cm'}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, units: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newMeasurement.description || ''}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Description of this measurement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newMeasurement.category || ''}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Body, Custom, etc."
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleAddMeasurement}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Measurements List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Value</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Units</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Formula</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">{measurement.name}</td>
                    <td className="py-3 px-6">
                      {editingId === measurement.id ? (
                        <input
                          type="number"
                          value={typeof measurement.value === 'number' ? measurement.value : ''}
                          onChange={(e) => updateMeasurement(measurement.id, { value: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingId(measurement.id)}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          {typeof measurement.value === 'number' ? measurement.value.toFixed(1) : measurement.value}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-gray-600">{measurement.units}</td>
                    <td className="py-3 px-6 text-gray-600 font-mono text-sm">
                      {measurement.formula || '-'}
                    </td>
                    <td className="py-3 px-6 text-gray-600">{measurement.description}</td>
                    <td className="py-3 px-6 text-gray-600">{measurement.category}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => deleteMeasurement(measurement.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {measurements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No measurements yet. Add your first measurement to get started.</p>
            </div>
          )}
        </div>

        {/* Formula Examples */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-3">Formula Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Basic Operations</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code className="bg-gray-100 px-1">waist/4</code> - Quarter waist</li>
                <li><code className="bg-gray-100 px-1">hip + 10</code> - Hip plus ease</li>
                <li><code className="bg-gray-100 px-1">bust * 0.25</code> - 25% of bust</li>
                <li><code className="bg-gray-100 px-1">(waist + hip)/2</code> - Average of waist and hip</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Common Patterns</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code className="bg-gray-100 px-1">waist/4 + 1</code> - Quarter waist with seam allowance</li>
                <li><code className="bg-gray-100 px-1">bust/2 - 2</code> - Half bust minus ease</li>
                <li><code className="bg-gray-100 px-1">shoulder + neck/3</code> - Shoulder plus neck adjustment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}