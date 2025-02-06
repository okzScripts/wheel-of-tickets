import { createContext, StrictMode, useState, use, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from "react-router"

const UsersContext = createContext({})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
function App() {
  const [users, setUsers] = useState([]);
  return <UsersContext.Provider value={{ users, setUsers }}>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </UsersContext.Provider>
}
function HomePage() {
  const { users, setUsers } = use(UsersContext);
  useEffect(() => {
    fetch("/api/users")
      .then(response => response.json()
        .then(data => (setUsers(data))),[])
  })
  return <ul>
    {users.map(user => (
      <li>{ user.name}</li>
        ))}
  </ul>
}
