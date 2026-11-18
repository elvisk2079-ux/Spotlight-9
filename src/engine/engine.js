/* ===== Drill engine (shared). Expects META, P, DRILLS defined before this script. ===== */
const byId = Object.fromEntries(P.map(p => [p.id, p]));
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().replace(/[.!?,;:]+$/, "");

let M = {};
try { M = JSON.parse(localStorage.getItem(META.ls) || "{}") || {}; } catch (e) { M = {}; }
const save = () => { try { localStorage.setItem(META.ls, JSON.stringify(M)); } catch (e) {} };
const COUNT = {};
let COUNTING = true;
const reg = id => { if (COUNTING && id && byId[id]) COUNT[id] = (COUNT[id] || 0) + 1; };
const goal = id => Math.max(1, Math.min(5, COUNT[id] || 5));
function hit(id, ok) {
  if (!id || !byId[id]) return;
  const r = M[id] || (M[id] = { c: 0, m: 0 });
  if (ok) r.c++; else r.m++;
  save(); renderBoard();
}
function renderBoard() {
  const b = document.getElementById("board");
  b.innerHTML = "";
  let learned = 0;
  P.forEach(p => {
    const r = M[p.id] || { c: 0, m: 0 };
    const g = goal(p.id);
    const n = Math.min(g, r.c);
    if (n >= g) learned++;
    const chip = el("div", "chip" + (n >= g ? " master" : r.m > r.c ? " weak" : ""));
    chip.append(el("span", "ph", p.phrase), el("span", "ru", p.ru));
    const dots = el("span", "dots");
    dots.setAttribute("aria-label", `${n} of ${g}`);
    for (let i = 0; i < g; i++) dots.append(el("i", i < n ? "on" : ""));
    chip.append(dots);
    b.append(chip);
  });
  document.getElementById("mastered").textContent = learned;
  document.getElementById("ptotal").textContent = P.length;
  document.getElementById("fill").style.width = `${(learned / P.length) * 100}%`;
}

function card(num, def) {
  const sec = el("section");
  sec.id = `d${num}`;
  const ex = el("article", "ex");
  const head = el("div", "ex-head");
  const h3 = el("h3");
  h3.append(el("span", "num", `Drill ${num}`), def.title);
  const score = el("span", "score");
  head.append(h3, score);
  ex.append(head, el("p", "instr", def.instr));
  if (def.bank) {
    const bank = el("div", "bank");
    def.bank.forEach(w => bank.append(el("span", null, w)));
    ex.append(bank);
  }
  const body = el("div");
  const foot = el("div", "foot");
  ex.append(body, foot);
  if (def.note) ex.append(el("p", "note", def.note));
  sec.append(ex);
  document.getElementById("main").append(sec);
  const a = el("a", null, `${num} · ${def.short}`);
  a.href = `#d${num}`;
  document.getElementById("nav").append(a);
  return { body, foot, score, total: 0, ok: 0, def };
}
const setScore = d => { d.score.textContent = `${d.ok} / ${d.total}`; d.score.classList.toggle("done", d.total > 0 && d.ok === d.total); };
function resetBtn(d, build) {
  const r = el("button", "btn", "Start again");
  r.type = "button";
  r.addEventListener("click", () => { d.body.innerHTML = ""; d.foot.innerHTML = ""; build(); });
  d.foot.append(r);
}
function splitId(spec, fallback) {
  const i = spec.lastIndexOf("#");
  return i > -1 ? [spec.slice(0, i), spec.slice(i + 1)] : [spec, fallback];
}
function options(list, correctSet, id, d, shuf) {
  reg(id);
  const wrap = el("span", "choice");
  let done = false;
  (shuf ? shuffle(list) : list).forEach(o => {
    const b = el("button", "opt", o);
    b.type = "button";
    b.addEventListener("click", () => {
      if (done || b.disabled) return;
      if (correctSet.includes(o)) {
        done = true;
        b.classList.add("ok");
        wrap.querySelectorAll(".opt").forEach(x => { if (x !== b) { x.classList.add("dim"); x.disabled = true; } });
        d.ok++; setScore(d); hit(id, true);
      } else {
        b.classList.add("bad", "shake");
        b.disabled = true;
        hit(id, false);
      }
    });
    wrap.append(b);
  });
  return wrap;
}

/* Inline text with {{*right|wrong#id}} choices, [[ans/alt#id]] typed gaps, ^CUE^ word-formation cues */
const TOK = /\{\{(.+?)\}\}|\[\[(.+?)\]\]|\^(.+?)\^/g;
function inline(text, id, d, gaps, shuf) {
  const frag = document.createDocumentFragment();
  let last = 0;
  text.replace(TOK, (m, c, t, q, off) => {
    frag.append(text.slice(last, off));
    if (c) {
      const [spec, gid] = splitId(c, id);
      const raw = spec.split("|");
      const right = raw.filter(o => o.startsWith("*")).map(o => o.slice(1));
      frag.append(options(raw.map(o => o.replace(/^\*/, "")), right, gid, d, shuf));
      d.total++;
    } else if (t) {
      const [spec, gid] = splitId(t, id);
      const answers = spec.split("/");
      const inp = el("input", "gap");
      inp.type = "text"; inp.autocomplete = "off"; inp.spellcheck = false;
      inp.id = `g${d.num}-${gaps.length}`;
      inp.setAttribute("autocapitalize", "off"); inp.setAttribute("aria-label", "gap");
      inp.style.width = `${Math.max(6, Math.max(...answers.map(a => a.length)) + 2)}ch`;
      reg(gid);
      const g = { inp, answers: answers.map(norm), show: answers[0], id: gid, ok: false };
      gaps.push(g);
      inp.addEventListener("input", () => inp.classList.remove("ok", "bad", "shown"));
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); d.check(); } });
      frag.append(inp);
      d.total++;
    } else {
      frag.append(el("span", "cue", q));
    }
    last = off + m.length;
    return m;
  });
  frag.append(text.slice(last));
  return frag;
}

const RENDER = {
  /* sentences with inline choices and/or typed gaps */
  gaps(d) {
    const def = d.def;
    const gaps = [];
    d.check = () => {
      gaps.forEach(g => {
        if (g.ok) return;
        const v = norm(g.inp.value);
        if (!v) return;
        g.inp.classList.remove("ok", "bad", "shown");
        if (g.answers.includes(v)) { g.ok = true; g.inp.classList.add("ok"); g.inp.readOnly = true; d.ok++; hit(g.id, true); }
        else { g.inp.classList.add("bad"); hit(g.id, false); }
      });
      setScore(d);
    };
    const items = def.keepOrder ? def.items : shuffle(def.items);
    const shuf = def.shuffleOptions !== false;
    if (def.layout === "text") {
      items.forEach(it => { const p = el("p", "text"); p.append(inline(it.t, it.id, d, gaps, shuf)); d.body.append(p); });
    } else {
      const ol = el("ol", "items");
      items.forEach(it => { const li = el("li"); li.append(inline(it.t, it.id, d, gaps, shuf)); ol.append(li); });
      d.body.append(ol);
    }
    if (gaps.length) {
      const c = el("button", "btn primary", "Check"); c.type = "button"; c.addEventListener("click", d.check);
      const s = el("button", "btn", "Show answers"); s.type = "button";
      s.addEventListener("click", () => gaps.forEach(g => { if (!g.ok) { g.inp.value = g.show; g.inp.classList.remove("bad"); g.inp.classList.add("shown"); } }));
      d.foot.append(c, s);
    }
  },
  /* question + option buttons; first option in o is the correct one */
  mcq(d) {
    const ol = el("ol", "items");
    shuffle(d.def.items).forEach(it => {
      const li = el("li");
      li.append(el("p", "q", it.q));
      const box = el("div", "mcq");
      box.append(options([...it.o], [it.o[0]], it.id, d, true));
      d.total++;
      li.append(box);
      ol.append(li);
    });
    d.body.append(ol);
  },
  /* meaning -> phrase, built from P */
  meaning(d) {
    const ol = el("ol", "items");
    const pool = d.def.ids ? P.filter(p => d.def.ids.includes(p.id)) : P;
    shuffle(pool).forEach(p => {
      const li = el("li");
      li.append(el("p", "q", p.ru));
      const lab = x => x.opt || x.phrase;
      const others = [...new Set(shuffle(pool.filter(x => x.id !== p.id)).map(lab))].filter(t => t !== lab(p)).slice(0, 3);
      const box = el("div", "mcq");
      box.append(options([lab(p), ...others], [lab(p)], p.id, d, true));
      d.total++;
      li.append(box);
      ol.append(li);
    });
    d.body.append(ol);
  },
  /* right or wrong */
  tf(d) {
    const ol = el("ol", "items");
    shuffle(d.def.items).forEach(it => {
      d.total++; reg(it.id);
      const li = el("li");
      li.append(el("p", "tf-line", it.t));
      const btns = el("div", "tf-btns");
      const fb = el("p", "fix"); fb.hidden = true;
      let done = false;
      [["Right", true], ["Wrong", false]].forEach(([label, val]) => {
        const b = el("button", "opt", label);
        b.type = "button";
        b.addEventListener("click", () => {
          if (done) return;
          done = true;
          const correct = val === it.ok;
          b.classList.add(correct ? "ok" : "bad");
          btns.querySelectorAll(".opt").forEach(x => { if (x !== b) { x.classList.add("dim"); x.disabled = true; } });
          fb.hidden = false;
          fb.className = "fix " + (correct ? "ok" : "bad");
          fb.innerHTML = "";
          if (it.ok) fb.append(correct ? "Yes, that's correct." : "It was correct.");
          else fb.append(correct ? "Yes! Correct version: " : "It was wrong. Correct version: ", el("b", null, it.fix));
          if (correct) { d.ok++; setScore(d); }
          hit(it.id, correct);
        });
        btns.append(b);
      });
      li.append(btns, fb);
      ol.append(li);
    });
    d.body.append(ol);
  },
  /* word order */
  order(d) {
    const ol = el("ol", "items");
    shuffle(d.def.items).forEach(it => {
      d.total++; reg(it.id);
      const li = el("li");
      if (it.q) li.append(el("p", "q", it.q));
      const wrap = el("div", "uns");
      const target = it.s.split(" ");
      const line = el("div", "answer-line");
      line.setAttribute("aria-label", "Your sentence");
      const pool = el("div", "tiles");
      const fb = el("p", "fix"); fb.hidden = true;
      let solved = false;
      const mk = w => {
        const t = el("button", "tile", w);
        t.type = "button";
        t.addEventListener("click", () => {
          if (solved) return;
          (t.parentElement === pool ? line : pool).append(t);
          line.classList.remove("bad"); fb.hidden = true;
        });
        return t;
      };
      let order = shuffle(target);
      if (order.join(" ") === it.s && target.length > 1) order = [...order.slice(1), order[0]];
      order.forEach(w => pool.append(mk(w)));
      const controls = el("div", "line");
      const c = el("button", "btn small primary", "Check"); c.type = "button";
      const sh = el("button", "btn small", "Show answer"); sh.type = "button";
      c.addEventListener("click", () => {
        if (solved) return;
        const built = [...line.children].map(x => x.textContent).join(" ");
        if (!built) return;
        fb.hidden = false;
        const alts = [it.s, ...(it.alt || [])];
        if (alts.includes(built)) {
          solved = true; line.classList.add("ok"); fb.className = "fix ok"; fb.textContent = "Correct!";
          d.ok++; setScore(d); hit(it.id, true);
        } else if (pool.children.length) {
          fb.className = "fix bad"; fb.textContent = "Use all the words.";
        } else {
          line.classList.add("bad"); fb.className = "fix bad"; fb.textContent = "Not quite. Tap words to move them and try again.";
          hit(it.id, false);
        }
      });
      sh.addEventListener("click", () => { fb.hidden = false; fb.className = "fix"; fb.innerHTML = ""; fb.append("Answer: ", el("b", null, it.s)); });
      controls.append(c, sh);
      wrap.append(line, pool, controls, fb);
      li.append(wrap);
      ol.append(li);
    });
    d.body.append(ol);
  },
  /* translation; key = regex the answer must contain */
  translate(d) {
    const ol = el("ol", "items tr");
    shuffle(d.def.items).forEach((it, i) => {
      d.total++; reg(it.id);
      const li = el("li");
      li.append(el("p", "ru-line", it.ru));
      const ta = el("textarea");
      ta.id = `t${d.num}-${i}`; ta.rows = 1; ta.placeholder = "Type in English…"; ta.setAttribute("aria-label", "Your translation");
      const line = el("div", "line");
      const c = el("button", "btn small primary", "Check"); c.type = "button";
      const sh = el("button", "btn small", "Show model"); sh.type = "button";
      const model = el("p", "model"); model.hidden = true;
      let solved = false;
      const re = new RegExp(`(^|[^a-z'])(${it.key})($|[^a-z'])`, "i");
      const check = () => {
        if (solved || !ta.value.trim()) return;
        const v = norm(ta.value);
        ta.classList.remove("ok", "bad");
        model.hidden = false; model.innerHTML = "";
        if (re.test(v)) {
          solved = true; ta.classList.add("ok"); ta.readOnly = true;
          model.append("Correct. Model: ", el("b", null, it.en));
          d.ok++; setScore(d); hit(it.id, true);
        } else {
          ta.classList.add("bad");
          model.append("Use ", el("b", null, it.hint || (byId[it.id] ? byId[it.id].phrase : "the target phrase")), ". Try again.");
          hit(it.id, false);
        }
      };
      c.addEventListener("click", check);
      ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check(); } });
      sh.addEventListener("click", () => { model.hidden = false; model.innerHTML = ""; model.append("Model: ", el("b", null, it.en)); });
      line.append(c, sh);
      li.append(ta, line, model);
      ol.append(li);
    });
    d.body.append(ol);
  }
};


/* ===== Flashcards (auto Drill 1) ===== */
const sayText = p => (p.say || p.phrase)
  .replace(/\([^)]*\)/g, " ").replace(/→/g, ", ").replace(/…|\.\.\./g, " ")
  .replace(/\bsb\b/g, "someone").replace(/\bsth\b/g, "something")
  .replace(/\s\/\s/g, " or ").replace(/^-/, "").replace(/\s+/g, " ").trim();
let VOICE = null;
function pickVoice() {
  try {
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    VOICE = vs.find(v => /en[-_]GB/i.test(v.lang) && /google|natural|online|serena|daniel|kate/i.test(v.name))
      || vs.find(v => /en[-_]GB/i.test(v.lang)) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  } catch (e) { VOICE = null; }
}
try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
function speak(text) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (VOICE) u.voice = VOICE;
    u.lang = VOICE ? VOICE.lang : "en-GB";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch (e) {}
}
const HAS_TTS = typeof window !== "undefined" && "speechSynthesis" in window;

RENDER.cards = function (d) {
  let deck = P.map(p => p.id), pos = 0, flipped = false, ruFirst = false, known = 0, auto = false;
  d.total = deck.length;
  const box = el("div", "fc");
  const tools = el("div", "fc-tools");
  const mk = (txt, title) => { const b = el("button", "btn ghost", txt); b.type = "button"; if (title) b.title = title; return b; };
  const bShuf = mk("Shuffle"), bDir = mk("Russian first"), bAuto = mk("Auto-sound: off");
  tools.append(bShuf, bDir);
  if (HAS_TTS) tools.append(bAuto);
  const flip = el("div", "flip"); flip.tabIndex = 0; flip.setAttribute("role", "button");
  const inner = el("div", "flip-in");
  const front = el("div", "face front"), back = el("div", "face back");
  inner.append(front, back); flip.append(inner);
  const nav = el("div", "fc-nav");
  const bPrev = mk("‹"), bNext = mk("›"), count = el("span", "fc-count");
  bPrev.setAttribute("aria-label", "previous"); bNext.setAttribute("aria-label", "next");
  nav.append(bPrev, count, bNext);
  const rate = el("div", "fc-rate");
  const bAgain = el("button", "btn again", "Again · Ещё раз"), bKnow = el("button", "btn know", "I know it · Знаю");
  bAgain.type = bKnow.type = "button";
  rate.append(bAgain, bKnow);
  const done = el("div", "fc-done");
  box.append(tools, flip, nav, rate, done);
  d.body.append(box);

  const face = (node, p, en) => {
    node.innerHTML = "";
    if (en) {
      node.append(el("div", "fc-word", p.phrase));
      if (HAS_TTS) {
        const s = el("button", "speak", "🔊"); s.type = "button"; s.setAttribute("aria-label", "listen");
        s.addEventListener("click", e => { e.stopPropagation(); speak(sayText(p)); });
        node.append(s);
      }
    } else {
      node.append(el("div", "fc-ru", p.ru));
      if (p.en) node.append(el("div", "fc-def", p.en));
    }
    node.append(el("div", "fc-hint", "tap to flip"));
  };
  function show() {
    done.innerHTML = "";
    const left = deck.length > 0;
    [flip, nav, rate].forEach(x => x.hidden = !left);
    if (!left) {
      done.append(el("p", null, `All ${P.length} cards done! Now go to Drill 2.`));
      const r = mk("Go through the cards again"); r.addEventListener("click", () => { deck = P.map(p => p.id); known = 0; d.ok = 0; setScore(d); pos = 0; show(); });
      done.append(r);
      return;
    }
    pos = (pos + deck.length) % deck.length;
    const p = byId[deck[pos]];
    flipped = false; flip.classList.remove("on");
    face(front, p, !ruFirst); face(back, p, ruFirst);
    count.textContent = `${pos + 1} / ${deck.length}`;
    if (auto && !ruFirst) speak(sayText(p));
  }
  function turn() {
    flipped = !flipped; flip.classList.toggle("on", flipped);
    if (auto && ruFirst && flipped) speak(sayText(byId[deck[pos]]));
  }
  flip.addEventListener("click", turn);
  flip.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); turn(); }
    else if (e.key === "ArrowRight") { pos++; show(); }
    else if (e.key === "ArrowLeft") { pos--; show(); }
  });
  bPrev.addEventListener("click", () => { pos--; show(); });
  bNext.addEventListener("click", () => { pos++; show(); });
  bShuf.addEventListener("click", () => { deck = shuffle(deck); pos = 0; show(); });
  bDir.addEventListener("click", () => { ruFirst = !ruFirst; bDir.textContent = ruFirst ? "English first" : "Russian first"; show(); });
  bAuto.addEventListener("click", () => { auto = !auto; bAuto.textContent = `Auto-sound: ${auto ? "on" : "off"}`; if (auto) show(); });
  bKnow.addEventListener("click", () => { deck.splice(pos, 1); known++; d.ok = known; setScore(d); show(); });
  bAgain.addEventListener("click", () => { const id = deck.splice(pos, 1)[0]; deck.push(id); if (pos >= deck.length - 1 && deck.length > 1) pos = deck.length - 1; show(); });
  show();
};

function startDrill(num, def) {
  const d = card(num, def);
  d.num = num;
  const build = () => {
    d.ok = 0; d.total = 0;
    RENDER[def.type](d);
    setScore(d);
    resetBtn(d, build);
  };
  build();
}

document.getElementById("reset-all").addEventListener("click", e => {
  const b = e.currentTarget;
  if (b.dataset.armed) { M = {}; save(); renderBoard(); b.textContent = "Reset my progress"; delete b.dataset.armed; }
  else { b.dataset.armed = "1"; b.textContent = "Tap again to reset"; setTimeout(() => { if (b.dataset.armed) { delete b.dataset.armed; b.textContent = "Reset my progress"; } }, 3000); }
});
const boardLink = el("a", null, "Phrases"); boardLink.href = "#board-sec";
document.getElementById("nav").append(boardLink);
const CARDS = { type: "cards", title: "Flashcards", short: "Cards",
  instr: "Look at the card and say what it means. Tap the card to flip it, 🔊 to listen. Then tap “I know it” or “Again” – the “Again” cards come back at the end." };
(META.cards === false ? DRILLS : [CARDS, ...DRILLS]).forEach((def, i) => startDrill(i + 1, def));
COUNTING = false;
renderBoard();
