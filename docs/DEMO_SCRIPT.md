# Kịch Bản Demo (2-3 phút)

1. **Mở App & Splash Screen**
   - Nhấn mạnh việc app khởi động nhanh.
   - Hiển thị danh sách phòng (staggered animation mượt mà).

2. **Khám Phá & Lọc (Browse & Filter)**
   - Thử thanh tìm kiếm: Gõ "A1" và thấy kết quả được lọc (debounce hoạt động, không lag).
   - Chọn nhiều filter: "Chỉ phòng trống" + "≤10" + "Toà A".
   - Kéo xuống để thấy Load More / Pull-to-refresh.

3. **Chi Tiết & Đặt Phòng (Booking Flow)**
   - Bấm vào một phòng (ví dụ: Room A101). Scale animation phản hồi.
   - Nhấn "Proceed to Booking".
   - Tại màn hình chọn giờ:
     - Chọn ngày mai.
     - Chọn 1 slot (07:00 - 08:00).
     - Bấm tiếp vào slot (09:00 - 10:00) để thấy slot được mở rộng thành 3 tiếng (07:00 - 10:00).
   - Bấm "Review Booking".
   - Xem lại thông tin, bấm "Confirm". (Rung Haptic nhẹ).

4. **Thử Chọn Trùng Giờ (Conflict Validation)**
   - Quay lại trang chủ, chọn đúng Room A101.
   - Chọn ngày mai. Chú ý các slot từ 07:00 - 10:00 lúc nãy đã biến thành màu đỏ (Occupied).
   - Không thể click vào các slot đó.

5. **Quản Lý Đặt Phòng (My Bookings)**
   - Chuyển sang Tab "My Bookings".
   - Thấy Booking vừa tạo nằm ở mục Upcoming.
   - Thử vuốt thẻ sang trái (Swipe). Giao diện thùng rác lộ ra.
   - Thả tay, bấm "No" để huỷ. Thẻ bật lại vị trí cũ bằng `withSpring`.
   - Vuốt lại lần nữa, bấm "Yes". Thẻ mờ dần và thu hẹp chiều cao, biến mất khỏi danh sách.

6. **Đóng / Mở App (Persist Data)**
   - Thoát hoàn toàn app (Reload Expo).
   - Vào lại tab "My Bookings" -> Dữ liệu (nếu còn) vẫn được giữ nguyên nhờ AsyncStorage + Zustand Persist.

*(Kết thúc video)*
