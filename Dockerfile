# Use lightweight nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built frontend files
COPY dist/ /usr/share/nginx/html/

# Expose HTTP
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]