# Use Node.js for backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend code
COPY backend/ ./ 

# Copy frontend into backend/public so Express/Node can serve it
RUN mkdir -p /app/backend/public
COPY frontend/ /app/backend/public

# Expose the port your backend uses (assuming 3000)
EXPOSE 3000

# Start the backend
CMD ["node", "app.js"]
