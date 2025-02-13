
export default function CreateCustomer()
{
    const handleChange = async () => {
        e.preventDefault();
    }

    const createCustomer = async () => {
        
    }



    return <>
        <header> Logga</header>
        <main>
            <form>
                <label onSubmit={handleOnSubmit}>
                    <input type="text"
                           name="name"
                           value={setData.firstName}
                           onChange={handleChange}
                           placeholder="Enter Firstname:"/>
                </label>

                <label onSubmit={handleOnSubmit}>
                    <input type="text"
                           name="name"
                           value={setData.lastName}
                           onChange={handleChange}
                           placeholder="Enter Lastname:"/>
                </label>

                <label onSubmit={handleOnSubmit}>
                    <input type="text"
                           name="mail"
                           value={setData.email}
                           onChange={handleChange}
                           placeholder="Enter email:"/>
                </label>

                <label onSubmit={handleOnSubmit}>
                    <input type="text"
                           name="password"
                           value={setData.password}
                           onChange={handleChange}
                           placeholder="Enter password"/>
                </label>


                <label onSubmit={handleOnSubmit}>
                    <input type="text"
                           name="company"
                           value={setData.password}
                           onChange={handleChange}
                           placeholder="Repeat password: "/>
                </label>
            </form>
            <button onClick={createCustomer} id="addCustomer">Create Account</button>
        </main>


    </>


}