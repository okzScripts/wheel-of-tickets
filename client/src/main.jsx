import { StrictMode, use, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)


  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/users/${email}`);
    const data = await response.json();
    setUser(data);
    
    const roleResponse = await fetch(`/api/roles/${data.role}`);
    const roleData = await roleResponse.text();
    setRole(roleData);
  };

  useEffect(() => {
  if (user) {
    console.log("User role:", user.role);
  }
}, [user]);

useEffect(() => {
  if (role) {
    console.log("Role data:", role);
  }
}, [role]);

  

  return (
    <main>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <label htmlFor="email">E-post:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <label htmlFor="password">Lösenord:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login Button */}
        <button type="submit" id="login-button">
          Login
        </button>

        {/* Register Button */}
        <button type="button">Registrera</button>
      </form>
    </main>
  );
}


