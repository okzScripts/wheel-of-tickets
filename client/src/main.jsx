import { StrictMode,useState,use,createContext,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router'
import { SuperAdminView, SuperAdminCompanyView } from "./SuperAdminView.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<SuperAdminView />} />
        <Route path='/superadmincompany' element={<SuperAdminCompanyView/>} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
);