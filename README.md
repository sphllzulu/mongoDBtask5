# Recipe API
A RESTful API for managing recipes with user authentication and role-based access control. Built with Node.js, Express, and MongoDB.
Features

### User authentication and session management
Role-based access control (admin/user)
CRUD operations for recipes
Input validation using Joi
Pagination for recipe listings
Secure password handling with bcrypt
Email validation for user registration

### Prerequisites

Node.js
MongoDB
npm or yarn

### Installation

Clone the repository
Install dependencies:

bashCopynpm install

Create a .env file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
PORT=8000
SESSION_SECRET=your_session_secret
```

### Dependencies

express
mongoose
dotenv
joi
bcrypt
express-session
connect-mongo
validator

### API Endpoints
Authentication

POST /api/register

Register a new user
Body: { "username": "email@example.com", "password": "password", "role": "user" }


POST /api/login

Login user
Body: { "username": "email@example.com", "password": "password" }



#### Recipes

POST /api/recipes (Admin only)

Create a new recipe
Required fields:

name (string)
ingredients (array of strings)
instructions (string)
preparationTime (number)
cookTime (number)
servings (number)




GET /api/recipes

Get all recipes (authenticated users only)
Supports pagination:

Query params: page (default: 1)
Query params: limit (default: 10)




GET /api/recipes/:id

Get a specific recipe by ID


PUT /api/recipes/:id

Update a recipe by ID
Same fields as POST


DELETE /api/recipes/:id

Delete a recipe by ID



### Authentication and Authorization

All users must register with a valid email address
Sessions are maintained using express-session
Passwords are hashed using bcrypt
Only admin users can create new recipes
Users must be logged in to view recipes

### Session Configuration

Sessions are stored in MongoDB
Cookie settings:

HTTP Only: true
Secure: false (set to true in production)
Max Age: 24 hours



### Error Handling
The API includes error handling for:
Invalid input validation
Authentication failures
Authorization failures
Database errors
Not found resources

### Development
To start the server in development mode:
```
npm run dev

```

The server will start on port 8000 (or the port specified in your .env file).
Security Considerations

Input validation using Joi
Email validation using validator
Secure password hashing
HTTP-only session cookies
Role-based access control
MongoDB connection security best practices

### Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.