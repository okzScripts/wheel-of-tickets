#Oskar Krantz - okzScripts
#Jonas Manni - Jmannicode
#Srecko Radivojevic - momfy11
#Viktor Thorsén - viktorthorsen
#Jacob Westholm - huineith


Instructions
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
After entering a ticket and your mail you will recieve an email with a link to the chat with the company's customer_agent



