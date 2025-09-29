FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:stable-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Nginx will listen on
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]