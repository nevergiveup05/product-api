# 1. Sử dụng Node.js bản LTS gọn nhẹ (Alpine)
FROM node:20-alpine

# 2. Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# 3. Copy package.json và package-lock.json vào container
COPY package*.json ./

# 4. Cài đặt các thư viện sản phẩm (production dependencies)
RUN npm ci --only=production

# 5. Copy toàn bộ mã nguồn vào container
COPY . .

# 6. Mở cổng 3000 cho ứng dụng
EXPOSE 3000

# 7. Lệnh mặc định để khởi chạy ứng dụng
CMD ["node", "index.js"]