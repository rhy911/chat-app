# Dùng image Node chính thức
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package
COPY package*.json ./

# Cài đặt phụ thuộc
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build ứng dụng
RUN npm run build

# Cài server tĩnh để chạy bản build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]

EXPOSE 3000
