import { useEffect, useState } from 'react'
import { getTodos, createTodo, updateTodo, deleteTodo } from './api'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    const content = input.trim()
    if (!content) return
    try {
      const todo = await createTodo(content)
      setTodos((prev) => [todo, ...prev])
      setInput('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id)
    setEditingText(todo.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingText('')
  }

  async function handleUpdate(id) {
    const content = editingText.trim()
    if (!content) return
    try {
      const updated = await updateTodo(id, content)
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
      cancelEdit()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <h1>할 일 목록</h1>

      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={input}
          placeholder="할 일을 입력하세요"
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>

      {error && (
        <p className="error" onClick={() => setError('')}>
          {error} (클릭하여 닫기)
        </p>
      )}

      {loading ? (
        <p>불러오는 중...</p>
      ) : todos.length === 0 ? (
        <p className="empty">할 일이 없습니다.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              {editingId === todo._id ? (
                <>
                  <input
                    type="text"
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(todo._id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                  <div className="actions">
                    <button onClick={() => handleUpdate(todo._id)}>저장</button>
                    <button onClick={cancelEdit}>취소</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="content">{todo.content}</span>
                  <div className="actions">
                    <button onClick={() => startEdit(todo)}>수정</button>
                    <button onClick={() => handleDelete(todo._id)}>삭제</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
