# IELTS Vocabulary Learning App

Ứng dụng học từ vựng IELTS với phương pháp Spaced Repetition, được xây dựng với NestJS (backend) và React (frontend).

## Tính năng chính

- 🧠 **Spaced Repetition**: Thuật toán học tập thông minh được tối ưu hóa giúp ghi nhớ từ vựng lâu dài
- 📚 **Từ vựng IELTS**: Hơn 15 từ vựng chất lượng cao được phân loại theo chủ đề
- 🔗 **Collocations**: Học các cụm từ và cách sử dụng từ vựng trong ngữ cảnh thực tế
- 📊 **Theo dõi tiến độ**: Thống kê chi tiết và trực quan về quá trình học tập
- 🔐 **Google OAuth**: Đăng nhập dễ dàng và bảo mật với tài khoản Google
- 📱 **Responsive Design**: Giao diện đẹp mắt và thân thiện trên mọi thiết bị
- 🎯 **Feedback tức thì**: Phản hồi ngay lập tức khi trả lời để tăng động lực học tập
- 🔊 **Text-to-Speech**: Phát âm từ vựng để cải thiện kỹ năng nghe và nói

## Công nghệ sử dụng

### Backend
- **NestJS**: Framework Node.js cho backend
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **TypeScript**: Ngôn ngữ lập trình
- **Passport**: Authentication middleware
- **JWT**: JSON Web Tokens cho xác thực

### Frontend
- **React**: Thư viện UI
- **TypeScript**: Ngôn ngữ lập trình
- **Tailwind CSS**: Framework CSS
- **ShadCN UI**: Component library
- **React Router**: Routing
- **Axios**: HTTP client

## Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- Node.js 16+
- MongoDB
- npm hoặc yarn

### 1. Clone repository
```bash
git clone <repository-url>
cd ielts-vocabulary-app
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục backend:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ielts-vocabulary
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

Tạo file `.env` trong thư mục frontend:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Cấu hình Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API
4. Tạo OAuth 2.0 credentials
5. Thêm authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback`
6. Copy Client ID và Client Secret vào file `.env` của backend

### 5. Chạy ứng dụng

#### Phương pháp 1: Development mode
Chạy MongoDB (nếu chưa chạy):
```bash
mongod
```

Chạy cả backend và frontend:
```bash
npm run dev
```

Hoặc chạy riêng lẻ:
```bash
# Backend
cd backend
npm run start:dev

# Frontend (terminal mới)
cd frontend
npm start
```

#### Phương pháp 2: Docker (Khuyến nghị)
```bash
# Chạy tất cả services với Docker
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

#### Phương pháp 3: Sử dụng setup script
```bash
# Cài đặt tự động
./scripts/setup.sh

# Kiểm tra health
./scripts/check-health.sh
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Cấu trúc dự án

```
ielts-vocabulary-app/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── database/      # Database connection
│   │   ├── user/          # User management
│   │   ├── vocabulary/    # Vocabulary management
│   │   └── main.ts        # Application entry point
│   ├── .env               # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main component
│   ├── .env               # Environment variables
│   └── package.json
└── README.md
```

## Thuật toán Spaced Repetition

Ứng dụng sử dụng thuật toán Spaced Repetition được tối ưu hóa với 7 level (0-6):

- **Level 0**: Ôn lại sau 10 phút (từ vựng khó)
- **Level 1**: Ôn lại sau 1 ngày
- **Level 2**: Ôn lại sau 3 ngày
- **Level 3**: Ôn lại sau 1 tuần
- **Level 4**: Ôn lại sau 2 tuần
- **Level 5**: Ôn lại sau 1 tháng
- **Level 6**: Ôn lại sau 3 tháng (đã thuộc)

### Cơ chế nâng/hạ level:
- **Trả lời đúng**: Level tăng 1 (tối đa level 6)
- **Trả lời sai**: 
  - Level 0-1: Về level 0
  - Level 2+: Giảm 2 level để đảm bảo ghi nhớ tốt hơn

## API Endpoints

### Authentication
- `GET /api/auth/google` - Khởi tạo Google OAuth
- `GET /api/auth/google/callback` - Callback từ Google

### Vocabulary
- `GET /api/vocabulary` - Lấy danh sách từ vựng
- `GET /api/vocabulary/search` - Tìm kiếm từ vựng
- `GET /api/vocabulary/topics` - Lấy danh sách chủ đề
- `POST /api/vocabulary/initialize` - Khởi tạo dữ liệu mẫu

### User
- `GET /api/users/profile` - Lấy thông tin user
- `GET /api/users/progress` - Lấy tiến độ học tập
- `GET /api/users/due-vocabulary` - Lấy từ vựng cần ôn
- `POST /api/users/progress/:vocabularyId` - Cập nhật tiến độ

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

- Email: your-email@example.com
- Project Link: [https://github.com/your-username/ielts-vocabulary-app](https://github.com/your-username/ielts-vocabulary-app)