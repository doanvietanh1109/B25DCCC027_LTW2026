# Bài thực hành 01

Đề bài: Ứng dụng "Quản Lý Điểm Sinh Viên"

## 1. Tính năng chính

- Hiển thị danh sách sinh viên ban đầu:

* Có sẵn một mảng dữ liệu mẫu gồm tối thiểu 3 sinh viên (mỗi sinh viên có các thông tin: `id, name, score, class`).
* Hiển thị danh sách này ra giao diện theo dạng bảng hoặc danh sách.

- Thêm sinh viên mới:

* Có một Form nhập liệu gồm các ô nhập: Họ tên, Điểm số, Lớp.
* Khi nhấn nút **"Thêm"**, cập nhật danh sách hiển thị ngay lập tức (không được làm mất dữ liệu cũ).
* **Ràng buộc dữ liệu:** Kiểm tra nếu để trống hoặc điểm số không hợp lệ (nhỏ hơn 0 hoặc lớn hơn 10) thì hiển thị thông báo lỗi, không cho thêm.

- Xóa sinh viên:

* Mỗi dòng sinh viên có một nút **"Xóa"**. Khi bấm vào, xóa sinh viên đó ra khỏi danh sách.

- Tính năng lọc (Filter) / Thống kê cơ bản:

* Có nút hoặc bộ lọc để hiển thị riêng danh sách sinh viên đạt loại Giỏi (Điểm `>= 8`) hoặc sinh viên trượt môn (Điểm `< 5`).
* Hiển thị tổng số lượng sinh viên và điểm trung bình của toàn lớp.

## 2. Yêu cầu kĩ thuật bắt buộc:

- **Cấu trúc Component (Bắt buộc chia tối thiểu 3 component):**
  - `App` (Component cha): Quản lý `state` chính của ứng dụng (dữ liệu danh sách sinh viên, bộ lọc).
  - `StudentList` hoặc `StudentTable` (Component con): Nhận danh sách qua `Props` để hiển thị.
  - `StudentItem` (Component cháu/con): Hiển thị chi tiết từng dòng dữ liệu của một sinh viên.

- **Quy chuẩn ES6:**
  - Bắt buộc dùng `let`, `const` thay cho `var`.
  - Dùng **Arrow Functions** cho tất cả các hàm/component.
  - Dùng **Destructuring Assignment** để bóc tách `props` và `state`.
  - Dùng **Template Literals** khi cần nối chuỗi hiển thị.
  - Sử dụng các phương thức xử lý mảng của ES6 (`.map()`, `.filter()`, `.reduce()`).

## 3. Cách chạy project

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ Vite hiển thị trong Terminal, thường là:

```text
http://localhost:5173
```
