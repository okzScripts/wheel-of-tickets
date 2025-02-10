import { StrictMode,useState,use,createContext,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter , Routes,Route, useNavigate } from 'react-router'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/> 
  </StrictMode>,
);


function App(){
  const [role,setRole]=useState(" "); 

  return (<main> 
         <span></span> <input id="email-field" placeholder="email"></input>
          <input id="password-field"placeholder="password"></input>
          <button onClick={Login } >Login</button>
         </main>); 
};

async function  Login(){
  let role=""; 
  let email= document.getElementById("email-field").value; 
  let password=document.getElementById("password-field").value;  
  let route= `/api/login/?email=${email}&password=${password}`; 
  console.log(route)
 await fetch(route)
  .then(response=>response.text())
        .then(data=>{role=data});

  console.log(role);
}




//console.log(`/api/login/?${document.getElementById("email-field").innerText}&${document.getElementById("password-field").innerText}`)