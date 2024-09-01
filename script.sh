#!/bin/bash

# Usage: ./update_repo.sh <github-repo-url>

# Check if a GitHub repository URL is provided as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <github-repo-url>"
    exit 1
fi

cd /home/projects
echo "working directory changes to home -> projects"
# Extract the repo name from the URL
REPO_URL=$1
REPO_NAME=$(basename -s .git "$REPO_URL")

# Check if the directory exists
if [ -d "$REPO_NAME" ]; then
    echo "Repository exists. Pulling the latest changes..."
    cd "$REPO_NAME"
    git pull
else
    echo "Repository does not exist. Cloning the repository..."
    git clone "$REPO_URL"
fi
