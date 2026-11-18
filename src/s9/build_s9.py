"""Build the Spotlight 9 site into the repo root (same engine as Academy Stars 5 / Spotlight 6).
Run from anywhere:  python3 src/s9/build_s9.py"""
import html, os, subprocess, sys

SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = os.path.abspath(os.path.join(SRC, ".."))
OUT = os.path.join(SRC, "out")
os.makedirs(OUT, exist_ok=True)
e = html.escape
HEAD = '<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
CSS = open(os.path.join(SRC, "engine", "style.css")).read()
AUTO = open(os.path.join(SRC, "packs", "_auto.js")).read()

# section, output path (kept stable — students already have these links), pack, title, word list for the hub
TOPICS = [
    ("Стр. 43 · Mysterious creatures", "p43/43-1.html", "s9-43-1", "43-1 · Loch Ness",
     "huge eyes, giant tentacles, a humped back, a snake-like head, in search of, sightings…"),
    ("Стр. 43 · Mysterious creatures", "p43/43-2.html", "s9-43-2", "43-2 · The Kraken",
     "horrifying, across, wrap, a violent whirlpool, a species, there's no doubt, whether…"),
    ("Стр. 43 · Mysterious creatures", "p43/43-3.html", "s9-43-3", "43-3 · Bigfoot",
     "witnesses, describe, footprints, extinct, unfortunately, so far, a fossil…"),
    ("Стр. 48 · Just an Illusion", "p48/48.html", "s9-48", "48 · Just an Illusion",
     "an optical illusion, eventually, appear, play tricks on, complicated, firstly, stare at…"),
]

def back(depth):
    href = "../" * depth + "index.html"
    return f'<p class="wrap back" style="margin:18px auto 0;font-size:15px"><a href="{href}">← Spotlight 9: все тексты</a></p>'

def build_packs():
    for _, path, pack, *_ in TOPICS:
        tmp = os.path.join(OUT, pack + ".src.js")
        # META comment lines must stay at the top for build.py; the helper goes right after them
        src = open(os.path.join(SRC, "packs", pack + ".js")).read()
        open(tmp, "w").write(src.replace("const META", AUTO + "\nconst META", 1))
        out = os.path.join(OUT, pack + ".html")
        subprocess.run([sys.executable, os.path.join(SRC, "engine", "build.py"), tmp, out], check=True)
        page = open(out).read().replace('<header class="hero wrap">', back(path.count("/")) + '\n<header class="hero wrap">', 1)
        dest = os.path.join(SITE, path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w").write(HEAD + page)

def hub():
    body, cur = "", None
    for i, (unit, path, _, t, s) in enumerate(TOPICS, 1):
        if unit != cur:
            if cur: body += "</ol></section>"
            body += f'<section class="unit"><h2>{e(unit)}</h2><ol class="toc">'
            cur = unit
        body += (f'<li><a class="row" href="{path}"><span class="n">{i}</span>'
                 f'<span class="t"><b>{e(t)}</b><span class="s">{e(s)}</span></span><span class="go" aria-hidden="true">→</span></a></li>')
    body += "</ol></section>"
    page = f'''<title>Spotlight 9</title>
{CSS}
.unit {{ padding-top: 22px; }}
.unit h2 {{ margin-bottom: 8px; }}
.toc {{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }}
.row {{ display: grid; grid-template-columns: 2.2em minmax(0,1fr) 1.2em; align-items: center; gap: 12px; padding: 12px 14px; background: var(--card); border: 1px solid var(--line); border-radius: 10px; text-decoration: none; color: var(--ink); }}
.row:hover {{ border-color: var(--accent); }}
.row:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px; }}
.n {{ font-family: var(--font-mono); font-size: 13px; color: var(--accent); }}
.t {{ display: flex; flex-direction: column; min-width: 0; }}
.t b {{ font-weight: 600; }}
.s {{ font-size: 14px; color: var(--muted); }}
.go {{ color: var(--muted); }}
.how {{ background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; margin-top: 30px; }}
.how h3 {{ margin: 0 0 8px; font-size: 17px; }}
.how ol {{ margin: 0; padding-left: 1.3em; display: flex; flex-direction: column; gap: 4px; }}
</style>
<header class="hero wrap">
  <p class="eyebrow">Чемоданчик учителя английского · 9 класс</p>
  <h1>Spotlight 9</h1>
  <p class="sub">Интерактивные тренажёры по лексике текстов учебника Spotlight 9: карточки и несколько тренировок на каждое слово.</p>
</header>
<main class="wrap" style="padding-block: 0 64px;">
  {body}
  <div class="how">
    <h3>Как заниматься</h3>
    <ol>
      <li>Сначала посмотри карточки и послушай слова (🔊).</li>
      <li>Пройди все тренировки по порядку. Ошибка не страшна: попробуй ещё раз.</li>
      <li>Следи за доской вверху: все точки зелёные — слово выучено, красная рамка — повтори.</li>
      <li>Через 2–3 дня нажми «Start again»: вопросы каждый раз перемешиваются.</li>
    </ol>
  </div>
</main>
'''
    open(os.path.join(SITE, "index.html"), "w").write(HEAD + page)

def redirect(path, to):
    open(os.path.join(SITE, path), "w").write(
        f'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url={to}">'
        f'<title>Spotlight 9</title></head><body><a href="{to}">Spotlight 9</a></body></html>\n')

if __name__ == "__main__":
    build_packs(); hub()
    redirect("p43/43-mix.html", "../index.html")
    print("built:", [t[1] for t in TOPICS])
