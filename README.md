# Quiz Game Backend API Documentation

## Overview

This backend system powers an interactive quiz game platform where users can participate as either Question Designers or Players. Designers create and manage questions while Players answer questions and compete on the leaderboard.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # Database connection configuration
│   ├── controllers/
│   │   ├── auth.controller.js  # Authentication logic
│   │   ├── designer.controller.js # Designer operations
│   │   ├── player.controller.js   # Player operations
│   │   └── user.controller.js     # User profile management
│   ├── middlewares/
│   │   ├── auth.middleware.js     # Authentication & authorization
│   │   └── validation.middleware.js # Input validation
│   ├── models/
│   │   ├── user.model.js      # User schema
│   │   ├── question.model.js  # Question schema
│   │   └── category.model.js  # Category schema
│   └── routes/
│       ├── auth.routes.js     # Authentication endpoints
│       ├── designer.routes.js # Designer endpoints
│       ├── player.routes.js   # Player endpoints
│       └── user.routes.js     # User profile endpoints
├── app.js                     # Application entry point
├── .env                       # Environment variables
└── package.json              # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd quiz-game-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```
PORT=8000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/quiz_app
```

4. Start the server:

```bash
npx nodemon app.js
```

## API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "string",
    "password": "string",
    "role": "designer" | "player"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}
```

### Designer Operations

#### Categories

- Create Category: `POST /api/designer/categories`
- Get Categories: `GET /api/designer/categories`
- Update Category: `PUT /api/designer/categories/:id`
- Delete Category: `DELETE /api/designer/categories/:id`

#### Questions

- Create Question: `POST /api/designer/questions`
- Get Questions: `GET /api/designer/questions`
- Get Single Question: `GET /api/designer/questions/:id`
- Update Question: `PUT /api/designer/questions/:id`
- Delete Question: `DELETE /api/designer/questions/:id`
- Add Related Question: `POST /api/designer/questions/:id/related/:relatedId`
- Remove Related Question: `DELETE /api/designer/questions/:id/related/:relatedId`

### Player Operations

#### Questions

- Get Questions: `GET /api/player/questions`
- Get Random Question: `GET /api/player/questions/random`
- Submit Answer: `POST /api/player/questions/:id/answer`

#### Social Features

- Follow Designer: `POST /api/player/follow/designer/:id`
- Follow Player: `POST /api/player/follow/player/:id`
- Get Leaderboard: `GET /api/player/leaderboard`

### User Profile Management

- Get Own Profile: `GET /api/users/profile`
- Update Profile: `PUT /api/users/profile`
- Get User Profile: `GET /api/users/:id`
- Get Following List: `GET /api/users/following`
- Get Followers List: `GET /api/users/followers`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_token>
```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Input validation
- Rate limiting on authentication routes

## Data Models

### User

```javascript
{
    username: String,
    password: String,
    role: "designer" | "player",
    points: Number,
    following: [UserId],
    followers: [UserId],
    answeredQuestions: [{
        question: QuestionId,
        wasCorrect: Boolean,
        timestamp: Date
    }]
}
```

### Question

```javascript
{
    text: String,
    options: [String],
    correctAnswer: Number,
    category: CategoryId,
    difficulty: Number,
    creator: UserId,
    relatedQuestions: [QuestionId]
}
```

### Category

```javascript
{
    name: String,
    creator: UserId
}
```

## Development

- The project uses nodemon for automatic server restart during development
- Swagger UI is available at `/api-docs` for API documentation
- Environment variables can be configured in the `.env` file

## Testing

Test the API endpoints using Postman or curl commands. Example test scripts are available in the `tests` directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

For more detailed information about specific endpoints or features, please refer to the Swagger documentation available at `/api-docs` when running the server.

Let me add a detailed explanation of our database choice to the README:

## Database Choice: MongoDB

### Why MongoDB?

For our quiz game application, we chose MongoDB as our database solution for several key reasons:

1. **Flexible Schema Design**

   - Our application deals with questions and categories that may evolve over time
   - MongoDB's schema-less nature allows us to:
     - Add new question types without database restructuring
     - Modify question formats easily
     - Store varying amounts of metadata for different question types
     - Update category structures without migration hassles

2. **Document Model Alignment**

   - Our data naturally fits MongoDB's document model:
     - Questions contain nested arrays of options
     - Users maintain lists of answered questions
     - Categories can have flexible metadata
   - Example of how our question structure maps perfectly to MongoDB documents:

   ```javascript
   {
     text: "What is 2+2?",
     options: ["3", "4", "5", "6"],
     correctAnswer: 1,
     category: ObjectId("..."),
     difficulty: 3,
     relatedQuestions: [ObjectId("..."), ObjectId("...")],
     metadata: {
       timeLimit: 30,
       points: 10,
       // Easily extendable without schema changes
     }
   }
   ```

3. **Performance Benefits**

   - Fast reads for quiz gameplay:
     - Quick question retrieval using indexes
     - Efficient random question selection
     - Fast leaderboard queries using MongoDB's aggregation
   - Atomic operations for:
     - Updating scores
     - Managing concurrent user answers
     - Handling user following/followers

4. **Scalability Considerations**

   - Horizontal scaling capabilities:
     - Can shard data across multiple servers
     - Supports growing number of questions and users
   - Built-in support for:
     - Caching
     - Query optimization
     - Index management

5. **Developer Experience**
   - Excellent Node.js integration through Mongoose
   - Easy to implement features like:
     - Real-time updates
     - Caching
     - Query building
   - Great documentation and community support

### Data Modeling Decisions

We structured our collections to optimize for common operations:

1. **Questions Collection**

```javascript
{
  _id: ObjectId,
  text: String,
  options: [String],
  correctAnswer: Number,
  category: { type: ObjectId, ref: 'Category' },
  difficulty: Number,
  creator: { type: ObjectId, ref: 'User' },
  relatedQuestions: [{ type: ObjectId, ref: 'Question' }],
  createdAt: Date
}
```

- Optimized for:
  - Quick question retrieval
  - Category-based filtering
  - Difficulty-based sorting
  - Related questions lookup

2. **Users Collection**

```javascript
{
  _id: ObjectId,
  username: String,
  password: String,
  role: String,
  points: Number,
  following: [{ type: ObjectId, ref: 'User' }],
  followers: [{ type: ObjectId, ref: 'User' }],
  answeredQuestions: [{
    question: { type: ObjectId, ref: 'Question' },
    wasCorrect: Boolean,
    timestamp: Date
  }]
}
```

- Designed for:
  - Fast authentication
  - Efficient leaderboard queries
  - Quick profile lookups
  - Social feature performance

3. **Categories Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  creator: { type: ObjectId, ref: 'User' },
  createdAt: Date
}
```

- Structured for:
  - Fast category listing
  - Easy category management
  - Question categorization

### Indexes

We implemented strategic indexes to optimize common queries:

```javascript
// User indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ points: -1 }); // For leaderboard

// Question indexes
db.questions.createIndex({ category: 1 });
db.questions.createIndex({ difficulty: 1 });
db.questions.createIndex({ creator: 1 });

// Category indexes
db.categories.createIndex({ name: 1 }, { unique: true });
```

### Advantages for Our Use Case

1. **Quiz Game Specific Benefits**

   - Fast random question selection
   - Efficient category-based filtering
   - Quick leaderboard updates
   - Easy implementation of social features

2. **Development Advantages**

   - Rapid prototyping capabilities
   - Easy schema evolution
   - Simple integration with Node.js
   - Straightforward scaling path

3. **Operational Benefits**
   - Simple backup and restore
   - Built-in replication
   - Easy monitoring and maintenance
   - Strong community support

This comprehensive explanation showcases why MongoDB was the ideal choice for our quiz game application, considering our specific requirements, performance needs, and future scalability plans.
