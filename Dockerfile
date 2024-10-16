# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application files to the container
COPY . .

# Expose the port the app will run on (usually 3000)
EXPOSE 3000

# Command to start your app
CMD ["npm", "start"]
