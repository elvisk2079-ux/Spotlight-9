import sys, re, html, os
base=os.path.dirname(os.path.abspath(__file__))
src=open(sys.argv[1]).read(); out=sys.argv[2]
meta={k:v.strip() for k,v in re.findall(r'^// (TITLE|EYEBROW|SUB|BOARD|LEAD): (.*)$',src,re.M)}
meta["SUB"]=re.sub(r"(?<![Ff]lashcards and )\b([Ff])ive drills",lambda m:("Flashcards and f" if m.group(1)=="F" else "flashcards and f")+"ive drills",meta["SUB"],count=1)
css=open(os.path.join(base,'style.css')).read()
eng=open(os.path.join(base,'engine.js')).read()
e=html.escape
page=f'''<title>{e(meta["TITLE"])}</title>
{css}</style>

<header class="hero wrap">
  <p class="eyebrow">{e(meta["EYEBROW"])}</p>
  <h1>{e(meta["TITLE"])}</h1>
  <p class="sub">{e(meta["SUB"])}</p>
</header>

<div class="bar">
  <div class="wrap">
    <nav class="nav" id="nav" aria-label="Drills"></nav>
    <div class="progress" aria-live="polite">
      <div class="track"><div class="fill" id="fill"></div></div>
      <span><b id="mastered">0</b> / <b id="ptotal">0</b> learned</span>
    </div>
  </div>
</div>

<main class="wrap" id="main">
  <section id="board-sec">
    <h2>{e(meta.get('BOARD','Your phrases'))}</h2>
    <p class="lead">{e(meta.get("LEAD","Every correct answer adds a dot. All dots green = learned. Red frame = repeat this one."))}</p>
    <div class="board" id="board"></div>
    <div class="board-foot">
      <span>Progress is saved in this browser.</span>
      <button class="btn small" type="button" id="reset-all">Reset my progress</button>
    </div>
  </section>
</main>

<script>
{src}
{eng}
</script>
'''
open(out,'w').write(page)
js=src+'\n'+eng
open(out+'.chk.js','w').write(js)
