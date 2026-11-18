/* Auto-built drills from P: EN→RU meaning and definition → word. g = group of look-alike translations (never distractors for each other). */
const AUTO = {
  sh(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  others(p, key, n) {
    const out = [];
    AUTO.sh(P.filter(x => x.id !== p.id && !(p.g && x.g === p.g))).forEach(x => { if (out.length < n && x[key] !== p[key] && !out.includes(x[key])) out.push(x[key]); });
    return out;
  },
  enru() { return P.map(p => ({ id: p.id, q: p.phrase, o: [p.ru, ...AUTO.others(p, "ru", 3)] })); },
  defn() { return P.filter(p => p.en).map(p => ({ id: p.id, q: p.en, o: [p.phrase, ...AUTO.others(p, "phrase", 3)] })); }
};
