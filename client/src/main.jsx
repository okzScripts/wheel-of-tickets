import { StrictMode, use, useState } from 'react'
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
  // State to track email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState()

  // Handle form submission
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload
    console.log('Email:', email);
    console.log('Password:', password);

    fetch(`/api/users/${email}`)
      .then(response => response.json())
      .then(data => setUser(data));
    console.log(user)




  };

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


