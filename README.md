# Book My Show API

A comprehensive movie booking application backend API built with Node.js, Express, and MongoDB. This API provides complete functionality for managing movies, theatres, user authentication, and administrative operations.

## 🚀 Features

- **User Management**: User registration, authentication, and role-based access control
- **Movie Management**: CRUD operations for movies with detailed information
- **Theatre Management**: Theatre CRUD operations and movie-theatre associations
- **Admin Panel**: Administrative functions for user role management
- **Authentication**: JWT-based authentication with middleware protection
- **Health Checks**: API health monitoring endpoints
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Password Security**: Bcrypt hashing for secure password storage

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv for configuration management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samratcodebase/BOOK-MY-SHOW.git
   cd BOOK-MY-SHOW
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/bookmyshow
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:8000`

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, min 10 chars),
  role: String (enum: USER, CLIENT, ADMIN, MODERATOR),
  userStatus: String (default: "APPROVED"),
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  movieName: String (required),
  description: String (required),
  casts: [String] (required),
  trailerUrl: String (required),
  language: String (required, default: "English"),
  releaseDate: String (required),
  director: String (required),
  releaseStatus: String (required, default: "RELEASED"),
  createdAt: Date,
  updatedAt: Date
}
```

### Theatre Model
```javascript
{
  name: String (required),
  description: String,
  city: String (required),
  pincode: Number (required),
  address: String,
  movies: [ObjectId] (references Movie model),
  createdAt: Date,
  updatedAt: Date
}
```

## 📚 API Documentation

### Authentication

#### POST /api/v1/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "Message": "User Registration SuccessFull",
  "Success": true,
  "Data": {
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "userStatus": "APPROVED",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error Responses:**
- `400`: Validation error (missing fields, invalid email, password too short)
- `409`: User already exists

#### GET /api/v1/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "Message": "User Retrieval SuccessFull",
  "Success": true,
  "Data": {
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Cookies:** `jwt` (HTTP-only cookie with JWT token)

**Error Responses:**
- `401`: Invalid credentials

#### GET /api/v1/auth/logout
Logout user by clearing JWT cookie.

**Response (200):**
```json
{
  "message": "Log Out Successful"
}
```

#### POST /api/v1/auth/resetpassword
Reset user password (requires valid JWT).

**Headers:**
```
x-access-token: <jwt_token>
```

**Request Body:**
```json
{
  "oldpassword": "currentpassword123",
  "newpassword": "newsecurepassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful. Please login again."
}
```

### Movies

#### POST /api/v1/mba/movies
Create a new movie.

**Request Body:**
```json
{
  "movieName": "Inception",
  "description": "A mind-bending thriller about dream invasion",
  "casts": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
  "trailerUrl": "https://example.com/inception-trailer",
  "language": "English",
  "releaseDate": "2010-07-16",
  "director": "Christopher Nolan",
  "releaseStatus": "RELEASED"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "movieName": "Inception",
    "description": "A mind-bending thriller about dream invasion",
    "casts": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    "trailerUrl": "https://example.com/inception-trailer",
    "language": "English",
    "releaseDate": "2010-07-16",
    "director": "Christopher Nolan",
    "releaseStatus": "RELEASED",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### GET /api/v1/mba/movies
Search movies by name (case-insensitive).

**Query Parameters:**
- `movieName` (optional): Search term

**Example:** `/api/v1/mba/movies?movieName=inception`

**Response (200):**
```json
{
  "success": true,
  "message": "Movies fetched successfully",
  "data": [
    {
      "movieName": "Inception",
      "description": "A mind-bending thriller about dream invasion",
      "casts": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
      "trailerUrl": "https://example.com/inception-trailer",
      "language": "English",
      "releaseDate": "2010-07-16",
      "director": "Christopher Nolan",
      "releaseStatus": "RELEASED",
      "_id": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### DELETE /api/v1/mba/movies/:id
Delete a movie by ID.

**URL Parameters:**
- `id`: MongoDB ObjectId of the movie

**Response (200):**
```json
{
  "success": true,
  "message": "Movie deleted successfully",
  "Data": {
    "movieName": "Inception",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error Responses:**
- `404`: Movie not found
- `400`: Invalid movie ID

#### PATCH /api/v1/mba/update
Update movie details.

**Request Body:**
```json
{
  "id": "60d5ecb74b24c72b8c8b4567",
  "data": {
    "description": "Updated description",
    "releaseStatus": "UPCOMING"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Movie updated successfully",
  "data": {
    "movieName": "Inception",
    "description": "Updated description",
    "releaseStatus": "UPCOMING",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Theatres

#### POST /api/v1/mba/theatres
Create a new theatre.

**Request Body:**
```json
{
  "name": "PVR Cinemas",
  "description": "Premium multiplex theatre",
  "city": "Mumbai",
  "pincode": 400001,
  "address": "123 MG Road, Mumbai, Maharashtra"
}
```

**Response (201):**
```json
{
  "message": "Theater Creation Successful",
  "success": true,
  "data": {
    "name": "PVR Cinemas",
    "description": "Premium multiplex theatre",
    "city": "Mumbai",
    "pincode": 400001,
    "address": "123 MG Road, Mumbai, Maharashtra",
    "movies": [],
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error Responses:**
- `400`: Missing required fields

#### GET /api/v1/mba/theatres
Get theatres with optional filters.

**Headers:**
```
x-access-token: <jwt_token>
```

**Query Parameters:**
- `name`: Filter by theatre name
- `city`: Filter by city
- `pincode`: Filter by pincode
- `movie`: Filter theatres showing specific movie

**Example:** `/api/v1/mba/theatres?city=Mumbai&movie=Inception`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "PVR Cinemas",
      "description": "Premium multiplex theatre",
      "city": "Mumbai",
      "pincode": 400001,
      "address": "123 MG Road, Mumbai, Maharashtra",
      "movies": [
        {
          "movieName": "Inception",
          "description": "A mind-bending thriller about dream invasion",
          "_id": "..."
        }
      ],
      "_id": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### PATCH /api/v1/mba/theatres/:id
Update theatre details.

**URL Parameters:**
- `id`: Theatre ID

**Request Body:**
```json
{
  "name": "Updated Theatre Name",
  "city": "New City"
}
```

**Response (200):**
```json
{
  "message": "Updation Successful",
  "data": {
    "name": "Updated Theatre Name",
    "city": "New City",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### DELETE /api/v1/mba/theatres/:id
Delete a theatre.

**URL Parameters:**
- `id`: Theatre ID

**Response (200):**
```json
{
  "message": "Theatre Deleted Successfully",
  "success": true,
  "data": {
    "name": "PVR Cinemas",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### GET /api/v1/mba/theatres/:id/movies
Get all movies in a theatre.

**URL Parameters:**
- `id`: Theatre ID

**Query Parameters:**
- `movie` (optional): Specific movie ID to filter

**Response (200):**
```json
{
  "theatre": {
    "name": "PVR Cinemas",
    "city": "Mumbai",
    "movies": [
      {
        "movieName": "Inception",
        "description": "A mind-bending thriller about dream invasion",
        "casts": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
        "trailerUrl": "https://example.com/inception-trailer",
        "language": "English",
        "releaseDate": "2010-07-16",
        "director": "Christopher Nolan",
        "releaseStatus": "RELEASED",
        "_id": "..."
      }
    ]
  }
}
```

#### PATCH /api/v1/mba/theatres/:id/add/movies
Add or remove movies from a theatre.

**URL Parameters:**
- `id`: Theatre ID

**Request Body:**
```json
{
  "movies": ["60d5ecb74b24c72b8c8b4567"],
  "insert": true  // true to add, false to remove
}
```

**Response (200):**
```json
{
  "name": "PVR Cinemas",
  "description": "Premium multiplex theatre",
  "city": "Mumbai",
  "pincode": 400001,
  "movies": ["60d5ecb74b24c72b8c8b4567"],
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Admin

#### PATCH /api/v1/admin/update/:id/user
Update user role (Admin only).

**Headers:**
```
x-access-token: <jwt_token>
```

**URL Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "message": "User Role Upgradation Complete",
  "data": {
    "username": "john_doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "_id": "..."
  }
}
```

### Health Check

#### GET /api/v1/health/check
Check API health and authentication status.

**Headers:**
```
x-access-token: <jwt_token>
```

**Response (200):**
```json
{
  "message": "Server Health Is Ok : 200"
}
```

## 🔐 Authentication

This API uses JWT (JSON Web Token) based authentication. Include the JWT token in the `x-access-token` header for protected routes:

```
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Roles

- **USER**: Basic user with read access to public data
- **CLIENT**: Extended user permissions
- **ADMIN**: Full administrative access
- **MODERATOR**: Moderation capabilities

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Deployment

1. Set environment variables in production
2. Use a production MongoDB instance
3. Set `NODE_ENV=production`
4. Use a process manager like PM2
5. Configure reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

**Samrat Roy**
- GitHub: [@Samratcodebase](https://github.com/Samratcodebase)

## 📞 Support

