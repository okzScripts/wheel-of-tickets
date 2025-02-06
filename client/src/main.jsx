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
        <Route path='/add-admin' element={<AddAdmin />} />
      </Routes>
    </BrowserRouter>
  </UsersContext.Provider>
}


function AddAdmin()
{

  return <main>
    <form id="userForm">
      <label for="username">Användarnamn:</label>
      <input type="text" id="username" name="username" required/>
        <label for="email">E-post:</label>
        <input type="email" id="email" name="email" required/>
          <label for="password">Lösenord:</label>
      <input type="password" id="password" name="password" required />
      <input type="company" id="company" name="company" required />
      <input type="role" id="role" name="role" required/>
            <button onClick={AddUser} type="submit">Registrera</button>
    </form>
    
  </main>
}

function AddUser() {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
   let company = document.getElementById("company").value;
  let role = document.getElementById("role").value;
  let userData = {
            id: 1,
            name: username,
            email: email,
            password: password,
            company: company,
            role: role,
            active: true,
  };
  
    fetch("/api/users", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (response.ok) {
          console.log("added")
        }
      })
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
      <li key={user.id}>{ user.name}</li>
        ))}
  </ul>

    <NavLink to="/add-admin"><button>Add admin</button></NavLink>
  </main>
}
