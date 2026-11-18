// TITLE: Just an Illusion · Часть 1
// EYEBROW: Spotlight 9 · стр. 48 · Just an Illusion · часть 1 из 2
// SUB: 13 слов из первой половины текста «Just an Illusion». Карточки и семь тренировок — каждая по всем словам.
// BOARD: Твои слова
// LEAD: Каждый правильный ответ добавляет точку. Все точки зелёные — слово выучено. Красная рамка — повтори его.
const META = { ls: "s9-p48-1" };
const P = [
  { id: "illusion", phrase: "an optical illusion", ru: "оптическая иллюзия", en: "a picture that tricks your eyes, so you see something that isn't really there" },
  { id: "track", phrase: "a train track", ru: "железнодорожный путь, рельсы", en: "the metal lines that trains run on" },
  { id: "further", phrase: "further", ru: "дальше", en: "at a greater distance" },
  { id: "seem", phrase: "seem to be", ru: "казаться (каким-то)", g: "seem", en: "to look like something is true" },
  { id: "eventually", phrase: "eventually", ru: "в конце концов, в итоге", en: "after a long time; in the end" },
  { id: "appear", phrase: "appear", ru: "казаться; появляться", g: "seem", en: "to seem; to come into view" },
  { id: "touch", phrase: "touch", ru: "касаться, соприкасаться", en: "to be so close to something that there is no space between" },
  { id: "know", phrase: "but we all know", ru: "но мы все знаем", en: "you say this when everyone is sure about something" },
  { id: "really", phrase: "don't really", ru: "на самом деле не", en: "you say this when something isn't true in reality" },
  { id: "simply", phrase: "simply", ru: "просто", en: "only, just" },
  { id: "tricks", phrase: "play tricks on", ru: "обманывать, подшучивать над", en: "to make someone believe something that isn't true" },
  { id: "seeing", phrase: "seeing", ru: "зрение, видение (процесс)", en: "the act of using your eyes" },
  { id: "complicated", phrase: "complicated", ru: "сложный", en: "difficult to understand, with many parts" }
];
const DRILLS = [
  { type: "meaning", title: "Найди слово", short: "RU → EN", instr: "Прочитай по-русски и выбери, как это будет по-английски." },
  { type: "mcq", title: "Что это значит?", short: "EN → RU", instr: "Прочитай слово по-английски и выбери перевод.", items: AUTO.enru() },
  { type: "gaps", title: "Choose the word: the text", short: "Text", instr: "Это предложения из текста «Just an Illusion». Выбери слово, которое было в тексте.",
    items: [
      { id: "track", t: "If you stand at the end of a {{*train track|optical illusion|complicated}} and look down it, what do you see?" },
      { id: "further", t: "The {{*further|simply|eventually}} down the tracks you look, the closer the two tracks seem to be." },
      { id: "seem", t: "The further you look, the closer the two tracks {{*seem to be|touch|play tricks on}}." },
      { id: "eventually", t: "{{*Eventually|Further|Complicated}}, they appear to touch." },
      { id: "appear", t: "Eventually, they {{*appear|touch|seeing}} to touch." },
      { id: "touch", t: "They appear to {{*touch|seeing|complicated}}, but we all know that they don't really." },
      { id: "know", t: "They appear to touch, {{*but we all know|eventually|simply}} that they don't really." },
      { id: "really", t: "…but we all know that they {{*don't really|simply|eventually}}." },
      { id: "simply", t: "Our eyes are {{*simply|further|complicated}} playing tricks on us." },
      { id: "tricks", t: "Our eyes are simply {{*playing tricks on|appearing|seeming}} us." },
      { id: "seeing", t: "Simply because {{*seeing|eventually|further}} is a complicated process!" },
      { id: "complicated", t: "Seeing is a {{*complicated|further|simply}} process!" },
      { id: "illusion", t: "This is why we can have so much fun with {{*optical illusions|train tracks|complicated}}!" }
    ] },
  { type: "mcq", title: "Guess the word", short: "Definitions", instr: "Прочитай объяснение по-английски и выбери слово.", items: AUTO.defn() },
  { type: "tf", title: "Right or wrong?", short: "Right or wrong", instr: "Предложение верное или с ошибкой? Подумай и про текст, и про слова.",
    items: [
      { id: "track", t: "If you look down a train track, the two tracks seem to get closer.", ok: true },
      { id: "touch", t: "At the end, the two tracks really touch.", ok: false, fix: "The tracks only appear to touch — they don't really touch." },
      { id: "really", t: "The tracks don't really touch.", ok: true },
      { id: "complicated", t: "Seeing is a simple process.", ok: false, fix: "Seeing is a complicated process." },
      { id: "tricks", t: "My eyes play tricks on me when I'm tired.", ok: true },
      { id: "complicated", t: "This is a very complicate question.", ok: false, fix: "This is a very complicated question." },
      { id: "further", t: "The further you go, the quieter it gets.", ok: true },
      { id: "seem", t: "He seems be tired today.", ok: false, fix: "He seems to be tired today." },
      { id: "illusion", t: "An optical illusion tricks your eyes.", ok: true },
      { id: "eventually", t: "“Eventually” means “at the very beginning”.", ok: false, fix: "“Eventually” means “in the end”." }
    ] },
  { type: "gaps", title: "Choose the word: new sentences", short: "Choose", instr: "Теперь те же слова в новых предложениях. Выбери подходящее.",
    items: [
      { id: "illusion", t: "The lines look curved, but they are straight — it's {{*an optical illusion|a train track|complicated}}." },
      { id: "track", t: "We walked along {{*a train track|an optical illusion|seeing}} until we saw the station." },
      { id: "further", t: "The {{*further|simply|eventually}} you walk from the city, the quieter it gets." },
      { id: "seem", t: "The two lines {{*seem to be|touch|play tricks on}} different, but they are the same length." },
      { id: "eventually", t: "We waited for two hours, and {{*eventually|further|complicated}} the bus came." },
      { id: "appear", t: "The trees {{*appear|touch|seeing}} smaller when you look at them from far away." },
      { id: "touch", t: "Don't {{*touch|appear|seeing}} the paint — it's still wet!" },
      { id: "simply", t: "Don't worry — it's {{*simply|eventually|further}} a game." },
      { id: "tricks", t: "My little brother likes to {{*play tricks on|appear|seem to be}} me — yesterday he hid my phone and said it was lost." },
      { id: "seeing", t: "{{*Seeing|Further|Eventually}} is believing." },
      { id: "complicated", t: "This game has very {{*complicated|further|simply}} rules — I don't understand them." },
      { id: "know", t: "He says he isn't afraid of spiders, {{*but we all know|eventually|simply}} that he is!" },
      { id: "really", t: "People say they see ghosts, but ghosts {{*don't really|eventually|further}} exist." }
    ] },
  { type: "order", title: "Собери предложение", short: "Collect", instr: "Нажимай на слова по порядку и собери предложение по-английски. Печатать не нужно.",
    items: [
      { id: "tricks", q: "Наши глаза нас обманывают.", s: "Our eyes are playing tricks on us." },
      { id: "seeing", q: "Зрение — сложный процесс.", s: "Seeing is a complicated process." },
      { id: "eventually", q: "В конце концов рельсы как будто соприкасаются.", s: "Eventually the tracks appear to touch." },
      { id: "seem", q: "Кажется, он устал.", s: "He seems to be tired." },
      { id: "simply", q: "Я просто не понимаю.", s: "I simply don't understand." },
      { id: "complicated", q: "Это сложная игра.", s: "It is a complicated game." },
      { id: "touch", q: "Не трогай краску!", s: "Don't touch the paint!" }
    ] }
];
