# Tổng hợp tính năng đã triển khai

## 1. Dashboard theo dõi tiến độ học tập
- Hiển thị tổng số từ đã học, số từ cần ôn trong ngày và độ chính xác dựa trên dữ liệu `userProgress` và `getDueVocabulary`.
- Cung cấp quick actions: bắt đầu ôn tập (điều hướng tới `/study`) và truy cập gói từ vựng IELTS.
- Trình bày lịch sử gần đây với level, thống kê đúng/sai và ngày cập nhật.

## 2. Phiên học Spaced Repetition
- Tải danh sách từ đến hạn ôn hoặc gợi ý từ mới nếu đã hoàn thành.
- Hỗ trợ đọc phát âm (Web Speech API), hiển thị định nghĩa, ví dụ, từ đồng nghĩa và collocations.
- Cho phép đánh dấu "Dễ"/"Khó" để cập nhật tiến độ và tính toán lại lịch ôn.

## 3. Thư viện từ vựng IELTS mở rộng
- Bộ lọc đa tầng: chủ đề, cấp độ, tìm kiếm tức thời và sắp xếp theo mức độ thành thạo hoặc lịch ôn.
- Hiển thị trạng thái học cá nhân (Chưa học/Đến hạn ôn/Đang tiến bộ/Đã thành thạo) với gợi ý lần ôn tiếp theo.
- Cung cấp thống kê tổng quan, seeding dữ liệu mẫu, phát âm, collocation và thẻ chủ đề.

## 4. Thuật toán ôn tập & API backend
- API `updateProgress` cập nhật level, bộ đếm đúng/sai và tính ngày ôn tiếp theo theo chu kỳ `[1, 3, 7, 14, 30, 90]`.
- API `getDueVocabulary` trả về danh sách từ đến hạn (tối đa 20) hoặc gợi ý từ mới nếu không có từ cần ôn.
- Hỗ trợ seed dữ liệu, truy vấn tiến độ và lấy danh sách chủ đề phục vụ giao diện frontend.
