'use client'

import { useState } from 'react'
import axios from 'axios'

type ClassInfo = {
  name: string
  id: string
  professor?: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [message, setMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [canvasId, setCanvasId] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("Syncing with Canvas...")
    setShowModal(false)

    try {
      const res = await axios.post('http://localhost:8000/scrape-canvas', {
        username: canvasId,
        password: password
      })
      if (res.data.success) {
        setClasses(res.data.classes)
        setMessage("Scraper reached the main page successfully!")
      } else {
        setMessage("Error: " + res.data.error)
      }
    } catch (err) {
      setMessage("Error: Could not connect to scraper service.")
      console.error(err)
    }
    setLoading(false)
  }

  return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Yukti: Student Dashboard</h1>
          <button
              onClick={() => setShowModal(true)}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Syncing with Canvas..." : "Sync with Canvas"}
          </button>
          {message && <p className="mt-4 text-sm text-gray-800">{message}</p>}
        </div>

        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Enter Canvas Credentials</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-left mb-1">Canvas ID</label>
                    <input
                        type="text"
                        value={canvasId}
                        onChange={(e) => setCanvasId(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-left mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Submit
                  </button>
                </form>
              </div>
            </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {classes.map((cls, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <h2 className="text-xl font-semibold">{cls.name}</h2>
                <p className="text-sm text-gray-500">Class ID: {cls.id}</p>
                {cls.professor && <p className="text-sm text-gray-700">Prof: {cls.professor}</p>}
              </div>
          ))}
        </div>
      </main>
  )
}
