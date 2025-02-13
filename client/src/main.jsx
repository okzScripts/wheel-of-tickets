import { StrictMode,useState,use,createContext,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter , Routes,Route, useNavigate } from 'react-router'
import CreateCustomer from './components/CreateCustomer.jsx'
import CustomerTicket from './components/CustomerTicket.jsx'
import "./styles.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>

      <CustomerTicket/>
  </StrictMode>,
);




//console.log(`/api/login/?${document.getElementById("email-field").innerText}&${document.getElementById("password-field").innerText}`)