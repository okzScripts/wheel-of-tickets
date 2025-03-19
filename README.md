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

#### Method: Get
  -  Route: /users/company/{role}

    Description: Retrieves all users by role in a specific company.

    Parameters: Path: role(type:string) 
                Querystring: active(type:bool)

    Response: JSON object containing all user details(TypedResults.Ok(users))
              TypedResults.BadRequest("Session not exisiting")
              TypedResults.BadRequest("ICKE SA NICKE!");
              TypedResults.BadRequest($"Error {ex.Message}");

  -  Route: /users/{id}

    Description: Retrieves a specific user based on their ID.

    Parameters: Path: id(type:int)
                Querystring:-
    
    Response: JSON object containing the users details(TypedResults.Ok(user))
              TypedResults.BadRequest("Ingen admin hittades");
              TypedResults.BadRequest($"Error {ex.Message}");


#### Method: Put
  -  Route: /users/{id}

    Description: Updates an admins user details
                
    Parameters: Path: id(type:int)
                Querystring:-

    Response: TypedResults.NotFound("Ingen User hittades")
              TypedResults.Ok("User updaterades")
              TypedResults.BadRequest($"Error {ex.Message}")
              TypedResults.BadRequest("Session not availabel")
    

### login: 

## categories: 

### products:


### tickets: 

### password: 
