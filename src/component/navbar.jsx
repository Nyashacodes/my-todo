import React, { useState } from 'react'

const noop = () => {}

export default function Navbar({ onAdd = noop, onSearch = noop, onFilter = noop }) {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('normal')
  const [activeFilter, setActiveFilter] = useState('all')

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    const todo = { id: Date.now(), text: trimmed, completed: false, priority }
    // call prop callback if provided
    onAdd(todo)
    // also emit a DOM event for apps that prefer listening instead of props
    try {
      window.dispatchEvent(new CustomEvent('todo:add', { detail: todo }))
    } catch (e) {}
    setText('')
    setPriority('normal')
  }

  const handleSearch = (q) => {
    setQuery(q)
    onSearch(q)
    try { window.dispatchEvent(new CustomEvent('todo:search', { detail: q })) } catch (e) {}
  }

  const changeFilter = (f) => {
    setActiveFilter(f)
    onFilter(f)
    try { window.dispatchEvent(new CustomEvent('todo:filter', { detail: f })) } catch (e) {}
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>My Todo</div>

      <div style={styles.group}>
        <input
          aria-label="Add todo"
          placeholder="Add a new todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          style={styles.input}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleAdd} style={styles.addBtn}>Add</button>
      </div>

      <div style={styles.group}>
        <input
          aria-label="Search todos"
          placeholder="Search..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.input}
        />

        <div style={styles.filters}>
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f ? styles.filterActive : {}),
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #e6e6e6',
    background: '#fff'
  },
  brand: {
    fontWeight: 700,
    fontSize: 18,
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
    minWidth: 180,
  },
  select: {
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
  },
  addBtn: {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#2f80ed',
    color: '#fff',
    cursor: 'pointer'
  },
  filters: {
    display: 'flex',
    gap: 6,
  },
  filterBtn: {
    padding: '6px 8px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer'
  },
  filterActive: {
    background: '#2f80ed',
    color: '#fff',
    borderColor: '#2f80ed'
  }
}
