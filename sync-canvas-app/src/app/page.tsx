'use client'

import { useState } from 'react'
import axios from 'axios'

type CourseInfo = {
  name: string
  id: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<CourseInfo[]>([])
  const [message, setMessage] = useState("")
  const [asuId, setAsuId] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("Logging into Canvas and scraping courses...")
    setCourses([])

    try {
      const res = await axios.post('http://localhost:8000/scrape-canvas', {
        username: asuId,
        password: password
      })
      if (res.data.success) {
        setCourses(res.data.courses)
        setMessage("Courses retrieved successfully!")
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
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Canvas Login</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block mb-1">Canvas ID</label>
              <input
                  type="text"
                  value={asuId}
                  onChange={(e) => setAsuId(e.target.value)}
                  className="border p-2 w-full"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full"
                  required
              />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Syncing..." : "Login & Sync"}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-gray-800">{message}</p>}
        </div>

        {courses.length > 0 && (
            <div className="mt-10 max-w-xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Courses</h2>
              {courses.map((course) => (
                  <div key={course.id} className="bg-white p-4 rounded shadow mb-2">
                    <p className="font-bold">{course.name}</p>
                    <p className="text-sm text-gray-600">ID: {course.id}</p>
                  </div>
              ))}
            </div>
        )}
      </main>
  )
}
