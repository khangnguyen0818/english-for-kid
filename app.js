"use strict";

/* ===================== Lưu tiến độ ===================== */
const STORE_KEY = "be-hoc-tieng-anh-v1";
const CAT_KEY = "be-hoc-tieng-anh-cat";

function loadState() {
  const empty = { stars: 0, learned: {}, topicBonus: {}, games: 0, best: {} };
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && typeof s.stars === "number") return { ...empty, ...s };
  } catch (e) { /* trình duyệt chặn bộ nhớ: dùng giá trị mặc định */ }
  return empty;
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* bỏ qua */ }
}

const state = loadState();

let currentCat = CATEGORIES[0].id;
try {
  const c = localStorage.getItem(CAT_KEY);
  if (CATEGORIES.some((x) => x.id === c)) currentCat = c;
} catch (e) { /* bỏ qua */ }

function setCat(id) {
  currentCat = id;
  try { localStorage.setItem(CAT_KEY, id); } catch (e) { /* bỏ qua */ }
}

/* ===================== Tiện ích ===================== */
const $app = document.getElementById("app");
const $title = document.getElementById("title");
const $back = document.getElementById("backBtn");
const $starCount = document.getElementById("starCount");
const $starBadge = document.getElementById("starBadge");

const topicById = (id) => TOPICS.find((t) => t.id === id);
const catById = (id) => CATEGORIES.find((c) => c.id === id);
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Mọi từ kèm chủ đề của nó, dùng cho trò chơi "Tất cả chủ đề".
const ALL_WORDS = TOPICS.flatMap((t) => t.words.map((w) => ({ ...w, topic: t })));
const wordsOf = (topic) => topic.words.map((w) => ({ ...w, topic }));

function picHTML(w) {
  if (w.swatch) return `<span class="swatch" style="background:${w.swatch}"></span>`;
  if (w.txt !== undefined) {
    const n = [...w.txt].length;
    const size = n <= 4 ? "big" : n <= 8 ? "mid" : n <= 16 ? "small" : "tiny";
    return `<span class="txt ${size}">${esc(w.txt)}</span>`;
  }
  return esc(w.img);
}

// Hai từ có cùng hình thì không được làm đáp án nhiễu của nhau.
const picKey = (w) => w.img || w.swatch || "txt:" + w.txt;

// Từ dùng được cho trò Xếp chữ: chỉ chữ cái, dài 3–8.
const spellable = (w) => /^[A-Za-z]{3,8}$/.test(w.en);

function learnedCount(topic) {
  return topic.words.filter((w) => state.learned[topic.id + ":" + w.en]).length;
}

function currentTitle() {
  return [...TITLES].reverse().find((t) => state.stars >= t.stars).name;
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function confetti(n = 30) {
  const box = document.getElementById("confetti");
  const items = ["⭐", "🎉", "✨", "🌟", "🎈", "💖"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.textContent = items[i % items.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    s.style.animationDelay = Math.random() * 0.5 + "s";
    box.appendChild(s);
    setTimeout(() => s.remove(), 4000);
  }
}

// Hẹn giờ gắn với màn hình hiện tại: tự hủy khi chuyển màn hình.
const timers = new Set();
function later(fn, ms) {
  const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
  timers.add(id);
  return id;
}
function clearTimers() {
  timers.forEach(clearTimeout);
  timers.clear();
}

/* ===================== Âm thanh ===================== */
let audioCtx;
function beep(notes) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    let t = audioCtx.currentTime;
    for (const [freq, dur, type] of notes) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + dur);
      t += dur * 0.8;
    }
  } catch (e) { /* không có âm thanh cũng không sao */ }
}
const sfx = {
  good: () => beep([[660, 0.12], [880, 0.12], [1320, 0.25]]),
  bad: () => beep([[220, 0.25, "triangle"]]),
  pop: () => beep([[900, 0.06, "square"], [1400, 0.08]]),
  flip: () => beep([[520, 0.05]]),
  win: () => beep([[523, 0.15], [659, 0.15], [784, 0.15], [1047, 0.4]]),
};

/* ===================== Phát âm (Web Speech) ===================== */
const synth = window.speechSynthesis;
let enVoice = null;

function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  enVoice =
    voices.find((v) => v.lang === "en-US" && /samantha|google|aria|jenny/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => /^en[-_]/i.test(v.lang)) ||
    null;
}
if (synth) {
  pickVoice();
  synth.addEventListener && synth.addEventListener("voiceschanged", pickVoice);
}

function speak(text, slow, btn) {
  if (!synth) {
    toast("Máy này chưa hỗ trợ đọc tiếng Anh 😢");
    return;
  }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  if (enVoice) u.voice = enVoice;
  u.rate = slow ? 0.5 : 0.85;
  u.pitch = 1.1;
  if (btn) {
    btn.classList.add("playing");
    const stop = () => btn.classList.remove("playing");
    u.onend = stop;
    u.onerror = stop;
    setTimeout(stop, 4000);
  }
  synth.speak(u);
}

/* ===================== Sao & phần thưởng ===================== */
function addStars(n, reason) {
  if (n <= 0) return;
  const before = state.stars;
  state.stars += n;
  saveState();
  updateStarBadge(true);
  if (reason) toast(`+${n} ⭐ ${reason}`);
  const unlocked = REWARDS.filter((r) => before < r.stars && state.stars >= r.stars);
  if (unlocked.length) {
    const r = unlocked[unlocked.length - 1];
    setTimeout(() => {
      sfx.win();
      confetti(40);
      toast(`🎁 Bé nhận được nhãn dán ${r.img} ${r.name}!`);
    }, reason ? 1200 : 0);
  }
}

function updateStarBadge(bump) {
  $starCount.textContent = state.stars;
  if (bump) {
    $starBadge.classList.remove("bump");
    void $starBadge.offsetWidth;
    $starBadge.classList.add("bump");
  }
}

/* ===================== Điều hướng ===================== */
// Các màn hình:
//   #/                     trang chủ (nhóm + chủ đề để học)
//   #/learn/<chủ đề>       học từ
//   #/games                chọn trò chơi
//   #/games/<chủ đề>       chọn trò chơi cho một chủ đề
//   #/pick/<trò chơi>      chọn chủ đề cho một trò chơi
//   #/play/<trò>/<chủ đề>  chơi (chủ đề "all" = tất cả)
//   #/rewards              phần thưởng
let rendered = null;
let lastHub = "/games";

function go(path) {
  if (location.hash !== "#" + path) {
    rendered = path;
    location.hash = path;
  }
  render(path);
}

window.addEventListener("hashchange", () => {
  const path = location.hash.slice(1) || "/";
  if (path !== rendered) render(path);
  rendered = null;
});

function parentOf(path) {
  const [, page, arg] = path.split("/");
  if (page === "games" && arg) return "/learn/" + arg;
  if (page === "pick") return "/games";
  if (page === "play") return lastHub;
  return "/";
}

$back.addEventListener("click", () => go(parentOf(location.hash.slice(1) || "/")));
$starBadge.addEventListener("click", () => go("/rewards"));

function setHeader(title, showBack) {
  $title.textContent = title;
  $back.hidden = !showBack;
}

function render(path) {
  if (synth) synth.cancel();
  clearTimers();
  window.scrollTo(0, 0);
  const [, page, a, b] = path.split("/");
  if (page === "learn" && topicById(a)) return renderLearn(topicById(a));
  if (page === "games" && a && topicById(a)) return renderGameHub(topicById(a));
  if (page === "games") return renderGameHub(null);
  if (page === "pick" && gameById(a)) return renderPick(gameById(a));
  if (page === "play" && gameById(a) && (b === "all" || topicById(b))) {
    return gameById(a).play(b === "all" ? null : topicById(b));
  }
  if (page === "rewards") return renderRewards();
  return renderHome();
}

/* ===================== Chọn nhóm & chủ đề ===================== */
// Hàng nút nhóm (cuộn ngang) + lưới chủ đề của nhóm đang chọn.
function topicPickerHTML(linkOf, filter = () => true, showProgress = false) {
  const cat = catById(currentCat);
  const topics = cat.topics.filter(filter);
  return `
    <div class="cat-pills" role="tablist">
      ${CATEGORIES.map((c) => `<button class="cat-pill ${c.id === cat.id ? "on" : ""}" data-cat="${c.id}" role="tab">
        <span>${c.icon}</span> ${esc(c.name)}</button>`).join("")}
    </div>
    <div class="topic-grid">
      ${topics.map((t) => {
        const n = learnedCount(t);
        const done = n === t.words.length;
        return `<button class="topic-card" style="--c:${t.color}" data-go="${linkOf(t)}">
          ${showProgress && done ? '<span class="done">🏅</span>' : ""}
          <span class="emo">${t.icon}</span>
          <span class="name">${esc(t.name)}</span>
          <span class="prog">${showProgress ? `${n}/${t.words.length} từ` : `${t.words.length} từ`}</span>
        </button>`;
      }).join("") || '<p class="tip">Nhóm này chưa có chủ đề phù hợp với trò chơi.</p>'}
    </div>`;
}

// Bấm nút nhóm: vẽ lại màn hình hiện tại, giữ nguyên vị trí cuộn của hàng nút.
$app.addEventListener("click", (e) => {
  const pill = e.target.closest("[data-cat]");
  if (!pill) return;
  const row = $app.querySelector(".cat-pills");
  const scroll = row ? row.scrollLeft : 0;
  const y = window.scrollY;
  setCat(pill.dataset.cat);
  render(location.hash.slice(1) || "/");
  window.scrollTo(0, y);
  const row2 = $app.querySelector(".cat-pills");
  if (row2) row2.scrollLeft = scroll;
});

/* ===================== Màn hình chính ===================== */
function renderHome() {
  setHeader("Bé Học Tiếng Anh", false);
  const learnedTotal = Object.keys(state.learned).length;
  $app.innerHTML = `
    <div class="hello">
      <p class="big">Xin chào bé! 👋</p>
      <p class="small">${esc(currentTitle())} · đã học ${learnedTotal}/${ALL_WORDS.length} từ</p>
    </div>
    <div class="row">
      <button class="big-btn orange" data-go="/games"><span class="emo">🎮</span> Trò chơi</button>
      <button class="big-btn purple" data-go="/rewards"><span class="emo">🎁</span> Phần thưởng</button>
    </div>
    <h2 class="section-title">📖 Học từ vựng · ${TOPICS.length} chủ đề</h2>
    ${topicPickerHTML((t) => "/learn/" + t.id, undefined, true)}
    <p class="tip">💡 Bấm 🔊 để nghe. Mỗi từ mới nghe lần đầu được +1 ⭐</p>
  `;
}

/* ===================== Học từ vựng ===================== */
function renderLearn(topic) {
  setHeader(`${topic.icon} ${topic.name}`, true);
  let i = 0;

  function draw() {
    const w = topic.words[i];
    const showVi = !(w.txt !== undefined && w.txt === w.vi);
    $app.innerHTML = `
      <div class="flashcard" style="--c:${topic.color}">
        <div class="pic pop">${picHTML(w)}</div>
        <p class="en">${esc(w.en)}</p>
        ${showVi ? `<p class="vi">${esc(w.vi)}</p>` : '<p class="vi"></p>'}
        <div class="speak-row">
          <button class="speak-btn" id="say" aria-label="Nghe phát âm">🔊</button>
          <button class="speak-btn slow" id="saySlow" aria-label="Nghe chậm">🐢</button>
        </div>
      </div>
      <p class="counter">Từ ${i + 1} / ${topic.words.length}</p>
      <div class="dots">
        ${topic.words.map((x, k) => `<span class="${state.learned[topic.id + ":" + x.en] ? "seen" : ""} ${k === i ? "cur" : ""}"></span>`).join("")}
      </div>
      <div class="row">
        <button class="big-btn light" id="prev" ${i === 0 ? "disabled style='opacity:.4'" : ""}>⬅️ Trước</button>
        <button class="big-btn green" id="next">${i === topic.words.length - 1 ? "Chơi 🎮" : "Tiếp ➡️"}</button>
      </div>
    `;
    const say = (slow) => (e) => {
      speak(w.en, slow, e.currentTarget);
      markLearned(w);
    };
    $app.querySelector("#say").onclick = say(false);
    $app.querySelector("#saySlow").onclick = say(true);
    $app.querySelector(".pic").onclick = say(false);
    $app.querySelector("#prev").onclick = () => { if (i > 0) { i--; draw(); } };
    $app.querySelector("#next").onclick = () => {
      if (i < topic.words.length - 1) { i++; draw(); speak(topic.words[i].en); }
      else go("/games/" + topic.id);
    };
  }

  function markLearned(w) {
    const key = topic.id + ":" + w.en;
    if (state.learned[key]) return;
    state.learned[key] = true;
    addStars(1, "Từ mới!");
    const dot = $app.querySelectorAll(".dots span")[i];
    if (dot) dot.classList.add("seen");
    if (learnedCount(topic) === topic.words.length && !state.topicBonus[topic.id]) {
      state.topicBonus[topic.id] = true;
      setTimeout(() => {
        sfx.win();
        confetti(40);
        addStars(5, `Học xong chủ đề ${topic.name}! 🏅`);
      }, 900);
    }
  }

  draw();
}

/* ===================== Hỗ trợ trò chơi ===================== */
const ROUNDS = 10;

// Chọn n từ làm câu hỏi, không lặp lại cho tới khi hết từ.
function pickTargets(pool, n) {
  let order = [];
  const out = [];
  while (out.length < n) {
    if (!order.length) order = shuffle(pool);
    out.push(order.pop());
  }
  return out;
}

// Đáp án nhiễu lấy từ cùng chủ đề với đáp án đúng (để hình không bị na ná),
// thiếu thì lấy thêm từ các chủ đề khác.
function distractors(target, n) {
  const out = [];
  const keys = new Set([picKey(target)]);
  const ens = new Set([target.en.toLowerCase()]);
  const tryAdd = (w) => {
    if (out.length >= n || keys.has(picKey(w)) || ens.has(w.en.toLowerCase())) return;
    keys.add(picKey(w));
    ens.add(w.en.toLowerCase());
    out.push(w);
  };
  shuffle(wordsOf(target.topic)).forEach(tryAdd);
  if (out.length < n) shuffle(ALL_WORDS).forEach(tryAdd);
  return out;
}

const poolOf = (topic) => (topic ? wordsOf(topic) : ALL_WORDS);
const playPath = (game, topic) => `/play/${game.id}/${topic ? topic.id : "all"}`;

function gameHeader(game, topic) {
  setHeader(`${game.icon} ${topic ? topic.name : "Tất cả chủ đề"}`, true);
}

function showResult({ game, topic, emoji, title, lines, earned }) {
  state.games++;
  saveState();
  sfx.win();
  confetti(earned >= 8 ? 60 : 30);
  setHeader("🎉 Kết quả", true);
  $app.innerHTML = `
    <div class="result">
      <div class="trophy">${emoji}</div>
      <h2>${esc(title)}</h2>
      ${lines.map((l) => `<p>${l}</p>`).join("")}
      <div class="stars-line">${"⭐".repeat(Math.min(earned, 13)) || "💪"}</div>
      <p>Nhận được <b>+${earned} ⭐</b></p>
      <div class="stack">
        <button class="big-btn green" id="again"><span class="emo">🔁</span> Chơi lại</button>
        <button class="big-btn light" data-go="${lastHub}"><span class="emo">🎯</span> Chọn trò khác</button>
        <button class="big-btn purple" data-go="/rewards"><span class="emo">🎁</span> Xem phần thưởng</button>
      </div>
    </div>
  `;
  $app.querySelector("#again").onclick = () => render(playPath(game, topic));
}

function medal(score, total) {
  const r = score / total;
  if (r >= 1) return ["🏆", "Tuyệt vời! Đúng hết!"];
  if (r >= 0.7) return ["🥇", "Giỏi lắm!"];
  if (r >= 0.4) return ["🥈", "Khá lắm! Cố lên nào!"];
  return ["🌱", "Bé đã cố gắng rồi!"];
}

const speakRow = () => `
  <div class="speak-row">
    <button class="speak-btn" id="say" aria-label="Nghe lại">🔊</button>
    <button class="speak-btn slow" id="saySlow" aria-label="Nghe chậm">🐢</button>
  </div>`;

function bindSpeak(text) {
  const $say = $app.querySelector("#say");
  $say.onclick = (e) => speak(text, false, e.currentTarget);
  $app.querySelector("#saySlow").onclick = (e) => speak(text, true, e.currentTarget);
  return $say;
}

/* ---------- Trò 1 & 2: Nghe chọn hình / Nhìn hình chọn từ ---------- */
// mode "listen": nghe từ, chọn 1 trong 4 hình.
// mode "picture": nhìn hình, chọn 1 trong 4 từ tiếng Anh.
function playChoice(game, topic, mode) {
  gameHeader(game, topic);
  const targets = pickTargets(poolOf(topic), ROUNDS);
  let round = 0;
  let score = 0;

  function drawRound() {
    const target = targets[round];
    const options = shuffle([target, ...distractors(target, 3)]);
    let tries = 0;
    let finished = false;

    const prompt = mode === "listen"
      ? `<p>Câu ${round + 1}/${ROUNDS}: Nghe và chọn hình đúng</p>${speakRow()}`
      : `<p>Câu ${round + 1}/${ROUNDS}: Đây là gì trong tiếng Anh?</p>
         <div class="prompt-pic">${picHTML(target)}</div>`;
    const optionHTML = (w, k) => mode === "listen"
      ? `<button class="choice" data-k="${k}" aria-label="Lựa chọn ${k + 1}">${picHTML(w)}</button>`
      : `<button class="word-choice" data-k="${k}">${esc(w.en)}</button>`;

    $app.innerHTML = `
      <div class="progress"><div style="width:${(round / ROUNDS) * 100}%"></div></div>
      <div class="question ${mode === "picture" ? "compact" : ""}">${prompt}</div>
      <div class="${mode === "listen" ? "choices" : "word-choices"}">
        ${options.map(optionHTML).join("")}
      </div>
      <div class="feedback" id="fb"></div>
    `;
    if (mode === "listen") speak(target.en, false, bindSpeak(target.en));

    const $fb = $app.querySelector("#fb");
    $app.querySelectorAll("[data-k]").forEach((btn) => {
      btn.onclick = () => {
        if (finished) return;
        const pick = options[+btn.dataset.k];
        tries++;
        if (pick.en === target.en) {
          finished = true;
          btn.classList.add("correct");
          $app.querySelectorAll("[data-k]").forEach((b) => (b.disabled = true));
          sfx.good();
          if (tries === 1) {
            score++;
            addStars(1);
          }
          $fb.className = "feedback good";
          $fb.innerHTML = `${tries === 1 ? "Giỏi quá! 🎉" : "Đúng rồi! 👍"} <b>${esc(target.en)}</b> = ${esc(target.vi)}`;
          later(() => speak(target.en), 350);
          later(() => {
            round++;
            if (round < ROUNDS) drawRound();
            else finish();
          }, 1900);
        } else {
          btn.classList.add("wrong");
          btn.disabled = true;
          sfx.bad();
          if (mode === "picture") speak(pick.en);
          $fb.className = "feedback bad";
          $fb.textContent = mode === "listen"
            ? `Chưa đúng, đó là "${pick.en}". Bé thử lại nhé! 💪`
            : `Chưa đúng, "${pick.en}" là ${pick.vi}. Thử lại nhé! 💪`;
        }
      };
    });
  }

  function finish() {
    const perfect = score === ROUNDS;
    if (perfect) addStars(3);
    const [emoji, title] = medal(score, ROUNDS);
    showResult({
      game, topic, emoji, title,
      lines: [`Bé trả lời đúng ngay <b>${score}/${ROUNDS}</b> câu${perfect ? " (thưởng thêm 3 ⭐)" : ""}`],
      earned: score + (perfect ? 3 : 0),
    });
  }

  drawRound();
}

/* ---------- Trò 3: Bắn bóng bay ---------- */
// Nghe từ, các quả bóng có hình bay lên; chạm đúng quả trước khi nó bay mất.
function playBalloon(game, topic) {
  gameHeader(game, topic);
  const targets = pickTargets(poolOf(topic), ROUNDS);
  const colors = ["#ff6b6b", "#4dabf7", "#51cf66", "#fcc419", "#cc5de8", "#ff922b"];
  let round = 0;
  let score = 0;

  function drawRound(retry) {
    const target = targets[round];
    const options = shuffle([target, ...distractors(target, 3)]);
    const lanes = shuffle([0, 1, 2, 3]);
    let tries = retry ? 1 : 0;
    let finished = false;

    $app.innerHTML = `
      <div class="progress"><div style="width:${(round / ROUNDS) * 100}%"></div></div>
      <div class="question compact">
        <p>Câu ${round + 1}/${ROUNDS}: Chạm vào bóng bay đúng!</p>
        ${speakRow()}
      </div>
      <div class="balloon-sky" id="sky">
        ${options.map((w, k) => {
          const dur = 8 + Math.random() * 3;
          const delay = Math.random() * 1.2;
          return `<button class="balloon" data-k="${k}"
            style="--x:${lanes[k] * 25 + 1}%;--col:${colors[(k + round) % colors.length]};animation-duration:${dur}s;animation-delay:${delay}s">
            <span class="b-body">${picHTML(w)}</span><span class="b-string"></span></button>`;
        }).join("")}
      </div>
      <div class="feedback" id="fb"></div>
    `;
    const $fb = $app.querySelector("#fb");
    speak(target.en, false, bindSpeak(target.en));

    $app.querySelectorAll(".balloon").forEach((btn) => {
      const w = options[+btn.dataset.k];
      btn.onclick = () => {
        if (finished || btn.classList.contains("popped")) return;
        btn.classList.add("popped");
        tries++;
        if (w.en === target.en) {
          finished = true;
          sfx.pop();
          sfx.good();
          if (tries === 1) {
            score++;
            addStars(1);
          }
          $fb.className = "feedback good";
          $fb.innerHTML = `Trúng rồi! 🎯 <b>${esc(target.en)}</b> = ${esc(target.vi)}`;
          later(() => speak(target.en), 300);
          later(next, 1700);
        } else {
          sfx.bad();
          $fb.className = "feedback bad";
          $fb.textContent = `Ối, đó là "${w.en}". Tìm quả khác nhé!`;
        }
      };
      // Bóng đúng bay mất: chơi lại câu này (không được sao).
      btn.addEventListener("animationend", (e) => {
        if (e.animationName !== "rise" || finished || w.en !== target.en) return;
        finished = true;
        $fb.className = "feedback bad";
        $fb.textContent = "Bóng bay mất rồi! Thử lại nhé 🎈";
        later(() => drawRound(true), 1500);
      });
    });
  }

  function next() {
    round++;
    if (round < ROUNDS) drawRound(false);
    else {
      const perfect = score === ROUNDS;
      if (perfect) addStars(3);
      const [emoji, title] = medal(score, ROUNDS);
      showResult({
        game, topic, emoji, title,
        lines: [`Bé bắn trúng ngay <b>${score}/${ROUNDS}</b> quả bóng${perfect ? " (thưởng thêm 3 ⭐)" : ""}`],
        earned: score + (perfect ? 3 : 0),
      });
    }
  }

  drawRound(false);
}

/* ---------- Trò 4: Lật thẻ trí nhớ ---------- */
// 6 cặp thẻ: một thẻ hình, một thẻ chữ tiếng Anh. Lật 2 thẻ, khớp thì giữ lại.
function playMemory(game, topic) {
  gameHeader(game, topic);
  const chosen = [];
  const keys = new Set();
  for (const w of shuffle(poolOf(topic))) {
    if (chosen.length === 6) break;
    if (keys.has(picKey(w)) || chosen.some((c) => c.en === w.en)) continue;
    keys.add(picKey(w));
    chosen.push(w);
  }
  const cards = shuffle(chosen.flatMap((w, i) => [{ i, kind: "pic", w }, { i, kind: "word", w }]));
  let open = [];
  let matched = 0;
  let moves = 0;
  let busy = false;

  $app.innerHTML = `
    <div class="question compact"><p>Lật 2 thẻ để tìm cặp <b>hình</b> và <b>chữ</b> giống nhau</p>
      <p class="moves">Số lượt: <b id="moves">0</b> · Đã tìm: <b id="found">0</b>/${chosen.length}</p></div>
    <div class="memory-grid">
      ${cards.map((c, k) => `<button class="mcard" data-k="${k}" aria-label="Thẻ ${k + 1}">
        <span class="m-back">❓</span>
        <span class="m-front ${c.kind}">${c.kind === "pic" ? picHTML(c.w) : esc(c.w.en)}</span>
      </button>`).join("")}
    </div>
  `;
  const $moves = $app.querySelector("#moves");
  const $found = $app.querySelector("#found");

  $app.querySelectorAll(".mcard").forEach((btn) => {
    btn.onclick = () => {
      const c = cards[+btn.dataset.k];
      if (busy || btn.classList.contains("flipped")) return;
      btn.classList.add("flipped");
      sfx.flip();
      if (c.kind === "word") speak(c.w.en);
      open.push({ btn, c });
      if (open.length < 2) return;
      moves++;
      $moves.textContent = moves;
      const [a, b] = open;
      open = [];
      if (a.c.i === b.c.i) {
        a.btn.classList.add("matched");
        b.btn.classList.add("matched");
        matched++;
        $found.textContent = matched;
        later(() => { sfx.good(); speak(a.c.w.en); }, 250);
        if (matched === chosen.length) later(finish, 1500);
      } else {
        busy = true;
        later(() => {
          a.btn.classList.remove("flipped");
          b.btn.classList.remove("flipped");
          busy = false;
        }, 1000);
      }
    };
  });

  function finish() {
    const good = moves <= chosen.length + 4;
    const earned = 3 + (good ? 2 : 0);
    addStars(earned);
    state.best.memory = Math.min(state.best.memory || 999, moves);
    showResult({
      game, topic,
      emoji: good ? "🏆" : "🥇",
      title: good ? "Trí nhớ siêu đỉnh!" : "Giỏi lắm!",
      lines: [`Bé tìm đủ ${chosen.length} cặp trong <b>${moves}</b> lượt`,
        good ? "Ít lượt quá, thưởng thêm 2 ⭐!" : `Thử tìm trong ${chosen.length + 4} lượt để được thưởng thêm nhé!`],
      earned,
    });
  }
}

/* ---------- Trò 5: Xếp chữ ---------- */
// Nhìn hình, nghe từ, bấm các chữ cái theo đúng thứ tự.
function playSpell(game, topic) {
  gameHeader(game, topic);
  const pool = poolOf(topic).filter(spellable);
  const total = Math.min(8, pool.length);
  const targets = shuffle(pool).slice(0, total);
  let round = 0;
  let score = 0;

  function drawRound() {
    const target = targets[round];
    const letters = [...target.en];
    let tiles = shuffle(letters.map((ch, k) => ({ ch, k })));
    // Tránh trường hợp xáo xong vẫn y nguyên thứ tự.
    if (letters.length > 1 && tiles.every((t, k) => t.ch === letters[k])) tiles = [...tiles.slice(1), tiles[0]];
    let pos = 0;
    let mistakes = 0;

    $app.innerHTML = `
      <div class="progress"><div style="width:${(round / total) * 100}%"></div></div>
      <div class="question compact">
        <p>Từ ${round + 1}/${total}: Xếp chữ thành từ đúng</p>
        <div class="prompt-pic small">${picHTML(target)}</div>
        <p class="hint-vi">${esc(target.vi)}</p>
        ${speakRow()}
      </div>
      <div class="slots">${letters.map(() => '<span class="slot"></span>').join("")}</div>
      <div class="tiles">${tiles.map((t, k) => `<button class="tile" data-k="${k}">${esc(t.ch)}</button>`).join("")}</div>
      <button class="link-btn" id="hint">💡 Gợi ý một chữ</button>
      <div class="feedback" id="fb"></div>
    `;
    speak(target.en, false, bindSpeak(target.en));
    const $slots = $app.querySelectorAll(".slot");
    const $fb = $app.querySelector("#fb");

    function place(btn) {
      $slots[pos].textContent = letters[pos];
      $slots[pos].classList.add("filled");
      btn.disabled = true;
      btn.classList.add("used");
      pos++;
      if (pos === letters.length) done();
    }

    function done() {
      $app.querySelectorAll(".tile").forEach((b) => (b.disabled = true));
      $app.querySelector("#hint").disabled = true;
      sfx.good();
      const ok = mistakes <= 1;
      if (ok) {
        score++;
        addStars(1);
      }
      $fb.className = "feedback good";
      $fb.innerHTML = `${ok ? "Giỏi quá! 🎉" : "Xong rồi! 👍"} <b>${esc(target.en)}</b>`;
      later(() => speak(target.en), 300);
      later(() => {
        round++;
        if (round < total) drawRound();
        else finish();
      }, 1800);
    }

    $app.querySelectorAll(".tile").forEach((btn) => {
      btn.onclick = () => {
        const t = tiles[+btn.dataset.k];
        if (t.ch.toLowerCase() === letters[pos].toLowerCase()) {
          sfx.flip();
          place(btn);
        } else {
          mistakes++;
          sfx.bad();
          btn.classList.remove("shake");
          void btn.offsetWidth;
          btn.classList.add("shake");
        }
      };
    });
    $app.querySelector("#hint").onclick = () => {
      const btn = [...$app.querySelectorAll(".tile:not(.used)")]
        .find((b) => tiles[+b.dataset.k].ch.toLowerCase() === letters[pos].toLowerCase());
      if (!btn) return;
      mistakes++;
      btn.classList.add("hinted");
      place(btn);
    };
  }

  function finish() {
    const perfect = score === total;
    if (perfect) addStars(3);
    const [emoji, title] = medal(score, total);
    showResult({
      game, topic, emoji, title,
      lines: [`Bé xếp đúng <b>${score}/${total}</b> từ (sai không quá 1 chữ)${perfect ? " — thưởng thêm 3 ⭐" : ""}`],
      earned: score + (perfect ? 3 : 0),
    });
  }

  drawRound();
}

/* ---------- Trò 6: Đúng hay sai (60 giây) ---------- */
function playTrueFalse(game, topic) {
  gameHeader(game, topic);
  const pool = poolOf(topic);
  const SECONDS = 60;
  let left = SECONDS;
  let right = 0;
  let wrong = 0;
  let current = null;
  let locked = false;

  $app.innerHTML = `
    <div class="tf-top">
      <span class="tf-timer">⏱️ <b id="time">${SECONDS}</b>s</span>
      <span class="tf-score">✅ <b id="right">0</b> · ❌ <b id="wrong">0</b></span>
    </div>
    <div class="progress"><div id="timebar" style="width:100%"></div></div>
    <div class="tf-card" id="card"></div>
    <div class="row tf-buttons">
      <button class="big-btn green" id="yes"><span class="emo">✅</span> Đúng</button>
      <button class="big-btn red" id="no"><span class="emo">❌</span> Sai</button>
    </div>
    <div class="feedback" id="fb"></div>
    <p class="tip">Hình và từ tiếng Anh có khớp nhau không? Trả lời thật nhanh!</p>
  `;
  const $card = $app.querySelector("#card");
  const $fb = $app.querySelector("#fb");

  function nextItem() {
    const w = pool[Math.floor(Math.random() * pool.length)];
    const match = Math.random() < 0.5;
    const shown = match ? w : distractors(w, 1)[0];
    current = { w, shown, match };
    $card.innerHTML = `<div class="tf-pic">${picHTML(w)}</div><div class="tf-word">${esc(shown.en)}</div>`;
    $card.classList.remove("pop");
    void $card.offsetWidth;
    $card.classList.add("pop");
    speak(shown.en);
    locked = false;
  }

  function answer(saysMatch) {
    if (locked || left <= 0) return;
    locked = true;
    if (saysMatch === current.match) {
      right++;
      sfx.good();
      $fb.className = "feedback good";
      $fb.textContent = "Đúng rồi! 🎉";
    } else {
      wrong++;
      sfx.bad();
      $fb.className = "feedback bad";
      $fb.innerHTML = `Ồ không! Hình này là <b>${esc(current.w.en)}</b>`;
    }
    $app.querySelector("#right").textContent = right;
    $app.querySelector("#wrong").textContent = wrong;
    later(nextItem, saysMatch === current.match ? 450 : 1300);
  }

  $app.querySelector("#yes").onclick = () => answer(true);
  $app.querySelector("#no").onclick = () => answer(false);

  function tick() {
    left--;
    $app.querySelector("#time").textContent = left;
    $app.querySelector("#timebar").style.width = (left / SECONDS) * 100 + "%";
    if (left <= 0) return finish();
    later(tick, 1000);
  }

  function finish() {
    clearTimers();
    const earned = Math.floor(right / 3);
    addStars(earned);
    const best = state.best.truefalse || 0;
    const record = right > best;
    if (record) state.best.truefalse = right;
    const [emoji, title] = right >= 20 ? ["🏆", "Nhanh như chớp!"] : right >= 10 ? ["🥇", "Giỏi lắm!"] : ["🌱", "Cố lên nào!"];
    showResult({
      game, topic, emoji, title,
      lines: [`Trong ${SECONDS} giây bé trả lời đúng <b>${right}</b> câu, sai ${wrong} câu`,
        record ? "🎊 Kỷ lục mới!" : `Kỷ lục của bé: ${best} câu`,
        "Cứ 3 câu đúng được 1 ⭐"],
      earned,
    });
  }

  nextItem();
  later(tick, 1000);
}

/* ===================== Danh sách trò chơi ===================== */
const GAMES = [
  { id: "listen", name: "Nghe & chọn hình", icon: "👂", color: "#3d8bfd",
    desc: "Nghe từ tiếng Anh rồi chọn hình đúng", play(t) { playChoice(this, t, "listen"); } },
  { id: "picture", name: "Nhìn hình chọn từ", icon: "🖼️", color: "#2ecc71",
    desc: "Nhìn hình rồi chọn từ tiếng Anh đúng", play(t) { playChoice(this, t, "picture"); } },
  { id: "balloon", name: "Bắn bóng bay", icon: "🎈", color: "#fc5c65",
    desc: "Nghe từ, chạm vào quả bóng đúng trước khi nó bay mất", play(t) { playBalloon(this, t); } },
  { id: "memory", name: "Lật thẻ trí nhớ", icon: "🃏", color: "#a55eea",
    desc: "Lật thẻ tìm cặp hình và chữ giống nhau", play(t) { playMemory(this, t); } },
  { id: "spell", name: "Xếp chữ", icon: "🔤", color: "#fd9644",
    desc: "Xếp các chữ cái thành từ tiếng Anh đúng",
    ok: (t) => (t ? wordsOf(t) : ALL_WORDS).filter(spellable).length >= 4,
    play(t) { playSpell(this, t); } },
  { id: "truefalse", name: "Đúng hay sai", icon: "⚡", color: "#f7b731",
    desc: "60 giây nhanh tay: hình và từ có khớp không?", play(t) { playTrueFalse(this, t); } },
];
const gameById = (id) => GAMES.find((g) => g.id === id);
const gameOk = (g, t) => !g.ok || g.ok(t);

function gameCardHTML(g, link, disabled) {
  return `<button class="game-card" style="--c:${g.color}" ${disabled ? "disabled" : `data-go="${link}"`}>
    <span class="g-icon">${g.icon}</span>
    <span class="g-text"><span class="g-name">${esc(g.name)}</span>
    <span class="g-desc">${disabled ? "Chủ đề này không có trò xếp chữ" : esc(g.desc)}</span></span>
  </button>`;
}

function renderGameHub(topic) {
  lastHub = topic ? "/games/" + topic.id : "/games";
  setHeader(topic ? `🎮 ${topic.name}` : "🎮 Trò chơi", true);
  $app.innerHTML = `
    <div class="hello">
      <p class="big">Bé muốn chơi trò gì?</p>
      <p class="small">${topic ? `Chủ đề: ${topic.icon} ${esc(topic.name)}` : "Chọn trò chơi, rồi chọn chủ đề"}</p>
    </div>
    <div class="game-list">
      ${GAMES.map((g) => gameCardHTML(g, topic ? playPath(g, topic) : "/pick/" + g.id, topic && !gameOk(g, topic))).join("")}
    </div>
    ${topic ? '<button class="big-btn light" data-go="/games" style="margin-top:16px"><span class="emo">🌈</span> Chơi với chủ đề khác</button>' : ""}
  `;
}

function renderPick(game) {
  lastHub = "/pick/" + game.id;
  setHeader(`${game.icon} ${game.name}`, true);
  $app.innerHTML = `
    <div class="hello">
      <p class="big">Bé chọn chủ đề nhé!</p>
      <p class="small">${esc(game.desc)}</p>
    </div>
    <button class="big-btn orange" data-go="${playPath(game, null)}"><span class="emo">🌈</span> Trộn tất cả chủ đề</button>
    <h2 class="section-title">Hoặc chọn một chủ đề</h2>
    ${topicPickerHTML((t) => playPath(game, t), (t) => gameOk(game, t))}
  `;
}

/* ===================== Phần thưởng ===================== */
function renderRewards() {
  setHeader("🎁 Phần thưởng", true);
  const next = REWARDS.find((r) => state.stars < r.stars);
  const prevStars = next ? (REWARDS[REWARDS.indexOf(next) - 1] || { stars: 0 }).stars : 0;
  const pct = next ? ((state.stars - prevStars) / (next.stars - prevStars)) * 100 : 100;
  const learnedTotal = Object.keys(state.learned).length;
  const badges = TOPICS.filter((t) => state.topicBonus[t.id]).length;

  $app.innerHTML = `
    <div class="reward-head">
      <div class="total">⭐ ${state.stars}</div>
      <div class="rank">${esc(currentTitle())}</div>
      <div class="progress"><div style="width:${pct}%"></div></div>
      <div class="next">${next
        ? `Còn <b>${next.stars - state.stars} ⭐</b> nữa để nhận ${next.img} ${esc(next.name)}`
        : "Bé đã nhận hết nhãn dán rồi! 🎊"}</div>
      <div class="next">📖 Đã học ${learnedTotal}/${ALL_WORDS.length} từ · 🎮 Đã chơi ${state.games} lượt</div>
      ${state.best.truefalse ? `<div class="next">⚡ Kỷ lục Đúng hay sai: ${state.best.truefalse} câu</div>` : ""}
    </div>
    <h2 class="section-title">🌟 Bộ sưu tập nhãn dán</h2>
    <div class="sticker-grid">
      ${REWARDS.map((r) => {
        const got = state.stars >= r.stars;
        return `<div class="sticker ${got ? "" : "locked"}">
          <div class="emo">${r.img}</div>
          <div class="lbl">${got ? esc(r.name) : "🔒 " + r.stars + " ⭐"}</div>
        </div>`;
      }).join("")}
    </div>
    <h2 class="section-title">🏅 Huy hiệu chủ đề · ${badges}/${TOPICS.length}</h2>
    ${CATEGORIES.map((c) => `
      <p class="badge-cat">${c.icon} ${esc(c.name)}</p>
      <div class="badge-grid">
        ${c.topics.map((t) => `<div class="badge ${state.topicBonus[t.id] ? "" : "locked"}" title="${esc(t.name)}">
          <span>${t.icon}</span><small>${esc(t.name)}</small></div>`).join("")}
      </div>`).join("")}
    <p class="tip">Học hết một chủ đề để nhận huy hiệu và +5 ⭐</p>
    <button class="link-btn" id="reset">Xóa tiến độ (dành cho bố mẹ)</button>
  `;
  $app.querySelector("#reset").onclick = () => {
    if (confirm("Xóa hết sao và tiến độ học của bé?")) {
      state.stars = 0; state.learned = {}; state.topicBonus = {}; state.games = 0; state.best = {};
      saveState();
      updateStarBadge(false);
      renderRewards();
    }
  };
}

/* ===================== Khởi động ===================== */
// Mọi nút có data-go đều chuyển màn hình.
$app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-go]");
  if (el && !el.disabled) go(el.dataset.go);
});

updateStarBadge(false);
render(location.hash.slice(1) || "/");
