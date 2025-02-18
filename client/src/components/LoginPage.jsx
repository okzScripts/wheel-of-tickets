import { NavLink } from "react-router";

export default function LoginPage()

{
    return<main>
        <NavLink to="/super-admin"><button >SuperAdmin</button> </NavLink>
        <NavLink to="/"><button>CustomerSupport</button></NavLink> 
        <NavLink to="/customer"><button>Customer</button></NavLink> 
        </main>

}