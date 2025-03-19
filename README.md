# Instructions

## set-up:  
1. Download project
  Build Postgressql-db with queries in /server/databasefiles/swine_sync.txt
  Add mockdata from the queries in /server/databasefiles/mockdata.txt

2. cd to folder
3. cd /server/
4. Open Program.cs and change the the database password to your own or use an environment variable.
  dotnet build + dotnet run
5. Open HttpPie or Postman, make a Post on "http://localhost:5000/api/mockhash" to hash the passwords.

6. cd to /client:
7. npm install
8. npm run dev
9. Click local link(http://localhost:5173/), log in as:
  Super-admin: super_gris@mail.com /pw: kung
  admin: grune@grymt.se /pw: hejhej
  customer_agent: tryne@hotmail.com /pw: asd123


To make a ticket:
navigate to http://localhost:5173/tech-solutions (to create a ticket for the Company Tech-Solution.
Adjust window to mobile view-size
After entering a ticket and your mail you will receive an email with a link to the chat with the company's customer_agent

## api-documentation: 

### API-root Path: 
  - http://localhost:5000/api 

### companies: 

#### Method: Get
  -  Route: /companies 
    
    Description: Retrieves the data for all companies using the swine sync CRM system. 

    Parameters: path:- querystring: active(type:bool)  

    Response: 
  
  - Route: /companies{id}

### users: 

### login: 

### categories: 
### Method: GET

> #### Route: `/categories/{id}`
> **Description:**  
> Retrieves the data for all categories belonging to the company where the user's ID is connected.  
>  
> **Parameters:**  
> - **Path:** `id` (type: `Int32`)  
>  
> **Response:**  
> JSON with category data.  

---

> #### Route: `/categories/company/`
> **Description:**  
> Retrieves the data of categories belonging to the company of the logged-in user (admin).  
> The boolean `active` is passed, and the result consists of all categories where `active` is `true` or `false`.  
>  
> **Parameters:**  
> - **HttpContext:** (Requires admin role in session)  
> - **Querystring:** `active` (type: `bool`)  

---

### Method: PUT

> #### Route: `/api/categories/status/`
> **Description:**  
> Changes the status of a category. `Active` will toggle between `true` and `false`.  
>  
> **Parameters:**  
> - **HttpContext:** (Requires admin role in session)  
> - **Querystring:**  
>   - `StatusDTO`  
>     - `id` (type: `Int32`)  
>     - `active` (type: `bool`)  
>  
> **Response:**  
> Status message (type: `string`)  

---

### Method: POST

> #### Route: `/api/categories/`
> **Description:**  
> Adds a category to the company.  
>  
> **Parameters:**  
> - **HttpContext:** (Requires admin role in session)  
> - **Querystring:**  
>   - `CategoryDTO`  
>     - `name` (type: `string`)  
>  
> **Response:**  
> Status message (type: `string`)  

### products:


### tickets: 

### password: 
