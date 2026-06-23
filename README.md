# User Registration API

A simple REST API built using **Node.js** and **Express.js** for managing user registrations.

## Features

* Get all users
* Get user by ID
* Register a new user
* Update user details
* Delete a user
* Input validation
* Duplicate email checking
* Proper HTTP status codes and error handling

## Technologies Used

* Node.js
* Express.js
* JavaScript

## Installation

```bash
git clone https://github.com/Prerana-Bubane/Task-02Prerana_Bubane.git

cd Task-02Prerana_Bubane

npm install

node server.js
```

Server runs at:

```bash
http://localhost:3000
```

## API Endpoints

| Method | Endpoint   | Description     |
| ------ | ---------- | --------------- |
| GET    | /          | API Information |
| GET    | /users     | Get All Users   |
| GET    | /users/:id | Get User By ID  |
| POST   | /users     | Register User   |
| PUT    | /users/:id | Update User     |
| DELETE | /users/:id | Delete User     |

## Testing

Test the API using:

* Postman
* Thunder Client

## Author

**Prerana Bubane**
DecodeLabs Full Stack Development Internship
