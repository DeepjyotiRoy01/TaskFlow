#!/bin/bash

# =============================================================================
# Task Manager Pro - Quick Start Script
# =============================================================================
# This script will help you set up Task Manager Pro quickly
# Run: chmod +x quick-start.sh && ./quick-start.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js version $(node --version) is compatible"
            return 0
        else
            print_error "Node.js version $(node --version) is too old. Please install Node.js 18 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        return 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version | cut -d'.' -f1)
        if [ "$NPM_VERSION" -ge 9 ]; then
            print_success "npm version $(npm --version) is compatible"
            return 0
        else
            print_error "npm version $(npm --version) is too old. Please install npm 9 or higher."
            return 1
        fi
    else
        print_error "npm is not installed. Please install npm 9 or higher."
        return 1
    fi
}

# Function to check MongoDB
check_mongodb() {
    if command_exists mongod; then
        print_success "MongoDB is installed"
        return 0
    else
        print_warning "MongoDB is not installed. You can:"
        echo "  1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
        echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
        echo "  3. Continue without MongoDB (you'll need to configure it later)"
        read -p "Do you want to continue? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            return 0
        else
            exit 1
        fi
    fi
}

# Function to create environment file
create_env_file() {
    if [ ! -f "server/.env" ]; then
        print_status "Creating environment file..."
        if [ -f "server/env.example" ]; then
            cp server/env.example server/.env
            print_success "Environment file created from template"
            print_warning "Please update server/.env with your configuration"
        else
            print_error "env.example file not found"
            return 1
        fi
    else
        print_status "Environment file already exists"
    fi
}

# Function to create required directories
create_directories() {
    print_status "Creating required directories..."
    mkdir -p server/uploads
    mkdir -p server/logs
    print_success "Directories created"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm run install-all
    print_success "Dependencies installed successfully"
}

# Function to start MongoDB (if available)
start_mongodb() {
    if command_exists mongod; then
        print_status "Checking if MongoDB is running..."
        if ! pgrep -x "mongod" > /dev/null; then
            print_warning "MongoDB is not running. Starting MongoDB..."
            mongod --fork --logpath /dev/null --dbpath /tmp/mongodb
            print_success "MongoDB started"
        else
            print_success "MongoDB is already running"
        fi
    fi
}

# Function to start the application
start_application() {
    print_status "Starting Task Manager Pro..."
    print_success "Application will be available at:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:5000"
    echo ""
    print_warning "Press Ctrl+C to stop the application"
    echo ""
    npm run dev
}

# Main execution
main() {
    echo "============================================================================="
    echo "🚀 Task Manager Pro - Quick Start Script"
    echo "============================================================================="
    echo ""

    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node_version || exit 1
    check_npm_version || exit 1
    check_mongodb || exit 1
    echo ""

    # Setup
    print_status "Setting up Task Manager Pro..."
    create_env_file || exit 1
    create_directories
    install_dependencies
    start_mongodb
    echo ""

    # Start application
    start_application
}

# Run main function
main "$@" 