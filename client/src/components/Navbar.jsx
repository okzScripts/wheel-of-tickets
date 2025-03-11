import "./../styles.css"
import logo from './../assets/logo.png';
import {NavLink, useFetcher} from "react-router";
import { useEffect } from "react";

export function NavigationBar({back}){
   
    return <nav className="navbar">
        <img src={logo}></img> 
            <NavLink to={back}>
            <button className="back-button">⬅️ Back</button>
        </NavLink>
        <NavLink to={"/change-password"}>
            <button className="back-button">🔒 Change Password</button>
        </NavLink>
        </nav>

}