
export default function CreateCustomer()

{
    return <>
        <header> Logga</header>
        <main>
            <form>
                <label>
                    <input type="text"
                           id="name"
                           placeholder="Enter Firstname:"/>
                </label>

                <label>
                    <input type="text"
                           id="name"
                           placeholder="Enter Lastname:"/>
                </label>

                <label>
                    <input type="text"
                           id="mail"
                           placeholder="Enter email:"/>
                </label>

                <label>
                    <input type="text"
                           id="password"
                           placeholder="Enter password"/>
                </label>


                <label>
                    <input type="text"
                           id="company"
                           placeholder="Repeat password: "/>
                </label>
            </form>
            <button id="addCustomer">Create Account</button>
        </main>


    </>


}