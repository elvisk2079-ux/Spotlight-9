/* Vocabulary trainer engine — tap-only exercises, new random set every run. */
(function () {
  "use strict";

  // ---------- helpers ----------
  function el(tag, attrs) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      var v = attrs[k];
      if (v == null) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(a, n) { return shuffle(a).slice(0, Math.min(n, a.length)); }
  function chunk(a, n) { var r = []; for (var i = 0; i < a.length; i += n) r.push(a.slice(i, i + n)); return r; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function distractors(pool, w, key, n) {
    var seen = {}; seen[w[key]] = 1;
    var out = [];
    shuffle(pool).forEach(function (x) {
      if (out.length < n && !seen[x[key]]) { seen[x[key]] = 1; out.push(x); }
    });
    return out;
  }
  function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  // ---------- speech ----------
  var voice = null;
  function pickVoice() {
    try {
      var vs = speechSynthesis.getVoices();
      voice = vs.filter(function (v) { return /en[-_]GB/i.test(v.lang); })[0] ||
              vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
    } catch (e) {}
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function say(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text.replace(/\(.*?\)/g, ""));
      u.lang = "en-GB"; if (voice) u.voice = voice; u.rate = 0.9;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function speakerBtn(text, cls) {
    return el("button", { class: "speak " + (cls || ""), "aria-label": "Послушать",
      onclick: function (ev) { ev.stopPropagation(); say(text); } }, "🔊");
  }
  function fill(ex, en) { return ex.replace("___", en); }

  // ---------- app shell ----------
  var app, stage, bar, stepLabel, cfg, state;

  function shell() {
    document.body.innerHTML = "";
    app = el("div", { class: "app" });
    var head = el("header", { class: "top" },
      el("a", { class: "home", href: cfg.home || "../index.html", "aria-label": "Все упражнения" }, "‹"),
      el("div", { class: "titles" },
        el("div", { class: "sub", text: cfg.subtitle }),
        el("div", { class: "ttl", text: cfg.title })),
      stepLabel = el("div", { class: "step" }));
    bar = el("div", { class: "bar" }, el("i"));
    stage = el("main", { class: "stage" });
    add(app, [head, bar, stage]);
    document.body.appendChild(app);
  }
  function setProgress(i, n, label) {
    bar.firstChild.style.width = (n ? (i / n) * 100 : 0) + "%";
    stepLabel.textContent = label || "";
  }
  function screen(title, hint) {
    stage.innerHTML = "";
    var box = el("section", { class: "screen" });
    if (title) add(box, el("h2", { text: title }));
    if (hint) add(box, el("p", { class: "hint", text: hint }));
    stage.appendChild(box);
    return box;
  }
  function mark(w, ok) {
    state.total++;
    if (ok) state.correct++;
    else state.mistakes[w.en] = w;
  }
  function counter(box, i, n) {
    add(box, el("div", { class: "count", text: (i + 1) + " / " + n }));
  }

  // ---------- exercises ----------
  var EX = {};

  EX.flash = {
    name: "Карточки", icon: "🃏",
    run: function (words) {
      return new Promise(function (done) {
        var queue = shuffle(words), total = queue.length, known = 0;
        function render() {
          if (!queue.length) return done();
          var w = queue[0];
          var box = screen("Карточки", "Нажми на карточку, чтобы перевернуть. «Знаю» — дальше, «Ещё раз» — карточка вернётся.");
          var card = el("button", { class: "flip" },
            el("div", { class: "inner" },
              el("div", { class: "face front" },
                el("div", { class: "big", text: w.en }),
                el("div", { class: "tap", text: "перевернуть ↻" })),
              el("div", { class: "face back" },
                el("div", { class: "big ru", text: w.ru }),
                w.ex ? el("div", { class: "ex", text: fill(w.ex, w.en) }) : null)));
          card.addEventListener("click", function () {
            card.classList.toggle("flipped");
            if (card.classList.contains("flipped") && w.ex) say(fill(w.ex, w.en)); else say(w.en);
          });
          add(box, [
            el("div", { class: "count", text: "Выучено " + known + " из " + total }),
            card,
            el("div", { class: "row" },
              speakerBtn(w.en, "big-speak"),
              el("button", { class: "btn ghost", onclick: function () { queue.push(queue.shift()); render(); } }, "🔁 Ещё раз"),
              el("button", { class: "btn", onclick: function () { queue.shift(); known++; render(); } }, "✓ Знаю"))
          ]);
          say(w.en);
        }
        render();
      });
    }
  };

  EX.match = {
    name: "Найди пару", icon: "🔗",
    run: function (words) {
      return new Promise(function (done) {
        var groups = chunk(shuffle(words), 5), gi = 0;
        function round() {
          if (gi >= groups.length) return done();
          var g = groups[gi++], left = shuffle(g), right = shuffle(g), sel = null, left_n = g.length, errs = {};
          var box = screen("Найди пару", "Нажми на английское слово, потом на перевод.");
          add(box, el("div", { class: "count", text: "Раунд " + gi + " / " + groups.length }));
          var grid = el("div", { class: "match" });
          var colL = el("div", { class: "col" }), colR = el("div", { class: "col" });
          function make(w, side) {
            var b = el("button", { class: "tile " + side, text: side === "en" ? w.en : w.ru });
            b._w = w; b._side = side;
            b.addEventListener("click", function () {
              if (b.disabled) return;
              if (side === "en") say(w.en);
              if (!sel || sel._side === side) {
                if (sel) sel.classList.remove("sel");
                sel = b; b.classList.add("sel"); return;
              }
              if (sel._w.en === w.en) {
                [sel, b].forEach(function (x) { x.classList.remove("sel"); x.classList.add("done"); x.disabled = true; });
                if (!errs[w.en]) mark(w, true);
                sel = null; left_n--;
                if (!left_n) wait(500).then(round);
              } else {
                var a = sel; sel = null;
                [a, b].forEach(function (x) { x.classList.remove("sel"); x.classList.add("bad"); });
                var wen = a._side === "en" ? a._w : b._w;
                if (!errs[wen.en]) { errs[wen.en] = 1; mark(wen, false); }
                vibrate(60);
                setTimeout(function () { a.classList.remove("bad"); b.classList.remove("bad"); }, 500);
              }
            });
            return b;
          }
          left.forEach(function (w) { colL.appendChild(make(w, "en")); });
          right.forEach(function (w) { colR.appendChild(make(w, "ru")); });
          add(grid, [colL, colR]); add(box, grid);
        }
        round();
      });
    }
  };

  function choiceRound(opts) {
    // opts: title, hint, items, prompt(w, box), key ('en'|'ru'), n options, after(w)
    return new Promise(function (done) {
      var i = 0;
      function next() {
        if (i >= opts.items.length) return done();
        var w = opts.items[i];
        var box = screen(opts.title, opts.hint);
        counter(box, i, opts.items.length);
        opts.prompt(w, box);
        var choices = shuffle([w].concat(distractors(opts.pool, w, opts.key, opts.n - 1)));
        var list = el("div", { class: "choices" });
        var answered = false;
        choices.forEach(function (c) {
          var b = el("button", { class: "choice", text: c[opts.key] });
          b.addEventListener("click", function () {
            if (answered) return; answered = true;
            var ok = c[opts.key] === w[opts.key];
            mark(w, ok);
            Array.prototype.forEach.call(list.children, function (x) {
              if (x.textContent === w[opts.key]) x.classList.add("good");
            });
            if (!ok) { b.classList.add("bad"); vibrate(80); }
            if (opts.after) opts.after(w, box, ok);
            i++;
            if (ok) wait(1100).then(next);
            else add(box, el("button", { class: "btn next", onclick: next }, "Дальше →"));
          });
          list.appendChild(b);
        });
        add(box, list);
      }
      next();
    });
  }

  EX.enru = {
    name: "Перевод EN → RU", icon: "🇬🇧",
    run: function (words, pool) {
      return choiceRound({
        title: "Выбери перевод", items: sample(words, 10), pool: pool, key: "ru", n: 4,
        prompt: function (w, box) {
          add(box, el("div", { class: "prompt" }, el("span", { text: w.en }), speakerBtn(w.en)));
          say(w.en);
        }
      });
    }
  };

  EX.ruen = {
    name: "Перевод RU → EN", icon: "🇷🇺",
    run: function (words, pool) {
      return choiceRound({
        title: "Как это по-английски?", items: sample(words, 10), pool: pool, key: "en", n: 4,
        prompt: function (w, box) { add(box, el("div", { class: "prompt ru", text: w.ru })); },
        after: function (w) { say(w.en); }
      });
    }
  };

  EX.listen = {
    name: "Послушай и выбери", icon: "🎧",
    run: function (words, pool) {
      return choiceRound({
        title: "Послушай и выбери перевод", hint: "Нажми на динамик, чтобы послушать ещё раз.",
        items: sample(words, 8), pool: pool, key: "ru", n: 4,
        prompt: function (w, box) {
          add(box, el("div", { class: "prompt" }, speakerBtn(w.en, "huge")));
          setTimeout(function () { say(w.en); }, 250);
        },
        after: function (w, box) { add(box, el("div", { class: "reveal", text: w.en })); }
      });
    }
  };

  EX.gap = {
    name: "Вставь слово", icon: "🧩",
    run: function (words, pool) {
      var items = sample(words.filter(function (w) { return w.ex; }), 8);
      return choiceRound({
        title: "Вставь слово", hint: "Какое слово пропущено?", items: items,
        pool: pool, key: "en", n: 3,
        prompt: function (w, box) {
          var parts = w.ex.split("___");
          var s = el("div", { class: "sentence" }, parts[0], el("span", { class: "gapslot", text: "______" }), parts[1] || "");
          add(box, s);
        },
        after: function (w, box) {
          var g = box.querySelector(".gapslot"); g.textContent = w.en; g.classList.add("filled");
          say(fill(w.ex, w.en));
        }
      });
    }
  };

  EX.tf = {
    name: "Верно или нет?", icon: "⚡",
    run: function (words, pool) {
      return new Promise(function (done) {
        var items = sample(words, 10), i = 0;
        function next() {
          if (i >= items.length) return done();
          var w = items[i];
          var truth = Math.random() < 0.5;
          var shown = truth ? w : (distractors(pool, w, "ru", 1)[0] || w);
          if (shown === w) truth = true;
          var box = screen("Верно или нет?", "Перевод правильный?");
          counter(box, i, items.length);
          add(box, el("div", { class: "pair" },
            el("div", { class: "pen" }, w.en, speakerBtn(w.en)),
            el("div", { class: "eq", text: "=" }),
            el("div", { class: "pru", text: shown.ru })));
          say(w.en);
          var answered = false;
          function answer(yes, btn) {
            if (answered) return; answered = true;
            var ok = yes === truth; mark(w, ok);
            btn.classList.add(ok ? "good" : "bad");
            if (!ok) vibrate(80);
            if (!truth) add(box, el("div", { class: "reveal", text: w.en + " — " + w.ru }));
            i++;
            if (ok && truth) wait(900).then(next);
            else add(box, el("button", { class: "btn next", onclick: next }, "Дальше →"));
          }
          var yes = el("button", { class: "choice tfb", text: "✓ Верно" });
          var no = el("button", { class: "choice tfb", text: "✗ Неверно" });
          yes.onclick = function () { answer(true, yes); };
          no.onclick = function () { answer(false, no); };
          add(box, el("div", { class: "row tf" }, yes, no));
        }
        next();
      });
    }
  };

  EX.memory = {
    name: "Мемори", icon: "🧠",
    run: function (words) {
      return new Promise(function (done) {
        var set = sample(words, 6), tiles = [];
        set.forEach(function (w) { tiles.push({ w: w, side: "en" }); tiles.push({ w: w, side: "ru" }); });
        tiles = shuffle(tiles);
        var box = screen("Мемори", "Открывай по две карточки и находи пары: слово + перевод.");
        var moves = el("div", { class: "count", text: "Ходы: 0" });
        add(box, moves);
        var grid = el("div", { class: "memory" }), open = [], found = 0, m = 0, lock = false;
        tiles.forEach(function (t) {
          var b = el("button", { class: "mem" }, el("span", { text: t.side === "en" ? t.w.en : t.w.ru }));
          b._en = t.w.en; if (t.side === "ru") b.classList.add("ruside");
          b.addEventListener("click", function () {
            if (lock || b.classList.contains("open") || b.classList.contains("done")) return;
            b.classList.add("open"); open.push({ b: b, t: t });
            if (t.side === "en") say(t.w.en);
            if (open.length === 2) {
              m++; moves.textContent = "Ходы: " + m;
              var a = open[0], c = open[1]; open = [];
              if (a.t.w.en === c.t.w.en && a.t.side !== c.t.side) {
                a.b.classList.add("done"); c.b.classList.add("done"); found++;
                if (found === set.length) {
                  add(box, el("div", { class: "reveal", text: "Готово за " + m + " ходов!" }));
                  add(box, el("button", { class: "btn next", onclick: done }, "Дальше →"));
                }
              } else {
                lock = true;
                setTimeout(function () { a.b.classList.remove("open"); c.b.classList.remove("open"); lock = false; }, 1000);
              }
            }
          });
          grid.appendChild(b);
        });
        add(box, grid);
      });
    }
  };

  EX.spell = {
    name: "Собери слово", icon: "🔤",
    ok: function (words) { return words.filter(function (w) { return /^[a-z]{4,12}$/i.test(w.en); }).length >= 3; },
    run: function (words) {
      return new Promise(function (done) {
        var items = sample(words.filter(function (w) { return /^[a-z]{4,12}$/i.test(w.en); }), 5), i = 0;
        function next() {
          if (i >= items.length) return done();
          var w = items[i], word = w.en.toLowerCase(), pos = 0, errs = 0;
          var box = screen("Собери слово", "Нажимай на буквы по порядку.");
          counter(box, i, items.length);
          add(box, el("div", { class: "prompt ru", text: w.ru }));
          var slots = el("div", { class: "slots" });
          word.split("").forEach(function () { slots.appendChild(el("span", { class: "slot" })); });
          add(box, [el("div", { class: "row center" }, speakerBtn(w.en)), slots]);
          var letters = el("div", { class: "letters" });
          shuffle(word.split("")).forEach(function (ch) {
            var b = el("button", { class: "letter", text: ch });
            b.addEventListener("click", function () {
              if (b.disabled) return;
              if (ch === word[pos]) {
                slots.children[pos].textContent = ch; slots.children[pos].classList.add("on");
                b.disabled = true; b.classList.add("used"); pos++;
                if (pos === word.length) {
                  mark(w, errs === 0); say(w.en); i++;
                  slots.classList.add("win");
                  wait(1100).then(next);
                }
              } else {
                errs++; b.classList.add("bad"); vibrate(50);
                setTimeout(function () { b.classList.remove("bad"); }, 400);
                if (errs === 3) { // подсказка
                  var hintB = Array.prototype.filter.call(letters.children, function (x) { return !x.disabled && x.textContent === word[pos]; })[0];
                  if (hintB) hintB.classList.add("hintme");
                }
              }
            });
            letters.appendChild(b);
          });
          add(box, letters);
        }
        next();
      });
    }
  };

  // ---------- session plan ----------
  function plan(words) {
    var translation = shuffle(["match", "enru", "ruen"])[0];
    var extra = ["match", "enru", "ruen", "listen", "tf", "memory", "spell"].filter(function (k) {
      return k !== translation && (!EX[k].ok || EX[k].ok(words));
    });
    var picks = sample(extra, 2);
    return ["flash", translation, picks[0], "gap", picks[1]];
  }

  function intro() {
    setProgress(0, 1, "");
    var box = screen(null);
    add(box, [
      el("div", { class: "hero" },
        el("div", { class: "emoji", text: cfg.emoji || "🐙" }),
        el("h1", { text: cfg.title }),
        el("p", { class: "hint", text: state.words.length + " слов и выражений · без печатания · каждый раз новый набор" })),
      el("h3", { text: "Сегодня:" }),
      el("ol", { class: "plan" }, state.plan.map(function (k) {
        return el("li", null, el("span", { class: "ic", text: EX[k].icon }), EX[k].name);
      })),
      el("button", { class: "btn wide", onclick: run }, "Начать ▶"),
      el("button", { class: "btn ghost wide", onclick: function () { state.plan = plan(state.words); intro(); } }, "🎲 Другой набор упражнений"),
      el("details", { class: "wordlist" },
        el("summary", { text: "Список слов" }),
        el("ul", null, state.words.map(function (w) {
          return el("li", null, el("b", { text: w.en }), " — " + w.ru, speakerBtn(w.en, "small"));
        })))
    ]);
  }

  function run() {
    say(" "); // unlock speech on iOS with the tap
    var steps = state.plan.slice(), i = 0;
    function step() {
      if (i >= steps.length) return review();
      var k = steps[i];
      setProgress(i, steps.length, (i + 1) + "/" + steps.length);
      i++;
      EX[k].run(state.words, state.pool).then(step);
    }
    step();
  }

  function review() {
    var errs = Object.keys(state.mistakes).map(function (k) { return state.mistakes[k]; });
    if (!errs.length || state.reviewed) return finish();
    state.reviewed = true;
    setProgress(1, 1, "★");
    var box = screen("Работа над ошибками", "Эти слова пока путаются — повторим ещё раз.");
    add(box, [
      el("ul", { class: "errs" }, errs.map(function (w) { return el("li", null, el("b", { text: w.en }), " — " + w.ru); })),
      el("button", { class: "btn wide", onclick: function () {
        var kinds = ["enru", "ruen"];
        EX.flash.run(errs).then(function () {
          return EX[kinds[Math.random() < 0.5 ? 0 : 1]].run(errs, state.pool);
        }).then(finish);
      } }, "Повторить ▶")
    ]);
  }

  function finish() {
    setProgress(1, 1, "✓");
    var pct = state.total ? Math.round(state.correct / state.total * 100) : 100;
    var stars = pct >= 90 ? "⭐⭐⭐" : pct >= 70 ? "⭐⭐" : "⭐";
    var msg = pct >= 90 ? "Отлично!" : pct >= 70 ? "Хорошо! Ещё один круг — и слова запомнятся." : "Неплохо для начала — пройди ещё раз, будет новый набор.";
    var box = screen(null);
    add(box, [
      el("div", { class: "hero" },
        el("div", { class: "emoji", text: stars }),
        el("h1", { text: pct + "%" }),
        el("p", { class: "hint", text: "Правильных ответов: " + state.correct + " из " + state.total }),
        el("p", { text: msg })),
      el("button", { class: "btn wide", onclick: function () { reset(); intro(); } }, "🎲 Новый набор упражнений"),
      el("a", { class: "btn ghost wide", href: cfg.home || "../index.html" }, "Все упражнения")
    ]);
  }

  function reset() {
    state.correct = 0; state.total = 0; state.mistakes = {}; state.reviewed = false;
    if (cfg.mix && state.started) state.words = sample(state.pool, cfg.count || 14);
    state.started = true;
    state.plan = plan(state.words);
  }

  window.Trainer = {
    start: function (c) {
      cfg = c;
      var sets = window.SETS || {};
      var words = [];
      if (c.mix) {
        var seen = {};
        c.mix.forEach(function (id) {
          (sets[id].words || []).forEach(function (w) { if (!seen[w.en]) { seen[w.en] = 1; words.push(w); } });
        });
        state = { pool: words.slice() };
        words = sample(words, c.count || 14);
      } else {
        var s = sets[c.set];
        cfg.title = cfg.title || s.title; cfg.subtitle = cfg.subtitle || s.subtitle;
        words = s.words.slice();
        state = { pool: words.slice() };
      }
      document.title = cfg.title;
      state.words = words;
      reset();
      shell();
      intro();
    }
  };
})();
