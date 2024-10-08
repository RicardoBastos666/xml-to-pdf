# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app directory (including .env file)
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
