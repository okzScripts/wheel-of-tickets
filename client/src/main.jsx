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
  return (

    <main>
      <h1>Login Page</h1>
      <form>


        <label htmlFor="email">E-post:</label>
        <input type="email" id="email" />

        <label htmlFor="password">Lösenord:</label>
        <input type="password" id="password" />

        <button type="submit">Registrera</button>
      </form>
    </main>

  )
}


