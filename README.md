Sure, here's the updated README with only the schema for the models:


# MERN App Backend

This is the backend part of a MERN stack application, built with Node.js, Express, and MongoDB. It handles user authentication, category management, and content management, including image, video, and text content.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [API Routes](#api-routes)
- [Usage](#usage)
- [Testing](#testing)
- [Models](#models)

## Prerequisites

Ensure you have the following installed:

- Node.js (v14 or above)
- npm (v6 or above) or yarn
- MongoDB (v4.4 or above)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/mern-app-backend.git
   cd mern-app-backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

   or if you are using yarn:

   ```sh
   yarn install
   ```

## Environment Variables

Create a `.env` file in the root of your project and add the following lines:

```sh
MONGO_URI=mongodb://localhost:27017/mern-app
JWT_SECRET=your_jwt_secret
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in production mode.

### `npm run dev`

Runs the app in development mode using nodemon for automatic restarts.

### `npm test`

Launches the test runner.

## Folder Structure

```plaintext
mern-app-backend/
│
├── node_modules/
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   └── contentController.js
├── middlewares/
│   ├── authMiddleware.js
├── models/
│   ├── categoryModel.js
│   ├── contentModel.js
│   └── userModel.js
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   └── contentRoutes.js
├── services/
│   ├── authService.js
│   ├── categoryService.js
│   └── contentService.js
├── tests/
│   ├── authController.test.js
│   ├── categoryController.test.js
│   ├── contentController.test.js
│   ├── authService.test.js
│   ├── categoryService.test.js
│   └── contentService.test.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## API Routes

### Authentication

#### Register

**Endpoint**

```http
POST /api/auth/register
```

**Request Body**

```json
{
  "username": "testUser",
  "email": "test@example.com",
  "password": "password123",
  "role": "Admin"
}
```

**Response**

```json
{
  "message": "User registered successfully"
}
```

#### Login

**Endpoint**

```http
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "token": "jwt_token",
  "role": "Admin"
}
```

### Categories

#### Create Category

**Endpoint**

```http
POST /api/categories
```

**Request Headers**

```http
Authorization: Bearer jwt_token
```

**Request Body**

```json
{
  "name": "TestCategory",
  "allowsImages": true,
  "allowsVideos": false,
  "allowsTexts": true
}
```

**Response**

```json
{
  "message": "Category created successfully"
}
```

#### Get All Categories

**Endpoint**

```http
GET /api/categories
```

**Response**

```json
[
  {
    "name": "Category1",
    "allowsImages": true,
    "allowsVideos": false,
    "allowsTexts": true
  },
  {
    "name": "Category2",
    "allowsImages": false,
    "allowsVideos": true,
    "allowsTexts": false
  }
]
```

### Contents

#### Get Contents

**Endpoint**

```http
GET /api/contents
```

**Response**

```json
{
  "contents": [
    {
      "title": "Sample Content",
      "type": "Image",
      "imageUrl": "http://example.com/image.jpg",
      "category": {
        "_id": "validCategoryId",
        "name": "Category1"
      },
      "creator": {
        "_id": "creatorId",
        "username": "User1"
      }
    }
  ],
  "counts": {
    "Image": 1,
    "Video": 0,
    "Text": 0
  },
  "pagination": {
    "totalCount": 1,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

#### Create Content

**Endpoint**

```http
POST /api/contents
```

**Request Headers**

```http
Authorization: Bearer jwt_token
```

**Request Body**

```json
{
  "title": "Sample Content",
  "type": "Image",
  "imageUrl": "http://example.com/image.jpg",
  "categoryId": "validCategoryId",
  "creatorId": "creatorId"
}
```

**Response**

```json
{
  "message": "Content created successfully"
}
```

#### Update Content

**Endpoint**

```http
PUT /api/contents/:id
```

**Request Headers**

```http
Authorization: Bearer jwt_token
```

**Request Body**

```json
{
  "title": "Updated Content",
  "type": "Video",
  "url": "http://example.com/video.mp4",
  "categoryId": "validCategoryId",
  "creatorId": "creatorId"
}
```

**Response**

```json
{
  "message": "Content updated successfully"
}
```

#### Delete Content

**Endpoint**

```http
DELETE /api/contents/:id
```

**Request Headers**

```http
Authorization: Bearer jwt_token
```

**Response**

```json
{
  "message": "Content deleted successfully"
}
```

## Usage

1. Start MongoDB server on `mongodb://localhost:27017/mern-app`.
2. Start the backend server:

   ```sh
   npm start
   ```

3. The backend server will be running on [http://localhost:5001](http://localhost:5001).

## Testing

To run tests, use the following command:

```sh
npm test
```

## Models

### User Model

- `username` (String): 
  - **Type**: String
  - **Unique**: Yes
  - **Required**: Yes
  - **Description**: The unique username of the user.

- `email` (String):
  - **Type**: String
  - **Unique**: Yes
  - **Required**: Yes
  - **Description**: The unique email address of the user.

- `password` (String):
  - **Type**: String
  - **Required**: Yes
  - **Description**: The password of the user.

- `role` (String):
  - **Type**: String
  - **Enum**: ['Admin', 'Reader', 'Creator']
  - **Required**: Yes
  - **Description**: The role of the user. Can be one of the following values:
    - 'Admin'
    - 'Reader'
    - 'Creator'

### Category Model

- `name` (String): 
  - **Type**: String
  - **Unique**: Yes
  - **Required**: Yes
  - **Description**: The unique name of the category.

- `allowsImages` (Boolean):
  - **Type**: Boolean
  - **Required**: Yes
  - **Description**: Indicates whether the category allows images.

- `allowsVideos` (Boolean):
  - **Type**: Boolean
  - **Required**: Yes
  - **Description**: Indicates whether the category allows videos.

- `allowsTexts` (Boolean):
  - **Type**: Boolean
  - **Required**: Yes
  - **Description**: Indicates whether the category allows text content.


### Content Model

- `title` (String): 
  - **Type**: String
  - **Required**: Yes
  - **Description**: The title of the content.

- `type` (String):
  - **Type**: String
  - **Enum**: ['Image', 'Video', 'Text']
  - **Required**: Yes
  - **Description**: The type of the content, which can be 'Image', 'Video', or 'Text'.

- `url` (String):
  - **Type**: String
  - **Required**: Only if `type` is 'Video'
  - **Description**: The URL for video content.

- `text` (String):
  - **Type**: String
  - **Required**: Only if `type` is 'Text'
  - **Description**: The text content.

- `imageUrl` (String):
  - **Type**: String
  - **Required**: Only if `type` is 'Image'
  - **Description**: The URL for image content.

- `category` (ObjectId):
  - **Type**: Schema.Types.ObjectId
  - **Ref**: 'Category'
  - **Required**: Yes
  - **Description**: The reference to the category of the content.

- `creator` (ObjectId):
  - **Type**: Schema.Types.ObjectId
  - **Ref**: 'User'
  - **Required**: Yes
  - **Description**: The reference to the user who created the content.
