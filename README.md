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
navigate to http://localhost:5173/tech-solutions to create a ticket for the Company Tech-Solution.
Adjust window to mobile view-size
After entering a ticket and your mail you will receive an email with a link to the chat with the company's customer_agent

## api-documentation:

### API-root Path:

- http://localhost:5000/api

### companies:

#### Method: Get

- Route: /companies

  Description: Retrieves the data for all companies using the swine sync CRM system.

#### Method: GET

- Route: /companies

  Description:
  Retrieves the data for either all active or all soft deleted companies using the swine sync CRM system .

  Parameters:

      path:
        -
      querystring:
        active(type:bool):
           keeping tracked if the company is soft deleted

      body:
        -

  Response:
  Ok 200: list<company>
  record company(int id, string name, string email, string phone, string description, string domain, bool active)

      BadRequest 400: string

- Route: /companies/{id}

  Description:
  Retrieves the data for a specific company specified by int32 id.

  Parameters:
  path: int32, id primary key

      querystring:
        -
      body:
        -

  Response:
  Ok 200: company
  record company(int id, string name, string email, string phone, string description, string domain, bool active)

      BadRequest 400: string

#### Method: PUT

- Route: /companies/{id}

  Description:

      Edits/updates the data of a company in the database.

  Parameters:

      path:
        int32 id  specifying company to be edited.

      querystring:

        -

      body:

        string Name | name of company

        string Email| email of company

        string Phone| phone for contacting company

        string Description | description of the company

        string Domain | domain of the company

  Response:

      Ok 200: string

      BadRequest 400: string

- Route: /companies/block/{id}/{active}

  Description:

        Changes The active status of a specific company to either block or unblock the company.

  Parameters:

      path:

       id int32 company id.

       active bool state to set the company active column to

      querystring:

       -

      body:

       -

  Response:

       Ok 200: string

       BadRequest 400: string

### Method: POST

- Route: /companies

  Description:

      Adds a company to the swine Sync database:

  Parameters:

      path:

       -

      querystring:

        -

  body:

         string Name | name of company

         string Email| email of company

         string Phone| phone for contacting company

         string Description | description of the company

         string Domain | domain of the company

  Response:

       Ok 200: string

       BadRequest 400: string

  Parameters: path:- querystring: active(type:bool)

  Response:

- Route: /companies{id}

### users:

### login:

### categories:

### Method: GET

> #### Route: `/categories/{id}`
>
> **Description:**  
> Retrieves the data for all categories belonging to the company where the user's ID is connected.
>
> **Parameters:**
>
> - **Path:** `id` (type: `Int32`)
>
> **Response:**  
> JSON with category data.

---

> #### Route: `/categories/company/`
>
> **Description:**  
> Retrieves the data of categories belonging to the company of the logged-in user (admin).  
> The boolean `active` is passed, and the result consists of all categories where `active` is `true` or `false`.
>
> **Parameters:**
>
> - **HttpContext:** (Requires admin role in session)
> - **Querystring:** `active` (type: `bool`)

---

### Method: PUT

> #### Route: `/api/categories/status/`
>
> **Description:**  
> Changes the status of a category. `Active` will toggle between `true` and `false`.
>
> **Parameters:**
>
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
>
> **Description:**  
> Adds a category to the company.
>
> **Parameters:**
>
> - **HttpContext:** (Requires admin role in session)
> - **Querystring:**
>   - `CategoryDTO`
>     - `name` (type: `string`)
>
> **Response:**  
> Status message (type: `string`)

### products:

#### Method: Get

- Route: /products/company/

  Description: Retrieves the data for all active products from a registered company. Requires a role to access.

  Parameters: path:- querystring: active(type:bool)

  Response: Task<Results<Ok<List<Product>>, BadRequest<string>>>

- Route: /products/{ProductId}

  Description: Retrieves the data for a specific product. Requires a role to access.

  Parameters: path:- querystring: ProductId(type:int)

  Response: type:Task<Results<Ok<List<Product>>, BadRequest<string>>>

- Route: /products/customer-ticket/

  Description: Retrieves the data for a specific product. Does not require login

  Parameters: path:- querystring: ProductId(type:int)

  Response: type:Task<Results<Ok<List<ProductTicketInfo>>, BadRequest<string>>>

#### Method: Post

- Route: /products

  Description: Adds data to create a new product. Requires role to access.

  Parameters: path:- querystring: PostProductDTO(type:(string, string, int, string, int))

  Response: type:Task<IResult>

#### Method: Put

- Route: /products

  Description: Edits the data in a specific product.

  Parameters: path:- querystring: PutProductDTO(type:(string, string, int, string, int, int))

  Response: type:Task<IResult>

- Route: /api/products/block/{id}/{active}

  Description: Updates a product status between active and blocked.

  Parameters: path:- querystring: id(type:int)

  Response: type:Task<Results<Ok<string>

### tickets:

### password:

#### Method Post:

- Route: /password/mockhash/

  Description:

      Hashes the passwords from the mockdata to be used after importing mockdata

  Parameters:

      path:

        -

      querystring:

        -

      body:

        -

  Response:

       Ok 200: d
       BadRequest 400: string
