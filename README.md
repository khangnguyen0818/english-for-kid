# 🌟 Bé Học Tiếng Anh

Web app học tiếng Anh cho bé (khoảng 8 tuổi), giao diện tiếng Việt, tối ưu cho điện thoại.

## Tính năng

- **📖 Học từ vựng: 110 chủ đề, 1.274 từ**, chia thành 11 nhóm:
  Động vật · Ăn uống · Con người · Hành động · Nhà cửa · Trường học · Số & thời gian ·
  Thiên nhiên · Thành phố & thế giới · Vui chơi · Giao tiếp (chào hỏi, câu nói hằng ngày,
  giới thiệu bản thân, hỏi trong lớp…).
  Mỗi từ có hình minh họa, nghĩa tiếng Việt, nút 🔊 nghe phát âm và 🐢 nghe chậm.
- **🎮 6 trò chơi** (chơi theo từng chủ đề hoặc trộn tất cả):
  - 👂 **Nghe & chọn hình** — nghe từ, chọn 1 trong 4 hình
  - 🖼️ **Nhìn hình chọn từ** — nhìn hình, chọn từ tiếng Anh đúng
  - 🎈 **Bắn bóng bay** — nghe từ, chạm vào quả bóng đúng trước khi nó bay mất
  - 🃏 **Lật thẻ trí nhớ** — tìm cặp thẻ hình và chữ
  - 🔤 **Xếp chữ** — xếp các chữ cái thành từ đúng (có nút gợi ý)
  - ⚡ **Đúng hay sai** — 60 giây trả lời nhanh, có lưu kỷ lục
- **⭐ Điểm sao & phần thưởng:**
  - +1 ⭐ cho mỗi từ mới bé nghe lần đầu, +5 ⭐ và huy hiệu khi học hết một chủ đề
  - Sao cho mỗi câu trả lời đúng trong trò chơi, thưởng thêm khi đúng hết
  - 20 nhãn dán để sưu tập và các danh hiệu theo số sao
- Tiến độ được lưu ngay trên máy (localStorage). Bố mẹ có thể xóa tiến độ ở trang Phần thưởng.

Phát âm dùng giọng đọc có sẵn của trình duyệt (Web Speech API). Nếu không nghe được, hãy tắt
chế độ im lặng của điện thoại và tăng âm lượng.

## Thêm / sửa từ vựng

Mở file `data.js`. Mỗi từ là một dòng dạng `[tiếng Anh, nghĩa tiếng Việt, hình]`, ví dụ:

```js
["horse", "con ngựa", "🐴"],
```

Muốn thêm chủ đề mới, chép một khối `T("...", "...", "...", [ ... ])` trong cùng nhóm rồi sửa lại.
Đừng đổi mã chủ đề hay chữ tiếng Anh của từ đã có, vì tiến độ của bé lưu theo đó.

## Chạy thử trên máy tính

Mở file `index.html` bằng trình duyệt, hoặc chạy `python3 -m http.server` rồi vào http://localhost:8000.

## Bật GitHub Pages

1. Vào repo trên GitHub → **Settings** → **Pages**.
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**.
3. Chọn nhánh chứa code (ví dụ `main`) và thư mục **/ (root)** → **Save**.
4. Đợi 1–2 phút, đường link sẽ hiện ở đầu trang Pages:
   `https://khangnguyen0818.github.io/english-for-kid/`
