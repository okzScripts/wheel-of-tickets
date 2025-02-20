import "./../styles.css"
import logo from './../assets/logo.png';
import {NavLink, useFetcher} from "react-router";
import { useEffect } from "react";

export function NavigationBar({backUrl}){
   
    useEffect(()=>console.log(backUrl))
    return <nav className="navbar">
        <img src={logo}></img> 
            <NavLink to={backUrl}>
                <button className="back-button">⬅️ Back</button>
            </NavLink>
        </nav>

}