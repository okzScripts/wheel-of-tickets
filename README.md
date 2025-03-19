# README

## Instructions

### Set-up:

1. **Download Project**
   - Build PostgreSQL database with queries in `/server/databasefiles/swine_sync.txt`
   - Add mock data from the queries in `/server/databasefiles/mockdata.txt`

2. **Navigate to the server folder**
   ```sh
   cd /server/
   ```

3. **Update Database Password**
   - Open `Program.cs`
   - Change the database password to your own or use an environment variable.

4. **Build and Run the Server**
   ```sh
   dotnet build
   dotnet run
   ```

5. **Hash Passwords**
   - Open HTTPie or Postman
   - Make a POST request to:
     ```
     http://localhost:5000/api/mockhash
     ```

6. **Navigate to the Client Folder**
   ```sh
   cd /client
   ```

7. **Install Dependencies**
   ```sh
   npm install
   ```

8. **Run the Client**
   ```sh
   npm run dev
   ```

9. **Access the Application**
   - Click the local link: [http://localhost:5173/](http://localhost:5173/)
   - Use the following credentials:
     - **Super-admin:** `super_gris@mail.com` / `kung`
     - **Admin:** `grune@grymt.se` / `hejhej`
     - **Customer Agent:** `tryne@hotmail.com` / `asd123`

### Creating a Ticket:
1. Navigate to [http://localhost:5173/tech-solutions](http://localhost:5173/tech-solutions)
2. Create a ticket for the Company Tech-Solution.
3. Adjust window to mobile view size.
4. After submitting a ticket with your email, you will receive an email with a link to chat with the company's customer agent.

---

## API Documentation

### API Root Path:
- `http://localhost:5000/api`

---

### **Companies**

#### **GET**
- **Route:** `/companies`
  - Retrieves data for all active or soft-deleted companies using Swine Sync CRM.
  - **Query Parameters:** `active` (bool) – Indicates whether the company is active.
  - **Response:**
    - `200 OK`: List of companies.
    - `400 BadRequest`: Error message.

- **Route:** `/companies/{id}`
  - Retrieves data for a specific company by ID.
  - **Path Parameter:** `id` (int) – Company ID.
  - **Response:**
    - `200 OK`: Company details.
    - `400 BadRequest`: Error message.

#### **PUT**
- **Route:** `/companies/{id}`
  - Updates a company's details.
  - **Path Parameter:** `id` (int) – Company ID.
  - **Body Parameters:**
    - `name` (string)
    - `email` (string)
    - `phone` (string)
    - `description` (string)
    - `domain` (string)
  - **Response:**
    - `200 OK`: Success message.
    - `400 BadRequest`: Error message.

- **Route:** `/companies/block/{id}/{active}`
  - Changes the active status of a company (block/unblock).
  - **Path Parameters:**
    - `id` (int) – Company ID.
    - `active` (bool) – New status.
  - **Response:**
    - `200 OK`: Success message.
    - `400 BadRequest`: Error message.

#### **POST**
- **Route:** `/companies`
  - Adds a company to the Swine Sync database.
  - **Body Parameters:**
    - `name` (string)
    - `email` (string)
    - `phone` (string)
    - `description` (string)
    - `domain` (string)
  - **Response:**
    - `200 OK`: Success message.
    - `400 BadRequest`: Error message.

---

### **Users**

#### **GET**
- **Route:** `/users/company/{role}`
  - Retrieves all users by role in a specific company.
  - **Path Parameter:** `role` (string) – User role.
  - **Query Parameters:** `active` (bool) – Active status.
  - **Response:** JSON object containing user details or error message.

- **Route:** `/users/{id}`
  - Retrieves a specific user by ID.
  - **Path Parameter:** `id` (int) – User ID.
  - **Response:** JSON object containing user details or error message.

#### **PUT**
- **Route:** `/users/{id}`
  - Updates user details.
  - **Path Parameter:** `id` (int) – User ID.
  - **Response:** Success or error message.

---

### **Categories**

#### **GET**
- **Route:** `/categories/{id}`
  - Retrieves all categories for the company of the user.
  - **Path Parameter:** `id` (int) – User ID.

- **Route:** `/categories/company/`
  - Retrieves categories for the logged-in admin’s company.
  - **Query Parameter:** `active` (bool)

#### **PUT**
- **Route:** `/api/categories/status/`
  - Toggles the active status of a category.
  - **Query Parameters:**
    - `id` (int)
    - `active` (bool)

#### **POST**
- **Route:** `/api/categories/`
  - Adds a new category.
  - **Body Parameter:** `name` (string)

---

### **Products**

#### **GET**
- **Route:** `/products/company/`
  - Retrieves active products for a company.
  - **Query Parameter:** `active` (bool)

- **Route:** `/products/{ProductId}`
  - Retrieves a specific product by ID.
  - **Path Parameter:** `ProductId` (int)

#### **POST**
- **Route:** `/products`
  - Adds a new product.
  - **Body Parameter:** `PostProductDTO` (string, string, int, string, int)

#### **PUT**
- **Route:** `/products`
  - Updates product data.
  - **Body Parameter:** `PutProductDTO` (string, string, int, string, int, int)

- **Route:** `/api/products/block/{id}/{active}`
  - Updates a product’s active status.
  - **Path Parameter:** `id` (int)

---

### **Tickets**

#### **GET**
- **Route:** `/tickets/{slug}`
  - Retrieves data for a specific ticket.
  - **Path Parameter:** `slug` (string)

#### **PUT**
- **Route:** `/tickets`
  - Assigns a random ticket to a customer agent.

#### **POST**
- **Route:** `/tickets`
  - Creates a ticket based on customer input.

---

### **Password Hashing**

#### **POST**
- **Route:** `/password/mockhash/`
  - Hashes passwords from mock data.
  - **Response:** Success or error message.


