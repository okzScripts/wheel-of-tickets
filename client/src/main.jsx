import { createContext, StrictMode, useState, use, useEffect, act } from 'react'
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
        <Route path='/add-admin' element={<AddAdminForm />} />
      </Routes>
    </BrowserRouter>
  </UsersContext.Provider>
}


function AddAdminForm() {
  const { users, setUsers } = use(UsersContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    let id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    let userData = {
      id,
      name: username,
      email,
      password,
      company,
      role: "admin",
      active: true,
    };
    fetch("/api/users", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(userData),
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text().then(text => (text ? JSON.parse(text) : {}));
  })
  .then(newUser => {
    if (Object.keys(newUser).length !== 0) {
      setUsers([...users, newUser]);
      console.log("User added:", newUser);
    } else {
      console.log("User added but no JSON returned");
    }
  })
  .catch(error => console.error("Error:", error));
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Användarnamn:</label>
        <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required />

        <label htmlFor="email">E-post:</label>
        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label htmlFor="password">Lösenord:</label>
        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <label htmlFor="company">Företag:</label>
        <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} required />

        <button type="submit">Registrera</button>
      </form>
    </main>
  );
}

function HomePage() {
  const { users, setUsers } = use(UsersContext);
  useEffect(() => {
    fetch("/api/users")
      .then(response => response.json()
        .then(data => (setUsers(data))), [])
  })
  return <main>

    <ul>
      {users.map(user => (
        <li key={user.id}>
          <p>{ user.id}</p>
          <p>{user.name}</p>
         <p>{user.active.toString()}</p>
          <button onClick={() => {
            fetch(`/api/users/${user.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ active: false }),
            })
          }}>Block admin</button>
        </li>
      ))}
    </ul>

    <NavLink to="/add-admin"><button>Add admin</button></NavLink>

  </main>
}