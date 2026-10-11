"use strict";

/* ===================== Lưu tiến độ ===================== */
const STORE_KEY = "be-hoc-tieng-anh-v1";

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && typeof s.stars === "number") {
      return { stars: s.stars, learned: s.learned || {}, topicBonus: s.topicBonus || {}, games: s.games || 0 };
    }
  } catch (e) { /* trình duyệt chặn bộ nhớ: dùng giá trị mặc định */ }
  return { stars: 0, learned: {}, topicBonus: {}, games: 0 };
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* bỏ qua */ }
}

const state = loadState();

/* ===================== Tiện ích ===================== */
const $app = document.getElementById("app");
const $title = document.getElementById("title");
const $back = document.getElementById("backBtn");
const $starCount = document.getElementById("starCount");
const $starBadge = document.getElementById("starBadge");

const topicById = (id) => TOPICS.find((t) => t.id === id);
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function picHTML(w) {
  if (w.swatch) return `<span class="swatch" style="background:${w.swatch}"></span>`;
  return esc(w.img);
}

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
let rendered = null;

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

$back.addEventListener("click", () => {
  const parts = (location.hash.slice(1) || "/").split("/").filter(Boolean);
  // #/game/animals -> #/game ; #/learn/animals -> #/ ; #/rewards -> #/
  if (parts[0] === "game" && parts.length > 1) go("/game");
  else go("/");
});
$starBadge.addEventListener("click", () => go("/rewards"));

function setHeader(title, showBack) {
  $title.textContent = title;
  $back.hidden = !showBack;
}

function render(path) {
  if (synth) synth.cancel();
  window.scrollTo(0, 0);
  const [, page, arg] = path.split("/");
  if (page === "learn" && topicById(arg)) return renderLearn(topicById(arg));
  if (page === "game" && arg) return renderGame(arg === "all" ? null : topicById(arg));
  if (page === "game") return renderGamePicker();
  if (page === "rewards") return renderRewards();
  return renderHome();
}

/* ===================== Màn hình chính ===================== */
function renderHome() {
  setHeader("Bé Học Tiếng Anh", false);
  $app.innerHTML = `
    <div class="hello">
      <p class="big">Xin chào bé! 👋</p>
      <p class="small">${esc(currentTitle())}</p>
    </div>
    <button class="big-btn orange" data-go="/game"><span class="emo">🎮</span> Chơi trò nghe & chọn</button>
    <h2 class="section-title">📖 Học từ vựng</h2>
    <div class="topic-grid">
      ${TOPICS.map((t) => {
        const n = learnedCount(t);
        const done = n === t.words.length;
        return `<button class="topic-card" style="--c:${t.color}" data-go="/learn/${t.id}">
          ${done ? '<span class="done">🏅</span>' : ""}
          <span class="emo">${t.icon}</span>
          <span class="name">${esc(t.name)}</span>
          <span class="prog">${n}/${t.words.length} từ</span>
        </button>`;
      }).join("")}
    </div>
    <div style="margin-top:18px">
      <button class="big-btn purple" data-go="/rewards"><span class="emo">🎁</span> Phần thưởng của bé</button>
    </div>
    <p class="tip">💡 Bấm 🔊 để nghe. Mỗi từ mới nghe lần đầu được +1 ⭐</p>
  `;
}

/* ===================== Học từ vựng ===================== */
function renderLearn(topic) {
  setHeader(`${topic.icon} ${topic.name}`, true);
  let i = 0;

  function draw() {
    const w = topic.words[i];
    $app.innerHTML = `
      <div class="flashcard" style="--c:${topic.color}">
        <div class="pic pop">${picHTML(w)}</div>
        <p class="en">${esc(w.en)}</p>
        <p class="vi">${esc(w.vi)}</p>
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
      else go("/game/" + topic.id);
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

/* ===================== Trò chơi: nghe & chọn hình ===================== */
function renderGamePicker() {
  setHeader("🎮 Nghe & chọn hình", true);
  $app.innerHTML = `
    <div class="hello">
      <p class="big">Bé chọn chủ đề nhé!</p>
      <p class="small">Nghe từ tiếng Anh rồi bấm vào hình đúng</p>
    </div>
    <button class="big-btn orange" data-go="/game/all"><span class="emo">🌈</span> Tất cả chủ đề</button>
    <div class="topic-grid" style="margin-top:14px">
      ${TOPICS.map((t) => `<button class="topic-card" style="--c:${t.color}" data-go="/game/${t.id}">
        <span class="emo">${t.icon}</span><span class="name">${esc(t.name)}</span></button>`).join("")}
    </div>
    <p class="tip">Đúng ngay lần đầu: +1 ⭐ · Đúng cả 10 câu: thưởng thêm 3 ⭐</p>
  `;
}

const ROUNDS = 10;

function renderGame(topic) {
  setHeader(topic ? `🎮 ${topic.name}` : "🎮 Tất cả chủ đề", true);
  const pool = topic
    ? topic.words.map((w) => ({ ...w, topic }))
    : TOPICS.flatMap((t) => t.words.map((w) => ({ ...w, topic: t })));

  // Chọn đáp án cho các vòng: không lặp lại cho tới khi hết từ.
  let order = [];
  const targets = [];
  while (targets.length < ROUNDS) {
    if (!order.length) order = shuffle(pool);
    targets.push(order.pop());
  }

  let round = 0;
  let correctFirstTry = 0;

  function drawRound() {
    const target = targets[round];
    const others = shuffle(pool.filter((w) => w.en !== target.en && (w.img || w.swatch) !== (target.img || target.swatch)));
    const seen = new Set([target.en]);
    const distract = [];
    for (const w of others) {
      if (distract.length === 3) break;
      if (seen.has(w.en)) continue;
      seen.add(w.en);
      distract.push(w);
    }
    const options = shuffle([target, ...distract]);
    let tries = 0;
    let finished = false;

    $app.innerHTML = `
      <div class="progress"><div style="width:${(round / ROUNDS) * 100}%"></div></div>
      <div class="question">
        <p>Câu ${round + 1}/${ROUNDS}: Nghe và chọn hình đúng</p>
        <div class="speak-row">
          <button class="speak-btn" id="say" aria-label="Nghe lại">🔊</button>
          <button class="speak-btn slow" id="saySlow" aria-label="Nghe chậm">🐢</button>
        </div>
      </div>
      <div class="choices">
        ${options.map((w, k) => `<button class="choice" data-k="${k}" aria-label="Lựa chọn ${k + 1}">${picHTML(w)}</button>`).join("")}
      </div>
      <div class="feedback" id="fb"></div>
    `;
    const $say = $app.querySelector("#say");
    $say.onclick = (e) => speak(target.en, false, e.currentTarget);
    $app.querySelector("#saySlow").onclick = (e) => speak(target.en, true, e.currentTarget);
    speak(target.en, false, $say);

    const $fb = $app.querySelector("#fb");
    $app.querySelectorAll(".choice").forEach((btn) => {
      btn.onclick = () => {
        if (finished) return;
        const pick = options[+btn.dataset.k];
        tries++;
        if (pick.en === target.en) {
          finished = true;
          btn.classList.add("correct");
          $app.querySelectorAll(".choice").forEach((b) => (b.disabled = true));
          sfx.good();
          if (tries === 1) {
            correctFirstTry++;
            addStars(1);
          }
          $fb.className = "feedback good";
          $fb.innerHTML = `${tries === 1 ? "Giỏi quá! 🎉" : "Đúng rồi! 👍"} <b>${esc(target.en)}</b> = ${esc(target.vi)}`;
          setTimeout(() => speak(target.en), 350);
          setTimeout(() => {
            round++;
            if (round < ROUNDS) drawRound();
            else showResult();
          }, 1900);
        } else {
          btn.classList.add("wrong");
          btn.disabled = true;
          sfx.bad();
          $fb.className = "feedback bad";
          $fb.textContent = `Chưa đúng, đó là "${pick.en}". Bé thử lại nhé! 💪`;
        }
      };
    });
  }

  function showResult() {
    state.games++;
    const perfect = correctFirstTry === ROUNDS;
    if (perfect) addStars(3);
    saveState();
    const earned = correctFirstTry + (perfect ? 3 : 0);
    const msg =
      perfect ? ["🏆", "Tuyệt vời! Đúng hết!"] :
      correctFirstTry >= 7 ? ["🥇", "Giỏi lắm!"] :
      correctFirstTry >= 4 ? ["🥈", "Khá lắm! Cố lên nào!"] :
      ["🌱", "Bé đã cố gắng rồi!"];
    sfx.win();
    confetti(perfect ? 60 : 30);
    setHeader("🎉 Kết quả", true);
    $app.innerHTML = `
      <div class="result">
        <div class="trophy">${msg[0]}</div>
        <h2>${msg[1]}</h2>
        <p>Bé trả lời đúng ngay <b>${correctFirstTry}/${ROUNDS}</b> câu</p>
        <div class="stars-line">${"⭐".repeat(Math.min(earned, 13)) || "💪"}</div>
        <p>Nhận được <b>+${earned} ⭐</b>${perfect ? " (có 3 ⭐ thưởng)" : ""}</p>
        <div class="stack">
          <button class="big-btn green" id="again"><span class="emo">🔁</span> Chơi lại</button>
          <button class="big-btn light" data-go="/game"><span class="emo">🎯</span> Chọn chủ đề khác</button>
          <button class="big-btn purple" data-go="/rewards"><span class="emo">🎁</span> Xem phần thưởng</button>
        </div>
      </div>
    `;
    $app.querySelector("#again").onclick = () => renderGame(topic);
  }

  drawRound();
}

/* ===================== Phần thưởng ===================== */
function renderRewards() {
  setHeader("🎁 Phần thưởng", true);
  const next = REWARDS.find((r) => state.stars < r.stars);
  const prevStars = next ? (REWARDS[REWARDS.indexOf(next) - 1] || { stars: 0 }).stars : 0;
  const pct = next ? ((state.stars - prevStars) / (next.stars - prevStars)) * 100 : 100;
  const learnedTotal = Object.keys(state.learned).length;
  const wordsTotal = TOPICS.reduce((s, t) => s + t.words.length, 0);

  $app.innerHTML = `
    <div class="reward-head">
      <div class="total">⭐ ${state.stars}</div>
      <div class="rank">${esc(currentTitle())}</div>
      <div class="progress"><div style="width:${pct}%"></div></div>
      <div class="next">${next
        ? `Còn <b>${next.stars - state.stars} ⭐</b> nữa để nhận ${next.img} ${esc(next.name)}`
        : "Bé đã nhận hết nhãn dán rồi! 🎊"}</div>
      <div class="next">📖 Đã học ${learnedTotal}/${wordsTotal} từ · 🎮 Đã chơi ${state.games} lượt</div>
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
    <h2 class="section-title">🏅 Huy hiệu chủ đề</h2>
    <div class="sticker-grid">
      ${TOPICS.map((t) => {
        const got = state.topicBonus[t.id];
        return `<div class="sticker ${got ? "" : "locked"}">
          <div class="emo">${t.icon}</div>
          <div class="lbl">${esc(t.name)}</div>
        </div>`;
      }).join("")}
    </div>
    <p class="tip">Học hết một chủ đề để nhận huy hiệu và +5 ⭐</p>
    <button class="link-btn" id="reset">Xóa tiến độ (dành cho bố mẹ)</button>
  `;
  $app.querySelector("#reset").onclick = () => {
    if (confirm("Xóa hết sao và tiến độ học của bé?")) {
      state.stars = 0; state.learned = {}; state.topicBonus = {}; state.games = 0;
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
  if (el) go(el.dataset.go);
});

updateStarBadge(false);
render(location.hash.slice(1) || "/");
