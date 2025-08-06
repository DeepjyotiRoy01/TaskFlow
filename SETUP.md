# 🚀 Task Manager Pro - Setup Guide

This guide will help you set up Task Manager Pro on your local machine step by step.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

### **Required Software**
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB](https://www.mongodb.com/) (v6.0 or higher)
- [Git](https://git-scm.com/) (v2.30 or higher)

### **Verify Installation**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Check MongoDB version (if installed)
mongod --version
```

## 🔧 Installation Steps

### **Step 1: Clone the Repository**
```bash
# Clone the repository
git clone https://github.com/yourusername/task-manager-pro.git

# Navigate to the project directory
cd task-manager-pro
```

### **Step 2: Install Dependencies**
```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

This command will install dependencies for:
- Root project (concurrently)
- Backend server (Express, MongoDB, etc.)
- Frontend client (React, TypeScript, etc.)

### **Step 3: Set Up MongoDB**

#### **Option A: Local MongoDB Installation**
1. **Download and Install MongoDB**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for your OS
   - Follow the installation instructions

2. **Start MongoDB Service**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   
   # Or start manually
   mongod
   ```

#### **Option B: MongoDB Atlas (Cloud)**
1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

### **Step 4: Environment Configuration**

Create a `.env` file in the `server` directory:

```bash
# Navigate to server directory
cd server

# Create .env file
touch .env  # On Windows: type nul > .env
```

Add the following configuration to your `.env` file:

```env
# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
PORT=5000
NODE_ENV=development

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/task-manager-pro

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager-pro?retryWrites=true&w=majority

# =============================================================================
# AUTHENTICATION CONFIGURATION
# =============================================================================
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# =============================================================================
# AI FEATURES CONFIGURATION (Optional)
# =============================================================================
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key-here

# =============================================================================
# EMAIL CONFIGURATION (Optional)
# =============================================================================
# For Gmail (enable 2FA and generate app password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# =============================================================================
# FILE UPLOAD CONFIGURATION (Optional)
# =============================================================================
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# =============================================================================
# CORS CONFIGURATION
# =============================================================================
CLIENT_URL=http://localhost:5173
```

### **Step 5: Create Required Directories**
```bash
# Navigate back to root directory
cd ..

# Create uploads directory for file uploads
mkdir server/uploads

# Create logs directory (optional)
mkdir server/logs
```

### **Step 6: Start the Application**

#### **Development Mode (Recommended)**
```bash
# Start both frontend and backend simultaneously
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

#### **Separate Mode (Alternative)**
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run client
```

### **Step 7: Verify Installation**

1. **Check Backend API**
   - Open http://localhost:5000 in your browser
   - You should see a welcome message

2. **Check Frontend**
   - Open http://localhost:5173 in your browser
   - You should see the Task Manager Pro landing page

3. **Test Database Connection**
   - The backend will automatically connect to MongoDB
   - Check the console for connection success message

## 🎯 First Time Setup

### **Create Your First Account**
1. Navigate to http://localhost:5173
2. Click "Sign Up" on the landing page
3. Fill in your details:
   - First Name
   - Last Name
   - Username
   - Email
   - Password
4. Click "Create Account"
5. You'll be redirected to the dashboard

### **Explore the Features**
- **Dashboard**: View your task overview and statistics
- **Tasks**: Create and manage your tasks
- **Team**: Invite team members (coming soon)
- **Achievements**: Track your progress and badges
- **Settings**: Customize your preferences

## 🔧 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :5000  # On macOS/Linux
netstat -ano | findstr :5000  # On Windows

# Kill the process or change the port in .env
```

#### **MongoDB Connection Failed**
```bash
# Check if MongoDB is running
ps aux | grep mongod  # On macOS/Linux
tasklist | findstr mongod  # On Windows

# Start MongoDB if not running
mongod
```

#### **Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Permission Denied (Linux/macOS)**
```bash
# Fix permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### **Environment-Specific Issues**

#### **Windows**
- Make sure you're running PowerShell as Administrator
- Install Windows Build Tools: `npm install --global windows-build-tools`

#### **macOS**
- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for MongoDB: `brew install mongodb-community`

#### **Linux (Ubuntu/Debian)**
```bash
# Install required packages
sudo apt-get update
sudo apt-get install -y build-essential python3
```

## 🚀 Production Deployment

### **Build for Production**
```bash
# Build the frontend
npm run build

# Start production server
npm run start
```

### **Environment Variables for Production**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

## 📚 Additional Resources

- [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

## 🆘 Need Help?

If you encounter any issues:

1. **Check the logs** in the terminal
2. **Verify your environment variables** in the `.env` file
3. **Ensure all prerequisites** are installed correctly
4. **Create an issue** on GitHub with detailed information

---

**Happy coding! 🎉** 