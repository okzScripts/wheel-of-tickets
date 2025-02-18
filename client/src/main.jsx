import { StrictMode,useState,use,createContext,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import CreateCustomer from './components/CreateCustomer.jsx'
//import CustomerTicket from './components/CustomerTicket.jsx'
import "./styles.css"
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router'
import { SuperAdminView, SuperAdminCompanyView, SuperAdminAdminView, SuperAdminAddAdminView, SuperAdminEditAdminView, SuperAdminAddCompanyView, SuperAdminEditCompanyView } from "./SuperAdminView.jsx"
import { AdminView,AdminAddProductView,AdminEditProductView ,AdminEditSupportView, AdminAddSupportView} from "./AdminView.jsx"
import CustomerService from './CustomerService.jsx'
import LoginPage from './components/LoginPage.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage/>} />
        <Route path='/customer' element={<CreateCustomer/>} />
        <Route path='/super-admin' element={<SuperAdminView />} />
        <Route path='/super-admin-company' element={<SuperAdminCompanyView />} />
        <Route path='/super-admin-add-company' element={<SuperAdminAddCompanyView />} />
        <Route path='/super-admin-edit-company' element={<SuperAdminEditCompanyView />} />
        <Route path='/super-admin-admin' element={<SuperAdminAdminView />} />
        <Route path='/super-admin-add-admin' element={<SuperAdminAddAdminView />} />
        <Route path='/customer-service' element={<CustomerService/>}/>
        <Route path='/super-admin-edit-admin' element={<SuperAdminEditAdminView />} />
        <Route path='/admin-add-product' element={<AdminAddProductView />} />
        <Route path='/admin' element={<AdminView/>}/> 
        <Route path='/admin-edit-product' element={<AdminEditProductView/>}/> 
        <Route path='/admin-edit-support' element={<AdminEditSupportView/>}/> 
        <Route path='/admin-add-support' element={<AdminAddSupportView/>}/> 
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
// adress för create user "http://localhost:5173/create-user"



//console.log(`/api/login/?${document.getElementById("email-field").innerText}&${document.getElementById("password-field").innerText}`)