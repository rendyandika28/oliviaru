FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose the port
EXPOSE 3000


# Start the application
CMD ["node", ".output/server/index.mjs"]
