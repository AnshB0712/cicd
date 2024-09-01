#!/bin/bash

# Usage: ./update_repo.sh <github-repo-url>

# Check if a GitHub repository URL is provided as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <github-repo-url>"
    exit 1
fi

# Change to the projects directory
cd /home/projects || exit
echo "Working directory changed to $(pwd)"

# Extract the repo name from the URL
REPO_URL=$1
REPO_NAME=$(basename -s .git "$REPO_URL")

# Function to stop running containers
stop_running_containers() {
    echo "Stopping running containers..."
    docker-compose down 2>/dev/null || docker stop $(docker ps -q) 2>/dev/null
}

# Function to handle Docker Compose
handle_docker_compose() {
    echo "Docker Compose file found. Using docker-compose..."
    docker-compose build
    docker-compose up -d
}

# Function to handle Dockerfile
handle_dockerfile() {
    echo "Dockerfile found. Using docker build and run..."
    docker build -t "$REPO_NAME" .
    docker run -d "$REPO_NAME"
}

# Check if the directory exists
if [ -d "$REPO_NAME" ]; then
    echo "Repository exists. Pulling the latest changes..."
    cd "$REPO_NAME" || exit
    git pull
else
    echo "Repository does not exist. Cloning the repository..."
    git clone "$REPO_URL"
    cd "$REPO_NAME" || exit
fi

# Stop running containers
stop_running_containers

# Check for docker-compose.yml or Dockerfile and take appropriate action
if [ -f "docker-compose.yml" ]; then
    handle_docker_compose
elif [ -f "Dockerfile" ]; then
    handle_dockerfile
else
    echo "Neither docker-compose.yml nor Dockerfile found. No Docker actions taken."
fi

echo "Script execution completed."