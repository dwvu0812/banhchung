# Quy tắc phát triển mã

Nhằm thống nhất codebase và tập trung vào trải nghiệm học từ vựng, đội ngũ duy trì các nguyên tắc sau:

1. **Tổ chức file gọn nhẹ (~25 dòng/file):** khi một thành phần vượt quá mức này hãy tách thành các mô-đun nhỏ, tái sử dụng được. Mỗi file chỉ nên đảm nhận một trách nhiệm rõ ràng.
2. **Ưu tiên dữ liệu và hành vi học từ vựng:** các màn hình chính phải hiển thị số liệu học tập, danh sách từ cần ôn và nút hành động rõ ràng. Tránh các nội dung quảng cáo hoặc thông tin không liên quan tới việc học.
3. **Tuân thủ component-first:** dùng function component với props rõ ràng, đặt tên mô tả hành vi (ví dụ `LearningDashboard`, `UpcomingReviews`).
4. **Quản lý style thống nhất:** sử dụng Tailwind CSS với tông màu dịu (xám, chàm) và tránh thêm thư viện giao diện tùy tiện. Khi cần nút hoặc tiêu đề hãy ưu tiên các component trong `components/ui`.
5. **Tách biệt cấu hình và dữ liệu tĩnh:** các hằng số, danh sách mô tả nên đặt trong file `constants` riêng để dễ bảo trì và tái sử dụng.

Bất kỳ đóng góp mới nào cần kiểm tra lại các quy tắc trên trước khi tạo pull request.
