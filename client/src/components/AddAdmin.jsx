
export default function AddAdmin()

{
    return <>
        <form>
            <label>Name:
                <input type="text"
                    id="name"
                    placeholder="Enter name" />
             
            </label>
        </form>
        <form>
            <label>Email:
                <input type="text"
                    id="mail"
                placeholder="Enter email"/>

            </label>
        </form>
        <form>
            <label>Password:
                <input type="text"
                    id="password"
                    placeholder="Enter password" />
            </label>
        </form>
        <form>
            <label>Company:
                <input type="text"
                    id="company"
                    placeholder="Enter company " />
            </label>
        </form>

    
    </>

    
}