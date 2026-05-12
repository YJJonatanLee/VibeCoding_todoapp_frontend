// VITE_API_BASE_URL이 있으면 배포된 백엔드 절대 주소를 사용하고,
// 없으면 '/todos' 상대 경로(개발 시 vite 프록시 경유)를 사용한다.
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/todos`

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    let message = `요청 실패 (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

export function getTodos() {
  return request(BASE_URL)
}

export function createTodo(content) {
  return request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
}

export function updateTodo(id, content) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
}

export function deleteTodo(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' })
}
