# Recipe API

A simple RESTful API for managing recipes built with Node.js, Express, and MongoDB. Features include CRUD operations, input validation, pagination, and error handling.

## Features

- CRUD operations for recipes
- Input validation using Joi
- Pagination for recipe listings
- Global error handling
- MongoDB integration

## Prerequisites

- Node.js
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

## Dependencies

- express
- mongoose
- dotenv
- joi

## API Endpoints

### Recipes

- **POST /api/recipes**
  - Create a new recipe
  - Required fields:
    - name (string)
    - ingredients (array of strings)
    - instructions (string)
    - preparationTime (number)
    - cookTime (number)
    - servings (number)
  - Example request body:
  ```json
  {
    "name": "Chocolate Cake",
    "ingredients": ["flour", "sugar", "cocoa powder"],
    "instructions": "Mix all ingredients...",
    "preparationTime": 20,
    "cookTime": 35,
    "servings": 8
  }
  ```

- **GET /api/recipes**
  - Get all recipes
  - Supports pagination:
    - Query params: `page` (default: 1)
    - Query params: `limit` (default: 10)
  - Example: `/api/recipes?page=1&limit=10`

- **GET /api/recipes/:id**
  - Get a specific recipe by ID
  - Example: `/api/recipes/65f8d7e12345`

- **PUT /api/recipes/:id**
  - Update a recipe by ID
  - Same fields as POST

- **DELETE /api/recipes/:id**
  - Delete a recipe by ID

## Data Validation

Input validation is implemented using Joi with the following schema:

```javascript
{
    name: string (required),
    ingredients: array of strings (required),
    instructions: string (required),
    preparationTime: number (required),
    cookTime: number (required),
    servings: number (required)
}
```

## Error Handling

The API includes a global error handling middleware that:
- Prevents duplicate error responses
- Returns standardized error messages
- Handles both validation and server errors

## Development

To start the server in development mode:

```bash
npm run dev
```

The server will start on port 8000 (or the port specified in your `.env` file).

## API Response Examples

### Successful Response
```json
{
    "name": "Chocolate Cake",
    "ingredients": ["flour", "sugar", "cocoa powder"],
    "instructions": "Mix all ingredients...",
    "preparationTime": 20,
    "cookTime": 35,
    "servings": 8,
    "_id": "65f8d7e12345",
    "__v": 0
}
```

### Error Response
```json
{
    "message": "Recipe not found"
}
```

### Pagination Response
```json
{
    "recipes": [...],
    "totalPages": 5,
    "currentPage": 1,
    "totalItems": 48
}
```



