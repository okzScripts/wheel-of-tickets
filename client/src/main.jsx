import { StrictMode,useState,use,createContext,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter , Routes,Route, useNavigate } from 'react-router'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
  </StrictMode>,
);




//console.log(`/api/login/?${document.getElementById("email-field").innerText}&${document.getElementById("password-field").innerText}`)