"use client";
import { useState } from 'react';

export default function ClassesPage() {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [responseData, setResponseData] = useState(null);

  const createClass = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        return alert('No JWT token found. Please log in first.');
      }

      const response = await fetch('http://localhost:3000/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          class_name: className,
          description: description
        })
      });

      const data = await response.json();
      setResponseData(data);
    } catch (err) {
      console.error(err);
      setResponseData({ error: 'Network error' });
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Create Class</h1>
      <form onSubmit={createClass}>
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Class</button>
      </form>

      {responseData && (
        <div style={{ marginTop: '1rem' }}>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
