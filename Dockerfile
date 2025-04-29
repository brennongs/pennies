# Use the official Node.js LTS image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application on port 9797
EXPOSE 9797

# Start the application
CMD ["npm", "start"]