import { StrictMode,useState,use,createContext,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import CreateCustomer from './components/CreateCustomer.jsx'
import CustomerTicket from './components/CustomerTicket.jsx'
import "./styles.css"
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router'
import { SuperAdminView, SuperAdminCompanyView, SuperAdminAdminView, SuperAdminAddAdminView } from "./SuperAdminView.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CustomerTicket/>  
      <CreateCustomer/>
    <BrowserRouter>
      <Routes>
        <Route index element={<SuperAdminView />} />
        <Route path='/super-admin-company' element={<SuperAdminCompanyView />} />
        <Route path='/super-admin-admin' element={<SuperAdminAdminView />} />
        <Route path='/super-admin-add-admin' element={<SuperAdminAddAdminView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
// adress för create user "http://localhost:5173/create-user"



//console.log(`/api/login/?${document.getElementById("email-field").innerText}&${document.getElementById("password-field").innerText}`)