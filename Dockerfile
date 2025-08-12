# Use Nginx base image
FROM nginx:alpine


# Copy your pre-built React app (dist folder) into Nginx public directory
COPY ./dist /usr/share/nginx/html

# Copy your custom Nginx configuration (optional)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 90
EXPOSE 90

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
