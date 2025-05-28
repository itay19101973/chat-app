[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ge_Ymx5m)
# Chatroom Web Application

A full-stack real-time chatroom application built with Express.js, EJS, and SQLite. This project implements user registration, authentication, and real-time messaging with a clean, responsive interface.

## 🚀 Features

### User Authentication
- **User Registration**: Two-step registration process with email validation
- **Session Management**: Secure session handling with automatic timeout
- **Login/Logout**: Protected routes with automatic redirects

### Chat Functionality
- **Real-time Messaging**: Messages update every 10 seconds via REST API polling
- **Message Management**: Users can edit and delete their own messages
- **Message Search**: Search through chat history by message content
- **Persistent Storage**: All messages stored in SQLite database

### User Experience
- **Responsive Design**: Clean, modern interface that works on all devices
- **Input Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages and graceful failure handling
- **Session Persistence**: Maintains user state across browser sessions

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Template Engine**: EJS
- **Database**: SQLite with Sequelize ORM
- **Session Management**: express-session with connect-session-sequelize
- **API**: RESTful API endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd chatroom-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional required packages** (if not already in package.json)
   ```bash
   npm install cookie express-session connect-session-sequelize
   npm install sqlite3 sequelize
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`


## 🔑 Key Features Implementation

### Registration Process
- **Step 1**: Email and name collection with validation
- **Step 2**: Password setup (30-second session timeout)
- **Validation**: Email uniqueness check, input sanitization
- **Security**: Passwords hashed before storage

### Chat System
- **Polling**: Automatic updates every 10 seconds
- **REST API**: Clean API endpoints for all chat operations
- **Message Operations**: Create, read, update, delete (CRUD)
- **Search**: Full-text search through message content

### Session Management
- **Timeout**: 30-second registration timeout
- **Persistence**: Sessions survive page refreshes
- **Security**: Automatic logout on session expiry
- **Validation**: All protected routes check authentication


## 🔒 Security Features

- **Input Validation**: All user inputs validated and sanitized
- **Session Security**: Secure session configuration
- **SQL Injection Prevention**: Sequelize ORM parameterized queries
- **XSS Protection**: EJS auto-escaping enabled
- **Authentication**: All chat routes protected
- **Authorization**: Users can only modify their own messages

## 🎨 User Interface

- **Clean Design**: Modern, minimalist interface
- **Responsive Layout**: Works on desktop and mobile
- **Real-time Updates**: Seamless message updates
- **User Feedback**: Clear success/error messages
- **Intuitive Navigation**: Easy-to-use interface elements

## 🧪 Testing

The application should be tested with:
- Multiple users simultaneously
- Different browsers and devices
- Network interruptions
- Session timeouts
- Various input combinations

## 📝 Configuration

Key configuration constants (defined in app.js):
- `REGISTER_TIMEOUT`: Registration session timeout (30 seconds)
- `POLLING_INTERVAL`: Message update interval (10 seconds)


## 📄 License

This project is created as part of an academic assignment for Internet Programming course.

## 👥 Authors

[itay mijan] - [itaym99@gmail.com]
[nir busheri] - [nirbu@edu.jmc.ac.il] (if applicable)



