# 🏡 Homely Hub

## 📌 Description
Homely Hub is a real estate management platform that allows users to browse, book, and manage properties. The project includes a **Node.js backend** with authentication, property management, and booking functionalities.

## ✨ Features
- 🔐 User authentication (JWT-based)
- 🏘️ Property listing and management
- 📅 Booking system
- 🖼️ Image uploads using Cloudinary
- 🔎 API request filtering, sorting, and pagination

## 🛠️ Tech Stack
- **Backend:** 🟢 Node.js, Express, MongoDB, Mongoose
- **Authentication:** 🔑 JWT, bcrypt
- **File Storage:** ☁️ Cloudinary
- **API Features:** 📊 Sorting, Filtering, Pagination

---

## 🚀 Installation

### Backend Setup
1. Navigate to the backend folder:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and configure environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

---

Happy Coding 🚀🎯
