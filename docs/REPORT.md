# Báo Cáo: VKU Room Booking App - Week 6

## 1. Mục Tiêu
Hoàn thiện ứng dụng đặt phòng VKU Room Booking, đạt chuẩn "Excellent" (9-10 điểm) ở các tiêu chí: UI/UX, Features, Navigation, State Management, và Code Quality. Ứng dụng phải mượt mà, dễ dùng, kiến trúc chuẩn và không có lỗi TypeScript.

## 2. Kiến Trúc 
### 2.1 Navigation
Sử dụng **React Navigation v7**. Kiến trúc kết hợp:
- **RootStack** (Native Stack): Quản lý các màn hình đè lên nhau (Room Details, Booking Flow).
- **MainTabs** (Bottom Tabs): Chứa Browse, My Bookings, Profile. Nằm bên trong RootStack.
- Đã khai báo Type an toàn cho toàn bộ tham số truyền giữa các màn hình (`RootStackParamList`).

### 2.2 Data Flow & State Management
- **Server State (Danh sách phòng)**: Quản lý bởi **TanStack Query**. Tự động caching, xử lý trạng thái loading/error, hỗ trợ Pull-to-refresh.
- **Client State (Bộ lọc & Đặt phòng)**: Quản lý bởi **Zustand**. 
  - `useFilterStore`: Lưu trạng thái các tuỳ chọn lọc (loại phòng, toà nhà, sức chứa).
  - `useBookingStore`: Lưu danh sách đặt phòng, kết hợp `AsyncStorage` để persist dữ liệu kể cả khi tắt app. Hydration được xử lý tốt để tránh flash màn hình.

## 3. Tính Năng Chính
- **Tìm kiếm & Lọc (Search & Filter)**:
  - Tìm kiếm Text được Debounce 300ms.
  - Filter Chips đa chiều (Sức chứa, Toà nhà, Loại phòng, Chỉ hiện phòng trống).
  - Responsive: Chia cột FlatList (1 cột cho điện thoại, 2-3 cột cho màn hình lớn).
- **Đặt phòng (Booking Flow)**:
  - Tuỳ chọn đa khung giờ (kéo dài tối đa 3 tiếng).
  - Kiểm tra xung đột (Conflict Prevention): Thuật toán so sánh khoảng thời gian (`startA < endB && startB < endA`) chặn người dùng chọn đè lên lịch đã có.
  - Phản hồi rung (Haptic feedback) khi đặt thành công.
- **Quản lý (My Bookings)**:
  - Phân loại và sắp xếp: Upcoming (sắp diễn ra) lên đầu, tiếp đến là Completed và Cancelled.
  - Vuốt để huỷ (Swipe-to-cancel).

## 4. Animation & Gestures
Sử dụng **Reanimated 4** và **Gesture Handler 2**:
- `RoomCard`: Phản hồi co giãn `withSpring` mượt mà khi người dùng chạm vào (sử dụng `Gesture.Tap()`).
- `Staggered Entry`: Danh sách phòng xuất hiện tuần tự (FadeInDown.delay) tạo cảm giác cao cấp.
- `Swipe-to-cancel`: `Gesture.Pan()` theo dõi thao tác kéo sang trái. Nếu vượt ngưỡng threshold, hiển thị Alert xác nhận. Sau khi xác nhận, phần tử từ từ thu hẹp chiều cao (`itemHeight = withTiming(0)`) trước khi xoá khỏi Store.

## 5. Khó Khăn & Cách Giải Quyết
- **Khó khăn**: Kết hợp dữ liệu Room từ server và Booking từ local để tính xem phòng đang Trống hay Bận ngay lúc này.
- **Giải pháp**: Xây dựng Hook `useFilteredRooms`. Lấy data từ TanStack Query, filter theo Zustand, sau đó map qua từng Room, kiểm tra xem `hasConflict` với danh sách booking hiện tại ở thời điểm `Date.now()` không. Mọi logic tính toán thực hiện trong `useMemo` để đảm bảo hiệu năng.

## 6. Hướng Phát Triển Tương Lai
- Tích hợp Authentication thực tế thay vì hardcode User ID.
- Đẩy dữ liệu Booking lên server (Backend) và sử dụng WebSocket/Supabase Realtime để cập nhật trạng thái phòng tức thời cho toàn bộ sinh viên thay vì chỉ lưu local.
