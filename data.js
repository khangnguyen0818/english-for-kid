// Dữ liệu từ vựng: các nhóm (CATEGORIES), mỗi nhóm gồm nhiều chủ đề.
//
// Mỗi từ viết dạng [tiếng Anh, nghĩa tiếng Việt, hình]:
//   - hình là emoji:                ["dog", "con chó", "🐶"]
//   - hình là ô màu (mã màu):        ["red", "màu đỏ", "#e53935"]
//   - hình là chữ (bắt đầu bằng =):  ["twenty", "hai mươi", "=20"]
//   - câu / từ không có emoji hợp:   ["hello", "=Xin chào"]  (hiện chữ tiếng Việt làm "hình")
//
// Lưu ý: tiến độ của bé lưu theo mã chủ đề + từ tiếng Anh, nên khi sửa
// đừng đổi mã chủ đề (vd "animals") hay chữ tiếng Anh của từ đã có.

const PALETTE = [
  "#ff9f43", "#ee5a9b", "#2ecc71", "#3d8bfd", "#a55eea", "#fc5c65", "#0fb9b1",
  "#f7b731", "#4b7bec", "#20bf6b", "#fd9644", "#8854d0", "#26c6da", "#eb3b5a", "#45aaf2",
];

function makeWord([en, vi, pic]) {
  if (pic === undefined && vi.startsWith("=")) return { en, vi: vi.slice(1), txt: vi.slice(1) };
  if (pic.startsWith("=")) return { en, vi, txt: pic.slice(1) };
  if (pic.startsWith("#") || pic.startsWith("linear-gradient")) return { en, vi, swatch: pic };
  return { en, vi, img: pic };
}

function T(id, name, icon, words, color) {
  return { id, name, icon, color, words: words.map(makeWord) };
}

const CATEGORIES = [
  /* ==================== ĐỘNG VẬT ==================== */
  { id: "c-animals", name: "Động vật", icon: "🐾", topics: [
    T("animals", "Con vật", "🐶", [
      ["dog", "con chó", "🐶"], ["cat", "con mèo", "🐱"], ["bird", "con chim", "🐦"],
      ["fish", "con cá", "🐟"], ["elephant", "con voi", "🐘"], ["tiger", "con hổ", "🐯"],
      ["lion", "con sư tử", "🦁"], ["monkey", "con khỉ", "🐵"], ["rabbit", "con thỏ", "🐰"],
      ["cow", "con bò", "🐮"], ["pig", "con lợn", "🐷"], ["duck", "con vịt", "🦆"],
      ["horse", "con ngựa", "🐴"], ["bear", "con gấu", "🐻"], ["frog", "con ếch", "🐸"],
      ["snake", "con rắn", "🐍"], ["chicken", "con gà", "🐔"], ["sheep", "con cừu", "🐑"],
      ["giraffe", "con hươu cao cổ", "🦒"], ["zebra", "con ngựa vằn", "🦓"], ["panda", "con gấu trúc", "🐼"],
      ["turtle", "con rùa", "🐢"], ["mouse", "con chuột", "🐭"], ["butterfly", "con bướm", "🦋"],
    ], "#ff9f43"),
    T("pets", "Thú cưng", "🐕", [
      ["dog", "con chó", "🐕"], ["cat", "con mèo", "🐈"], ["hamster", "chuột hamster", "🐹"],
      ["rabbit", "con thỏ", "🐇"], ["parrot", "con vẹt", "🦜"], ["goldfish", "cá vàng", "🐠"],
      ["turtle", "con rùa", "🐢"], ["mouse", "con chuột", "🐁"], ["lizard", "con thằn lằn", "🦎"],
    ]),
    T("farm", "Nông trại", "🐄", [
      ["cow", "con bò", "🐄"], ["pig", "con lợn", "🐖"], ["horse", "con ngựa", "🐎"],
      ["sheep", "con cừu", "🐑"], ["goat", "con dê", "🐐"], ["chicken", "con gà", "🐔"],
      ["chick", "gà con", "🐤"], ["duck", "con vịt", "🦆"], ["turkey", "gà tây", "🦃"],
      ["water buffalo", "con trâu", "🐃"], ["farmer", "bác nông dân", "👨‍🌾"], ["tractor", "máy cày", "🚜"],
      ["rice", "cây lúa", "🌾"],
    ]),
    T("wild", "Động vật hoang dã", "🦁", [
      ["lion", "sư tử", "🦁"], ["tiger", "con hổ", "🐅"], ["wolf", "chó sói", "🐺"],
      ["fox", "con cáo", "🦊"], ["deer", "con nai", "🦌"], ["bear", "con gấu", "🐻"],
      ["gorilla", "khỉ đột", "🦍"], ["hippo", "hà mã", "🦛"], ["rhino", "tê giác", "🦏"],
      ["leopard", "con báo", "🐆"], ["kangaroo", "chuột túi", "🦘"], ["koala", "gấu túi", "🐨"],
      ["camel", "lạc đà", "🐫"], ["zebra", "ngựa vằn", "🦓"], ["giraffe", "hươu cao cổ", "🦒"],
      ["elephant", "con voi", "🐘"],
    ]),
    T("forest", "Trong rừng", "🌲", [
      ["monkey", "con khỉ", "🐒"], ["orangutan", "đười ươi", "🦧"], ["sloth", "con lười", "🦥"],
      ["bat", "con dơi", "🦇"], ["hedgehog", "con nhím", "🦔"], ["raccoon", "gấu mèo", "🦝"],
      ["squirrel", "con sóc", "🐿️"], ["otter", "rái cá", "🦦"], ["boar", "lợn rừng", "🐗"],
      ["skunk", "chồn hôi", "🦨"], ["badger", "con lửng", "🦡"], ["owl", "cú mèo", "🦉"],
      ["snake", "con rắn", "🐍"],
    ]),
    T("sea", "Dưới biển", "🐳", [
      ["fish", "con cá", "🐟"], ["whale", "cá voi", "🐳"], ["dolphin", "cá heo", "🐬"],
      ["shark", "cá mập", "🦈"], ["octopus", "bạch tuộc", "🐙"], ["crab", "con cua", "🦀"],
      ["shrimp", "con tôm", "🦐"], ["squid", "con mực", "🦑"], ["lobster", "tôm hùm", "🦞"],
      ["shell", "vỏ sò", "🐚"], ["blowfish", "cá nóc", "🐡"],
    ]),
    T("insects", "Côn trùng", "🐝", [
      ["bee", "con ong", "🐝"], ["ant", "con kiến", "🐜"], ["ladybug", "bọ rùa", "🐞"],
      ["butterfly", "con bướm", "🦋"], ["spider", "con nhện", "🕷️"], ["spider web", "mạng nhện", "🕸️"],
      ["mosquito", "con muỗi", "🦟"], ["cricket", "con dế", "🦗"], ["snail", "ốc sên", "🐌"],
      ["caterpillar", "sâu bướm", "🐛"], ["scorpion", "bọ cạp", "🦂"],
    ]),
    T("birds", "Các loài chim", "🦜", [
      ["bird", "con chim", "🐦"], ["eagle", "đại bàng", "🦅"], ["owl", "cú mèo", "🦉"],
      ["parrot", "con vẹt", "🦜"], ["penguin", "chim cánh cụt", "🐧"], ["flamingo", "chim hồng hạc", "🦩"],
      ["peacock", "con công", "🦚"], ["swan", "thiên nga", "🦢"], ["dove", "chim bồ câu", "🕊️"],
      ["duck", "con vịt", "🦆"],
    ]),
    T("reptiles", "Khủng long & bò sát", "🦖", [
      ["dinosaur", "khủng long", "🦕"], ["T-rex", "khủng long bạo chúa", "🦖"], ["crocodile", "cá sấu", "🐊"],
      ["lizard", "thằn lằn", "🦎"], ["snake", "con rắn", "🐍"], ["turtle", "con rùa", "🐢"],
      ["frog", "con ếch", "🐸"], ["dragon", "con rồng", "🐉"],
    ]),
    T("sounds", "Tiếng kêu con vật", "🔊", [
      ["woof", "gâu gâu (chó)", "🐶"], ["meow", "meo meo (mèo)", "🐱"], ["moo", "ò ò (bò)", "🐮"],
      ["oink", "ụt ịt (lợn)", "🐷"], ["quack", "cạc cạc (vịt)", "🦆"], ["baa", "be be (cừu)", "🐑"],
      ["neigh", "hí hí (ngựa)", "🐴"], ["roar", "gầm gừ (sư tử)", "🦁"], ["hiss", "xì xì (rắn)", "🐍"],
      ["buzz", "vo ve (ong)", "🐝"], ["tweet", "líu lo (chim)", "🐦"], ["ribbit", "ộp ộp (ếch)", "🐸"],
      ["hoot", "cú cú (cú mèo)", "🦉"], ["cock-a-doodle-doo", "ò ó o (gà trống)", "🐓"],
    ]),
  ] },

  /* ==================== ĂN UỐNG ==================== */
  { id: "c-food", name: "Ăn uống", icon: "🍽️", topics: [
    T("food", "Đồ ăn", "🍔", [
      ["apple", "quả táo", "🍎"], ["banana", "quả chuối", "🍌"], ["orange", "quả cam", "🍊"],
      ["bread", "bánh mì", "🍞"], ["egg", "quả trứng", "🥚"], ["milk", "sữa", "🥛"],
      ["rice", "cơm", "🍚"], ["cake", "bánh ngọt", "🍰"], ["pizza", "bánh pizza", "🍕"],
      ["carrot", "củ cà rốt", "🥕"], ["ice cream", "kem", "🍦"], ["candy", "kẹo", "🍬"],
      ["noodles", "mì / phở", "🍜"], ["soup", "canh / súp", "🍲"], ["sandwich", "bánh kẹp", "🥪"],
      ["hamburger", "bánh hamburger", "🍔"], ["french fries", "khoai tây chiên", "🍟"], ["cheese", "phô mai", "🧀"],
      ["cookie", "bánh quy", "🍪"], ["chocolate", "sô-cô-la", "🍫"], ["juice", "nước ép", "🧃"],
      ["water", "nước", "💧"], ["meat", "thịt", "🥩"],
    ], "#2ecc71"),
    T("fruits", "Trái cây", "🍇", [
      ["grapes", "quả nho", "🍇"], ["watermelon", "quả dưa hấu", "🍉"], ["strawberry", "quả dâu tây", "🍓"],
      ["pineapple", "quả dứa", "🍍"], ["mango", "quả xoài", "🥭"], ["lemon", "quả chanh", "🍋"],
      ["pear", "quả lê", "🍐"], ["peach", "quả đào", "🍑"], ["cherry", "quả anh đào", "🍒"],
      ["coconut", "quả dừa", "🥥"], ["kiwi", "quả kiwi", "🥝"], ["melon", "quả dưa lưới", "🍈"],
      ["avocado", "quả bơ", "🥑"], ["apple", "quả táo", "🍎"], ["orange", "quả cam", "🍊"],
      ["banana", "quả chuối", "🍌"],
    ], "#e84393"),
    T("vegetables", "Rau củ", "🥦", [
      ["tomato", "quả cà chua", "🍅"], ["potato", "củ khoai tây", "🥔"], ["corn", "bắp ngô", "🌽"],
      ["cucumber", "quả dưa chuột", "🥒"], ["broccoli", "súp lơ xanh", "🥦"], ["onion", "củ hành", "🧅"],
      ["garlic", "củ tỏi", "🧄"], ["mushroom", "cây nấm", "🍄"], ["chili", "quả ớt", "🌶️"],
      ["eggplant", "quả cà tím", "🍆"], ["lettuce", "rau xà lách", "🥬"], ["peanut", "hạt lạc", "🥜"],
      ["sweet potato", "khoai lang", "🍠"],
    ], "#20bf6b"),
    T("drinks", "Đồ uống", "🥤", [
      ["milk", "sữa", "🥛"], ["juice", "nước ép", "🧃"], ["tea", "trà", "🍵"],
      ["coffee", "cà phê", "☕"], ["soda", "nước ngọt", "🥤"], ["water", "nước", "💧"],
      ["ice", "đá", "🧊"], ["smoothie", "sinh tố", "🍹"], ["baby bottle", "bình sữa", "🍼"],
    ]),
    T("breakfast", "Bữa sáng", "🍳", [
      ["fried egg", "trứng ốp la", "🍳"], ["bacon", "thịt xông khói", "🥓"], ["cereal", "ngũ cốc", "🥣"],
      ["pancakes", "bánh kếp", "🥞"], ["butter", "bơ", "🧈"], ["honey", "mật ong", "🍯"],
      ["toast", "bánh mì nướng", "🍞"], ["sausage", "xúc xích", "🌭"], ["milk", "sữa", "🥛"],
      ["waffle", "bánh tổ ong", "🧇"],
    ]),
    T("bakery", "Tiệm bánh", "🥐", [
      ["bread", "bánh mì", "🍞"], ["baguette", "bánh mì que", "🥖"], ["croissant", "bánh sừng bò", "🥐"],
      ["pretzel", "bánh quy xoắn", "🥨"], ["bagel", "bánh vòng", "🥯"], ["cupcake", "bánh nướng nhỏ", "🧁"],
      ["donut", "bánh rán vòng", "🍩"], ["pie", "bánh nướng nhân", "🥧"], ["cookie", "bánh quy", "🍪"],
      ["birthday cake", "bánh sinh nhật", "🎂"],
    ]),
    T("sweets", "Đồ ngọt", "🍭", [
      ["cake", "bánh ngọt", "🍰"], ["candy", "kẹo", "🍬"], ["lollipop", "kẹo mút", "🍭"],
      ["chocolate", "sô-cô-la", "🍫"], ["ice cream", "kem ốc quế", "🍦"], ["shaved ice", "đá bào", "🍧"],
      ["pudding", "bánh flan", "🍮"], ["sundae", "kem ly", "🍨"],
    ]),
    T("fastfood", "Đồ ăn nhanh", "🍟", [
      ["hamburger", "bánh hamburger", "🍔"], ["french fries", "khoai tây chiên", "🍟"], ["pizza", "bánh pizza", "🍕"],
      ["hot dog", "bánh mì xúc xích", "🌭"], ["sandwich", "bánh kẹp", "🥪"], ["taco", "bánh taco", "🌮"],
      ["burrito", "bánh cuộn burrito", "🌯"], ["popcorn", "bỏng ngô", "🍿"], ["fried chicken", "gà rán", "🍗"],
    ]),
    T("asianfood", "Món ăn châu Á", "🍜", [
      ["rice", "cơm", "🍚"], ["noodles", "mì / phở", "🍜"], ["sushi", "sushi", "🍣"],
      ["dumpling", "bánh bao / há cảo", "🥟"], ["rice ball", "cơm nắm", "🍙"], ["bento", "cơm hộp", "🍱"],
      ["curry", "cà ri", "🍛"], ["fried shrimp", "tôm chiên", "🍤"], ["chopsticks", "đôi đũa", "🥢"],
      ["mooncake", "bánh trung thu", "🥮"], ["fish cake", "chả cá", "🍥"],
    ]),
    T("western", "Món Âu", "🍝", [
      ["spaghetti", "mì Ý", "🍝"], ["salad", "rau trộn", "🥗"], ["steak", "bít tết", "🥩"],
      ["soup", "súp", "🍲"], ["cheese", "phô mai", "🧀"], ["chicken leg", "đùi gà", "🍗"],
      ["ribs", "sườn nướng", "🍖"], ["paella", "cơm chảo", "🥘"],
    ]),
    T("meals", "Các bữa ăn", "🍽️", [
      ["breakfast", "bữa sáng", "🥞"], ["lunch", "bữa trưa", "🍱"], ["dinner", "bữa tối", "🍽️"],
      ["snack", "đồ ăn vặt", "🍪"], ["dessert", "món tráng miệng", "🍨"], ["picnic", "dã ngoại", "🧺"],
    ]),
    T("tastes", "Mùi vị", "😋", [
      ["sweet", "ngọt", "🍬"], ["sour", "chua", "🍋"], ["salty", "mặn", "🧂"],
      ["spicy", "cay", "🌶️"], ["bitter", "đắng", "☕"], ["delicious", "ngon", "😋"],
      ["yucky", "dở / ghê quá", "🤢"],
    ]),
    T("protein", "Thịt, cá, trứng, sữa", "🥚", [
      ["meat", "thịt", "🥩"], ["chicken", "thịt gà", "🍗"], ["fish", "cá", "🐟"],
      ["egg", "quả trứng", "🥚"], ["milk", "sữa", "🥛"], ["cheese", "phô mai", "🧀"],
      ["butter", "bơ", "🧈"], ["shrimp", "tôm", "🍤"], ["bacon", "thịt xông khói", "🥓"],
    ]),
    T("foodtalk", "Câu nói khi ăn", "💬", [
      ["I'm hungry.", "=Con đói."], ["I'm thirsty.", "=Con khát."], ["I'm full.", "=Con no rồi."],
      ["It's yummy!", "=Ngon quá!"], ["Let's eat!", "=Ăn thôi!"], ["Enjoy your meal!", "=Chúc ngon miệng!"],
      ["Can I have some water, please?", "=Cho con xin nước ạ."], ["No, thank you.", "=Không, cảm ơn ạ."],
    ]),
  ] },

  /* ==================== CON NGƯỜI ==================== */
  { id: "c-people", name: "Con người", icon: "🧒", topics: [
    T("family", "Gia đình", "👨‍👩‍👧", [
      ["family", "gia đình", "👨‍👩‍👧‍👦"], ["father", "bố", "👨"], ["mother", "mẹ", "👩"],
      ["brother", "anh / em trai", "👦"], ["sister", "chị / em gái", "👧"], ["grandfather", "ông", "👴"],
      ["grandmother", "bà", "👵"], ["baby", "em bé", "👶"], ["home", "ngôi nhà", "🏠"],
      ["love", "yêu thương", "❤️"], ["uncle", "chú / bác / cậu", "🧔"], ["aunt", "cô / dì / thím", "👩‍🦰"],
      ["cousin", "anh chị em họ", "🧒"], ["friend", "bạn bè", "👫"], ["hug", "cái ôm", "🤗"],
      ["pet", "thú cưng", "🐾"],
    ], "#a55eea"),
    T("people", "Mọi người", "🧑", [
      ["man", "đàn ông", "👨"], ["woman", "phụ nữ", "👩"], ["boy", "cậu bé", "👦"],
      ["girl", "cô bé", "👧"], ["baby", "em bé", "👶"], ["old man", "ông cụ", "👴"],
      ["old woman", "bà cụ", "👵"], ["friends", "bạn bè", "👫"], ["people", "mọi người", "👥"],
    ]),
    T("body", "Cơ thể", "👀", [
      ["eye", "con mắt", "👁️"], ["ear", "cái tai", "👂"], ["nose", "cái mũi", "👃"],
      ["mouth", "cái miệng", "👄"], ["tooth", "cái răng", "🦷"], ["tongue", "cái lưỡi", "👅"],
      ["hand", "bàn tay", "✋"], ["finger", "ngón tay", "☝️"], ["arm", "cánh tay", "💪"],
      ["leg", "cái chân", "🦵"], ["foot", "bàn chân", "🦶"], ["hair", "mái tóc", "💇"],
      ["brain", "bộ não", "🧠"], ["bone", "xương", "🦴"], ["nails", "móng tay", "💅"],
    ], "#fd9644"),
    T("senses", "Năm giác quan", "👃", [
      ["see", "nhìn", "👀"], ["hear", "nghe", "👂"], ["smell", "ngửi", "👃"],
      ["taste", "nếm", "👅"], ["touch", "chạm", "✋"],
    ]),
    T("feelings", "Cảm xúc", "😊", [
      ["happy", "vui vẻ", "😄"], ["sad", "buồn", "😢"], ["angry", "tức giận", "😠"],
      ["scared", "sợ hãi", "😨"], ["sleepy", "buồn ngủ", "😴"], ["surprised", "ngạc nhiên", "😲"],
      ["sick", "bị ốm", "🤒"], ["shy", "xấu hổ / ngại", "😳"], ["bored", "chán", "😑"],
      ["excited", "háo hức", "🤩"], ["worried", "lo lắng", "😟"], ["cool", "ngầu", "😎"],
    ], "#f7b731"),
    T("feelings2", "Cảm xúc 2", "🥰", [
      ["confused", "bối rối", "😕"], ["nervous", "hồi hộp", "😬"], ["calm", "bình tĩnh", "😌"],
      ["loved", "được yêu thương", "🥰"], ["silly", "nghịch ngợm", "🤪"], ["grumpy", "cáu kỉnh", "😤"],
      ["disgusted", "thấy ghê", "🤢"], ["curious", "tò mò", "🧐"], ["lonely", "cô đơn", "😔"],
      ["tired", "mệt", "😫"],
    ]),
    T("jobs", "Nghề nghiệp", "👩‍⚕️", [
      ["doctor", "bác sĩ", "👩‍⚕️"], ["farmer", "nông dân", "👨‍🌾"], ["cook", "đầu bếp", "👨‍🍳"],
      ["police officer", "cảnh sát", "👮"], ["firefighter", "lính cứu hỏa", "👩‍🚒"], ["singer", "ca sĩ", "👩‍🎤"],
      ["artist", "họa sĩ", "👨‍🎨"], ["pilot", "phi công", "👨‍✈️"], ["astronaut", "phi hành gia", "👩‍🚀"],
      ["builder", "thợ xây", "👷"], ["scientist", "nhà khoa học", "👩‍🔬"], ["mechanic", "thợ sửa xe", "👨‍🔧"],
      ["teacher", "giáo viên", "👩‍🏫"], ["office worker", "nhân viên văn phòng", "👨‍💼"], ["programmer", "lập trình viên", "👨‍💻"],
      ["judge", "thẩm phán", "👨‍⚖️"], ["detective", "thám tử", "🕵️"], ["guard", "lính gác", "💂"],
      ["factory worker", "công nhân", "👨‍🏭"],
    ], "#0fb9b1"),
    T("clothes", "Quần áo", "👕", [
      ["shirt", "áo sơ mi", "👔"], ["T-shirt", "áo phông", "👕"], ["dress", "váy liền", "👗"],
      ["pants", "quần dài", "👖"], ["shorts", "quần đùi", "🩳"], ["shoes", "đôi giày", "👟"],
      ["boots", "đôi ủng", "👢"], ["socks", "đôi tất", "🧦"], ["hat", "cái mũ", "👒"],
      ["cap", "mũ lưỡi trai", "🧢"], ["coat", "áo khoác", "🧥"], ["scarf", "khăn quàng", "🧣"],
      ["gloves", "găng tay", "🧤"], ["glasses", "kính mắt", "👓"],
    ], "#45aaf2"),
    T("accessories", "Phụ kiện", "👜", [
      ["ring", "chiếc nhẫn", "💍"], ["watch", "đồng hồ đeo tay", "⌚"], ["handbag", "túi xách", "👜"],
      ["purse", "cái ví", "👛"], ["sunglasses", "kính râm", "🕶️"], ["lipstick", "son môi", "💄"],
      ["ribbon", "cái nơ", "🎀"], ["top hat", "mũ ảo thuật", "🎩"], ["high heels", "giày cao gót", "👠"],
      ["sandals", "dép xăng-đan", "👡"], ["crown", "vương miện", "👑"], ["ballet shoes", "giày ba-lê", "🩰"],
    ]),
    T("health", "Sức khỏe", "💊", [
      ["fever", "sốt", "🤒"], ["cough", "ho", "😷"], ["sneeze", "hắt hơi", "🤧"],
      ["hurt", "bị đau", "🤕"], ["medicine", "thuốc", "💊"], ["injection", "mũi tiêm", "💉"],
      ["bandage", "băng dán cá nhân", "🩹"], ["thermometer", "nhiệt kế", "🌡️"], ["hospital", "bệnh viện", "🏥"],
      ["doctor", "bác sĩ", "👩‍⚕️"], ["healthy", "khỏe mạnh", "💪"],
    ]),
  ] },

  /* ==================== HÀNH ĐỘNG ==================== */
  { id: "c-actions", name: "Hành động", icon: "🏃", topics: [
    T("moves", "Vận động", "🏃", [
      ["run", "chạy", "🏃"], ["walk", "đi bộ", "🚶"], ["swim", "bơi", "🏊"],
      ["dance", "nhảy múa", "💃"], ["climb", "leo trèo", "🧗"], ["ride a bike", "đạp xe", "🚴"],
      ["stand", "đứng", "🧍"], ["sleep", "ngủ", "🛌"], ["row", "chèo thuyền", "🚣"],
      ["cartwheel", "nhào lộn", "🤸"], ["kneel", "quỳ", "🧎"],
    ]),
    T("daily", "Việc hằng ngày", "📖", [
      ["eat", "ăn", "🍽️"], ["drink", "uống", "🥤"], ["read", "đọc", "📖"],
      ["write", "viết", "✍️"], ["sing", "hát", "🎤"], ["draw", "vẽ", "🖍️"],
      ["cook", "nấu ăn", "🍳"], ["wash", "rửa", "🧼"], ["take a shower", "tắm vòi sen", "🚿"],
      ["watch TV", "xem ti vi", "📺"], ["play games", "chơi điện tử", "🎮"], ["listen to music", "nghe nhạc", "🎧"],
    ]),
    T("gestures", "Cử chỉ", "👋", [
      ["wave", "vẫy tay", "👋"], ["clap", "vỗ tay", "👏"], ["point", "chỉ tay", "👉"],
      ["think", "suy nghĩ", "🤔"], ["laugh", "cười to", "😂"], ["cry", "khóc", "😭"],
      ["smile", "mỉm cười", "😊"], ["talk", "nói chuyện", "🗣️"], ["look", "nhìn", "👀"],
      ["kiss", "hôn", "😘"], ["hug", "ôm", "🤗"], ["shake hands", "bắt tay", "🤝"],
      ["thumbs up", "giơ ngón cái", "👍"], ["shh", "suỵt", "🤫"],
    ]),
    T("actions3", "Hành động khác", "🔧", [
      ["lock", "khóa", "🔒"], ["unlock", "mở khóa", "🔓"], ["give", "tặng", "🎁"],
      ["buy", "mua", "🛒"], ["cut", "cắt", "✂️"], ["build", "xây", "🏗️"],
      ["fix", "sửa", "🔧"], ["paint", "tô màu", "🎨"], ["plant", "trồng cây", "🌱"],
      ["fly a kite", "thả diều", "🪁"], ["drive", "lái xe", "🚗"], ["call", "gọi điện", "📞"],
    ]),
    T("routine", "Thói quen mỗi ngày", "⏰", [
      ["wake up", "thức dậy", "⏰"], ["get dressed", "mặc quần áo", "👕"], ["have breakfast", "ăn sáng", "🥞"],
      ["go to school", "đi học", "🏫"], ["study", "học bài", "📚"], ["do homework", "làm bài tập về nhà", "📝"],
      ["have lunch", "ăn trưa", "🍱"], ["go home", "về nhà", "🏠"], ["take a bath", "tắm", "🛁"],
      ["have dinner", "ăn tối", "🍽️"], ["go to bed", "đi ngủ", "🛏️"],
    ]),
    T("chores", "Việc nhà", "🧹", [
      ["sweep the floor", "quét nhà", "🧹"], ["wash the dishes", "rửa bát", "🍽️"], ["do the laundry", "giặt quần áo", "🧺"],
      ["water the plants", "tưới cây", "🌱"], ["make the bed", "dọn giường", "🛏️"], ["take out the trash", "đổ rác", "🗑️"],
      ["feed the dog", "cho chó ăn", "🐕"], ["cook dinner", "nấu bữa tối", "🍳"], ["tidy up toys", "dọn đồ chơi", "🧸"],
      ["wash the car", "rửa xe", "🚗"],
    ]),
    T("weekend", "Cuối tuần", "🎡", [
      ["go swimming", "đi bơi", "🏊"], ["go shopping", "đi mua sắm", "🛍️"], ["go to the park", "đi công viên", "🏞️"],
      ["go to the zoo", "đi sở thú", "🦁"], ["visit grandparents", "thăm ông bà", "👵"], ["watch a movie", "xem phim", "🎬"],
      ["play football", "đá bóng", "⚽"], ["go camping", "đi cắm trại", "⛺"], ["go fishing", "đi câu cá", "🎣"],
      ["ride a bike", "đạp xe", "🚴"],
    ]),
    T("hobbies", "Sở thích", "🎨", [
      ["reading", "đọc sách", "📚"], ["drawing", "vẽ", "🖍️"], ["singing", "ca hát", "🎤"],
      ["dancing", "nhảy múa", "💃"], ["cooking", "nấu ăn", "🍳"], ["gardening", "làm vườn", "🌱"],
      ["painting", "vẽ tranh màu", "🎨"], ["playing chess", "chơi cờ vua", "♟️"], ["taking photos", "chụp ảnh", "📸"],
      ["playing the piano", "chơi đàn piano", "🎹"], ["hide and seek", "trốn tìm", "🙈"], ["knitting", "đan len", "🧶"],
    ]),
  ] },

  /* ==================== NHÀ CỬA ==================== */
  { id: "c-home", name: "Nhà cửa", icon: "🏠", topics: [
    T("house", "Trong nhà", "🛋️", [
      ["bed", "cái giường", "🛏️"], ["sofa", "ghế sofa", "🛋️"], ["door", "cái cửa", "🚪"],
      ["light", "bóng đèn", "💡"], ["TV", "ti vi", "📺"], ["phone", "điện thoại", "📱"],
      ["toilet", "bồn cầu", "🚽"], ["bathtub", "bồn tắm", "🛁"], ["key", "chìa khóa", "🔑"],
      ["cup", "cái cốc", "☕"], ["spoon", "cái thìa", "🥄"], ["bowl", "cái bát", "🥣"],
      ["plate", "cái đĩa", "🍽️"], ["soap", "xà phòng", "🧼"], ["broom", "cái chổi", "🧹"],
    ], "#8854d0"),
    T("rooms", "Các phòng", "🚪", [
      ["bedroom", "phòng ngủ", "🛏️"], ["bathroom", "phòng tắm", "🛁"], ["kitchen", "nhà bếp", "🍳"],
      ["living room", "phòng khách", "🛋️"], ["dining room", "phòng ăn", "🍽️"], ["garden", "khu vườn", "🏡"],
      ["garage", "nhà để xe", "🚗"], ["toilet", "nhà vệ sinh", "🚽"],
    ]),
    T("kitchen", "Nhà bếp", "🔪", [
      ["knife", "con dao", "🔪"], ["fork", "cái nĩa", "🍴"], ["spoon", "cái thìa", "🥄"],
      ["chopsticks", "đôi đũa", "🥢"], ["bowl", "cái bát", "🥣"], ["plate", "cái đĩa", "🍽️"],
      ["cup", "cái cốc", "☕"], ["frying pan", "cái chảo", "🍳"], ["pot", "cái nồi", "🍲"],
      ["salt", "muối", "🧂"], ["bottle", "cái chai", "🍾"],
    ]),
    T("bathroom", "Phòng tắm", "🛁", [
      ["toilet", "bồn cầu", "🚽"], ["shower", "vòi sen", "🚿"], ["bathtub", "bồn tắm", "🛁"],
      ["soap", "xà phòng", "🧼"], ["sponge", "bọt biển", "🧽"], ["toilet paper", "giấy vệ sinh", "🧻"],
      ["lotion", "kem dưỡng da", "🧴"], ["basket", "giỏ đựng đồ", "🧺"],
    ]),
    T("household", "Đồ vật quanh nhà", "📦", [
      ["candle", "cây nến", "🕯️"], ["box", "cái hộp", "📦"], ["envelope", "phong bì", "✉️"],
      ["picture", "bức tranh", "🖼️"], ["mailbox", "hộp thư", "📫"], ["shopping bag", "túi mua sắm", "🛍️"],
      ["thread", "sợi chỉ", "🧵"], ["yarn", "cuộn len", "🧶"], ["safety pin", "kim băng", "🧷"],
      ["umbrella", "cái ô", "☂️"], ["trash can", "thùng rác", "🗑️"], ["clock", "đồng hồ để bàn", "🕰️"],
    ]),
    T("tools", "Dụng cụ", "🔨", [
      ["hammer", "cái búa", "🔨"], ["wrench", "cờ lê", "🔧"], ["screw", "ốc vít", "🔩"],
      ["gear", "bánh răng", "⚙️"], ["magnet", "nam châm", "🧲"], ["toolbox", "hộp dụng cụ", "🧰"],
      ["axe", "cái rìu", "🪓"], ["flashlight", "đèn pin", "🔦"], ["chain", "dây xích", "⛓️"],
      ["pick", "cuốc chim", "⛏️"], ["scissors", "cái kéo", "✂️"], ["key", "chìa khóa", "🔑"],
    ]),
    T("technology", "Công nghệ", "💻", [
      ["laptop", "máy tính xách tay", "💻"], ["computer", "máy tính bàn", "🖥️"], ["keyboard", "bàn phím", "⌨️"],
      ["mouse", "chuột máy tính", "🖱️"], ["printer", "máy in", "🖨️"], ["phone", "điện thoại", "📱"],
      ["camera", "máy ảnh", "📷"], ["video camera", "máy quay", "📹"], ["TV", "ti vi", "📺"],
      ["radio", "đài", "📻"], ["battery", "pin", "🔋"], ["plug", "phích cắm", "🔌"],
      ["robot", "người máy", "🤖"], ["headphones", "tai nghe", "🎧"], ["disc", "đĩa CD", "💿"],
    ]),
  ] },

  /* ==================== TRƯỜNG HỌC ==================== */
  { id: "c-school", name: "Trường học", icon: "🏫", topics: [
    T("school", "Trường học", "🏫", [
      ["school", "trường học", "🏫"], ["teacher", "cô giáo / thầy giáo", "🧑‍🏫"], ["book", "quyển sách", "📚"],
      ["pencil", "bút chì", "✏️"], ["pen", "bút mực", "🖊️"], ["bag", "cặp sách", "🎒"],
      ["ruler", "thước kẻ", "📏"], ["scissors", "cái kéo", "✂️"], ["crayon", "bút sáp màu", "🖍️"],
      ["chair", "cái ghế", "🪑"], ["clock", "đồng hồ", "🕒"], ["student", "học sinh", "🧑‍🎓"],
      ["notebook", "quyển vở", "📓"], ["paper", "tờ giấy", "📄"], ["paintbrush", "cọ vẽ", "🖌️"],
      ["computer", "máy tính", "💻"], ["globe", "quả địa cầu", "🌍"], ["map", "bản đồ", "🗺️"],
      ["bell", "cái chuông", "🔔"], ["lunch box", "hộp cơm", "🍱"],
    ], "#3d8bfd"),
    T("stationery", "Đồ dùng học tập", "📐", [
      ["abacus", "bàn tính", "🧮"], ["folder", "bìa hồ sơ", "📁"], ["clipboard", "bìa kẹp", "📋"],
      ["paperclip", "kẹp giấy", "📎"], ["pushpin", "đinh ghim", "📌"], ["magnifying glass", "kính lúp", "🔍"],
      ["set square", "ê-ke", "📐"], ["calendar", "quyển lịch", "📅"], ["graduation cap", "mũ tốt nghiệp", "🎓"],
    ]),
    T("subjects", "Môn học", "📚", [
      ["math", "môn Toán", "➗"], ["English", "tiếng Anh", "🔤"], ["Vietnamese", "tiếng Việt", "📖"],
      ["science", "khoa học", "🔬"], ["music", "âm nhạc", "🎵"], ["art", "mỹ thuật", "🎨"],
      ["P.E.", "thể dục", "⚽"], ["history", "lịch sử", "📜"], ["geography", "địa lý", "🌏"],
      ["IT", "tin học", "💻"],
    ]),
    T("classroom", "Câu lệnh trong lớp", "🙋", [
      ["stand up", "đứng lên", "🧍"], ["sit down", "ngồi xuống", "🪑"], ["open your book", "mở sách ra", "📖"],
      ["close your book", "gấp sách lại", "📕"], ["listen", "lắng nghe", "👂"], ["look", "nhìn", "👀"],
      ["be quiet", "trật tự", "🤫"], ["raise your hand", "giơ tay", "🙋"], ["write", "viết", "✍️"],
      ["clap your hands", "vỗ tay", "👏"],
    ]),
    T("classq", "Hỏi trong lớp", "❓", [
      ["May I come in?", "=Con vào lớp được không ạ?"], ["May I go out?", "=Con ra ngoài được không ạ?"],
      ["Can you help me?", "=Cô giúp con được không ạ?"], ["I don't understand.", "=Con chưa hiểu ạ."],
      ["Can you say it again, please?", "=Cô nói lại được không ạ?"], ["What does it mean?", "=Nghĩa là gì ạ?"],
      ["I'm finished.", "=Con làm xong rồi ạ."], ["Sorry, I'm late.", "=Con xin lỗi vì đến muộn."],
    ]),
    T("alphabet", "Bảng chữ cái", "🔤",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c) => [c, "chữ " + c, "=" + c])),
    T("colors", "Màu sắc", "🎨", [
      ["red", "màu đỏ", "#e53935"], ["orange", "màu cam", "#fb8c00"], ["yellow", "màu vàng", "#fdd835"],
      ["green", "màu xanh lá", "#43a047"], ["blue", "màu xanh dương", "#1e88e5"], ["purple", "màu tím", "#8e24aa"],
      ["pink", "màu hồng", "#f48fb1"], ["brown", "màu nâu", "#795548"], ["black", "màu đen", "#212121"],
      ["white", "màu trắng", "#ffffff"], ["gray", "màu xám", "#9e9e9e"],
      ["gold", "màu vàng kim", "linear-gradient(135deg,#fff3b0,#d4a017 55%,#a87c00)"],
      ["silver", "màu bạc", "linear-gradient(135deg,#ffffff,#c0c0c0 55%,#8a8a8a)"],
    ], "#ee5a9b"),
    T("colors2", "Màu sắc 2", "🖍️", [
      ["light blue", "xanh da trời", "#81d4fa"], ["dark blue", "xanh dương đậm", "#1a237e"],
      ["light green", "xanh lá nhạt", "#aed581"], ["dark green", "xanh lá đậm", "#1b5e20"],
      ["turquoise", "xanh ngọc", "#26c6da"], ["beige", "màu be", "#e8d5b0"],
      ["cream", "màu kem", "#fff3c4"], ["maroon", "màu đỏ đô", "#800000"],
      ["rainbow", "bảy sắc cầu vồng", "linear-gradient(135deg,#e53935,#fb8c00,#fdd835,#43a047,#1e88e5,#8e24aa)"],
    ]),
    T("shapes", "Hình khối", "🔺", [
      ["circle", "hình tròn", "🔵"], ["square", "hình vuông", "🟦"], ["triangle", "hình tam giác", "🔺"],
      ["star", "ngôi sao", "⭐"], ["heart", "trái tim", "❤️"], ["diamond", "hình thoi", "🔷"],
      ["cross", "dấu X", "❌"], ["arrow", "mũi tên", "➡️"], ["crescent", "trăng lưỡi liềm", "🌙"],
      ["cube", "khối lập phương", "🧊"],
    ]),
    T("praise", "Lời khen", "🌟", [
      ["good job", "làm tốt lắm", "👍"], ["excellent", "xuất sắc", "🌟"], ["perfect", "hoàn hảo", "💯"],
      ["amazing", "tuyệt vời", "🤩"], ["well done", "giỏi lắm", "👏"], ["awesome", "quá đỉnh", "🎉"],
      ["try again", "thử lại nhé", "🔁"], ["you can do it", "con làm được mà", "💪"],
      ["I'm proud of you", "bố mẹ tự hào về con", "🥰"], ["great idea", "ý hay đấy", "💡"],
    ]),
  ] },

  /* ==================== SỐ & THỜI GIAN ==================== */
  { id: "c-time", name: "Số & thời gian", icon: "🔢", topics: [
    T("numbers", "Số đếm", "🔢", [
      ["zero", "số không", "=0"], ["one", "số một", "=1"], ["two", "số hai", "=2"],
      ["three", "số ba", "=3"], ["four", "số bốn", "=4"], ["five", "số năm", "=5"],
      ["six", "số sáu", "=6"], ["seven", "số bảy", "=7"], ["eight", "số tám", "=8"],
      ["nine", "số chín", "=9"], ["ten", "số mười", "=10"], ["eleven", "số mười một", "=11"],
      ["twelve", "số mười hai", "=12"], ["thirteen", "số mười ba", "=13"], ["fourteen", "số mười bốn", "=14"],
      ["fifteen", "số mười lăm", "=15"], ["sixteen", "số mười sáu", "=16"], ["seventeen", "số mười bảy", "=17"],
      ["eighteen", "số mười tám", "=18"], ["nineteen", "số mười chín", "=19"], ["twenty", "số hai mươi", "=20"],
      ["thirty", "số ba mươi", "=30"], ["forty", "số bốn mươi", "=40"], ["fifty", "số năm mươi", "=50"],
      ["one hundred", "số một trăm", "=100"],
    ], "#eb8c00"),
    T("numbers2", "Số lớn", "💯", [
      ["twenty-one", "hai mươi mốt", "=21"], ["twenty-two", "hai mươi hai", "=22"], ["twenty-five", "hai mươi lăm", "=25"],
      ["thirty-three", "ba mươi ba", "=33"], ["forty-four", "bốn mươi tư", "=44"], ["fifty-five", "năm mươi lăm", "=55"],
      ["sixty", "sáu mươi", "=60"], ["seventy", "bảy mươi", "=70"], ["eighty", "tám mươi", "=80"],
      ["ninety", "chín mươi", "=90"], ["ninety-nine", "chín mươi chín", "=99"], ["two hundred", "hai trăm", "=200"],
      ["five hundred", "năm trăm", "=500"], ["one thousand", "một nghìn", "=1000"],
    ]),
    T("ordinals", "Số thứ tự", "🥇", [
      ["first", "thứ nhất", "=1st"], ["second", "thứ hai", "=2nd"], ["third", "thứ ba", "=3rd"],
      ["fourth", "thứ tư", "=4th"], ["fifth", "thứ năm", "=5th"], ["sixth", "thứ sáu", "=6th"],
      ["seventh", "thứ bảy", "=7th"], ["eighth", "thứ tám", "=8th"], ["ninth", "thứ chín", "=9th"],
      ["tenth", "thứ mười", "=10th"],
    ]),
    T("math", "Phép tính", "➕", [
      ["plus", "cộng", "➕"], ["minus", "trừ", "➖"], ["times", "nhân", "✖️"],
      ["divided by", "chia", "➗"], ["equals", "bằng", "=="],
      ["one plus one", "một cộng một", "=1 + 1"], ["two plus three", "hai cộng ba", "=2 + 3"],
      ["five minus two", "năm trừ hai", "=5 − 2"], ["four times two", "bốn nhân hai", "=4 × 2"],
      ["ten divided by five", "mười chia năm", "=10 ÷ 5"], ["two plus two equals four", "hai cộng hai bằng bốn", "=2 + 2 = 4"],
    ]),
    T("clock", "Xem giờ", "🕐", [
      ["one o'clock", "một giờ", "🕐"], ["two o'clock", "hai giờ", "🕑"], ["three o'clock", "ba giờ", "🕒"],
      ["four o'clock", "bốn giờ", "🕓"], ["five o'clock", "năm giờ", "🕔"], ["six o'clock", "sáu giờ", "🕕"],
      ["seven o'clock", "bảy giờ", "🕖"], ["eight o'clock", "tám giờ", "🕗"], ["nine o'clock", "chín giờ", "🕘"],
      ["ten o'clock", "mười giờ", "🕙"], ["eleven o'clock", "mười một giờ", "🕚"], ["twelve o'clock", "mười hai giờ", "🕛"],
    ]),
    T("timeofday", "Các buổi trong ngày", "🌅", [
      ["morning", "buổi sáng", "🌅"], ["noon", "buổi trưa", "🌞"], ["afternoon", "buổi chiều", "🌤️"],
      ["evening", "buổi tối", "🌆"], ["night", "ban đêm", "🌃"],
    ]),
    T("timewords", "Từ chỉ thời gian", "📅", [
      ["today", "=Hôm nay"], ["tomorrow", "=Ngày mai"], ["yesterday", "=Hôm qua"],
      ["now", "=Bây giờ"], ["later", "=Lát nữa"], ["day", "=Ngày"],
      ["week", "=Tuần"], ["month", "=Tháng"], ["year", "=Năm"],
      ["hour", "=Giờ"], ["minute", "=Phút"],
    ]),
    T("days", "Các ngày trong tuần", "🗓️", [
      ["Monday", "=Thứ Hai"], ["Tuesday", "=Thứ Ba"], ["Wednesday", "=Thứ Tư"],
      ["Thursday", "=Thứ Năm"], ["Friday", "=Thứ Sáu"], ["Saturday", "=Thứ Bảy"],
      ["Sunday", "=Chủ Nhật"],
    ]),
    T("months", "Các tháng", "📆", [
      ["January", "=Tháng 1"], ["February", "=Tháng 2"], ["March", "=Tháng 3"],
      ["April", "=Tháng 4"], ["May", "=Tháng 5"], ["June", "=Tháng 6"],
      ["July", "=Tháng 7"], ["August", "=Tháng 8"], ["September", "=Tháng 9"],
      ["October", "=Tháng 10"], ["November", "=Tháng 11"], ["December", "=Tháng 12"],
    ]),
    T("seasons", "Các mùa", "🍂", [
      ["spring", "mùa xuân", "🌸"], ["summer", "mùa hè", "🌞"], ["autumn", "mùa thu", "🍂"],
      ["winter", "mùa đông", "☃️"], ["rainy season", "mùa mưa", "🌧️"], ["dry season", "mùa khô", "🏜️"],
    ]),
  ] },

  /* ==================== THIÊN NHIÊN ==================== */
  { id: "c-nature", name: "Thiên nhiên", icon: "🌳", topics: [
    T("weather", "Thời tiết", "🌤️", [
      ["sun", "mặt trời", "☀️"], ["rain", "mưa", "🌧️"], ["cloud", "đám mây", "☁️"],
      ["wind", "gió", "🌬️"], ["snow", "tuyết", "❄️"], ["storm", "cơn bão", "⛈️"],
      ["lightning", "tia chớp", "⚡"], ["rainbow", "cầu vồng", "🌈"], ["hot", "nóng", "🥵"],
      ["cold", "lạnh", "🥶"], ["umbrella", "cái ô", "☂️"], ["moon", "mặt trăng", "🌙"],
      ["star", "ngôi sao", "⭐"], ["tornado", "lốc xoáy", "🌪️"], ["fog", "sương mù", "🌫️"],
      ["snowman", "người tuyết", "⛄"],
    ], "#26c6da"),
    T("weathertalk", "Nói về thời tiết", "☀️", [
      ["It's sunny.", "trời nắng", "☀️"], ["It's rainy.", "trời mưa", "🌧️"], ["It's cloudy.", "trời nhiều mây", "☁️"],
      ["It's windy.", "trời có gió", "🌬️"], ["It's snowy.", "trời có tuyết", "❄️"], ["It's hot.", "trời nóng", "🥵"],
      ["It's cold.", "trời lạnh", "🥶"], ["It's stormy.", "trời có bão", "⛈️"],
    ]),
    T("plants", "Cây cối", "🌳", [
      ["tree", "cái cây", "🌳"], ["pine tree", "cây thông", "🌲"], ["palm tree", "cây dừa", "🌴"],
      ["cactus", "xương rồng", "🌵"], ["leaf", "chiếc lá", "🍃"], ["maple leaf", "lá phong", "🍁"],
      ["sprout", "mầm cây", "🌱"], ["herb", "rau thơm", "🌿"], ["clover", "cỏ bốn lá", "🍀"],
      ["bamboo", "cây tre", "🎍"], ["rice plant", "cây lúa", "🌾"], ["mushroom", "cây nấm", "🍄"],
    ]),
    T("flowers", "Các loài hoa", "🌻", [
      ["rose", "hoa hồng", "🌹"], ["sunflower", "hoa hướng dương", "🌻"], ["tulip", "hoa tulip", "🌷"],
      ["cherry blossom", "hoa anh đào", "🌸"], ["hibiscus", "hoa dâm bụt", "🌺"], ["daisy", "hoa cúc", "🌼"],
      ["bouquet", "bó hoa", "💐"], ["wilted flower", "hoa héo", "🥀"],
    ]),
    T("landscape", "Cảnh vật", "🏝️", [
      ["mountain", "ngọn núi", "⛰️"], ["volcano", "núi lửa", "🌋"], ["island", "hòn đảo", "🏝️"],
      ["beach", "bãi biển", "🏖️"], ["desert", "sa mạc", "🏜️"], ["sea", "biển", "🌊"],
      ["river", "dòng sông", "🏞️"], ["sunrise", "bình minh", "🌅"], ["sunset", "hoàng hôn", "🌇"],
      ["snowy mountain", "núi tuyết", "🏔️"], ["city", "thành phố", "🏙️"],
    ]),
    T("sky", "Bầu trời", "🌈", [
      ["sun", "mặt trời", "☀️"], ["moon", "mặt trăng", "🌙"], ["star", "ngôi sao", "⭐"],
      ["cloud", "đám mây", "☁️"], ["rainbow", "cầu vồng", "🌈"], ["bird", "con chim", "🐦"],
      ["airplane", "máy bay", "✈️"], ["kite", "cái diều", "🪁"], ["balloon", "bóng bay", "🎈"],
      ["helicopter", "trực thăng", "🚁"],
    ]),
    T("space", "Vũ trụ", "🚀", [
      ["Earth", "Trái Đất", "🌍"], ["full moon", "trăng tròn", "🌕"], ["planet", "hành tinh", "🪐"],
      ["comet", "sao chổi", "☄️"], ["rocket", "tên lửa", "🚀"], ["astronaut", "phi hành gia", "👩‍🚀"],
      ["alien", "người ngoài hành tinh", "👽"], ["UFO", "đĩa bay", "🛸"], ["telescope", "kính thiên văn", "🔭"],
      ["satellite", "vệ tinh", "🛰️"], ["galaxy", "dải ngân hà", "🌌"], ["shooting star", "sao băng", "🌠"],
      ["sun", "mặt trời", "🌞"],
    ]),
    T("summer", "Mùa hè", "🏖️", [
      ["swimsuit", "đồ bơi", "👙"], ["sunglasses", "kính râm", "🕶️"], ["ice cream", "kem", "🍦"],
      ["watermelon", "dưa hấu", "🍉"], ["sunscreen", "kem chống nắng", "🧴"], ["shorts", "quần đùi", "🩳"],
      ["swim", "bơi", "🏊"], ["hot", "nóng", "🥵"], ["beach", "bãi biển", "🏖️"],
      ["sun hat", "mũ rộng vành", "👒"],
    ]),
    T("winter", "Mùa đông", "⛄", [
      ["snow", "tuyết", "❄️"], ["snowman", "người tuyết", "⛄"], ["scarf", "khăn quàng", "🧣"],
      ["gloves", "găng tay", "🧤"], ["coat", "áo khoác", "🧥"], ["sled", "xe trượt tuyết", "🛷"],
      ["ice skates", "giày trượt băng", "⛸️"], ["skis", "ván trượt tuyết", "🎿"], ["cold", "lạnh", "🥶"],
      ["hot drink", "đồ uống nóng", "☕"], ["Christmas tree", "cây thông Noel", "🎄"],
    ]),
  ] },

  /* ==================== THÀNH PHỐ & THẾ GIỚI ==================== */
  { id: "c-city", name: "Thành phố & thế giới", icon: "🏙️", topics: [
    T("transport", "Xe cộ", "🚗", [
      ["car", "ô tô", "🚗"], ["bus", "xe buýt", "🚌"], ["bike", "xe đạp", "🚲"],
      ["motorbike", "xe máy", "🛵"], ["train", "tàu hỏa", "🚆"], ["plane", "máy bay", "✈️"],
      ["boat", "con thuyền", "⛵"], ["ship", "tàu thủy", "🚢"], ["truck", "xe tải", "🚚"],
      ["taxi", "xe taxi", "🚕"], ["helicopter", "trực thăng", "🚁"], ["rocket", "tên lửa", "🚀"],
      ["ambulance", "xe cứu thương", "🚑"], ["fire truck", "xe cứu hỏa", "🚒"], ["police car", "xe cảnh sát", "🚓"],
    ], "#4b7bec"),
    T("vehicles2", "Xe cộ 2", "🛴", [
      ["scooter", "xe trượt scooter", "🛴"], ["skateboard", "ván trượt", "🛹"], ["tractor", "máy cày", "🚜"],
      ["racing car", "xe đua", "🏎️"], ["van", "xe khách nhỏ", "🚐"], ["tram", "xe điện", "🚋"],
      ["subway", "tàu điện ngầm", "🚇"], ["cable car", "cáp treo", "🚠"], ["canoe", "xuồng", "🛶"],
      ["speedboat", "ca nô", "🚤"], ["motorcycle", "mô tô", "🏍️"], ["parachute", "cái dù", "🪂"],
      ["ferry", "phà", "⛴️"],
    ]),
    T("traffic", "Giao thông", "🚦", [
      ["traffic light", "đèn giao thông", "🚦"], ["stop sign", "biển dừng lại", "🛑"], ["highway", "đường cao tốc", "🛣️"],
      ["bridge", "cây cầu", "🌉"], ["roadwork", "công trường", "🚧"], ["no entry", "cấm đi vào", "⛔"],
      ["parking", "bãi đỗ xe", "🅿️"], ["railway", "đường ray", "🛤️"], ["helmet", "mũ bảo hộ", "⛑️"],
      ["children crossing", "trẻ em qua đường", "🚸"], ["gas station", "trạm xăng", "⛽"],
    ]),
    T("directions", "Chỉ đường", "🧭", [
      ["turn left", "rẽ trái", "⬅️"], ["turn right", "rẽ phải", "➡️"], ["go straight", "đi thẳng", "⬆️"],
      ["go back", "quay lại", "🔙"], ["stop", "dừng lại", "🛑"], ["wait", "chờ đã", "✋"],
      ["be careful", "cẩn thận", "⚠️"], ["follow me", "đi theo tớ", "👣"], ["cross the road", "sang đường", "🚸"],
    ]),
    T("places", "Nơi chốn", "🏥", [
      ["hospital", "bệnh viện", "🏥"], ["bank", "ngân hàng", "🏦"], ["post office", "bưu điện", "🏤"],
      ["hotel", "khách sạn", "🏨"], ["store", "cửa hàng", "🏪"], ["mall", "trung tâm thương mại", "🏬"],
      ["factory", "nhà máy", "🏭"], ["office", "văn phòng", "🏢"], ["stadium", "sân vận động", "🏟️"],
      ["church", "nhà thờ", "⛪"], ["school", "trường học", "🏫"], ["house", "ngôi nhà", "🏠"],
    ]),
    T("funplaces", "Đi chơi & đi lại", "🎢", [
      ["amusement park", "công viên giải trí", "🎢"], ["ferris wheel", "vòng đu quay", "🎡"], ["carousel", "ngựa gỗ quay", "🎠"],
      ["cinema", "rạp chiếu phim", "🎦"], ["circus", "rạp xiếc", "🎪"], ["fountain", "đài phun nước", "⛲"],
      ["park", "công viên", "🏞️"], ["zoo", "sở thú", "🦒"], ["airport", "sân bay", "🛫"],
      ["train station", "ga tàu", "🚉"], ["bus stop", "trạm xe buýt", "🚏"],
    ]),
    T("shopping", "Mua sắm", "🛒", [
      ["shopping cart", "xe đẩy hàng", "🛒"], ["shopping bags", "túi mua sắm", "🛍️"], ["money", "tiền", "💵"],
      ["credit card", "thẻ ngân hàng", "💳"], ["receipt", "hóa đơn", "🧾"], ["price tag", "nhãn giá", "🏷️"],
      ["gift", "món quà", "🎁"], ["money bag", "túi tiền", "💰"], ["store", "cửa hàng", "🏪"],
      ["How much is it?", "=Cái này bao nhiêu tiền?"],
    ]),
    T("travel", "Du lịch", "🧳", [
      ["suitcase", "va li", "🧳"], ["passport", "hộ chiếu", "🛂"], ["ticket", "vé", "🎫"],
      ["map", "bản đồ", "🗺️"], ["camera", "máy ảnh", "📸"], ["compass", "la bàn", "🧭"],
      ["airplane", "máy bay", "✈️"], ["hotel", "khách sạn", "🏨"], ["globe", "quả địa cầu", "🌍"],
      ["tent", "cái lều", "⛺"],
    ]),
    T("signs", "Ký hiệu", "⚠️", [
      ["warning", "cảnh báo", "⚠️"], ["no smoking", "cấm hút thuốc", "🚭"], ["recycle", "tái chế", "♻️"],
      ["wheelchair", "xe lăn", "♿"], ["restroom", "nhà vệ sinh", "🚻"], ["information", "thông tin", "ℹ️"],
      ["question mark", "dấu hỏi", "❓"], ["exclamation mark", "dấu chấm than", "❗"], ["check mark", "dấu đúng", "✅"],
      ["SOS", "cứu với", "🆘"], ["new", "mới", "🆕"], ["free", "miễn phí", "🆓"],
    ]),
    T("emergency", "Khẩn cấp", "🚨", [
      ["police officer", "cảnh sát", "👮"], ["firefighter", "lính cứu hỏa", "👩‍🚒"], ["ambulance", "xe cứu thương", "🚑"],
      ["fire truck", "xe cứu hỏa", "🚒"], ["police car", "xe cảnh sát", "🚓"], ["fire", "đám cháy", "🔥"],
      ["fire extinguisher", "bình chữa cháy", "🧯"], ["siren", "còi báo động", "🚨"], ["phone", "điện thoại", "📞"],
      ["hospital", "bệnh viện", "🏥"], ["help", "cứu với", "🆘"],
    ]),
    T("countries", "Quốc gia", "🌏", [
      ["Vietnam", "=Việt Nam"], ["America", "=Mỹ"], ["England", "=Anh"],
      ["Japan", "=Nhật Bản"], ["Korea", "=Hàn Quốc"], ["China", "=Trung Quốc"],
      ["France", "=Pháp"], ["Australia", "=Úc"], ["Thailand", "=Thái Lan"],
      ["Singapore", "=Xin-ga-po"], ["Laos", "=Lào"], ["Cambodia", "=Cam-pu-chia"],
      ["Russia", "=Nga"], ["India", "=Ấn Độ"],
    ]),
    T("continents", "Châu lục & đại dương", "🌍", [
      ["Asia", "=Châu Á"], ["Europe", "=Châu Âu"], ["Africa", "=Châu Phi"],
      ["North America", "=Bắc Mỹ"], ["South America", "=Nam Mỹ"], ["Oceania", "=Châu Đại Dương"],
      ["Antarctica", "=Châu Nam Cực"], ["Pacific Ocean", "=Thái Bình Dương"], ["Atlantic Ocean", "=Đại Tây Dương"],
      ["Indian Ocean", "=Ấn Độ Dương"],
    ]),
  ] },

  /* ==================== VUI CHƠI ==================== */
  { id: "c-fun", name: "Vui chơi", icon: "🎉", topics: [
    T("toys", "Đồ chơi", "🧸", [
      ["teddy bear", "gấu bông", "🧸"], ["ball", "quả bóng", "⚽"], ["kite", "cái diều", "🪁"],
      ["balloon", "bóng bay", "🎈"], ["robot", "người máy", "🤖"], ["puzzle", "trò xếp hình", "🧩"],
      ["yo-yo", "con quay yo-yo", "🪀"], ["drum", "cái trống", "🥁"], ["guitar", "đàn ghi-ta", "🎸"],
      ["dice", "xúc xắc", "🎲"], ["video game", "trò chơi điện tử", "🎮"], ["blocks", "khối xếp hình", "🧱"],
    ], "#fc5c65"),
    T("sports", "Môn thể thao", "⚽", [
      ["football", "bóng đá", "⚽"], ["basketball", "bóng rổ", "🏀"], ["baseball", "bóng chày", "⚾"],
      ["tennis", "quần vợt", "🎾"], ["volleyball", "bóng chuyền", "🏐"], ["badminton", "cầu lông", "🏸"],
      ["table tennis", "bóng bàn", "🏓"], ["golf", "đánh gôn", "⛳"], ["bowling", "bowling", "🎳"],
      ["boxing", "quyền anh", "🥊"], ["rugby", "bóng bầu dục", "🏉"], ["ice hockey", "khúc côn cầu", "🏒"],
    ]),
    T("sports2", "Thể thao vận động", "🏊", [
      ["swimming", "bơi lội", "🏊"], ["cycling", "đạp xe", "🚴"], ["skiing", "trượt tuyết", "⛷️"],
      ["ice skating", "trượt băng", "⛸️"], ["surfing", "lướt sóng", "🏄"], ["running", "chạy bộ", "🏃"],
      ["karate", "võ thuật", "🥋"], ["fishing", "câu cá", "🎣"], ["skateboarding", "trượt ván", "🛹"],
      ["horse riding", "cưỡi ngựa", "🏇"], ["gymnastics", "thể dục dụng cụ", "🤸"], ["weightlifting", "cử tạ", "🏋️"],
    ]),
    T("sportsgear", "Đồ thể thao", "🏆", [
      ["trophy", "cúp", "🏆"], ["medal", "huy chương", "🏅"], ["goal", "khung thành", "🥅"],
      ["skis", "ván trượt tuyết", "🎿"], ["ice skates", "giày trượt băng", "⛸️"], ["boxing gloves", "găng đấm bốc", "🥊"],
      ["sled", "xe trượt tuyết", "🛷"], ["finish flag", "cờ về đích", "🏁"], ["stopwatch", "đồng hồ bấm giờ", "⏱️"],
      ["fishing rod", "cần câu", "🎣"], ["diving mask", "kính lặn", "🤿"],
    ]),
    T("music", "Âm nhạc", "🎵", [
      ["piano", "đàn piano", "🎹"], ["guitar", "đàn ghi-ta", "🎸"], ["violin", "đàn vi-ô-lông", "🎻"],
      ["trumpet", "kèn trumpet", "🎺"], ["saxophone", "kèn saxophone", "🎷"], ["drum", "cái trống", "🥁"],
      ["microphone", "micrô", "🎤"], ["headphones", "tai nghe", "🎧"], ["music note", "nốt nhạc", "🎵"],
      ["banjo", "đàn banjo", "🪕"], ["radio", "đài", "📻"], ["bell", "cái chuông", "🔔"],
    ]),
    T("arts", "Nghệ thuật & giải trí", "🎭", [
      ["palette", "bảng màu", "🎨"], ["picture", "bức tranh", "🖼️"], ["movie", "bộ phim", "🎬"],
      ["theater", "sân khấu kịch", "🎭"], ["ticket", "vé xem", "🎟️"], ["popcorn", "bỏng ngô", "🍿"],
      ["camera", "máy ảnh", "📷"], ["video camera", "máy quay phim", "🎥"], ["magic", "ảo thuật", "🎩"],
      ["circus", "rạp xiếc", "🎪"], ["ballet", "múa ba-lê", "🩰"],
    ]),
    T("birthday", "Tiệc sinh nhật", "🎂", [
      ["birthday cake", "bánh sinh nhật", "🎂"], ["gift", "món quà", "🎁"], ["balloon", "bóng bay", "🎈"],
      ["party", "bữa tiệc", "🎉"], ["candle", "cây nến", "🕯️"], ["confetti", "pháo giấy", "🎊"],
      ["celebrate", "ăn mừng", "🥳"], ["card", "tấm thiệp", "💌"], ["friends", "bạn bè", "👫"],
      ["music", "âm nhạc", "🎵"], ["Happy birthday!", "=Chúc mừng sinh nhật!"],
    ]),
    T("festivals", "Lễ hội", "🏮", [
      ["Lunar New Year", "Tết Nguyên Đán (lì xì)", "🧧"], ["fireworks", "pháo hoa", "🎆"], ["lantern", "đèn lồng", "🏮"],
      ["mooncake", "bánh trung thu", "🥮"], ["Mid-Autumn Festival", "Tết Trung thu", "🌕"], ["Christmas", "Giáng sinh", "🎄"],
      ["Santa Claus", "ông già Noel", "🎅"], ["Halloween", "lễ hội Halloween", "🎃"], ["ghost", "con ma", "👻"],
      ["firecracker", "pháo", "🧨"], ["Valentine's Day", "ngày Valentine", "💝"], ["dragon dance", "múa rồng", "🐉"],
    ]),
    T("fairy", "Cổ tích & phép thuật", "🧚", [
      ["castle", "lâu đài", "🏰"], ["princess", "công chúa", "👸"], ["prince", "hoàng tử", "🤴"],
      ["fairy", "nàng tiên", "🧚"], ["mermaid", "nàng tiên cá", "🧜‍♀️"], ["wizard", "phù thủy", "🧙"],
      ["dragon", "con rồng", "🐉"], ["unicorn", "kỳ lân", "🦄"], ["ghost", "con ma", "👻"],
      ["genie", "thần đèn", "🧞"], ["crystal ball", "quả cầu pha lê", "🔮"], ["superhero", "siêu anh hùng", "🦸"],
      ["monster", "quái vật", "👾"], ["crown", "vương miện", "👑"],
    ]),
    T("camping", "Cắm trại", "⛺", [
      ["tent", "cái lều", "⛺"], ["campfire", "lửa trại", "🔥"], ["flashlight", "đèn pin", "🔦"],
      ["backpack", "ba lô", "🎒"], ["map", "bản đồ", "🗺️"], ["compass", "la bàn", "🧭"],
      ["forest", "khu rừng", "🌲"], ["mountain", "ngọn núi", "⛰️"], ["hiking boots", "giày leo núi", "🥾"],
      ["stars", "bầu trời sao", "🌌"], ["fishing", "câu cá", "🎣"],
    ]),
    T("beach", "Ở bãi biển", "🏖️", [
      ["sea", "biển", "🌊"], ["beach umbrella", "ô bãi biển", "🏖️"], ["shell", "vỏ sò", "🐚"],
      ["crab", "con cua", "🦀"], ["swimsuit", "đồ bơi", "👙"], ["boat", "con thuyền", "⛵"],
      ["surfing", "lướt sóng", "🏄"], ["island", "hòn đảo", "🏝️"], ["coconut", "quả dừa", "🥥"],
      ["sun", "mặt trời", "☀️"], ["sunglasses", "kính râm", "🕶️"],
    ]),
  ] },

  /* ==================== GIAO TIẾP ==================== */
  { id: "c-talk", name: "Giao tiếp", icon: "💬", topics: [
    T("greetings", "Chào hỏi", "👋", [
      ["hello", "=Xin chào"], ["goodbye", "=Tạm biệt"], ["good morning", "=Chào buổi sáng"],
      ["good afternoon", "=Chào buổi chiều"], ["good evening", "=Chào buổi tối"], ["good night", "=Chúc ngủ ngon"],
      ["How are you?", "=Bạn có khỏe không?"], ["I'm fine, thank you.", "=Mình khỏe, cảm ơn bạn."],
      ["Nice to meet you.", "=Rất vui được gặp bạn."], ["See you later.", "=Hẹn gặp lại nhé."],
    ]),
    T("phrases", "Câu nói hằng ngày", "💬", [
      ["yes", "=Vâng / Có"], ["no", "=Không"], ["please", "=Làm ơn"],
      ["thank you", "=Cảm ơn"], ["sorry", "=Xin lỗi"], ["You're welcome.", "=Không có gì."],
      ["Excuse me.", "=Cho tớ hỏi một chút."], ["I don't know.", "=Tớ không biết."], ["I love you.", "=Con yêu bố mẹ."],
      ["Let's go!", "=Đi thôi!"], ["Help me, please.", "=Giúp tớ với."], ["OK.", "=Được rồi."],
    ]),
    T("aboutme", "Giới thiệu bản thân", "🙋", [
      ["What's your name?", "=Bạn tên là gì?"], ["My name is Nam.", "=Mình tên là Nam."],
      ["How old are you?", "=Bạn bao nhiêu tuổi?"], ["I'm eight years old.", "=Mình 8 tuổi."],
      ["Where do you live?", "=Bạn sống ở đâu?"], ["I live in Vietnam.", "=Mình sống ở Việt Nam."],
      ["What's your favorite color?", "=Bạn thích màu gì nhất?"], ["I like blue.", "=Mình thích màu xanh dương."],
      ["Who is this?", "=Đây là ai?"], ["This is my mom.", "=Đây là mẹ mình."],
    ]),
    T("questions", "Từ để hỏi", "❓", [
      ["what", "=Cái gì?"], ["where", "=Ở đâu?"], ["who", "=Ai?"],
      ["when", "=Khi nào?"], ["why", "=Tại sao?"], ["how", "=Như thế nào?"],
      ["which", "=Cái nào?"], ["how many", "=Bao nhiêu?"],
    ]),
    T("pronouns", "Đại từ", "👉", [
      ["I", "=Tôi / Mình"], ["you", "=Bạn"], ["he", "=Anh ấy / Cậu ấy"],
      ["she", "=Cô ấy / Bạn ấy (nữ)"], ["it", "=Nó"], ["we", "=Chúng mình"],
      ["they", "=Họ / Các bạn ấy"], ["my", "=Của mình"], ["your", "=Của bạn"],
    ]),
    T("prepositions", "Vị trí", "📦", [
      ["in", "=Ở trong"], ["on", "=Ở trên"], ["under", "=Ở dưới"],
      ["next to", "=Bên cạnh"], ["behind", "=Phía sau"], ["in front of", "=Phía trước"],
      ["between", "=Ở giữa"], ["near", "=Ở gần"],
    ]),
    T("verbs", "Động từ thường dùng", "✨", [
      ["be", "=Là / thì"], ["have", "=Có"], ["go", "=Đi"],
      ["come", "=Đến"], ["like", "=Thích"], ["want", "=Muốn"],
      ["can", "=Có thể"], ["see", "=Nhìn thấy"], ["know", "=Biết"],
      ["make", "=Làm ra"], ["give", "=Cho / tặng"], ["love", "=Yêu"],
      ["help", "=Giúp đỡ"], ["play", "=Chơi"],
    ]),
    T("opposites", "Từ trái nghĩa", "↔️", [
      ["big", "to", "🐘"], ["small", "nhỏ", "🐜"], ["hot", "nóng", "🔥"],
      ["cold", "lạnh", "🧊"], ["fast", "nhanh", "🐆"], ["slow", "chậm", "🐌"],
      ["old", "già", "👴"], ["young", "trẻ", "👶"], ["loud", "ồn ào", "📢"],
      ["quiet", "yên lặng", "🤫"], ["wet", "ướt", "💦"], ["dry", "khô", "🏜️"],
      ["happy", "vui", "😀"], ["sad", "buồn", "😢"],
    ]),
    T("describe", "Tính từ miêu tả", "🦸", [
      ["strong", "khỏe", "💪"], ["tired", "mệt", "😫"], ["rich", "giàu", "🤑"],
      ["funny", "buồn cười", "🤣"], ["smart", "thông minh", "🤓"], ["kind", "tốt bụng", "😇"],
      ["lazy", "lười biếng", "🦥"], ["busy", "bận rộn", "🐝"], ["clean", "sạch sẽ", "🧼"],
      ["new", "mới", "🆕"], ["beautiful", "đẹp", "🌸"], ["brave", "dũng cảm", "🦁"],
      ["cool", "ngầu", "🆒"],
    ]),
  ] },
];

// Gán màu cho chủ đề chưa có màu riêng, và gắn nhóm cho từng chủ đề.
const TOPICS = [];
CATEGORIES.forEach((cat) => {
  cat.topics.forEach((t, i) => {
    t.color = t.color || PALETTE[(i * 3 + cat.id.length) % PALETTE.length];
    t.cat = cat.id;
    TOPICS.push(t);
  });
});

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
  { stars: 400, img: "🦚", name: "Chim công" },
  { stars: 500, img: "💎", name: "Kim cương" },
  { stars: 650, img: "🏰", name: "Lâu đài" },
  { stars: 800, img: "🪐", name: "Sao Thổ" },
  { stars: 1000, img: "🌟", name: "Ngôi sao huyền thoại" },
  { stars: 1250, img: "🦖", name: "Khủng long bạo chúa" },
  { stars: 1500, img: "🎡", name: "Vòng đu quay" },
  { stars: 1800, img: "🧞", name: "Thần đèn" },
  { stars: 2200, img: "🛸", name: "Đĩa bay" },
  { stars: 2600, img: "🌋", name: "Núi lửa" },
  { stars: 3000, img: "🌌", name: "Dải ngân hà" },
];

// Danh hiệu theo số sao.
const TITLES = [
  { stars: 0, name: "Mầm non tiếng Anh 🌱" },
  { stars: 15, name: "Bé chăm học 📖" },
  { stars: 50, name: "Nhà thám hiểm 🧭" },
  { stars: 100, name: "Siêu sao nhí ⭐" },
  { stars: 200, name: "Nhà vô địch 🏅" },
  { stars: 400, name: "Bậc thầy tiếng Anh 🎓" },
  { stars: 700, name: "Huyền thoại tiếng Anh 🌟" },
  { stars: 1200, name: "Phi hành gia ngôn ngữ 🚀" },
  { stars: 2000, name: "Vua tiếng Anh 👑" },
];
