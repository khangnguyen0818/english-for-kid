# 🌟 Bé Học Tiếng Anh

Web app học tiếng Anh cho bé (khoảng 8 tuổi), giao diện tiếng Việt, tối ưu cho điện thoại.

## Tính năng

- **📖 Học từ vựng theo 6 chủ đề:** Con vật, Màu sắc, Đồ ăn, Gia đình, Trường học, Số đếm (67 từ).
  Mỗi từ có hình minh họa, nghĩa tiếng Việt, nút 🔊 nghe phát âm và nút 🐢 nghe chậm.
- **🎮 Trò chơi Nghe & chọn hình:** nghe từ tiếng Anh rồi chọn 1 trong 4 hình. Mỗi lượt 10 câu,
  chơi theo từng chủ đề hoặc trộn tất cả.
- **⭐ Điểm sao & phần thưởng:**
  - +1 ⭐ cho mỗi từ mới bé nghe lần đầu
  - +5 ⭐ và huy hiệu khi học hết một chủ đề
  - +1 ⭐ mỗi câu trả lời đúng ngay lần đầu, +3 ⭐ thưởng khi đúng cả 10 câu
  - Mở khóa bộ sưu tập nhãn dán (🐣 🦋 🐬 🦄 🚀 🏆 …) và danh hiệu theo số sao
- Tiến độ được lưu ngay trên điện thoại (localStorage). Bố mẹ có thể xóa tiến độ ở trang Phần thưởng.

Phát âm dùng giọng đọc có sẵn của trình duyệt (Web Speech API) nên không cần mạng
cho phần âm thanh. Nếu không nghe được, hãy tắt chế độ im lặng của điện thoại và tăng âm lượng.

## Thêm / sửa từ vựng

Mở file `data.js`, thêm dòng mới vào chủ đề, ví dụ:

```js
{ en: "horse", vi: "con ngựa", img: "🐴" },
```

## Chạy thử trên máy tính

Mở file `index.html` bằng trình duyệt, hoặc chạy `python3 -m http.server` rồi vào http://localhost:8000.

## Bật GitHub Pages

1. Vào repo trên GitHub → **Settings** → **Pages**.
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**.
3. Chọn nhánh chứa code (ví dụ `main`) và thư mục **/ (root)** → **Save**.
4. Đợi 1–2 phút, đường link sẽ hiện ở đầu trang Pages:
   `https://khangnguyen0818.github.io/english-for-kid/`
