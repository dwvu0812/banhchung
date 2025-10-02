# Đề xuất tính năng cho ứng dụng IELTS Vocabulary Learning

## Tổng quan hiện trạng
- Ứng dụng đã có luồng học từ vựng với giao diện ôn tập từng thẻ từ, cho phép nghe phát âm và đánh dấu "Dễ"/"Khó" để cập nhật tiến độ. 【F:frontend/src/pages/StudyPage.tsx†L1-L121】
- Bảng điều khiển hiện hiển thị một số chỉ số cơ bản (tổng số từ đã học, số từ cần ôn trong ngày, độ chính xác) và danh sách hoạt động gần đây. 【F:frontend/src/pages/DashboardPage.tsx†L1-L196】
- Trang gói từ vựng IELTS hỗ trợ lọc theo chủ đề/cấp độ và phát âm từng từ, đồng thời có API backend cho việc seed dữ liệu và tạo từ mới. 【F:frontend/src/pages/IeltsVocabularyPage.tsx†L1-L200】【F:backend/src/vocabulary/vocabulary.controller.ts†L1-L55】
- Thuật toán spaced repetition hiện tại cố định khoảng cách thời gian giữa các lần ôn tập theo mảng `intervals = [1, 3, 7, 14, 30, 90]` (tính theo ngày). 【F:backend/src/user/user.service.ts†L65-L140】

## Đề xuất phát triển/ cải tiến

### 1. Hệ thống ôn tập thích ứng hơn
- Cho phép điều chỉnh động khoảng cách ôn tập dựa trên hiệu suất cá nhân (ví dụ: sử dụng hệ số điều chỉnh dựa trên độ khó tự đánh giá, hoặc áp dụng thuật toán SM-2).
- Thêm API và giao diện cho phép người dùng đặt mục tiêu ôn tập/ngày, nhắc lịch qua email hoặc thông báo đẩy.
- Lý do: hệ thống hiện tại sử dụng chu kỳ cố định nên khó phản ánh năng lực từng người học; việc cá nhân hóa giúp tăng khả năng ghi nhớ và giữ chân người dùng. 【F:backend/src/user/user.service.ts†L102-L140】

### 2. Phân tích tiến độ và động lực học tập
- Mở rộng Dashboard với biểu đồ lịch sử (số từ đã học theo ngày, streak), bảng xếp hạng cá nhân, huy hiệu thành tích.
- Cung cấp báo cáo chi tiết cho từng kỹ năng IELTS (Writing/Speaking...) dựa trên chủ đề mà người dùng học nhiều nhất.
- Lý do: hiện tại dashboard chỉ có số liệu tổng hợp tức thời, chưa có thông tin xu hướng hoặc yếu tố gamification để duy trì động lực. 【F:frontend/src/pages/DashboardPage.tsx†L16-L196】

### 3. Quản lý bộ từ cá nhân và cộng đồng
- Xây dựng giao diện cho phép người dùng tự thêm/sửa/xóa từ vựng cá nhân, tái sử dụng API `POST /vocabulary` sẵn có; bổ sung quyền kiểm soát truy cập và phân quyền (từ riêng tư/công khai).
- Tạo "marketplace" chia sẻ bộ từ theo chủ đề, có lượt thích/tải về để cộng đồng đóng góp.
- Lý do: backend đã hỗ trợ thêm từ mới nhưng frontend chưa có trải nghiệm tạo nội dung, bỏ lỡ cơ hội mở rộng kho từ. 【F:backend/src/vocabulary/vocabulary.controller.ts†L13-L55】【F:frontend/src/pages/IeltsVocabularyPage.tsx†L45-L110】

### 4. Cải thiện trải nghiệm tìm kiếm và duyệt từ
- Bổ sung thanh tìm kiếm tức thời, sắp xếp theo mức độ thành thạo, và phân trang vô hạn trên trang IELTS Vocabulary; tái sử dụng API `/vocabulary/search` đã có.
- Hiển thị trạng thái học của từng từ (chưa học/đang học/đã thuộc) dựa trên dữ liệu `userProgress` để người học ưu tiên ôn tập.
- Lý do: hiện tại người dùng chỉ lọc theo chủ đề/cấp độ, chưa thể tìm theo từ khóa hoặc kết hợp với tiến độ cá nhân. 【F:frontend/src/pages/IeltsVocabularyPage.tsx†L80-L200】【F:backend/src/vocabulary/vocabulary.controller.ts†L33-L55】

### 5. Mở rộng nội dung luyện thi IELTS
- Thêm module bài tập áp dụng từ vựng: viết Task 1/2, trả lời Speaking, ghép collocation theo ngữ cảnh.
- Kết nối với phân tích AI (ví dụ: chấm điểm speaking hoặc gợi ý chỉnh sửa writing) để người dùng luyện tập thực tế với bộ từ họ vừa học.
- Lý do: hiện ứng dụng tập trung vào ghi nhớ từ đơn lẻ, chưa có phần luyện tập kỹ năng gắn liền với bài thi, làm giảm tính ứng dụng của kiến thức. 【F:frontend/src/pages/StudyPage.tsx†L64-L121】

