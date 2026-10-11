// Dữ liệu từ vựng theo chủ đề.
// Mỗi từ: en (tiếng Anh), vi (nghĩa tiếng Việt), img (emoji minh họa)
// hoặc swatch (mã màu, dùng cho chủ đề màu sắc).
const TOPICS = [
  {
    id: "animals", name: "Con vật", icon: "🐶", color: "#ff9f43",
    words: [
      { en: "dog", vi: "con chó", img: "🐶" },
      { en: "cat", vi: "con mèo", img: "🐱" },
      { en: "bird", vi: "con chim", img: "🐦" },
      { en: "fish", vi: "con cá", img: "🐟" },
      { en: "elephant", vi: "con voi", img: "🐘" },
      { en: "tiger", vi: "con hổ", img: "🐯" },
      { en: "lion", vi: "con sư tử", img: "🦁" },
      { en: "monkey", vi: "con khỉ", img: "🐵" },
      { en: "rabbit", vi: "con thỏ", img: "🐰" },
      { en: "cow", vi: "con bò", img: "🐮" },
      { en: "pig", vi: "con lợn", img: "🐷" },
      { en: "duck", vi: "con vịt", img: "🦆" },
    ],
  },
  {
    id: "colors", name: "Màu sắc", icon: "🎨", color: "#ee5a9b",
    words: [
      { en: "red", vi: "màu đỏ", swatch: "#e53935" },
      { en: "orange", vi: "màu cam", swatch: "#fb8c00" },
      { en: "yellow", vi: "màu vàng", swatch: "#fdd835" },
      { en: "green", vi: "màu xanh lá", swatch: "#43a047" },
      { en: "blue", vi: "màu xanh dương", swatch: "#1e88e5" },
      { en: "purple", vi: "màu tím", swatch: "#8e24aa" },
      { en: "pink", vi: "màu hồng", swatch: "#f48fb1" },
      { en: "brown", vi: "màu nâu", swatch: "#795548" },
      { en: "black", vi: "màu đen", swatch: "#212121" },
      { en: "white", vi: "màu trắng", swatch: "#ffffff" },
      { en: "gray", vi: "màu xám", swatch: "#9e9e9e" },
    ],
  },
  {
    id: "food", name: "Đồ ăn", icon: "🍎", color: "#2ecc71",
    words: [
      { en: "apple", vi: "quả táo", img: "🍎" },
      { en: "banana", vi: "quả chuối", img: "🍌" },
      { en: "orange", vi: "quả cam", img: "🍊" },
      { en: "bread", vi: "bánh mì", img: "🍞" },
      { en: "egg", vi: "quả trứng", img: "🥚" },
      { en: "milk", vi: "sữa", img: "🥛" },
      { en: "rice", vi: "cơm", img: "🍚" },
      { en: "cake", vi: "bánh ngọt", img: "🍰" },
      { en: "pizza", vi: "bánh pizza", img: "🍕" },
      { en: "carrot", vi: "củ cà rốt", img: "🥕" },
      { en: "ice cream", vi: "kem", img: "🍦" },
      { en: "candy", vi: "kẹo", img: "🍬" },
    ],
  },
  {
    id: "family", name: "Gia đình", icon: "👨‍👩‍👧", color: "#a55eea",
    words: [
      { en: "family", vi: "gia đình", img: "👨‍👩‍👧‍👦" },
      { en: "father", vi: "bố", img: "👨" },
      { en: "mother", vi: "mẹ", img: "👩" },
      { en: "brother", vi: "anh / em trai", img: "👦" },
      { en: "sister", vi: "chị / em gái", img: "👧" },
      { en: "grandfather", vi: "ông", img: "👴" },
      { en: "grandmother", vi: "bà", img: "👵" },
      { en: "baby", vi: "em bé", img: "👶" },
      { en: "home", vi: "ngôi nhà", img: "🏠" },
      { en: "love", vi: "yêu thương", img: "❤️" },
    ],
  },
  {
    id: "school", name: "Trường học", icon: "🏫", color: "#3d8bfd",
    words: [
      { en: "school", vi: "trường học", img: "🏫" },
      { en: "teacher", vi: "cô giáo / thầy giáo", img: "🧑‍🏫" },
      { en: "book", vi: "quyển sách", img: "📚" },
      { en: "pencil", vi: "bút chì", img: "✏️" },
      { en: "pen", vi: "bút mực", img: "🖊️" },
      { en: "bag", vi: "cặp sách", img: "🎒" },
      { en: "ruler", vi: "thước kẻ", img: "📏" },
      { en: "scissors", vi: "cái kéo", img: "✂️" },
      { en: "crayon", vi: "bút sáp màu", img: "🖍️" },
      { en: "chair", vi: "cái ghế", img: "🪑" },
      { en: "clock", vi: "đồng hồ", img: "🕒" },
    ],
  },
  {
    id: "numbers", name: "Số đếm", icon: "🔢", color: "#f7b731",
    words: [
      { en: "zero", vi: "số không", img: "0️⃣" },
      { en: "one", vi: "số một", img: "1️⃣" },
      { en: "two", vi: "số hai", img: "2️⃣" },
      { en: "three", vi: "số ba", img: "3️⃣" },
      { en: "four", vi: "số bốn", img: "4️⃣" },
      { en: "five", vi: "số năm", img: "5️⃣" },
      { en: "six", vi: "số sáu", img: "6️⃣" },
      { en: "seven", vi: "số bảy", img: "7️⃣" },
      { en: "eight", vi: "số tám", img: "8️⃣" },
      { en: "nine", vi: "số chín", img: "9️⃣" },
      { en: "ten", vi: "số mười", img: "🔟" },
    ],
  },
];

// Phần thưởng: mỗi mốc sao mở khóa một nhãn dán (sticker).
const REWARDS = [
  { stars: 5, img: "🐣", name: "Gà con" },
  { stars: 15, img: "🦋", name: "Bươm bướm" },
  { stars: 30, img: "🐬", name: "Cá heo" },
  { stars: 50, img: "🦄", name: "Kỳ lân" },
  { stars: 75, img: "🚀", name: "Tên lửa" },
  { stars: 100, img: "🏆", name: "Cúp vàng" },
  { stars: 140, img: "🐉", name: "Rồng thần" },
  { stars: 200, img: "👑", name: "Vương miện" },
  { stars: 300, img: "🌈", name: "Cầu vồng" },
  { stars: 500, img: "💎", name: "Kim cương" },
];

// Danh hiệu theo số sao.
const TITLES = [
  { stars: 0, name: "Mầm non tiếng Anh 🌱" },
  { stars: 15, name: "Bé chăm học 📖" },
  { stars: 50, name: "Nhà thám hiểm 🧭" },
  { stars: 100, name: "Siêu sao nhí ⭐" },
  { stars: 200, name: "Nhà vô địch 🏅" },
  { stars: 400, name: "Bậc thầy tiếng Anh 🎓" },
];
