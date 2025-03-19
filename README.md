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

- Route: /companies

  Description: Retrieves the data for all companies using the swine sync CRM system.

  Parameters: path:- querystring: active(type:bool)

  Response:

- Route: /companies{id}

### users:

### login:

## categories:

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
