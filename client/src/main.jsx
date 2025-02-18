import { StrictMode, useState, use, createContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router'
import { SuperAdminView, SuperAdminCompanyView, SuperAdminAdminView, SuperAdminAddAdminView } from "./SuperAdminView.jsx"
import CustomerService from './CustomerService.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<SuperAdminView />} />
        <Route path='/super-admin-company' element={<SuperAdminCompanyView />} />
        <Route path='/super-admin-admin' element={<SuperAdminAdminView />} />
        <Route path='/super-admin-add-admin' element={<SuperAdminAddAdminView />} />
        <Route path='/customer-service' element={<CustomerService/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);